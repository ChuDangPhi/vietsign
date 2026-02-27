"use client";

import React, { useState, useRef } from "react";
import { StepItem } from "@/data/lessonsData";
import { VideoContainer } from "./VideoContainer";
import {
  aiService,
  AIAssessmentResult,
} from "@/features/study/services/aiService";
import {
  Video,
  Camera,
  StopCircle,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Play,
  RotateCcw,
} from "lucide-react";

interface PracticeVideoStepProps {
  step: StepItem;
  onComplete?: () => void;
}

export function PracticeVideoStep({
  step,
  onComplete,
}: PracticeVideoStepProps) {
  // Step đưa ra video mẫu và màn hình camera. Người dùng xem mẫu, quay lại video của mình và gửi để AI chấm điểm.
  // State quản lý trạng thái quay video
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  // State quản lý trạng thái kiểm tra AI
  const [isExamining, setIsExamining] = useState(false);
  const [result, setResult] = useState<AIAssessmentResult | null>(null);

  // Refs để truy cập DOM video element và MediaRecorder
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Bắt đầu quay video từ camera
  const startRecording = async () => {
    try {
      // Yêu cầu quyền truy cập camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Khởi tạo MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Thu thập dữ liệu video
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      // Xử lý khi dừng quay
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecordedBlob(blob);
        setRecordedUrl(URL.createObjectURL(blob));

        // Dừng tất cả các tracks (tắt đèn camera)
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setResult(null); // Reset kết quả cũ nếu có
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  // Dừng quay video
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Gửi video đã quay lên Mock AI Service để chấm điểm
  const handleSubmit = async () => {
    if (!recordedBlob) return;

    setIsExamining(true);
    try {
      // Gọi Mock AI Service
      const aiResult = await aiService.evaluateVideo(recordedBlob);
      setResult(aiResult);

      if (aiResult.isCorrect && onComplete) {
        // Tự động đánh dấu hoàn thành nếu đúng (hoặc để người dùng bấm 'Tiếp tục')
      }
    } catch (error) {
      console.error("AI Check failed", error);
    } finally {
      setIsExamining(false);
    }
  };

  // Reset trạng thái để quay lại từ đầu
  const handleRetry = () => {
    setRecordedBlob(null);
    setRecordedUrl(null);
    setResult(null);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2 text-primary-900">
          {step.description || `Thực hành ký hiệu: ${step.word}`}
        </h3>
        <p className="text-gray-500 text-sm">
          Xem video mẫu và quay lại động tác của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sample Video */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3 text-primary-700 font-medium">
            <Video size={20} />
            <span>Video mẫu</span>
          </div>
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-sm relative flex items-center justify-center">
            <VideoContainer
              videoUrl={step.videoUrl || step.imageUrl || ""}
              size="md"
              showControls={true}
            />
          </div>
        </div>

        {/* Recording Area */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-red-600 font-medium">
            <Camera size={20} />
            <span>Camera của bạn</span>
          </div>

          <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-sm relative flex items-center justify-center">
            {!isRecording && !recordedUrl && (
              <button
                onClick={startRecording}
                className="flex flex-col items-center gap-3 text-white hover:scale-105 transition-transform"
              >
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
                  <Play className="fill-white" size={32} />
                </div>
                <span className="font-medium">Bắt đầu quay</span>
              </button>
            )}

            <video
              ref={videoRef}
              className={`w-full h-full object-cover transform scale-x-[-1] ${
                !isRecording ? "hidden" : ""
              }`}
              muted
            />

            {recordedUrl && !isRecording && (
              <video
                src={recordedUrl}
                controls
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 flex justify-center gap-4">
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors"
              >
                <StopCircle size={18} />
                Dừng quay
              </button>
            ) : null}

            {!isRecording && recordedBlob && !result && (
              <>
                <button
                  onClick={handleRetry}
                  disabled={isExamining}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  <RotateCcw size={18} />
                  Quay lại
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isExamining}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-70"
                >
                  {isExamining ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <UploadCloud size={18} />
                  )}
                  {isExamining ? "Đang kiểm tra..." : "Gửi kiểm tra"}
                </button>
              </>
            )}

            {!isRecording && result && (
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                <RefreshCw size={18} />
                Thử lại
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div
          className={`mt-4 p-6 rounded-2xl border-2 flex items-start gap-4 animate-in slide-in-from-bottom-5 fade-in duration-500 ${
            result.isCorrect
              ? "border-green-100 bg-green-50"
              : "border-amber-100 bg-amber-50"
          }`}
        >
          <div
            className={`p-3 rounded-full ${
              result.isCorrect
                ? "bg-green-100 text-green-600"
                : "bg-amber-100 text-amber-600"
            }`}
          >
            {result.isCorrect ? (
              <CheckCircle2 size={32} />
            ) : (
              <AlertCircle size={32} />
            )}
          </div>
          <div>
            <h4
              className={`text-lg font-bold mb-1 ${
                result.isCorrect ? "text-green-800" : "text-amber-800"
              }`}
            >
              {result.isCorrect ? "Chính xác!" : "Cần cố gắng thêm"}
              <span className="text-sm font-normal ml-2 opacity-80">
                (Độ chính xác: {result.score}%)
              </span>
            </h4>
            <p className="text-gray-700">{result.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
}
