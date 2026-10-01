"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { register as registerApi } from "@/api/auth";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    try {
      setServerError("");

      await registerApi({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      router.push("/login");
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold">Đăng ký</h1>

        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

        {/* Username */}
        <div>
          <input
            type="text"
            placeholder="Username"
            {...register("username", {
              required: "Vui lòng nhập username",
              minLength: {
                value: 3,
                message: "Username phải có ít nhất 3 ký tự",
              },
            })}
            className="w-full rounded border p-3"
          />

          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
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

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Mật khẩu"
            {...register("password", {
              required: "Vui lòng nhập mật khẩu",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              },
            })}
            className="w-full rounded border p-3"
          />

          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            {...register("confirmPassword", {
              required: "Vui lòng nhập lại mật khẩu",
              validate: (value) => value === password || "Mật khẩu không khớp",
            })}
            className="w-full rounded border p-3"
          />

          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded bg-black p-3 text-white"
        >
          Đăng ký
        </button>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full"
        >
          Đã có tài khoản? Đăng nhập
        </button>
      </form>
    </main>
  );
}
