"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

function Footersection() {
  const { t, lang } = useTranslation();

  const activeNavLinks = [
    { id: "how-it-works", label: t({ section: "footer_section", key: "link_how_it_works" }) },
    { id: "categories", label: t({ section: "footer_section", key: "link_categories" }) },
    { id: "ai-features", label: t({ section: "footer_section", key: "link_ai_features" }) },
    { id: "sellers", label: t({ section: "footer_section", key: "link_for_sellers" }) },
  ];

  return (
    <footer className="w-full bg-white dark:bg-[#060913] border-t border-slate-200/80 dark:border-slate-800/80 pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-12 text-center md:text-start border-b border-slate-100 dark:border-slate-800/60">
          
          {/* Brand & Bio */}
          <div className="max-w-md space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-amber-300 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white dark:text-[#060913]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Studivo</span>
            </Link>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {t({ section: "footer_section", key: "description" })}
            </p>
          </div>

          {/* Clean Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {activeNavLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-[#fff4b7] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

        </div>

        {/* Minimal Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <p>{t({ section: "footer_section", key: "copyright" })}</p>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span>{t({ section: "footer_section", key: "made_for" })}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footersection;