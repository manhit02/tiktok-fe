import api from "@/lib/axios";
import { ApiResponse } from "@/types/apiType";
import { NotificationItem } from "@/types/notification";

export const getNotifications = async () => {
  return await api.get<ApiResponse<NotificationItem[]>>(`/notification`);
};

export const createNotification = async (data: Partial<NotificationItem>) => {
  return await api.post<ApiResponse<boolean>>(`/notification/create`, data);
};

export const markAsRead = async (id: string) => {
  return await api.put<ApiResponse<boolean>>(`/notification/${id}/read`);
};

export const markAllAsRead = async () => {
  return await api.put<ApiResponse<boolean>>(`/notification/read-all`);
};
