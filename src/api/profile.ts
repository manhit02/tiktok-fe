
import api from "@/lib/axios";


export const getProfile = async (id: string) => {
  return await api.get(`/profile/${id}`);
};
export const updateProfile = async (id: string, data: any) => {
  return await api.put(`/profile/${id}`, data);
};
export const getUserVideos = (userId: string,page=1,limit=10) => {
    return api.get(`/profile/videos/${userId}`, {params: {page, limit}});
};