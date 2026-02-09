import {
  supabase,
  Message,
  Room,
  RoomParticipant,
  MessageStatus,
} from "@/core/lib/supabaseClient";

/**
 * Service quản lý Chat Real-time với Supabase
 * Sử dụng schema: rooms, room_participants, messages, message_statuses
 */
export const chatService = {
  // ==================== ROOMS ====================

  /**
   * Lấy danh sách phòng chat của user
   */
  getRoomsForUser: async (userId: string) => {
    const { data: participations, error: pError } = await supabase
      .from("room_participants")
      .select("room_id")
      .eq("user_id", userId);

    if (pError) throw pError;
    if (!participations || participations.length === 0) return [];

    const roomIds = participations.map((p: any) => p.room_id);

    const { data: rooms, error: rError } = await supabase
      .from("rooms")
      .select("*")
      .in("id", roomIds)
      .order("created_at", { ascending: false });

    if (rError) throw rError;
    return rooms as Room[];
  },

  /**
   * Lấy thông tin chi tiết một phòng
   */
  getRoomById: async (roomId: string) => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (error) throw error;
    return data as Room;
  },

  /**
   * Lấy danh sách thành viên trong phòng
   */
  getRoomParticipants: async (roomId: string) => {
    const { data, error } = await supabase
      .from("room_participants")
      .select("*")
      .eq("room_id", roomId);

    if (error) throw error;
    return data as RoomParticipant[];
  },

  /**
   * Tạo phòng chat mới (1-1 hoặc nhóm)
   */
  createRoom: async (
    name: string | null,
    isGroup: boolean,
    participantIds: string[],
  ) => {
    const { data: room, error: rError } = await supabase
      .from("rooms")
      .insert([{ name, is_group: isGroup }])
      .select()
      .single();

    if (rError) throw rError;

    const participants = participantIds.map((userId) => ({
      room_id: room.id,
      user_id: userId,
    }));

    const { error: pError } = await supabase
      .from("room_participants")
      .insert(participants);

    if (pError) throw pError;

    return room as Room;
  },

  /**
   * Tạo phòng nhóm mới
   */
  createGroupRoom: async (
    name: string,
    creatorId: string,
    memberIds: string[],
  ) => {
    const allMembers = [
      creatorId,
      ...memberIds.filter((id) => id !== creatorId),
    ];
    return await chatService.createRoom(name, true, allMembers);
  },

  /**
   * Tìm hoặc tạo phòng chat 1-1 giữa 2 user
   */
  getOrCreateDirectRoom: async (userId1: string, userId2: string) => {
    const { data: rooms1 } = await supabase
      .from("room_participants")
      .select("room_id")
      .eq("user_id", userId1);

    const { data: rooms2 } = await supabase
      .from("room_participants")
      .select("room_id")
      .eq("user_id", userId2);

    if (rooms1 && rooms2) {
      const roomIds1 = rooms1.map((r: any) => r.room_id);
      const roomIds2 = rooms2.map((r: any) => r.room_id);
      const commonRoomIds = roomIds1.filter((id: any) => roomIds2.includes(id));

      for (const roomId of commonRoomIds) {
        const { data: room } = await supabase
          .from("rooms")
          .select("*")
          .eq("id", roomId)
          .eq("is_group", false)
          .single();

        if (room) return room as Room;
      }
    }

    return await chatService.createRoom(null, false, [userId1, userId2]);
  },

  /**
   * Cập nhật tên phòng (chỉ cho nhóm)
   */
  updateRoomName: async (roomId: string, newName: string) => {
    const { error } = await supabase
      .from("rooms")
      .update({ name: newName })
      .eq("id", roomId);

    if (error) throw error;
  },

  /**
   * Thêm thành viên vào nhóm
   */
  addParticipant: async (roomId: string, userId: string) => {
    const { error } = await supabase
      .from("room_participants")
      .insert([{ room_id: roomId, user_id: userId }]);

    if (error) throw error;
  },

  /**
   * Xóa thành viên khỏi nhóm
   */
  removeParticipant: async (roomId: string, userId: string) => {
    const { error } = await supabase
      .from("room_participants")
      .delete()
      .eq("room_id", roomId)
      .eq("user_id", userId);

    if (error) throw error;
  },

  /**
   * Rời khỏi nhóm
   */
  leaveRoom: async (roomId: string, userId: string) => {
    await chatService.removeParticipant(roomId, userId);
  },

  // ==================== MESSAGES ====================

  /**
   * Lấy tin nhắn của một phòng
   */
  getMessages: async (roomId: string, limit: number = 50) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data as Message[];
  },

  /**
   * Lấy thêm tin nhắn cũ hơn (pagination)
   */
  getOlderMessages: async (
    roomId: string,
    beforeDate: string,
    limit: number = 20,
  ) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .eq("is_deleted", false)
      .lt("created_at", beforeDate)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data as Message[]).reverse();
  },

  /**
   * Gửi tin nhắn mới
   */
  sendMessage: async (
    roomId: string,
    userId: string,
    content: string,
    type: string = "text",
    replyTo: string | null = null,
  ) => {
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          room_id: roomId,
          user_id: userId,
          content,
          type,
          reply_to: replyTo,
          is_edited: false,
          is_deleted: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Message;
  },

  /**
   * Gửi tin nhắn có ảnh
   */
  sendImageMessage: async (
    roomId: string,
    userId: string,
    file: File,
    caption?: string,
  ) => {
    // Upload ảnh lên Supabase Storage
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `chat/${roomId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("chat-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Lấy public URL
    const { data: urlData } = supabase.storage
      .from("chat-images")
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    // Gửi tin nhắn với URL ảnh
    const content = JSON.stringify({
      imageUrl,
      caption: caption || "",
    });

    return await chatService.sendMessage(roomId, userId, content, "image");
  },

  /**
   * Gửi file đính kèm
   */
  sendFileMessage: async (roomId: string, userId: string, file: File) => {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `chat/${roomId}/files/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("chat-files")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("chat-files")
      .getPublicUrl(filePath);

    const content = JSON.stringify({
      fileUrl: urlData.publicUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    return await chatService.sendMessage(roomId, userId, content, "file");
  },

  /**
   * Chỉnh sửa tin nhắn
   */
  editMessage: async (messageId: string, newContent: string) => {
    const { data, error } = await supabase
      .from("messages")
      .update({ content: newContent, is_edited: true })
      .eq("id", messageId)
      .select()
      .single();

    if (error) throw error;
    return data as Message;
  },

  /**
   * Xóa tin nhắn (soft delete)
   */
  deleteMessage: async (messageId: string) => {
    const { error } = await supabase
      .from("messages")
      .update({ is_deleted: true })
      .eq("id", messageId);

    if (error) throw error;
  },

  /**
   * Ghim tin nhắn trong phòng
   */
  pinMessage: async (roomId: string, messageId: string) => {
    const { error } = await supabase
      .from("rooms")
      .update({ pinned_message_id: messageId })
      .eq("id", roomId);

    if (error) throw error;
  },

  /**
   * Bỏ ghim tin nhắn
   */
  unpinMessage: async (roomId: string) => {
    const { error } = await supabase
      .from("rooms")
      .update({ pinned_message_id: null })
      .eq("id", roomId);

    if (error) throw error;
  },

  // ==================== REALTIME ====================

  /**
   * Đăng ký nhận tin nhắn mới realtime
   */
  subscribeToMessages: (
    roomId: string,
    callback: (message: Message) => void,
  ) => {
    return supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload: any) => callback(payload.new as Message),
      )
      .subscribe();
  },

  /**
   * Đăng ký nhận cập nhật tin nhắn (edit/delete)
   */
  subscribeToMessageUpdates: (
    roomId: string,
    callback: (message: Message) => void,
  ) => {
    return supabase
      .channel(`room-updates:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload: any) => callback(payload.new as Message),
      )
      .subscribe();
  },

  /**
   * Hủy đăng ký realtime
   */
  unsubscribe: async (channel: any) => {
    await supabase.removeChannel(channel);
  },

  // ==================== MESSAGE STATUS ====================

  /**
   * Cập nhật trạng thái tin nhắn (đã đọc)
   */
  updateMessageStatus: async (
    messageId: string,
    userId: string,
    status: string,
  ) => {
    const { error } = await supabase.from("message_statuses").upsert(
      {
        message_id: messageId,
        user_id: userId,
        status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "message_id,user_id" },
    );

    if (error) throw error;
  },

  /**
   * Đánh dấu tất cả tin nhắn trong phòng là đã đọc
   */
  markAllAsRead: async (roomId: string, userId: string) => {
    const { data: messages } = await supabase
      .from("messages")
      .select("id")
      .eq("room_id", roomId)
      .neq("user_id", userId);

    if (!messages || messages.length === 0) return;

    const statuses = messages.map((msg: any) => ({
      message_id: msg.id,
      user_id: userId,
      status: "read",
      updated_at: new Date().toISOString(),
    }));

    await supabase
      .from("message_statuses")
      .upsert(statuses, { onConflict: "message_id,user_id" });
  },

  // ==================== SEARCH ====================

  /**
   * Tìm kiếm tin nhắn trong phòng
   */
  searchMessages: async (roomId: string, query: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .eq("is_deleted", false)
      .ilike("content", `%${query}%`)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data as Message[];
  },
};
