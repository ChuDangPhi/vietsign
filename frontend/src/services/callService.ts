import { supabase } from "@/core/lib/supabaseClient";

// Cấu hình STUN/TURN servers
const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

export type CallType = "audio" | "video";
export type CallStatus = "idle" | "calling" | "ringing" | "connected" | "ended";

export interface CallState {
  status: CallStatus;
  type: CallType;
  roomId: string;
  callerId: string;
  receiverId: string;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

/**
 * Service quản lý gọi thoại và video call
 * Sử dụng WebRTC với Supabase Realtime làm signaling
 */
export class CallService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private signalChannel: any = null;
  private currentRoomId: string | null = null;
  private currentUserId: string;

  // Callbacks
  public onCallStateChange: ((state: Partial<CallState>) => void) | null = null;
  public onRemoteStream: ((stream: MediaStream) => void) | null = null;
  public onCallEnded: (() => void) | null = null;
  public onIncomingCall:
    | ((callerId: string, callType: CallType) => void)
    | null = null;

  constructor(userId: string) {
    this.currentUserId = userId;
  }

  /**
   * Khởi tạo media stream (camera/microphone)
   */
  private async getMediaStream(type: CallType): Promise<MediaStream> {
    const constraints: MediaStreamConstraints = {
      audio: true,
      video: type === "video" ? { width: 1280, height: 720 } : false,
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.localStream = stream;
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      throw new Error("Không thể truy cập camera/microphone");
    }
  }

  /**
   * Khởi tạo peer connection
   */
  private createPeerConnection(): RTCPeerConnection {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Xử lý ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && this.currentRoomId) {
        this.sendSignal({
          type: "ice-candidate",
          candidate: event.candidate,
        });
      }
    };

    // Xử lý remote stream
    pc.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      if (this.onRemoteStream) {
        this.onRemoteStream(event.streams[0]);
      }
    };

    // Xử lý connection state
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        this.onCallStateChange?.({ status: "connected" });
      } else if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        this.endCall();
      }
    };

    this.peerConnection = pc;
    return pc;
  }

  /**
   * Đăng ký nhận tín hiệu signaling
   */
  private subscribeToSignaling(roomId: string) {
    this.currentRoomId = roomId;

    this.signalChannel = supabase
      .channel(`call:${roomId}`)
      .on(
        "broadcast",
        { event: "signal" },
        async ({ payload }: { payload: any }) => {
          if (payload.senderId === this.currentUserId) return;

          switch (payload.type) {
            case "offer":
              await this.handleOffer(payload);
              break;
            case "answer":
              await this.handleAnswer(payload);
              break;
            case "ice-candidate":
              await this.handleIceCandidate(payload);
              break;
            case "call-request":
              this.onIncomingCall?.(payload.callerId, payload.callType);
              break;
            case "call-accepted":
              await this.handleCallAccepted(payload);
              break;
            case "call-rejected":
            case "call-ended":
              this.endCall();
              break;
          }
        },
      )
      .subscribe();
  }

  /**
   * Gửi tín hiệu signaling
   */
  private async sendSignal(data: any) {
    if (!this.currentRoomId) return;

    await supabase.channel(`call:${this.currentRoomId}`).send({
      type: "broadcast",
      event: "signal",
      payload: {
        ...data,
        senderId: this.currentUserId,
      },
    });
  }

  /**
   * Bắt đầu cuộc gọi
   */
  async startCall(
    roomId: string,
    receiverId: string,
    type: CallType,
  ): Promise<MediaStream> {
    this.onCallStateChange?.({
      status: "calling",
      type,
      roomId,
      callerId: this.currentUserId,
      receiverId,
    });

    // Đăng ký signaling channel
    this.subscribeToSignaling(roomId);

    // Lấy media stream
    const stream = await this.getMediaStream(type);

    // Gửi yêu cầu gọi
    await this.sendSignal({
      type: "call-request",
      callerId: this.currentUserId,
      receiverId,
      callType: type,
    });

    return stream;
  }

  /**
   * Chấp nhận cuộc gọi đến
   */
  async acceptCall(roomId: string, type: CallType): Promise<MediaStream> {
    this.onCallStateChange?.({ status: "connected" });

    // Đăng ký signaling
    this.subscribeToSignaling(roomId);

    // Lấy media stream
    const stream = await this.getMediaStream(type);

    // Tạo peer connection
    const pc = this.createPeerConnection();

    // Thêm tracks vào peer connection
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    // Thông báo đã accept
    await this.sendSignal({
      type: "call-accepted",
    });

    return stream;
  }

  /**
   * Xử lý khi đối phương accept cuộc gọi
   */
  private async handleCallAccepted(payload: any) {
    if (!this.localStream) return;

    const pc = this.createPeerConnection();

    // Thêm tracks
    this.localStream.getTracks().forEach((track) => {
      pc.addTrack(track, this.localStream!);
    });

    // Tạo offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    await this.sendSignal({
      type: "offer",
      offer,
    });
  }

  /**
   * Xử lý offer từ caller
   */
  private async handleOffer(payload: any) {
    if (!this.peerConnection) return;

    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(payload.offer),
    );

    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    await this.sendSignal({
      type: "answer",
      answer,
    });
  }

  /**
   * Xử lý answer từ callee
   */
  private async handleAnswer(payload: any) {
    if (!this.peerConnection) return;

    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(payload.answer),
    );
  }

  /**
   * Xử lý ICE candidate
   */
  private async handleIceCandidate(payload: any) {
    if (!this.peerConnection) return;

    try {
      await this.peerConnection.addIceCandidate(
        new RTCIceCandidate(payload.candidate),
      );
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
    }
  }

  /**
   * Từ chối cuộc gọi
   */
  async rejectCall() {
    await this.sendSignal({ type: "call-rejected" });
    this.cleanup();
  }

  /**
   * Kết thúc cuộc gọi
   */
  async endCall() {
    await this.sendSignal({ type: "call-ended" });
    this.cleanup();
    this.onCallEnded?.();
  }

  /**
   * Bật/tắt microphone
   */
  toggleMute(): boolean {
    if (!this.localStream) return false;

    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      return !audioTrack.enabled; // true = muted
    }
    return false;
  }

  /**
   * Bật/tắt camera
   */
  toggleCamera(): boolean {
    if (!this.localStream) return false;

    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      return !videoTrack.enabled; // true = camera off
    }
    return false;
  }

  /**
   * Lấy local stream hiện tại
   */
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  /**
   * Lấy remote stream hiện tại
   */
  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  /**
   * Cleanup resources
   */
  private cleanup() {
    // Stop all tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Unsubscribe from signaling
    if (this.signalChannel) {
      supabase.removeChannel(this.signalChannel);
      this.signalChannel = null;
    }

    this.remoteStream = null;
    this.currentRoomId = null;

    this.onCallStateChange?.({ status: "idle" });
  }

  /**
   * Đăng ký lắng nghe cuộc gọi đến
   */
  subscribeToIncomingCalls(roomIds: string[]) {
    roomIds.forEach((roomId) => {
      supabase
        .channel(`call:${roomId}`)
        .on(
          "broadcast",
          { event: "signal" },
          ({ payload }: { payload: any }) => {
            if (
              payload.type === "call-request" &&
              payload.receiverId === this.currentUserId
            ) {
              this.currentRoomId = roomId;
              this.onIncomingCall?.(payload.callerId, payload.callType);
            }
          },
        )
        .subscribe();
    });
  }
}
