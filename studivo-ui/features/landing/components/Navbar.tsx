"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { LangToggle } from "../../../shared/components/LangToggle";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useAuthStore } from "@/shared/store/auth.store";
import { LayoutGrid } from "lucide-react";

const navLinksConfig = [
  { id: "how_it_works", href: "#how-it-works" },
  { id: "categories", href: "#categories" },
  { id: "ai_features", href: "#ai-features" },
  { id: "sellers", href: "#sellers" },
  { id: "faq", href: "#faq" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, lang } = useTranslation();
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="fixed top-3 left-0 right-0 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/90 dark:bg-[#131b2e]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-lg px-4 md:px-6 transition-all">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-amber-300 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">

              <LayoutGrid className="text-white dark:text-[#060913]" size={24} />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Studivo</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinksConfig.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-[#fff4b7] transition-colors"
              >
                {t({ section: "landing_navbar", key: link.id })}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                href={user.role === "seller" ? "/dashboard/seller" : "/dashboard/student"}
                className="text-xs md:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-amber-300 text-white dark:text-[#060913] px-5 py-2.5 rounded-2xl font-black shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>{t({ section: "landing_navbar", key: "dashboard" }) || (lang === "ar" ? "لوحة التحكم" : "Dashboard")}</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-[#fff4b7] px-3 py-2 transition-colors"
                >
                  {t({ section: "landing_navbar", key: "login" })}
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-xs md:text-sm dark:hover:to-amber-200 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-amber-300 text-white dark:text-[#060913] px-4 md:px-5 py-2.5 rounded-2xl font-black shadow-md transition-all active:scale-95"
                >
                  {t({ section: "landing_navbar", key: "signup" })}
                </Link>
              </>
            )}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <ThemeToggle />
              <LangToggle />
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
              {menuOpen ? (
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 py-4 space-y-3">
            {navLinksConfig.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-[#fff4b7] py-1"
              >
                {t({ section: "landing_navbar", key: link.id })}
              </Link>
            ))}
            <div className="flex gap-3 pt-2 items-center justify-between border-t border-slate-200 dark:border-slate-800">
              <div className="flex gap-2">
                <Link 
                  href="/auth/login" 
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-bold text-slate-700 dark:text-slate-200 px-3 py-2"
                >
                  {t({ section: "landing_navbar", key: "login" })}
                </Link>
                <Link 
                  href="/auth/signup" 
                  onClick={() => setMenuOpen(false)}
                  className="text-sm bg-blue-600 dark:bg-[#fff4b7] text-white dark:text-[#060913] px-4 py-2 rounded-2xl font-black"
                >
                  {t({ section: "landing_navbar", key: "signup" })}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LangToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}