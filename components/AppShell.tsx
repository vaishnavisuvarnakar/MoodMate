"use client";

import { Sidebar, MobileNav } from "./Sidebar";
import { useProfile } from "@/lib/storage";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { name } = useProfile();

  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-end items-center gap-3 px-4 md:px-8 py-4 border-b border-outline-variant/30">
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-sm font-bold text-on-secondary-container">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold hidden sm:inline">{name}</span>
        </div>
        <main className="flex-1 px-4 md:px-8 py-6 pb-24 md:pb-6 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
