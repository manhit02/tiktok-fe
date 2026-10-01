"use client";

import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { login } from "@/api/auth";
import { setUser } from "@/store/authSlice";
import type { AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import Link from "next/link";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    await login(data)
      .then((res) => {
        const { accessToken, refreshToken, user } = res.data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        dispatch(setUser(user));
        router.push("/");
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold">Đăng nhập</h1>

        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Vui lòng nhập email",
            })}
            className="w-full rounded border p-3"
          />

          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Mật khẩu"
            {...register("password", {
              required: "Vui lòng nhập mật khẩu",
            })}
            className="w-full rounded border p-3"
          />

          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <button
            type="submit"
            className="w-full rounded bg-black p-3 text-white"
          >
            Đăng nhập
          </button>
          <Link href="/register">
            <span className="text-sm text-blue-500">Đăng ký</span>
          </Link>
        </div>
      </form>
    </main>
  );
}
