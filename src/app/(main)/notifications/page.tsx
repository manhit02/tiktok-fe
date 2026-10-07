"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getNotifications, markAsRead, markAllAsRead } from "@/api/notification";
import { NotificationItem } from "@/types/notification";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "like" | "comment" | "follow">("all");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      if (res.data?.data) {
        setNotifications(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy thông báo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Lỗi đánh dấu đã đọc:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Lỗi đánh dấu tất cả đã đọc:", error);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.type.toLowerCase() === filter;
  });

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "like":
        return "❤️";
      case "comment":
        return "💬";
      case "follow":
        return "👤";
      default:
        return "🔔";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Vừa xong";
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 7) return `${diffDays} ngày trước`;
      return date.toLocaleDateString("vi-VN");
    } catch {
      return "";
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Thông báo</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500">
              Bạn có <span className="font-semibold text-[#ff3b5c]">{unreadCount}</span> thông báo chưa đọc
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-[#ff3b5c] hover:underline font-medium"
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b pb-3 mb-4 overflow-x-auto">
        {(
          [
            { key: "all", label: "Tất cả" },
            { key: "like", label: "Lượt thích" },
            { key: "comment", label: "Bình luận" },
            { key: "follow", label: "Follow" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === tab.key
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 animate-pulse"
            >
              <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-800 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/3" />
                <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-3">🔔</div>
          <p className="text-lg font-medium">Không có thông báo nào</p>
          <p className="text-sm">Khi có người follow, thích hoặc bình luận video, bạn sẽ thấy ở đây.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => !item.isRead && handleMarkAsRead(item.id)}
              className={`flex items-center gap-3 p-3 rounded-xl transition cursor-pointer ${
                item.isRead
                  ? "hover:bg-gray-50 dark:hover:bg-zinc-900/50"
                  : "bg-red-50/40 dark:bg-zinc-900 border-l-4 border-[#ff3b5c]"
              }`}
            >
              {/* Avatar with icon badge */}
              <div className="relative">
                <Link
                  href={item.sender?.id ? `/profile/${item.sender.id}` : "#"}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {item.sender?.avatar ? (
                      <Image
                        src={item.sender.avatar}
                        alt={item.sender.username || "User"}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg">👤</span>
                    )}
                  </div>
                </Link>
                <span className="absolute -bottom-1 -right-1 text-xs bg-white dark:bg-zinc-800 rounded-full p-0.5 shadow">
                  {getIcon(item.type)}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <Link
                    href={item.sender?.id ? `/profile/${item.sender.id}` : "#"}
                    onClick={(e) => e.stopPropagation()}
                    className="font-bold hover:underline mr-1 text-black dark:text-white"
                  >
                    {item.sender?.username || "Người dùng"}
                  </Link>
                  <span>{item.content}</span>
                </p>
                <span className="text-xs text-gray-400 mt-1 block">
                  {formatTime(item.createdAt)}
                </span>
              </div>

              {/* Video thumbnail preview if available */}
              {item.video?.videoUrl && (
                <div className="w-12 h-16 rounded overflow-hidden bg-black flex-shrink-0">
                  <video
                    src={item.video.videoUrl}
                    className="w-full h-full object-cover"
                    muted
                  />
                </div>
              )}

              {/* Unread indicator */}
              {!item.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff3b5c] flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
