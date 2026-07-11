"use client";

import React from "react";
import { useTranslation } from "@/shared/hooks/useTranslation"; 

const categoriesConfig = [
  { id: "electronics", emoji: "💻", count: "2.4K+" },
  { id: "books", emoji: "📚", count: "1.8K+" },
  { id: "furniture", emoji: "🪑", count: "940+" },
  { id: "clothing", emoji: "👕", count: "3.1K+" },
  { id: "food", emoji: "🛒", count: "5.2K+" },
  { id: "services", emoji: "🔧", count: "1.2K+" },
  { id: "sports", emoji: "⚽", count: "880+" },
  { id: "beauty", emoji: "💊", count: "1.5K+" },
];

export default function CategoriesSection() {
  const { t } = useTranslation();

  return (
    <section id="categories" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14 space-y-3">
          <p className="text-xs md:text-sm font-extrabold text-blue-600 dark:text-[#fff4b7] uppercase tracking-widest">
            {t({ section: "categories_section", key: "badge" })}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t({ section: "categories_section", key: "title" })}
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {categoriesConfig.map(({ id, emoji, count }) => (
            <button
              key={id}
              className="group flex flex-col items-center gap-3.5 p-6 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#131b2e] dark:to-[#0d1322] border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500 dark:hover:border-indigo-500/60 transition-all duration-300 text-center shadow-sm hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-indigo-950/50 border border-blue-100 dark:border-indigo-500/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {emoji}
              </div>
              <div>
                <p className="font-bold text-sm md:text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#fff4b7] transition-colors">
                  {t({ section: "categories_section", key: id })}
                </p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {count} {t({ section: "categories_section", key: "requests_suffix" })}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}