"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import type { RootState } from "@/store/store";
import LogoutButton from "@/components/auth/LogoutButton";
import { useState, useEffect } from "react";
import { addHistory, getHistory } from "@/api/search";

export default function Header() {
  const router = useRouter();
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [query, setQuery] = useState("");
  const [searchRe, setSearchRe] = useState<string[]>([]);
  const handleSearch = async () => {
    try {
      if (isLoggedIn) {
        await addHistory(query);
      } else {
        // luu local storage
        const history = localStorage.getItem("history");
        if (history) {
          const historyArray = JSON.parse(history);

          const newHistory = [
            query,
            ...historyArray.filter((item: string) => item !== query),
          ].slice(0, 10);

          localStorage.setItem("history", JSON.stringify(newHistory));
        } else {
          localStorage.setItem("history", JSON.stringify([query]));
        }
      }
    } catch (error) {
      console.log(error);
    }
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  useEffect(() => {
    if (!query.trim()) {
      setSearchRe([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        if (isLoggedIn) {
          const res = await getHistory();

          setSearchRe(res.data.data.map((item: any) => item.query));
        } else {
          const history = localStorage.getItem("history");

          if (history) {
            setSearchRe(JSON.parse(history));
          }
        }
      } catch (error) {
        console.log(error);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [query, isLoggedIn]);
  return (
    <header className="fixed left-60 right-0 top-0 z-40 flex h-16 items-center justify-between border-b bg-white dark:bg-black px-6">
      {/* Search */}
      <div className="w-full max-w-md relative">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="w-full rounded-full bg-gray-100 dark:bg-white/10 px-5 py-3 outline-none focus:ring-2 focus:ring-black"
        />
        {query.length > 0 && (
          <div className="absolute top-full left-0 right-0 p-4 bg-white dark:bg-black w-full">
            {searchRe.map((history, index) => (
              <div
                key={index}
                className="flex items-center gap-2 cursor-pointer"
              >
                <p onClick={() => handleSearch()}>{history}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User */}
      <div className="ml-6 flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => router.push(`/profile/${user?.id}`)}
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>👤</span>
                )}
              </div>

              <span className="font-medium">{user?.username}</span>
            </button>
            <LogoutButton />
          </>
        ) : (
          <button
            className="btn-primary cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
}
