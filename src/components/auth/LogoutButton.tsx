"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { logout } from "@/api/auth";
import { logout as clearAuth } from "@/store/authSlice";

import type { AppDispatch } from "@/store/store";

export default function LogoutButton() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      if (refreshToken) {
        await logout(refreshToken);
      }
    } catch (error) {
      console.log("Logout API error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      dispatch(clearAuth());

      router.back();
    }
  };

  return <button onClick={handleLogout}>Đăng xuất</button>;
}
