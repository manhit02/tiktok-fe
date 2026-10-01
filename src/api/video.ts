import api from "@/lib/axios";
import { ApiResponse } from "@/types/apiType";
import { Video }from "@/types/video";
export const getAllVideos= (page = 1, limit = 10) => {
    return api.get<{
        success: boolean;
        data: Video[];
    }>("/videos", {
        params: {
            page,
            limit,
        },
    });
};

export const getFeed = (page = 1, limit = 10) => {
    return api.get<{
        success: boolean;
        data: Video[];
    }>("/videos/feed", {
        params: {
            page,
            limit,
        },
    });
};

export const likeVideo = (videoId: string) => {
    return api.post(`/videos/${videoId}/like`);
};
export const getComments = (videoId: string) => {
    return api.get(`/videos/${videoId}/comments`);
};

export const createComment = (
    videoId: string,
    content: string
) => {
    return api.post(`/videos/${videoId}/comments`, {
        content,
    });
};
export const deleteComment = (videoId :string,commentId: string) => {
    return api.delete(`/videos/${videoId}/comments/${commentId}`);
};
export const viewVideo = (videoId: string) => {
    return api.post(`/videos/${videoId}/view`);
};
export const updateComment = (videoId:String,commentId: string, content: string) => {
    return api.put(`/videos/${videoId}/comments/${commentId}`, { content });
};

