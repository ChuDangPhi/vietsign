"use client";

import React, { useState } from "react";
import { Globe, Languages, MapPin, Type, Mic2, MessageCircle, CheckCircle2, Save, X, ArrowLeft, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

export const LanguageSettings: React.FC = () => {
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayLanguage: "vi",
    subtitleLanguage: "vi",
    region: "VN",
    timezone: "UTC+7",
    voiceRecognition: true
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  const languages = [
    { code: "vi", name: "Tiếng Việt (Vietnamese)", flag: "🇻🇳" },
    { code: "en", name: "Tiếng Anh (English)", flag: "🇺🇸" }
  ];

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
        <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
              <Globe size={40} className="text-white" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-green-100 text-sm mb-1 uppercase tracking-wider font-semibold">Cài đặt ngôn ngữ</p>
              <h1 className="text-3xl font-bold mb-2">Ngôn ngữ & Vùng miền</h1>
              <p className="text-green-100 opacity-90">Chọn ngôn ngữ hiển thị và định dạng khu vực phù hợp nhất với bạn.</p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ngôn ngữ giao diện */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Ngôn ngữ giao diện</label>
              {isEditing ? (
                <select 
                  value={editForm.displayLanguage} 
                  onChange={(e) => setEditForm({ ...editForm, displayLanguage: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                >
                  <option value="vi">🇻🇳 Tiếng Việt</option>
                  <option value="en">🇺🇸 English</option>
                </select>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                  <Languages size={18} className="text-gray-400" />
                  {editForm.displayLanguage === 'vi' ? '🇻🇳 Tiếng Việt' : '🇺🇸 English'}
                </p>
              )}
            </div>

            {/* Ngôn ngữ phụ đề */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Phụ đề video</label>
              {isEditing ? (
                <select 
                  value={editForm.subtitleLanguage} 
                  onChange={(e) => setEditForm({ ...editForm, subtitleLanguage: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                >
                  <option value="vi">🇻🇳 Tiếng Việt</option>
                  <option value="en">🇺🇸 English</option>
                  <option value="none">Không hiển thị</option>
                </select>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                  <Type size={18} className="text-gray-400" />
                  {editForm.subtitleLanguage === 'vi' ? '🇻🇳 Tiếng Việt' : editForm.subtitleLanguage === 'en' ? '🇺🇸 English' : 'Không hiển thị'}
                </p>
              )}
            </div>

            {/* Khu vực */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Khu vực</label>
              {isEditing ? (
                <select 
                  value={editForm.region} 
                  onChange={(e) => setEditForm({ ...editForm, region: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                >
                  <option value="VN">🇻🇳 Việt Nam</option>
                  <option value="US">🇺🇸 United States</option>
                  <option value="JP">🇯🇵 Japan</option>
                  <option value="KR">🇰🇷 Korea</option>
                </select>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                  <MapPin size={18} className="text-gray-400" />
                  {editForm.region === 'VN' ? '🇻🇳 Việt Nam' : editForm.region === 'US' ? '🇺🇸 United States' : editForm.region}
                </p>
              )}
            </div>

            {/* Múi giờ */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Múi giờ</label>
              {isEditing ? (
                <select 
                  value={editForm.timezone} 
                  onChange={(e) => setEditForm({ ...editForm, timezone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                >
                  <option value="UTC+7">UTC+7 (Việt Nam)</option>
                  <option value="UTC+0">UTC+0 (GMT)</option>
                  <option value="UTC-5">UTC-5 (Eastern US)</option>
                  <option value="UTC+9">UTC+9 (Japan/Korea)</option>
                </select>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 flex items-center gap-2">
                  <Globe size={18} className="text-gray-400" />
                  {editForm.timezone}
                </p>
              )}
            </div>

            {/* Nhận diện giọng nói */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Nhận diện giọng nói</label>
              {isEditing ? (
                <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-xl">
                  <span className={`text-sm font-medium ${editForm.voiceRecognition ? 'text-green-600' : 'text-gray-400'}`}>
                    {editForm.voiceRecognition ? 'Đang bật' : 'Đang tắt'}
                  </span>
                  <button 
                    type="button"
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${editForm.voiceRecognition ? 'bg-primary-600' : 'bg-gray-200'}`}
                    onClick={() => setEditForm({ ...editForm, voiceRecognition: !editForm.voiceRecognition })}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${editForm.voiceRecognition ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-xl">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${editForm.voiceRecognition ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    <Mic2 size={14} />
                    {editForm.voiceRecognition ? 'Đã bật' : 'Đã tắt'}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Language List */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Danh sách ngôn ngữ được hỗ trợ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {languages.map(lang => (
                <div 
                  key={lang.code}
                  className={`flex items-center justify-between p-4 rounded-xl ${editForm.displayLanguage === lang.code ? 'border-2 border-primary-500 bg-primary-50' : 'border border-gray-100 bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-semibold text-gray-900">{lang.name}</span>
                  </div>
                  {editForm.displayLanguage === lang.code ? (
                    <CheckCircle2 className="text-primary-600" size={20} />
                  ) : (
                    <button 
                      className="text-primary-600 text-sm font-medium"
                      onClick={() => isEditing && setEditForm({ ...editForm, displayLanguage: lang.code })}
                    >
                      {isEditing ? 'Chọn' : ''}
                    </button>
                  )}
                </div>
              ))}
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
