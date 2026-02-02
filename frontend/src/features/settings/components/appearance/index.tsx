"use client";

import React, { useState } from "react";
import { Palette, Moon, Sun, Type, Layout, Sparkles, Monitor, AppWindow, Save, X, ArrowLeft, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

export const AppearanceSettings: React.FC = () => {
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    theme: "light",
    fontSize: "100%",
    accentColor: "Mặc định",
    density: "Chuẩn",
    animations: true
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
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
              <Palette size={40} className="text-white" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-purple-100 text-sm mb-1 uppercase tracking-wider font-semibold">Cài đặt giao diện</p>
              <h1 className="text-3xl font-bold mb-2">Giao diện & Trải nghiệm</h1>
              <p className="text-purple-100 opacity-90">Tùy chỉnh màu sắc, chủ đề và cách hiển thị nội dung theo ý muốn của bạn.</p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chủ đề */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Chủ đề (Theme)</label>
              {isEditing ? (
                <select 
                  value={editForm.theme} 
                  onChange={(e) => setEditForm({ ...editForm, theme: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                >
                  <option value="light">Sáng</option>
                  <option value="dark">Tối</option>
                  <option value="system">Theo hệ thống</option>
                </select>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                  {editForm.theme === 'light' ? <Sun size={18} className="text-orange-500" /> : <Moon size={18} className="text-indigo-500" />}
                  {editForm.theme === 'light' ? 'Sáng' : editForm.theme === 'dark' ? 'Tối' : 'Theo hệ thống'}
                </p>
              )}
            </div>

            {/* Kích thước chữ */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Kích thước chữ</label>
              {isEditing ? (
                <select 
                  value={editForm.fontSize} 
                  onChange={(e) => setEditForm({ ...editForm, fontSize: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                >
                  <option value="75%">Nhỏ (75%)</option>
                  <option value="100%">Bình thường (100%)</option>
                  <option value="125%">Lớn (125%)</option>
                  <option value="150%">Rất lớn (150%)</option>
                </select>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                  <Type size={18} className="text-blue-500" />
                  {editForm.fontSize}
                </p>
              )}
            </div>

            {/* Màu nhấn */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Màu nhấn</label>
              {isEditing ? (
                <select 
                  value={editForm.accentColor} 
                  onChange={(e) => setEditForm({ ...editForm, accentColor: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                >
                  <option value="Mặc định">Mặc định (Xanh dương)</option>
                  <option value="Tím">Tím</option>
                  <option value="Xanh lá">Xanh lá</option>
                  <option value="Cam">Cam</option>
                </select>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-purple-500" />
                  {editForm.accentColor}
                </p>
              )}
            </div>

            {/* Mật độ hiển thị */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Mật độ hiển thị</label>
              {isEditing ? (
                <select 
                  value={editForm.density} 
                  onChange={(e) => setEditForm({ ...editForm, density: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                >
                  <option value="Compact">Gọn (Compact)</option>
                  <option value="Chuẩn">Chuẩn (Default)</option>
                  <option value="Thoải mái">Thoải mái (Comfortable)</option>
                </select>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                  <Layout size={18} className="text-indigo-500" />
                  {editForm.density}
                </p>
              )}
            </div>

            {/* Hiệu ứng động */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Hiệu ứng chuyển động</label>
              {isEditing ? (
                <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-xl">
                  <span className={`text-sm font-medium ${editForm.animations ? 'text-green-600' : 'text-gray-400'}`}>
                    {editForm.animations ? 'Đang bật' : 'Đang tắt'}
                  </span>
                  <button 
                    type="button"
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${editForm.animations ? 'bg-primary-600' : 'bg-gray-200'}`}
                    onClick={() => setEditForm({ ...editForm, animations: !editForm.animations })}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${editForm.animations ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${editForm.animations ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {editForm.animations ? 'Bật' : 'Tắt'}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Bản xem trước</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className={`border-2 rounded-xl p-4 flex items-center justify-center h-24 ${editForm.theme === 'light' ? 'bg-gray-50 border-primary-500' : 'bg-gray-100 border-transparent'}`}>
                <Monitor size={32} className="text-primary-500" />
                <span className="ml-2 font-medium">Sáng {editForm.theme === 'light' && '(Active)'}</span>
              </div>
              <div className={`rounded-xl p-4 flex items-center justify-center h-24 text-white ${editForm.theme === 'dark' ? 'bg-gray-900 border-2 border-gray-700' : 'bg-gray-900 border-2 border-transparent'}`}>
                <Monitor size={32} className="text-gray-400" />
                <span className="ml-2 font-medium text-gray-400">Tối {editForm.theme === 'dark' && '(Active)'}</span>
              </div>
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
