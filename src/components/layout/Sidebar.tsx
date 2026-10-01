"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
const menus = [
  {
    name: "For You",
    href: "/feed",
    icon: "🏠",
  },
  {
    name: "Following",
    href: "/following",
    icon: "👥",
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: "🔔",
  },
  {
    name: "Favorites",
    href: "/favorites",
    icon: "❤️",
  },
  {
    name: "Upload",
    href: "/upload",
    icon: "⬆",
  },
  {
    name: "Profile",
    href: "/profile/me",
    icon: "👤",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 border-r bg-white dark:bg-black">
      <div className="p-5" onClick={() => router.push(`/`)}>
        <h1 className="text-2xl font-bold cursor-pointer">TikTok</h1>
      </div>

      <nav className="space-y-1 px-3">
        {menus.map((menu) => {
          const isActive = pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 rounded-lg p-3 ${
                isActive
                  ? "bg-gray-100 font-bold text-[#ff3b5c] dark:bg-white/10"
                  : "hover:bg-gray-100 hover:text-[#ff3b5c] dark:hover:bg-white/10"
              }`}
            >
              <span>{menu.icon}</span>

              <span>{menu.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
