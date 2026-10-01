import axios,{ InternalAxiosRequestConfig } from "axios";
interface RetryConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Gắn access token vào request
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }

    return config;
});

// Tự refresh token khi access token hết hạn
api.interceptors.response.use(
    (response) => response,

    async (error) => {
       const originalRequest = error.config as RetryConfig;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");

            if (!refreshToken) {
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                    {
                        refreshToken,
                    }
                );

                const newAccessToken =
                    response.data.data.accessToken;

                localStorage.setItem(
                    "accessToken",
                    newAccessToken
                );

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;