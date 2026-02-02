import React, { useState } from "react";
import { Bell, Search, Menu } from "lucide-react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import UserDropdown from "./components/UserDropdown";
import NotificationDropdown from "./components/NotificationDropdown";

interface DashboardHeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<DashboardHeaderProps> = ({ toggleSidebar }) => {
  const user = useSelector((state: any) => state.admin.user);
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<
    "notifications" | "user" | null
  >(null);

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
      {/* Backdrop for closing dropdowns */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setActiveDropdown(null)}
        ></div>
      )}

      <div className="flex items-center gap-4">
        {/* Toggle Button - YouTube Style */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-3 group mr-2">
          <div className="w-10 h-10 relative group-hover:scale-105 transition-transform">
            <Image
              src="/icon.svg"
              alt="VietSignSchool Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              VietSign<span className="text-primary-600">School</span>
            </span>
            <p className="text-xs text-gray-500 -mt-1">Ngôn ngữ ký hiệu</p>
          </div>
        </Link>
      </div>

      {/* Center Search Bar - YouTube Style */}
      <div className="hidden md:flex flex-1 max-w-2xl mx-4">
        <div className="flex w-full">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full bg-gray-50 border border-gray-300 border-r-0 rounded-l-full px-4 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-gray-500"
          />
          <button className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-full px-5 hover:bg-gray-200 transition-colors text-gray-600">
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 relative z-50">
        {/* Search Mobile Button */}
        <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Search size={22} />
        </button>

        {/* Notification */}
        <div className="relative">
          <button
            className={`p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors relative ${
              activeDropdown === "notifications" ? "bg-gray-100" : ""
            }`}
            onClick={() =>
              setActiveDropdown(
                activeDropdown === "notifications" ? null : "notifications"
              )
            }
          >
            <Bell size={22} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          {activeDropdown === "notifications" && (
            <NotificationDropdown onClose={() => setActiveDropdown(null)} />
          )}
        </div>

        {/* User Profile */}
        <div className="relative ml-2">
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white cursor-pointer hover:scale-105 transition-transform select-none"
            onClick={() =>
              setActiveDropdown(activeDropdown === "user" ? null : "user")
            }
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          {activeDropdown === "user" && (
            <UserDropdown user={user} onClose={() => setActiveDropdown(null)} />
          )}
        </div>
      </div>
    </header>
  );
};
