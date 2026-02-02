"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  MessageCircle,
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Users,
  Plus,
  Loader2,
  Reply,
  RotateCcw,
  Pin,
  UserPlus,
  LogOut,
  X,
  Download,
  File,
} from "lucide-react";
import { formatMessageTime } from "@/data/messagesData";
import { roleLabels, UserItem } from "@/data/usersData";
import { fetchAllUsers } from "@/services/userService";
import { chatService } from "@/services/chatService";
import { CallService, CallType, CallState } from "@/services/callService";
import { Room, Message } from "@/core/lib/supabaseClient";
import { Modal } from "@/shared/components/common/Modal";
import {
  IncomingCallModal,
  ActiveCallOverlay,
  CallingOverlay,
} from "./CallComponents";

interface RoomDisplay {
  id: string;
  name: string;
  avatar: string | null;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  role: string;
  isGroup: boolean;
  memberCount?: number;
}

export const Messages: React.FC = () => {
  const user = useSelector((state: any) => state.admin.user);
  const currentUserId = user?.id?.toString() || "1";

  // Room states
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedRoomData, setSelectedRoomData] = useState<Room | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Message states
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  // Reply state
  const [replyTo, setReplyTo] = useState<Message | null>(null);

  // User data
  const [usersMap, setUsersMap] = useState<Record<string, UserItem>>({});
  const [roomParticipants, setRoomParticipants] = useState<string[]>([]);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isRoomSettingsOpen, setIsRoomSettingsOpen] = useState(false);

  // Modal form states
  const [newConvPartnerId, setNewConvPartnerId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState("");
  const [newMemberId, setNewMemberId] = useState("");

  // File upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);
  const updateChannelRef = useRef<any>(null);
  const callServiceRef = useRef<CallService | null>(null);

  // Call states
  const [callState, setCallState] = useState<Partial<CallState>>({
    status: "idle",
  });
  const [incomingCall, setIncomingCall] = useState<{
    callerId: string;
    callType: CallType;
  } | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ==================== FETCH USERS ====================
  useEffect(() => {
    async function loadUsers() {
      try {
        const { users } = await fetchAllUsers({ limit: 1000 });
        const map: Record<string, UserItem> = {};
        users.forEach((u) => {
          map[u.id.toString()] = u;
        });
        setUsersMap(map);
      } catch (e) {
        console.error("Failed to load users", e);
      }
    }
    loadUsers();
  }, []);

  // ==================== FETCH ROOMS ====================
  useEffect(() => {
    async function loadRooms() {
      setLoadingRooms(true);
      try {
        const data = await chatService.getRoomsForUser(currentUserId);
        setRooms(data);
      } catch (e) {
        console.error("Failed to load rooms", e);
      } finally {
        setLoadingRooms(false);
      }
    }
    loadRooms();
  }, [currentUserId]);

  // ==================== FETCH MESSAGES & PARTICIPANTS ON ROOM SELECT ====================
  useEffect(() => {
    if (!selectedRoom) {
      setMessages([]);
      setRoomParticipants([]);
      setSelectedRoomData(null);
      return;
    }

    async function loadRoomData() {
      setLoadingMessages(true);
      try {
        // Load room details
        const room = await chatService.getRoomById(selectedRoom!);
        setSelectedRoomData(room);

        // Load participants
        const participants = await chatService.getRoomParticipants(
          selectedRoom!,
        );
        setRoomParticipants(participants.map((p) => p.user_id));

        // Load messages
        const msgs = await chatService.getMessages(selectedRoom!);
        setMessages(msgs);

        // Mark as read
        await chatService.markAllAsRead(selectedRoom!, currentUserId);
      } catch (e) {
        console.error("Failed to load room data", e);
      } finally {
        setLoadingMessages(false);
      }
    }
    loadRoomData();

    // Realtime subscription for new messages
    const channel = chatService.subscribeToMessages(selectedRoom, (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
      if (newMsg.user_id !== currentUserId) {
        chatService.markAllAsRead(selectedRoom!, currentUserId);
      }
    });
    channelRef.current = channel;

    // Realtime subscription for message updates
    const updateChannel = chatService.subscribeToMessageUpdates(
      selectedRoom,
      (updatedMsg) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === updatedMsg.id ? updatedMsg : m)),
        );
      },
    );
    updateChannelRef.current = updateChannel;

    return () => {
      if (channelRef.current) chatService.unsubscribe(channelRef.current);
      if (updateChannelRef.current)
        chatService.unsubscribe(updateChannelRef.current);
    };
  }, [selectedRoom, currentUserId]);

  // ==================== SCROLL TO BOTTOM ====================
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ==================== ROOM DISPLAY LIST ====================
  const roomDisplayList = useMemo((): RoomDisplay[] => {
    return rooms.map((room) => {
      let name = room.name || "Cuộc trò chuyện";
      let avatar: string | null = null;
      let role = room.is_group ? "Nhóm" : "Người dùng";

      return {
        id: room.id,
        name,
        avatar,
        lastMessage: "",
        time: formatMessageTime(room.created_at),
        unread: 0,
        online: false,
        role,
        isGroup: room.is_group,
      };
    });
  }, [rooms]);

  const filteredRooms = roomDisplayList.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedChat = roomDisplayList.find((r) => r.id === selectedRoom);

  // ==================== SEND MESSAGE ====================
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      const content = newMessage.trim();
      setNewMessage("");
      setReplyTo(null);

      await chatService.sendMessage(
        selectedRoom,
        currentUserId,
        content,
        "text",
        replyTo?.id || null,
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // ==================== RECALL MESSAGE ====================
  const handleRecallMessage = async (messageId: string) => {
    if (!confirm("Bạn có chắc muốn thu hồi tin nhắn này?")) return;

    try {
      await chatService.deleteMessage(messageId);
      // Update local state to show as recalled
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, is_deleted: true } : m)),
      );
    } catch (error) {
      console.error("Error recalling message:", error);
    }
  };

  // ==================== CALL SERVICE INITIALIZATION ====================
  useEffect(() => {
    const callService = new CallService(currentUserId);

    callService.onCallStateChange = (state) => {
      setCallState((prev) => ({ ...prev, ...state }));

      // Start/stop call timer
      if (state.status === "connected") {
        setCallDuration(0);
        callTimerRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      } else if (state.status === "idle" || state.status === "ended") {
        if (callTimerRef.current) {
          clearInterval(callTimerRef.current);
          callTimerRef.current = null;
        }
      }
    };

    callService.onRemoteStream = (stream) => {
      setRemoteStream(stream);
    };

    callService.onIncomingCall = (callerId, callType) => {
      setIncomingCall({ callerId, callType });
    };

    callService.onCallEnded = () => {
      setLocalStream(null);
      setRemoteStream(null);
      setCallDuration(0);
      setIsMuted(false);
      setIsCameraOff(false);
      setIncomingCall(null);
    };

    callServiceRef.current = callService;

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [currentUserId]);

  // ==================== CALL HANDLERS ====================
  const handleStartCall = async (type: CallType) => {
    if (!selectedRoom || !callServiceRef.current) return;

    // Find the other user in the room (for 1-1 chat)
    const receiverId = roomParticipants.find((id) => id !== currentUserId);
    if (!receiverId) {
      alert("Không tìm thấy người nhận cuộc gọi");
      return;
    }

    try {
      const stream = await callServiceRef.current.startCall(
        selectedRoom,
        receiverId,
        type,
      );
      setLocalStream(stream);
      setCallState({ status: "calling", type, receiverId });
    } catch (error: any) {
      alert(error.message || "Không thể bắt đầu cuộc gọi");
    }
  };

  const handleAcceptCall = async () => {
    if (!incomingCall || !selectedRoom || !callServiceRef.current) return;

    try {
      const stream = await callServiceRef.current.acceptCall(
        selectedRoom,
        incomingCall.callType,
      );
      setLocalStream(stream);
      setIncomingCall(null);
    } catch (error: any) {
      alert(error.message || "Không thể chấp nhận cuộc gọi");
      setIncomingCall(null);
    }
  };

  const handleRejectCall = async () => {
    if (!callServiceRef.current) return;
    await callServiceRef.current.rejectCall();
    setIncomingCall(null);
  };

  const handleEndCall = async () => {
    if (!callServiceRef.current) return;
    await callServiceRef.current.endCall();
  };

  const handleToggleMute = () => {
    if (!callServiceRef.current) return;
    const muted = callServiceRef.current.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleCamera = () => {
    if (!callServiceRef.current) return;
    const off = callServiceRef.current.toggleCamera();
    setIsCameraOff(off);
  };

  // Get caller/receiver info for call UI
  const getCallParticipantInfo = () => {
    const participantId =
      incomingCall?.callerId ||
      callState.receiverId ||
      roomParticipants.find((id) => id !== currentUserId);
    if (!participantId) return { name: "Unknown", avatar: null };
    const user = usersMap[participantId];
    return {
      name: user?.name || `User ${participantId}`,
      avatar: user?.avatar || null,
    };
  };

  // ==================== PIN MESSAGE ====================
  const handlePinMessage = async (messageId: string) => {
    if (!selectedRoom) return;

    try {
      await chatService.pinMessage(selectedRoom, messageId);
      setSelectedRoomData((prev) =>
        prev ? { ...prev, pinned_message_id: messageId } : null,
      );
    } catch (error) {
      console.error("Error pinning message:", error);
    }
  };

  // ==================== FILE UPLOAD ====================
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedRoom) return;

    try {
      await chatService.sendImageMessage(selectedRoom, currentUserId, file);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Lỗi upload ảnh. Vui lòng thử lại.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedRoom) return;

    try {
      await chatService.sendFileMessage(selectedRoom, currentUserId, file);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Lỗi upload file. Vui lòng thử lại.");
    }
  };

  // ==================== CREATE DIRECT CHAT ====================
  const handleCreateConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConvPartnerId) return;

    try {
      const room = await chatService.getOrCreateDirectRoom(
        currentUserId,
        newConvPartnerId,
      );
      setRooms((prev) => [room, ...prev.filter((r) => r.id !== room.id)]);
      setIsCreateModalOpen(false);
      setNewConvPartnerId("");
      setSelectedRoom(room.id);
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Lỗi tạo cuộc trò chuyện");
    }
  };

  // ==================== CREATE GROUP CHAT ====================
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      const memberIds = groupMembers
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id);

      const room = await chatService.createGroupRoom(
        groupName.trim(),
        currentUserId,
        memberIds,
      );
      setRooms((prev) => [room, ...prev]);
      setIsGroupModalOpen(false);
      setGroupName("");
      setGroupMembers("");
      setSelectedRoom(room.id);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Lỗi tạo nhóm");
    }
  };

  // ==================== ADD MEMBER TO GROUP ====================
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberId.trim() || !selectedRoom) return;

    try {
      await chatService.addParticipant(selectedRoom, newMemberId.trim());
      setRoomParticipants((prev) => [...prev, newMemberId.trim()]);
      setIsAddMemberModalOpen(false);
      setNewMemberId("");
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Lỗi thêm thành viên");
    }
  };

  // ==================== LEAVE GROUP ====================
  const handleLeaveGroup = async () => {
    if (!selectedRoom || !confirm("Bạn có chắc muốn rời khỏi nhóm?")) return;

    try {
      await chatService.leaveRoom(selectedRoom, currentUserId);
      setRooms((prev) => prev.filter((r) => r.id !== selectedRoom));
      setSelectedRoom(null);
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ==================== RENDER MESSAGE CONTENT ====================
  const renderMessageContent = (msg: Message) => {
    if (msg.type === "image") {
      try {
        const data = JSON.parse(msg.content);
        return (
          <div className="space-y-1">
            <img
              src={data.imageUrl}
              alt="Shared image"
              className="max-w-full rounded-lg cursor-pointer hover:opacity-90"
              onClick={() => window.open(data.imageUrl, "_blank")}
            />
            {data.caption && (
              <p className="text-sm whitespace-pre-wrap">{data.caption}</p>
            )}
          </div>
        );
      } catch {
        return <p className="text-sm">{msg.content}</p>;
      }
    }

    if (msg.type === "file") {
      try {
        const data = JSON.parse(msg.content);
        const fileSize = (data.fileSize / 1024).toFixed(1) + " KB";
        return (
          <a
            href={data.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            <File size={24} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{data.fileName}</p>
              <p className="text-xs opacity-70">{fileSize}</p>
            </div>
            <Download size={18} />
          </a>
        );
      } catch {
        return <p className="text-sm">{msg.content}</p>;
      }
    }

    return <p className="text-sm whitespace-pre-wrap">{msg.content}</p>;
  };

  const getReplyContent = (replyToId: string | null) => {
    if (!replyToId) return null;
    const repliedMsg = messages.find((m) => m.id === replyToId);
    if (!repliedMsg) return "Tin nhắn đã xóa";
    if (repliedMsg.is_deleted) return "Tin nhắn đã thu hồi";
    if (repliedMsg.type === "image") return "📷 Hình ảnh";
    if (repliedMsg.type === "file") return "📎 File đính kèm";
    return repliedMsg.content;
  };

  return (
    <div
      className="bg-white fixed top-16 right-0 bottom-0 z-10"
      style={{
        left: "var(--sidebar-width, 0px)",
        transition: "left 0.3s ease-in-out",
      }}
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Tin nhắn</h2>
            <div className="flex gap-1">
              <button
                onClick={() => setIsGroupModalOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Tạo nhóm chat"
              >
                <Users size={20} className="text-gray-600" />
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Chat riêng"
              >
                <Plus size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>

          {/* Room List */}
          <div className="flex-1 overflow-y-auto">
            {loadingRooms ? (
              <div className="flex justify-center p-4">
                <Loader2 className="animate-spin text-primary-600" />
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle
                  size={40}
                  className="mx-auto mb-2 text-gray-300"
                />
                <p className="text-sm">Chưa có cuộc trò chuyện</p>
              </div>
            ) : (
              filteredRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-gray-50 ${
                    selectedRoom === room.id
                      ? "bg-primary-50 border-l-4 border-l-primary-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                    {room.isGroup ? <Users size={20} /> : room.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {room.name}
                    </h4>
                    <p className="text-sm text-gray-500 truncate">
                      {room.role}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                  {selectedChat.isGroup ? (
                    <Users size={18} />
                  ) : (
                    selectedChat.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedChat.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedChat.isGroup
                      ? `${roomParticipants.length} thành viên`
                      : selectedChat.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartCall("audio")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Gọi thoại"
                >
                  <Phone size={20} className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleStartCall("video")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Gọi video"
                >
                  <Video size={20} className="text-gray-600" />
                </button>
                <button
                  onClick={() => setIsRoomSettingsOpen(!isRoomSettingsOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <MoreVertical size={20} className="text-gray-600" />
                </button>

                {/* Room Settings Dropdown */}
                {isRoomSettingsOpen && (
                  <div className="absolute right-4 top-16 bg-white shadow-lg rounded-lg border p-2 z-50 min-w-[180px]">
                    {selectedChat.isGroup && (
                      <>
                        <button
                          onClick={() => {
                            setIsAddMemberModalOpen(true);
                            setIsRoomSettingsOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-left text-sm"
                        >
                          <UserPlus size={16} /> Thêm thành viên
                        </button>
                        <button
                          onClick={() => {
                            handleLeaveGroup();
                            setIsRoomSettingsOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-left text-sm text-red-600"
                        >
                          <LogOut size={16} /> Rời nhóm
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setIsRoomSettingsOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-left text-sm"
                    >
                      <X size={16} /> Đóng
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Pinned Message */}
            {selectedRoomData?.pinned_message_id && (
              <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200 flex items-center gap-2">
                <Pin size={16} className="text-yellow-600" />
                <p className="text-sm text-yellow-800 truncate flex-1">
                  {getReplyContent(selectedRoomData.pinned_message_id)}
                </p>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {loadingMessages ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="animate-spin text-primary-600" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <MessageCircle
                      size={48}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    <p>Chưa có tin nhắn</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.user_id === currentUserId;
                  const sender = usersMap[msg.user_id];
                  const time = formatMessageTime(msg.created_at);
                  const replyContent = getReplyContent(msg.reply_to);

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      {!isMe && selectedChat.isGroup && (
                        <div className="flex-shrink-0 mr-2">
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold">
                            {sender?.name?.charAt(0) || "?"}
                          </div>
                        </div>
                      )}
                      <div className="max-w-[70%] group relative">
                        {!isMe && selectedChat.isGroup && (
                          <p className="text-xs text-gray-500 mb-1 ml-1">
                            {sender?.name?.split(" ").pop() || "User"}
                          </p>
                        )}

                        {msg.reply_to && (
                          <div className="mb-1 px-3 py-1 bg-gray-200 rounded-lg text-xs text-gray-600 border-l-2 border-primary-500">
                            <Reply size={12} className="inline mr-1" />
                            {replyContent}
                          </div>
                        )}

                        <div
                          className={`px-4 py-2.5 rounded-2xl ${
                            msg.is_deleted
                              ? "bg-gray-200 text-gray-500 italic border border-gray-300"
                              : isMe
                                ? "bg-primary-600 text-white rounded-br-md"
                                : "bg-white text-gray-900 shadow-sm border border-gray-100 rounded-bl-md"
                          }`}
                        >
                          {msg.is_deleted ? (
                            <p className="text-sm flex items-center gap-1">
                              <RotateCcw size={14} />
                              Tin nhắn đã thu hồi
                            </p>
                          ) : (
                            renderMessageContent(msg)
                          )}
                          {!msg.is_deleted && (
                            <div
                              className={`flex items-center justify-end gap-1 mt-1 ${
                                isMe ? "text-primary-200" : "text-gray-400"
                              }`}
                            >
                              <span className="text-xs">{time}</span>
                              {isMe && <CheckCheck size={14} />}
                            </div>
                          )}
                        </div>

                        {/* Message Actions - only show if not deleted */}
                        {!msg.is_deleted && (
                          <div className="absolute top-0 right-0 hidden group-hover:flex gap-1 -mt-6 bg-white rounded-lg shadow-sm p-1 z-10">
                            <button
                              onClick={() => setReplyTo(msg)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Trả lời"
                            >
                              <Reply size={14} className="text-gray-500" />
                            </button>
                            <button
                              onClick={() => handlePinMessage(msg.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Ghim"
                            >
                              <Pin size={14} className="text-gray-500" />
                            </button>
                            {isMe && (
                              <button
                                onClick={() => handleRecallMessage(msg.id)}
                                className="p-1 hover:bg-gray-100 rounded"
                                title="Thu hồi"
                              >
                                <RotateCcw
                                  size={14}
                                  className="text-orange-500"
                                />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Preview */}
            {replyTo && (
              <div className="px-4 py-2 bg-gray-100 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Reply size={16} className="text-primary-600" />
                  <div>
                    <p className="text-xs font-medium">Đang trả lời</p>
                    <p className="text-sm text-gray-600 truncate max-w-md">
                      {replyTo.content}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setReplyTo(null)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Paperclip size={20} className="text-gray-500" />
                </button>
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ImageIcon size={20} className="text-gray-500" />
                </button>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-xl"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={40} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chọn cuộc trò chuyện
              </h3>
              <p className="text-gray-500">Bắt đầu nhắn tin ngay</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Direct Chat Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Chat riêng"
      >
        <form onSubmit={handleCreateConversation} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Người dùng
            </label>
            <input
              type="text"
              value={newConvPartnerId}
              onChange={(e) => setNewConvPartnerId(e.target.value)}
              placeholder="Nhập ID người dùng"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Bắt đầu chat
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Group Modal */}
      <Modal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        title="Tạo nhóm chat"
      >
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên nhóm
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Nhập tên nhóm"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID thành viên (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={groupMembers}
              onChange={(e) => setGroupMembers(e.target.value)}
              placeholder="VD: 2, 3, 5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsGroupModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Tạo nhóm
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        title="Thêm thành viên"
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID thành viên mới
            </label>
            <input
              type="text"
              value={newMemberId}
              onChange={(e) => setNewMemberId(e.target.value)}
              placeholder="Nhập ID người dùng"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddMemberModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Thêm
            </button>
          </div>
        </form>
      </Modal>

      {/* Call UI Overlays */}
      <IncomingCallModal
        isOpen={!!incomingCall}
        callerName={getCallParticipantInfo().name}
        callerAvatar={getCallParticipantInfo().avatar}
        callType={incomingCall?.callType || "audio"}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />

      <CallingOverlay
        isOpen={callState.status === "calling"}
        callType={(callState.type as CallType) || "audio"}
        receiverName={getCallParticipantInfo().name}
        receiverAvatar={getCallParticipantInfo().avatar}
        onCancel={handleEndCall}
      />

      <ActiveCallOverlay
        isOpen={callState.status === "connected"}
        callType={(callState.type as CallType) || "audio"}
        participantName={getCallParticipantInfo().name}
        participantAvatar={getCallParticipantInfo().avatar}
        localStream={localStream}
        remoteStream={remoteStream}
        callDuration={callDuration}
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        onToggleMute={handleToggleMute}
        onToggleCamera={handleToggleCamera}
        onEndCall={handleEndCall}
      />
    </div>
  );
};
