// src/api/notifications.ts
import { apiRequest } from "./request";

export interface Notification {
  notificationId: number;
  type: "STORY" | "EVENING" | "MORNING" | "COMMENT";
  message: string;
  createdAt: string;
  isRead: boolean;
}

export async function getNotifications() {
  return apiRequest<Notification[]>("/api/notifications", {
    method: "GET",
  });
}
