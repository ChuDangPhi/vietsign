"use client";

import React from "react";
import { HelpCircle, MessageCircle, FileText, Video, LifeBuoy, BookOpen, Send, CheckCircle2, ArrowLeft, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

export const HelpSettings: React.FC = () => {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <button 
          onClick={() => router.push("/settings")}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-white rounded-xl transition-all font-medium border border-transparent hover:border-gray-200 hover:shadow-sm group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại cài đặt</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-teal-700 text-white p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
              <HelpCircle size={40} className="text-white" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-cyan-100 text-sm mb-1 uppercase tracking-wider font-semibold">Trợ giúp & Hỗ trợ</p>
              <h1 className="text-3xl font-bold mb-2">Chúng tôi có thể giúp gì?</h1>
              <p className="text-cyan-100 opacity-90">Tìm câu trả lời cho các câu hỏi thường gặp hoặc liên hệ với đội ngũ hỗ trợ.</p>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-cyan-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <MessageCircle size={24} className="text-cyan-600" />
                </div>
                <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">Support</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Liên hệ hỗ trợ</h3>
              <p className="text-gray-600 text-sm mb-4">Gửi yêu cầu hỗ trợ trực tiếp cho đội ngũ vận hành hệ thống.</p>
              <button className="w-full bg-cyan-50 text-cyan-600 font-semibold py-2.5 rounded-xl hover:bg-cyan-100 transition-colors flex items-center justify-center gap-2">
                Gửi yêu cầu
                <ExternalLink size={16} />
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">FAQ</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Câu hỏi thường gặp</h3>
              <p className="text-gray-600 text-sm mb-4">Tìm kiếm nhanh câu trả lời cho các vấn đề phổ biến nhất.</p>
              <button className="w-full bg-blue-50 text-blue-600 font-semibold py-2.5 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                Xem FAQ
                <ExternalLink size={16} />
              </button>
            </div>

            <div className="bg-teal-50 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-teal-100 group">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <BookOpen size={24} className="text-teal-600" />
                </div>
                <span className="text-xs font-semibold text-teal-600 bg-white px-3 py-1 rounded-full">Docs</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tài liệu hướng dẫn</h3>
              <p className="text-gray-700 text-sm mb-4">Hướng dẫn chi tiết cách sử dụng các tính năng của VietSignSchool.</p>
              <button className="w-full bg-white text-teal-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                Mở tài liệu
                <ExternalLink size={16} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-cyan-50 p-4 rounded-xl text-center">
              <LifeBuoy size={24} className="text-cyan-600 mx-auto mb-2" />
              <p className="text-xl font-bold text-gray-900">24/7</p>
              <p className="text-xs text-gray-500">Hỗ trợ trực tuyến</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <Video size={24} className="text-blue-600 mx-auto mb-2" />
              <p className="text-xl font-bold text-gray-900">50+</p>
              <p className="text-xs text-gray-500">Video hướng dẫn</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl text-center">
              <Send size={24} className="text-indigo-600 mx-auto mb-2" />
              <p className="text-xl font-bold text-gray-900">{"< 2h"}</p>
              <p className="text-xs text-gray-500">Thời gian phản hồi</p>
            </div>
            <div className="bg-teal-50 p-4 rounded-xl text-center">
              <CheckCircle2 size={24} className="text-teal-600 mx-auto mb-2" />
              <p className="text-xl font-bold text-gray-900">Good</p>
              <p className="text-xs text-gray-500">Trạng thái hệ thống</p>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="border-t border-gray-100 pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Yêu cầu gần đây của bạn</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
                    <span className="text-lg">🎫</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Lỗi không xem được video bài học</p>
                    <p className="text-xs text-gray-500">Đã phản hồi • 1 ngày trước</p>
                  </div>
                </div>
                <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Đã giải quyết
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
                    <span className="text-lg">📧</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Không nhận được email xác nhận</p>
                    <p className="text-xs text-gray-500">Đang xử lý • 3 giờ trước</p>
                  </div>
                </div>
                <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Đang xử lý
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="border-t border-gray-100 pt-8 mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Gửi yêu cầu mới</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Tiêu đề</label>
                  <input 
                    type="text" 
                    placeholder="Nhập tiêu đề yêu cầu"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Loại yêu cầu</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white">
                    <option value="">Chọn loại yêu cầu</option>
                    <option value="bug">Báo lỗi</option>
                    <option value="feature">Đề xuất tính năng</option>
                    <option value="question">Câu hỏi</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Mô tả chi tiết</label>
                <textarea 
                  placeholder="Mô tả vấn đề của bạn..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none" 
                ></textarea>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium flex items-center gap-2">
            <Send size={18} />
            Gửi yêu cầu
          </button>
        </div>
      </div>
    </div>
  );
};
