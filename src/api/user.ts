
import api from "@/lib/axios";
import { ApiResponse } from "@/types/apiType";
import { Follow,Follow2 } from "@/types/user";



export const getUser = async (id: string) => {
  return await api.get(`/users/${id}`);
};
export const getFollowing=async (id: string) => {
  return await api.get<ApiResponse<Follow[]>>(`/users/${id}/following`);
};
export const getFollowers=async (id: string) => {
  return await api.get<ApiResponse<Follow[]>>(`/users/${id}/followers`);
};
export const toggleFollow = async (userId: string) => {
  return api.post<Follow2>(`/users/${userId}/follow`);
};
export const checkFollowing = async (userId: string) => {
  return api.get<Follow2>(`/users/${userId}/check-following`);
};
