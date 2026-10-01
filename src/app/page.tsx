"use client";

import { getAllVideos } from "@/api/video";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import VideoCard from "@/components/video/VideoCard";
import { Video } from "@/types/video";
import { useEffect, useState } from "react";

export default function MainLayout() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingUsers, setFollowingUsers] = useState<string[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await getAllVideos();
      setVideos(res.data.data);
    };
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <Header />
      <main className="ml-60 mt-16 min-h-[calc(100vh - 64px)]">
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
      </main>
    </div>
  );
}
