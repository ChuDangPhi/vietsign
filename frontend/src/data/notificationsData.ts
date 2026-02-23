// Notifications data

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  isRead: boolean;
  createdAt: string;
  sender: string;
  link?: string;
}

export const mockNotifications: NotificationItem[] = [];

export const notificationTypeConfig: Record<
  string,
  { iconName: string; bgColor: string; iconColor: string }
> = {
  info: {
    iconName: "Info",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  warning: {
    iconName: "AlertTriangle",
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  success: {
    iconName: "CheckCircle",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  error: {
    iconName: "XCircle",
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
};
