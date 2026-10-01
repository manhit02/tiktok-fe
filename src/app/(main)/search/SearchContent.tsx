"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSearch } from "@/api/search";
import { useEffect } from "react";
import { Search } from "@/types/search";
import Link from "next/link";
import Image from "next/image";
export default function page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [searchRe, setSearchRe] = useState<Search | null>(null);
  useEffect(() => {
    getSearch(query || "").then((res) => {
      setSearchRe(res.data.data);
    });
  }, [query]);
  return (
    <>
      <div className="mt-4 grid grid-cols-3 gap-1">
        {searchRe && searchRe.videos.length > 0 ? (
          searchRe?.videos.map((video) => (
            <div className="flex flex-col justify-between">
              <Link
                href={`/profile/videos/${video.userId}?videoId=${video.id}`}
                key={video.id}
                className="aspect-3/4 overflow-hidden bg-gray-200 dark:bg-gray-800"
              >
                <video
                  src={video.videoUrl}
                  className="h-full w-full object-cover"
                />
              </Link>
              <Link
                href={`/profile/${video.userId}`}
                className="flex items-center gap-1"
              >
                <Image
                  width={24}
                  height={24}
                  src={video.avatar}
                  alt=""
                  className="rounded-[50%] w-6 h-6"
                />
                <h1>{video.username}</h1>
              </Link>
            </div>
          ))
        ) : (
          <div>Không tìm thấy video</div>
        )}
        {searchRe && searchRe.videos.length < 1 && searchRe.users.length > 0 ? (
          searchRe?.users.map((user) => (
            <Link href={`/profile/${user.id}`} key={user.id}>
              <Image
                width={24}
                height={24}
                src={user.avatar}
                alt=""
                className="rounded-[50%] w-6 h-6"
              />
              <h1>{user.username}</h1>
            </Link>
          ))
        ) : (
          <div>Không tìm thấy người dùng</div>
        )}
      </div>
    </>
  );
}
