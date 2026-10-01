"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "@/api/auth";
import { setUser, finishLoading } from "@/store/authSlice";
import type { AppDispatch } from "@/store/store";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        dispatch(finishLoading());
        return;
      }
      try {
        const res = await getMe();

        dispatch(setUser(res.data.data));
      } catch (error) {
        console.log("Token không hợp lệ");

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(finishLoading());
      }
    };

    checkAuth();
  }, [dispatch]);

  return children;
}
