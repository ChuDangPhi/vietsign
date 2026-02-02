"use client";

import React, { useState } from "react";
import { Bell, Mail, Smartphone, BellOff, MessageSquare, ShieldCheck, Clock, Save, X, ArrowLeft, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

export const NotificationsSettings: React.FC = () => {
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    pushNotifications: true,
    emailNotifications: true,
    securityAlerts: true,
    discussionReplies: true,
    courseUpdates: true,
    quietHours: "22:00",
    weeklyDigest: false
  });

  const handleSave = () => {
    setIsEditing(false);
  };

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
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
              <Bell size={40} className="text-white" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-orange-100 text-sm mb-1 uppercase tracking-wider font-semibold">Cài đặt thông báo</p>
              <h1 className="text-3xl font-bold mb-2">Thông báo & Tin nhắn</h1>
              <p className="text-orange-100 opacity-90">Kiểm soát cách và thời điểm bạn nhận được cập nhật từ hệ thống.</p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông báo đẩy */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Thông báo đẩy (Push)</label>
              {isEditing ? (
                <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-xl">
                  <span className={`text-sm font-medium ${editForm.pushNotifications ? 'text-green-600' : 'text-gray-400'}`}>
                    {editForm.pushNotifications ? 'Đang bật' : 'Đang tắt'}
                  </span>
                  <button 
                    type="button"
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${editForm.pushNotifications ? 'bg-primary-600' : 'bg-gray-200'}`}
                    onClick={() => setEditForm({ ...editForm, pushNotifications: !editForm.pushNotifications })}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${editForm.pushNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${editForm.pushNotifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    <Smartphone size={14} />
                    {editForm.pushNotifications ? 'Đã bật' : 'Đã tắt'}
                  </span>
                </p>
              )}
            </div>

            {/* Email thông báo */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email thông báo</label>
              {isEditing ? (
                <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-xl">
                  <span className={`text-sm font-medium ${editForm.emailNotifications ? 'text-green-600' : 'text-gray-400'}`}>
                    {editForm.emailNotifications ? 'Đang bật' : 'Đang tắt'}
                  </span>
                  <button 
                    type="button"
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${editForm.emailNotifications ? 'bg-primary-600' : 'bg-gray-200'}`}
                    onClick={() => setEditForm({ ...editForm, emailNotifications: !editForm.emailNotifications })}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${editForm.emailNotifications ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${editForm.emailNotifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    <Mail size={14} />
                    {editForm.emailNotifications ? 'Đã bật' : 'Đã tắt'}
                  </span>
                </p>
              )}
            </div>

            {/* Cảnh báo bảo mật */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Cảnh báo bảo mật</label>
              {isEditing ? (
                <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-xl">
                  <span className={`text-sm font-medium ${editForm.securityAlerts ? 'text-green-600' : 'text-gray-400'}`}>
                    {editForm.securityAlerts ? 'Đang bật' : 'Đang tắt'}
                  </span>
                  <button 
                    type="button"
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${editForm.securityAlerts ? 'bg-primary-600' : 'bg-gray-200'}`}
                    onClick={() => setEditForm({ ...editForm, securityAlerts: !editForm.securityAlerts })}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${editForm.securityAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${editForm.securityAlerts ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    <ShieldCheck size={14} />
                    {editForm.securityAlerts ? 'Đã bật' : 'Đã tắt'}
                  </span>
                </p>
              )}
            </div>

            {/* Chế độ im lặng */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Chế độ im lặng (sau)</label>
              {isEditing ? (
                <input 
                  type="time" 
                  value={editForm.quietHours} 
                  onChange={(e) => setEditForm({ ...editForm, quietHours: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                  <Clock size={18} className="text-gray-400" />
                  {editForm.quietHours}
                </p>
              )}
            </div>

            {/* Phản hồi thảo luận */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Thảo luận & Phản hồi</label>
              {isEditing ? (
                <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-xl">
                  <span className={`text-sm font-medium ${editForm.discussionReplies ? 'text-green-600' : 'text-gray-400'}`}>
                    {editForm.discussionReplies ? 'Đang bật' : 'Đang tắt'}
                  </span>
                  <button 
                    type="button"
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${editForm.discussionReplies ? 'bg-primary-600' : 'bg-gray-200'}`}
                    onClick={() => setEditForm({ ...editForm, discussionReplies: !editForm.discussionReplies })}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${editForm.discussionReplies ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${editForm.discussionReplies ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    <MessageSquare size={14} />
                    {editForm.discussionReplies ? 'Đã bật' : 'Đã tắt'}
                  </span>
                </p>
              )}
            </div>

            {/* Cập nhật khóa học */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Cập nhật khóa học</label>
              {isEditing ? (
                <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-xl">
                  <span className={`text-sm font-medium ${editForm.courseUpdates ? 'text-green-600' : 'text-gray-400'}`}>
                    {editForm.courseUpdates ? 'Đang bật' : 'Đang tắt'}
                  </span>
                  <button 
                    type="button"
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${editForm.courseUpdates ? 'bg-primary-600' : 'bg-gray-200'}`}
                    onClick={() => setEditForm({ ...editForm, courseUpdates: !editForm.courseUpdates })}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${editForm.courseUpdates ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${editForm.courseUpdates ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    <Bell size={14} />
                    {editForm.courseUpdates ? 'Đã bật' : 'Đã tắt'}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
            <div className="bg-orange-50 p-4 rounded-xl text-center">
              <Bell size={24} className="text-orange-600 mx-auto mb-2" />
              <p className="text-xl font-bold text-gray-900">Bật</p>
              <p className="text-xs text-gray-500">Trạng thái hiện tại</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <MessageSquare size={24} className="text-blue-600 mx-auto mb-2" />
              <p className="text-xl font-bold text-gray-900">15</p>
              <p className="text-xs text-gray-500">Thông báo tuần này</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl text-center">
              <Clock size={24} className="text-indigo-600 mx-auto mb-2" />
              <p className="text-xl font-bold text-gray-900">{editForm.quietHours}</p>
              <p className="text-xs text-gray-500">Chế độ im lặng</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl text-center">
              <BellOff size={24} className="text-purple-600 mx-auto mb-2" />
              <p className="text-xl font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-500">Kênh đã tắt</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-white transition-colors font-medium flex items-center gap-2"
              >
                <X size={18} />
                Hủy
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium flex items-center gap-2"
              >
                <Save size={18} />
                Lưu thay đổi
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-white transition-colors font-medium flex items-center gap-2"
            >
              <Edit size={18} />
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
