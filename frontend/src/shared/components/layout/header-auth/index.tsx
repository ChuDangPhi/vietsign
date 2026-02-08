import React, { useState, useEffect, useMemo, useRef } from "react";
import { Bell, Search, Menu, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import UserDropdown from "./components/UserDropdown";
import NotificationDropdown from "./components/NotificationDropdown";
import { fetchAllUsers } from "@/services/userService";
import { chatService } from "@/services/chatService";
import { roleLabels, UserItem } from "@/data/usersData";

interface DashboardHeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<DashboardHeaderProps> = ({ toggleSidebar }) => {
  const user = useSelector((state: any) => state.admin.user);
  const pathname = usePathname();
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<
    "notifications" | "user" | null
  >(null);

  // User search states
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [usersMap, setUsersMap] = useState<Record<string, UserItem>>({});
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch users logic
  useEffect(() => {
    async function loadUsers() {
      try {
        const { users } = await fetchAllUsers({ limit: 1000 });
        const map: Record<string, UserItem> = {};
        users.forEach((u) => {
          map[u.id.toString()] = u;
        });
        setUsersMap(map);
      } catch (e) {
        console.error("Failed to load users", e);
      }
    }
    loadUsers();
  }, []);

  // Close search suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowUserSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter users based on search query
  const filteredUserSuggestions = useMemo(() => {
    if (!userSearchQuery.trim()) return [];
    const query = userSearchQuery.toLowerCase();
    const currentUserId = user?.id?.toString();

    return Object.values(usersMap)
      .filter(
        (u) =>
          u.id.toString() !== currentUserId &&
          (u.name?.toLowerCase().includes(query) ||
            u.email?.toLowerCase().includes(query)),
      )
      .slice(0, 10); // Limit to 10 suggestions
  }, [userSearchQuery, usersMap, user]);

  const handleDirectMessage = async (targetUser: UserItem) => {
    if (!user?.id) return;
    try {
      const room = await chatService.getOrCreateDirectRoom(
        user.id.toString(),
        targetUser.id.toString(),
      );
      // Navigate to messages page with the room selected query param if needed,
      // but usually the chat page handles selection via state.
      // Since we are likely navigating from another page,
      // we might need a way to pass the selected room.
      // For now, let's just navigate to /messages.
      // Ideally, /messages should accept a roomId query param.
      // Let's assume /messages route can handle no params or we just go there.
      // But to be more useful, maybe we should store selected room in local storage or redux?
      // Or simply navigate. The user can find the room in the list since it was just created/fetched (bumped to top).

      // Update: Chat page usually loads rooms on mount.
      // If we create it here, it will be at the top.
      router.push("/messages");
      setUserSearchQuery("");
      setShowUserSuggestions(false);
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Lỗi khi tạo cuộc trò chuyện");
    }
  };

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

      {/* Center Search Bar - User Search with Suggestions */}
      <div
        className="hidden md:flex flex-1 max-w-2xl mx-4 relative"
        ref={searchRef}
      >
        <div className="flex w-full">
          <input
            type="text"
            value={userSearchQuery}
            onChange={(e) => {
              setUserSearchQuery(e.target.value);
              setShowUserSuggestions(true);
            }}
            onFocus={() => setShowUserSuggestions(true)}
            placeholder="Tìm kiếm người dùng..." 
            className="w-full bg-gray-50 border border-gray-300 border-r-0 rounded-l-full px-4 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-gray-500"
          />
          <button className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-full px-5 hover:bg-gray-200 transition-colors text-gray-600">
            <Search size={18} />
          </button>
        </div>

        {/* User Suggestions Dropdown */}
        {showUserSuggestions && filteredUserSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-[60]">
            {filteredUserSuggestions.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-medium text-gray-900 truncate">
                    {user.name || `User ${user.id}`}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email || ""}{" "}
                    {user.role && (
                      <span className="text-primary-600">
                        • {roleLabels[user.role] || user.role}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleDirectMessage(user)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shrink-0"
                >
                  <MessageCircle size={14} />
                  Nhắn tin
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {showUserSuggestions &&
          userSearchQuery.trim() &&
          filteredUserSuggestions.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 p-4 text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-lg z-[60]">
              Không tìm thấy người dùng nào
            </div>
          )}
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
                activeDropdown === "notifications" ? null : "notifications",
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
