"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    if (path === "/profile") {
      router.push("/profile/me");
    }
  }, [path]);
  return <></>;
}
