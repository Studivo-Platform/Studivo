"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useAuthStore } from "@/shared/store/auth.store";

const featureKeys = ["feature1", "feature2", "feature3", "feature4"] as const;

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      const dashboardPath = user.role === "seller" ? "/dashboard/seller" : "/dashboard/student";
      router.replace(dashboardPath);
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#060913] transition-colors duration-300">

      {/* ── Left panel — branded gradient ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col justify-between p-10 relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 dark:from-[#060913] dark:via-[#131b2e] dark:to-[#0d1322] border-e border-slate-200 dark:border-slate-800">

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border border-white/30 group-hover:scale-105 transition-transform">
              <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="2" fill="white" />
                <rect x="10" y="2" width="6" height="6" rx="2" fill="white" opacity="0.7" />
                <rect x="2" y="10" width="6" height="6" rx="2" fill="white" opacity="0.7" />
                <rect x="10" y="10" width="6" height="6" rx="2" fill="white" opacity="0.4" />
              </svg>
            </div>
            <span className="text-white font-black text-2xl tracking-tight">Studivo</span>
          </Link>
        </div>

        {/* Middle content */}
        <div className="relative z-10 space-y-8 text-start my-auto py-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-white/90 text-xs md:text-sm font-bold backdrop-blur-sm">
            <svg className="w-4 h-4 text-cyan-300 dark:text-[#fff4b7]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span>{t({ section: "auth_layout", key: "badge" })}</span>
          </div>

          <h1 className="text-3xl xl:text-5xl font-black text-white dark:text-[#fff4b7] leading-tight tracking-tight">
            {t({ section: "auth_layout", key: "title" })}
          </h1>

          <p className="text-blue-100 dark:text-slate-300 text-base md:text-lg leading-relaxed font-medium">
            {t({ section: "auth_layout", key: "subtitle" })}
          </p>

          <ul className="space-y-3.5 pt-2">
            {featureKeys.map((key) => (
              <li key={key} className="flex items-center gap-3 text-white/90 text-sm md:text-base font-bold">
                <span className="w-6 h-6 rounded-full bg-white/20 border border-white/40 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span>{t({ section: "auth_layout", key: key })}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom — social proof */}
        <div className="relative z-10 flex items-center gap-3 pt-6 border-t border-white/20">
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {["bg-blue-400", "bg-cyan-400", "bg-amber-300"].map((c, i) => (
              <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-white/80 shadow-sm`} />
            ))}
          </div>
          <p className="text-white/90 text-xs md:text-sm font-semibold">
            {t({ section: "auth_layout", key: "social_proof_prefix" })}
            <span className="font-black text-white dark:text-[#fff4b7] mx-1">12,450+</span>
            {t({ section: "auth_layout", key: "social_proof_suffix" })}
          </p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#060913]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-[#fff4b7] transition-colors">
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{t({ section: "auth_layout", key: "back_to_home" })}</span>
          </Link>
          
          <ThemeToggle />
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md bg-white dark:bg-gradient-to-br dark:from-[#131b2e] dark:to-[#0d1322] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
}