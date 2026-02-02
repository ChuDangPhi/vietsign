"use client";

import React, { useEffect, useRef } from "react";
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  X,
  User,
} from "lucide-react";
import { CallType } from "@/services/callService";

interface IncomingCallModalProps {
  isOpen: boolean;
  callerName: string;
  callerAvatar?: string | null;
  callType: CallType;
  onAccept: () => void;
  onReject: () => void;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  isOpen,
  callerName,
  callerAvatar,
  callType,
  onAccept,
  onReject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 text-center animate-pulse-slow">
        {/* Avatar */}
        <div className="relative mx-auto mb-6">
          {callerAvatar ? (
            <img
              src={callerAvatar}
              alt={callerName}
              className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-green-400 ring-offset-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto ring-4 ring-green-400 ring-offset-4">
              <User size={40} className="text-white" />
            </div>
          )}
          {/* Call type indicator */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            {callType === "video" ? (
              <>
                <Video size={12} /> Video
              </>
            ) : (
              <>
                <Phone size={12} /> Thoại
              </>
            )}
          </div>
        </div>

        {/* Caller info */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{callerName}</h3>
        <p className="text-gray-500 mb-8">
          Đang gọi {callType === "video" ? "video" : "thoại"} cho bạn...
        </p>

        {/* Action buttons */}
        <div className="flex justify-center gap-6">
          <button
            onClick={onReject}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
            title="Từ chối"
          >
            <PhoneOff size={28} />
          </button>
          <button
            onClick={onAccept}
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
            title="Chấp nhận"
          >
            <Phone size={28} />
          </button>
        </div>
      </div>

      {/* Ringtone animation circles */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

interface ActiveCallOverlayProps {
  isOpen: boolean;
  callType: CallType;
  participantName: string;
  participantAvatar?: string | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callDuration: number;
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
}

export const ActiveCallOverlay: React.FC<ActiveCallOverlayProps> = ({
  isOpen,
  callType,
  participantName,
  participantAvatar,
  localStream,
  remoteStream,
  callDuration,
  isMuted,
  isCameraOff,
  onToggleMute,
  onToggleCamera,
  onEndCall,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Set video streams
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-3">
          {participantAvatar ? (
            <img
              src={participantAvatar}
              alt={participantName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
              <User size={20} />
            </div>
          )}
          <div>
            <h3 className="text-white font-semibold">{participantName}</h3>
            <p className="text-white/70 text-sm">
              {formatDuration(callDuration)}
            </p>
          </div>
        </div>
      </div>

      {/* Video area */}
      {callType === "video" ? (
        <div className="flex-1 relative">
          {/* Remote video (full screen) */}
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              {participantAvatar ? (
                <img
                  src={participantAvatar}
                  alt={participantName}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary-600 flex items-center justify-center">
                  <User size={60} className="text-white" />
                </div>
              )}
            </div>
          )}

          {/* Local video (picture-in-picture) */}
          <div className="absolute top-20 right-4 w-32 h-48 rounded-xl overflow-hidden shadow-lg border-2 border-white/20">
            {localStream && !isCameraOff ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <VideoOff size={24} className="text-white/50" />
              </div>
            )}
          </div>
        </div>
      ) : (
        // Audio call view
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            {participantAvatar ? (
              <img
                src={participantAvatar}
                alt={participantName}
                className="w-40 h-40 rounded-full object-cover mx-auto mb-6 ring-4 ring-primary-400 ring-offset-4 ring-offset-gray-900"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-6 ring-4 ring-primary-400 ring-offset-4 ring-offset-gray-900">
                <User size={60} className="text-white" />
              </div>
            )}
            <h2 className="text-2xl font-bold text-white mb-2">
              {participantName}
            </h2>
            <p className="text-white/70">{formatDuration(callDuration)}</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-center gap-6">
          {/* Mute button */}
          <button
            onClick={onToggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMuted
                ? "bg-red-500 hover:bg-red-600"
                : "bg-white/20 hover:bg-white/30"
            }`}
            title={isMuted ? "Bật mic" : "Tắt mic"}
          >
            {isMuted ? (
              <MicOff size={24} className="text-white" />
            ) : (
              <Mic size={24} className="text-white" />
            )}
          </button>

          {/* Camera button (only for video call) */}
          {callType === "video" && (
            <button
              onClick={onToggleCamera}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isCameraOff
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-white/20 hover:bg-white/30"
              }`}
              title={isCameraOff ? "Bật camera" : "Tắt camera"}
            >
              {isCameraOff ? (
                <VideoOff size={24} className="text-white" />
              ) : (
                <Video size={24} className="text-white" />
              )}
            </button>
          )}

          {/* End call button */}
          <button
            onClick={onEndCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all hover:scale-110"
            title="Kết thúc cuộc gọi"
          >
            <PhoneOff size={28} className="text-white" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
};

interface CallingOverlayProps {
  isOpen: boolean;
  callType: CallType;
  receiverName: string;
  receiverAvatar?: string | null;
  onCancel: () => void;
}

export const CallingOverlay: React.FC<CallingOverlayProps> = ({
  isOpen,
  callType,
  receiverName,
  receiverAvatar,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col items-center justify-center">
      {/* Avatar with animation */}
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping-slow">
          <div className="w-40 h-40 rounded-full bg-primary-400/20"></div>
        </div>
        <div className="absolute inset-0 animate-ping-slower">
          <div className="w-40 h-40 rounded-full bg-primary-400/10"></div>
        </div>
        {receiverAvatar ? (
          <img
            src={receiverAvatar}
            alt={receiverName}
            className="w-40 h-40 rounded-full object-cover relative z-10"
          />
        ) : (
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center relative z-10">
            <User size={60} className="text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <h2 className="text-2xl font-bold text-white mb-2">{receiverName}</h2>
      <p className="text-white/70 mb-8 flex items-center gap-2">
        {callType === "video" ? <Video size={18} /> : <Phone size={18} />}
        Đang gọi {callType === "video" ? "video" : "thoại"}...
      </p>

      {/* Cancel button */}
      <button
        onClick={onCancel}
        className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-all hover:scale-110"
        title="Hủy cuộc gọi"
      >
        <PhoneOff size={28} className="text-white" />
      </button>

      <style jsx>{`
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        @keyframes ping-slower {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 2s ease-out infinite;
        }
        .animate-ping-slower {
          animation: ping-slower 2s ease-out infinite 0.5s;
        }
      `}</style>
    </div>
  );
};
