"use client";

import { useEffect, useRef, useState } from "react";
import { Video } from "@/types/video";
import { likeVideo, viewVideo } from "@/api/video";
import CommentSection from "./CommentSection";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { checkFollowing, toggleFollow } from "@/api/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
interface VideoCardProps {
  video: Video;
  followingUsers: boolean;
  onFollowChange: (userId: string, following: boolean) => void;
}
export default function VideoCard({
  video,
  followingUsers,
  onFollowChange,
}: VideoCardProps) {
  const [liked, setLiked] = useState(video.isLiked);
  const [showComments, setShowComments] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [likeCount, setLikeCount] = useState(video.likeCount);
  const viewedRef = useRef(false);
  const [viewCount, setViewCount] = useState(video.views);
  const [isPlay, setIsPlay] = useState(false);
  const [countComments, setCountComments] = useState(video.commentCount);
  const router = useRouter();
  useEffect(() => {
    setLiked(video.isLiked);
    setCountComments(video.commentCount);
  }, [user, video.isLiked, video.commentCount]);
  const handleLike = async () => {
    try {
      if (!isLoggedIn) {
        router.push("/login");
        return;
      }
      await likeVideo(video.id).then((res) => {
        setLiked(res.data.liked);
        setLikeCount(res.data.likeCount);
      });
    } catch (error) {
      console.log("Lỗi like:", error);
    }
  };
  useEffect(() => {
    const element = videoRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.play().catch(() => {});
          setIsPlay(true);
          if (viewedRef.current) return;
          viewVideo(video.id).then((res) => {
            viewedRef.current = true;
            setViewCount(res.data.views);
          });
        } else {
          element.pause();
          setIsPlay(false);
        }
      },
      {
        threshold: 0.7,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleFollow = async () => {
    try {
      if (!isLoggedIn) {
        router.push("/login");
        return;
      }
      const res = await toggleFollow(video.userId);
      onFollowChange(video.userId, res.data.following);
    } catch (error: any) {
      console.log("Lỗi follow:", error);
    }
  };
  return (
    <div className="flex justify-center border-b pb-8 relative">
      <div className="relative h-[600px] w-[340px] overflow-hidden rounded-xl bg-black">
        <video
          ref={videoRef}
          src={video.videoUrl}
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          onClick={() => {
            if (isPlay) {
              videoRef.current?.pause();
            } else {
              videoRef.current?.play();
            }
            setIsPlay((prev) => !prev);
          }}
        />
        {!isPlay && (
          <div className="bg-black/10 absolute top-0 left-0 w-full h-full z-1 flex items-center justify-center cursor-pointer pointer-events-none">
            ▶︎
          </div>
        )}
        {/* Thông tin */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 text-white">
          <div className="flex items-center gap-3">
            <Link
              href={
                user?.id === video.userId
                  ? "/profile/me"
                  : `/profile/${video.userId}`
              }
              className="h-10 w-10 overflow-hidden rounded-full bg-gray-300"
            >
              {video.avatar && (
                <img
                  src={video.avatar}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </Link>

            <span className="font-bold">@{video.username || "Unknown"}</span>
            {user?.id !== video.userId && (
              <button onClick={handleFollow} className="cursor-pointer">
                {followingUsers ? "✔️" : "➕"}
              </button>
            )}
          </div>

          <p className="mt-3">{video.caption}</p>
        </div>
      </div>
      {showComments && (
        <CommentSection
          videoId={video.id}
          onClose={() => setShowComments(false)}
          onCommentCountChange={setCountComments}
        />
      )}
      {/* Actions */}
      <div className="absolute bottom-20 right-[-60px] flex flex-col gap-5 z-[99]">
        <div className="text-center">
          <button onClick={handleLike} className="text-2xl cursor-pointer">
            {liked ? "❤️" : "🤍"}
          </button>

          <span className="text-sm">{likeCount}</span>
        </div>

        <div className="text-center">
          <div
            className="text-2xl cursor-pointer"
            onClick={() => setShowComments((prev) => !prev)}
          >
            💬
          </div>
          <span className="text-sm">{countComments}</span>
        </div>

        <div className="text-center">
          <div className="text-2xl">👁</div>
          <span className="text-sm">{viewCount}</span>
        </div>
      </div>
    </div>
  );
}
