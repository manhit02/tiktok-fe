"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getUserVideos } from "@/api/profile";
import { Video } from "@/types/video";
import VideoCard from "@/components/video/VideoCard";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function VideoPage() {
  const path = usePathname();
  const userMe = useSelector((state: RootState) => state.auth.user);
  const { uid } = useParams();
  const [userVideos, setUserVideos] = useState<Video[]>([]);
  const [followingUsers, setFollowingUsers] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const videoid = searchParams.get("videoId");
  useEffect(() => {
    async function fetchUserVideos() {
      try {
        if (path === "/profile/videos/me") {
          if (!userMe?.id) return;
          const res = await getUserVideos(userMe.id);
          const videos: Video[] = res.data.data;
          const index = videos.findIndex((x) => x.id === videoid);

          const orderedVideos = [
            ...videos.slice(index),
            ...videos.slice(0, index),
          ];
          setUserVideos(orderedVideos);
        } else {
          if (!uid) return;
          const res = await getUserVideos(uid as string);
          const videos: Video[] = res.data.data;
          const index = videos.findIndex((x) => x.id === videoid);

          const orderedVideos = [
            ...videos.slice(index),
            ...videos.slice(0, index),
          ];
          setUserVideos(orderedVideos);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserVideos();
  }, [path, uid, userMe]);

  return (
    <>
      <div className="h-[calc(100vh-64px)] snap-y snap-mandatory overflow-y-auto">
        {userVideos.map((video) => (
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
    </>
  );
}
