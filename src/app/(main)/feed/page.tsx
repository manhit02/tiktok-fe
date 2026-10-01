"use client";

import { useEffect, useState } from "react";

import { getFeed } from "@/api/video";
import { Video } from "@/types/video";
import VideoCard from "@/components/video/VideoCard";
import { checkFollowing } from "@/api/user";
export default function FeedPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingUsers, setFollowingUsers] = useState<string[]>([]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await getFeed();
        setVideos(res.data.data);
        // Lấy ID user không trùng
        const uniqueUserIds = [
          ...new Set(res.data.data.map((video) => video.userId)),
        ];
        // Kiểm tra mình có follow từng user không
        const followingData = await Promise.all(
          uniqueUserIds.map((user) => checkFollowing(user)),
        );
        // Chỉ giữ lại những user đang follow
        const result = uniqueUserIds.filter(
          (_, index) => followingData[index].data.following,
        );
        // set following users
        setFollowingUsers(result);
      } catch (error) {
        console.log("Lỗi lấy feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] snap-y snap-mandatory overflow-y-auto">
      {videos.map((video) => (
        <div
          key={video.id}
          className="flex min-h-[calc(100vh-64px)] snap-center items-center justify-center"
        >
          <VideoCard
            video={video}
            followingUsers={followingUsers.includes(video.userId)}
            onFollowChange={(userId, following) => {
              setFollowingUsers((prev) => {
                if (following) {
                  return prev.includes(userId) ? prev : [...prev, userId];
                }

                return prev.filter((id) => id !== userId);
              });
            }}
          />
        </div>
      ))}
    </div>
  );
}
