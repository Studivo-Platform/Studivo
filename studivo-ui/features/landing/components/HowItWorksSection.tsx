"use client";

import React from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";

const stepsConfig = [
  {
    id: "step1",
    number: "01",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    id: "step2",
    number: "02",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.636-6.364l.707.707M6.343 17.657l-.707.707M17.657 17.657l.707.707M12 21v-1" />
      </svg>
    ),
  },
  {
    id: "step3",
    number: "03",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 02 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    id: "step4",
    number: "04",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <p className="text-xs md:text-sm font-extrabold text-blue-600 dark:text-[#fff4b7] uppercase tracking-widest">
            {t({ section: "how_it_works_section", key: "badge" })}
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t({ section: "how_it_works_section", key: "title" })}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-xl mx-auto font-medium">
            {t({ section: "how_it_works_section", key: "description" })}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stepsConfig.map(({ id, number, icon }) => (
            <div 
              key={id} 
              className="relative rounded-2xl p-6 md:p-7 bg-white dark:bg-gradient-to-br dark:from-[#131b2e] dark:to-[#0d1322] border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-blue-500 dark:hover:border-indigo-500/60 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-indigo-950/50 text-blue-600 dark:text-cyan-400 border border-blue-100 dark:border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <span className="text-3xl font-black text-slate-300 dark:text-slate-700 select-none">
                  {number}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t({ section: "how_it_works_section", key: `${id}_title` })}
              </h3>
              
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {t({ section: "how_it_works_section", key: `${id}_desc` })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}