"use client";

import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  mockNotifications,
  notificationTypeConfig,
  NotificationItem,
} from "@/data";
import {
  fetchAllNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "@/services/notificationService";
import { Pagination, usePagination } from "@/shared/components/common/Pagination";

const iconMap: Record<string, React.ReactNode> = {
  Info: <Info size={20} />,
  AlertTriangle: <AlertTriangle size={20} />,
  CheckCircle: <CheckCircle size={20} />,
  XCircle: <XCircle size={20} />,
};

const ITEMS_PER_PAGE = 5;

export function NotificationsManagement() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to load notifications", error);
        setNotifications(mockNotifications);
      } finally {
        setIsLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const filteredNotifications = notifications.filter(
    (notif) =>
      filterType === "all" ||
      (filterType === "unread" ? !notif.isRead : notif.type === filterType)
  );

  const {
    currentPage,
    totalPages,
    paginatedItems,
    paddedItems,
    setCurrentPage,
  } = usePagination(filteredNotifications, ITEMS_PER_PAGE);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error("Failed to mark as read", e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (e) {
      console.error("Failed to delete notification", e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary-600" />
            Thông báo
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-sm font-medium bg-red-500 text-white rounded-full ml-2">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý và theo dõi các thông báo hệ thống
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors shadow-sm"
          >
            <CheckCheck size={18} /> Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none bg-white min-w-[160px] focus:ring-2 focus:ring-primary-500 transition-all"
          >
            <option value="all">Tất cả thông báo</option>
            <option value="unread">Chưa đọc</option>
            <option value="info">Thông tin</option>
            <option value="warning">Cảnh báo</option>
            <option value="success">Thành công</option>
            <option value="error">Lỗi</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {paddedItems.map((notif, index) => {
            if (!notif)
              return (
                <div
                  key={`empty-${index}`}
                  className="h-[110px]"
                  aria-hidden="true"
                />
              );

            const config = notificationTypeConfig[notif.type];
            return (
              <div
                key={notif.id}
                className={`p-5 hover:bg-gray-50 transition-colors ${
                  !notif.isRead ? "bg-primary-50/20" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center ${config.iconColor} shadow-sm`}
                  >
                    {iconMap[config.iconName]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-semibold ${
                          !notif.isRead ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {notif.title}
                      </h3>
                      {!notif.isRead && (
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                      <span className="text-primary-600">{notif.sender}</span>
                      <span>•</span>
                      <span>{notif.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity">
                    {!notif.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Đánh dấu đã đọc"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notif.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa thông báo"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredNotifications.length > 0 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={notifications.length}
            filteredItems={filteredNotifications.length}
            itemName="thông báo"
            onPageChange={setCurrentPage}
          />
        ) : (
          <div className="p-16 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có thông báo nào
            </h3>
            <p className="text-gray-500">
              Bạn đã xem hết tất cả thông báo trong danh mục này
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
