"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import type { RootState } from "@/store/store";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { isLoggedIn, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  return children;
}
