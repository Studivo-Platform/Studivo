"use client";

import Link from "next/link";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { ThemeToggle } from "./ThemeToggle";
import { LangToggle } from "./LangToggle";
import { useAuthStore } from "@/shared/store/auth.store";

export function Navbar() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="fixed top-0 start-0 md:start-64 end-0 h-16 border-b border-slate-200/60 dark:border-slate-800/80 px-4 md:px-8 flex items-center justify-between gap-4 bg-white/80 dark:bg-[#060913]/80 backdrop-blur-xl z-30 transition-all">
      <div className="flex items-center gap-2">
        <span className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400">مرحباً بك في منصة ستوديفو</span>
      </div>

      {/* Right Tools & User Avatar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100 dark:bg-[#131b2e]/80 border border-slate-200 dark:border-slate-800">
          <LangToggle />
          <ThemeToggle />
        </div>

        <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 dark:border-indigo-500/30 shrink-0 bg-blue-100 dark:bg-indigo-950 flex items-center justify-center shadow-sm">
          {user?.profileImage ? (
            <img src={user.profileImage} alt="User Profile" className="h-full w-full object-cover" />
          ) : (
            <span className="font-bold text-blue-600 dark:text-indigo-400 text-sm">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
          )}
        </div>
      </div>
    </nav>
  );
}
