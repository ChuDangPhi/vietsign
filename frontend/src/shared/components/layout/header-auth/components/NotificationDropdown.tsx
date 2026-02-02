import React from "react";
import { Settings, MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface Notification {
    id: string;
    avatar: string;
    title: string;
    time: string;
    isRead: boolean;
    image?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        avatar: "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff",
        title: "Chào mừng bạn đến với VietSign! Hãy bắt đầu bài học đầu tiên.",
        time: "2 giờ trước",
        isRead: false,
    },
    {
        id: "2",
        avatar: "https://ui-avatars.com/api/?name=Teacher&background=10B981&color=fff",
        title: "Giáo viên đã chấm bài tập về nhà của bạn.",
        time: "1 ngày trước",
        isRead: true,
        image: "https://dummyimage.com/100x60/f3f4f6/9ca3af&text=Bai+tap"
    },
    {
        id: "3",
        avatar: "https://ui-avatars.com/api/?name=System&background=6366F1&color=fff",
        title: "Cập nhật hệ thống mới: Thêm tính năng từ điển AI.",
        time: "3 ngày trước",
        isRead: true,
    },
    {
        id: "4",
        avatar: "https://ui-avatars.com/api/?name=Nam&background=F59E0B&color=fff",
        title: "Nam đã bình luận về bài đăng của bạn trong diễn đàn.",
        time: "1 tuần trước",
        isRead: true,
    }
];

interface NotificationDropdownProps {
    onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
    return (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
                <h3 className="text-base font-semibold text-gray-900">Thông báo</h3>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <Settings size={18} />
                </button>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
                {MOCK_NOTIFICATIONS.map((notif) => (
                    <div
                        key={notif.id}
                        className={`
                flex gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 relative group
                ${!notif.isRead ? 'bg-blue-50/50' : ''}
            `}
                    >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <img src={notif.avatar} alt="" className="w-10 h-10 rounded-full shadow-sm" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm text-gray-900 leading-snug mb-1 ${!notif.isRead ? 'font-semibold' : ''}`}>
                                {notif.title}
                            </p>
                            <p className="text-xs text-gray-500">
                                {notif.time}
                            </p>
                        </div>

                        {/* Optional Image */}
                        {notif.image && (
                            <div className="flex-shrink-0 w-16 h-12 rounded overflow-hidden border border-gray-200">
                                <img src={notif.image} alt="" className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Unread Indicator */}
                        {!notif.isRead && (
                            <div className="absolute top-1/2 right-4 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}

                        {/* Hover Actions */}
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-full bg-white shadow-sm border border-gray-100">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationDropdown;
