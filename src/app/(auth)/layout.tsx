"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import type { RootState } from "@/store/store";
import ConfirmPopup from "@/components/common/ConfirmPopup";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { isLoggedIn, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  if (isLoading) {
    return null;
  }

  if (isLoggedIn) {
    return (
      <ConfirmPopup
        title="Bạn đã đăng nhập"
        message="Bạn đã đăng nhập rồi. Bạn có muốn quay về trang chủ không?"
        onConfirm={() => router.replace("/")}
      />
    );
  }

  return children;
}
