import api from "@/lib/axios";
import {
    LoginPayload,
    RegisterPayload,
    AuthResponse,
} from "@/types/auth";

export const login = (data: LoginPayload) => {
    return api.post<AuthResponse>("/auth/login", data);
};

export const register = (data: RegisterPayload) => {
    return api.post("/auth/register", data);
};

export const getMe = () => {
    return api.get("/auth/me");
};

export const refreshToken = (refreshToken: string) => {
    return api.post("/auth/refresh", {
        refreshToken,
    });
};

export const logout = (refreshToken: string) => {
    return api.post("/auth/logout", {
        refreshToken,
    });
};