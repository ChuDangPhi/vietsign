"use client";

import React from "react";
import Link from "next/link";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* 404 Number with glitch effect */}
        <div className="relative mb-8">
          <h1 className="text-[180px] md:text-[220px] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-primary-400 leading-none select-none">
            404
          </h1>
          {/* Glitch layers */}
          <h1 className="absolute inset-0 text-[180px] md:text-[220px] font-black text-primary-500/30 leading-none select-none animate-glitch-1">
            404
          </h1>
          <h1 className="absolute inset-0 text-[180px] md:text-[220px] font-black text-purple-500/30 leading-none select-none animate-glitch-2">
            404
          </h1>
        </div>

        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border border-red-500/30 backdrop-blur-sm">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full border-2 border-red-500/50 animate-ping"></div>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Không tìm thấy trang
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại, đã bị xóa, hoặc bạn không có quyền truy cập.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105"
          >
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Về trang chủ
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </button>
        </div>

        {/* Help text */}
        <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 max-w-md mx-auto">
          <div className="flex items-center gap-3 text-gray-300 mb-3">
            <Search className="w-5 h-5 text-primary-400" />
            <span className="font-medium">Gợi ý</span>
          </div>
          <ul className="text-sm text-gray-400 text-left space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
              Kiểm tra lại đường dẫn URL
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
              Đảm bảo bạn đã đăng nhập nếu trang yêu cầu
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
              Liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn
            </li>
          </ul>
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes glitch-1 {
          0%, 100% {
            transform: translate(0);
          }
          20% {
            transform: translate(-3px, 3px);
          }
          40% {
            transform: translate(-3px, -3px);
          }
          60% {
            transform: translate(3px, 3px);
          }
          80% {
            transform: translate(3px, -3px);
          }
        }
        @keyframes glitch-2 {
          0%, 100% {
            transform: translate(0);
          }
          20% {
            transform: translate(3px, -3px);
          }
          40% {
            transform: translate(3px, 3px);
          }
          60% {
            transform: translate(-3px, -3px);
          }
          80% {
            transform: translate(-3px, 3px);
          }
        }
        .animate-glitch-1 {
          animation: glitch-1 3s ease-in-out infinite;
        }
        .animate-glitch-2 {
          animation: glitch-2 3s ease-in-out infinite reverse;
        }
      `}</style>
    </div>
  );
}
