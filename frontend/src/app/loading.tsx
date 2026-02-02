"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto relative">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-100 border-t-primary-600 animate-spin"></div>

            {/* Inner pulsing circle */}
            <div className="absolute inset-3 rounded-full bg-primary-600 animate-pulse flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">V</span>
            </div>
          </div>

          {/* Floating dots */}
          <div className="flex justify-center gap-2 mt-6">
            <div
              className="w-3 h-3 rounded-full bg-primary-400 animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-3 h-3 rounded-full bg-primary-500 animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-3 h-3 rounded-full bg-primary-600 animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang tải...</h2>
        <p className="text-gray-500 text-sm">Vui lòng đợi trong giây lát</p>

        {/* Progress bar */}
        <div className="w-64 h-1.5 bg-gray-100 rounded-full mx-auto mt-6 overflow-hidden">
          <div className="h-full bg-primary-600 rounded-full animate-loading-bar"></div>
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes loading-bar {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 60%;
            margin-left: 20%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
