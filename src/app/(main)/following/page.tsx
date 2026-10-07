"use client";
import { getFollowing } from "@/api/user";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import type { RootState } from "@/store/store";
import type { FollowUser } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
export default function Following() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [following, setFollowing] = useState<FollowUser[]>([]);
  useEffect(() => {
    if (user?.id) {
      getFollowing(user.id).then((res) => {
        setFollowing(res.data.data);
      });
    }
  }, [user?.id]);
  return (
    <>
      <div>
        {following.map((item) => (
          <Link href={`/profile/${item.id}`} key={item.id}>
            <Image
              src={item?.avatar || ""}
              alt={item?.username || ""}
              width={50}
              height={50}
            />
            {item?.username || ""}
          </Link>
        ))}
      </div>
    </>
  );
}
