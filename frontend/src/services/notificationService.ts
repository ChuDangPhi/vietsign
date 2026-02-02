import { Base } from "@/domain/entities/base";
import { mockNotifications, NotificationItem } from "@/data";

export async function fetchAllNotifications(): Promise<NotificationItem[]> {
  return mockNotifications;
}

export async function markAsRead(id: number): Promise<void> {
  // Mock
  console.log(`Marked notification ${id} as read`);
}

export async function markAllAsRead(): Promise<void> {
  // Mock
  console.log("Marked all notifications as read");
}

export async function deleteNotification(id: number): Promise<void> {
  // Mock
  console.log(`Deleted notification ${id}`);
}
