"use client";

import React from "react";
import { useSelector } from "react-redux";
import {
  User,
  Bell,
  Palette,
  Shield,
  Globe,
  HelpCircle,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export const Settings: React.FC = () => {
  const user = useSelector((state: any) => state.admin.user) || {
    name: "Người dùng",
    email: "user@example.com",
    role: "STUDENT",
  };

  const settingSections = [
    {
      title: "Tài khoản",
      description: "Thông tin cá nhân, mật khẩu và bảo mật",
      icon: User,
      href: "/settings/account",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Giao diện",
      description: "Theme, dark mode và hình nền",
      icon: Palette,
      href: "/settings/appearance",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Thông báo",
      description: "Email, push notification và tin nhắn",
      icon: Bell,
      href: "/settings/notifications",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Ngôn ngữ",
      description: "Tiếng Việt, English và khu vực",
      icon: Globe,
      href: "/settings/language",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Quyền riêng tư",
      description: "Hiển thị hồ sơ và dữ liệu",
      icon: Shield,
      href: "/settings/privacy",
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Trợ giúp",
      description: "FAQ, hướng dẫn và liên hệ hỗ trợ",
      icon: HelpCircle,
      href: "/settings/help",
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Card - Display Only */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800 relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row items-end md:items-end -mt-12 mb-4 gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-3xl text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>
            </div>
            <div className="flex-1 pb-2 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {user?.name}
              </h1>
              <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                {typeof user?.role === "object"
                  ? user.role.label
                  : user?.role || "Thành viên"}
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                {user?.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Email
                </p>
                <p className="font-medium text-gray-900 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Điện thoại
                </p>
                <p className="font-medium text-gray-900">Chưa cập nhật</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Địa chỉ
                </p>
                <p className="font-medium text-gray-900">Việt Nam</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Navigation Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
            <SettingsIcon size={20} />
          </span>
          Cài đặt chung
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Link href={section.href} key={index} className="group">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 relative overflow-hidden h-full">
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 ${section.bg} rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform`}
                  ></div>

                  <div className="relative z-10">
                    <div
                      className={`w-12 h-12 ${section.bg} ${section.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                    >
                      <Icon size={24} />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {section.description}
                    </p>

                    <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-primary-600 transition-colors mt-auto">
                      Mở cài đặt{" "}
                      <ChevronRight
                        size={16}
                        className="ml-1 group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper icon
const SettingsIcon = ({
  size,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
