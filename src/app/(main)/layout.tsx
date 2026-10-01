"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <Header />

      <main className="ml-60 mt-16 min-h-[calc(100vh - 64px)]">{children}</main>
    </div>
  );
}
