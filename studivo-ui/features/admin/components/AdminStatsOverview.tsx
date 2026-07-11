"use client";

import React from "react";
import { Users, GraduationCap, FileText, Tag, TrendingUp, Sparkles } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface AdminStatsOverviewProps {
  stats: any;
  isLoading: boolean;
}

export function AdminStatsOverview({ stats, isLoading }: AdminStatsOverviewProps) {
  const { t, lang } = useTranslation();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-3xl bg-slate-100 dark:bg-[#131b2e] animate-pulse border border-slate-200 dark:border-slate-800" />
        ))}
      </div>
    );
  }

  const totals = stats.totals || {};
  const today = stats.today || {};

  const cards = [
    {
      title: t({ section: "admin_portal", key: "stat_users" }),
      value: totals.users ?? 0,
      badge: `+${today.users ?? 0} ${t({ section: "admin_portal", key: "stat_today" })}`,
      icon: Users,
      color: "from-blue-600 to-indigo-600 dark:from-indigo-500 dark:to-cyan-400",
      textColor: "text-blue-600 dark:text-cyan-300",
    },
    {
      title: t({ section: "admin_portal", key: "stat_students_sellers" }),
      value: lang === "ar"
        ? `${totals.students ?? 0} طالب / ${totals.sellers ?? 0} بائع`
        : `${totals.students ?? 0} Student / ${totals.sellers ?? 0} Seller`,
      badge: t({ section: "admin_portal", key: "stat_role_dist" }),
      icon: GraduationCap,
      color: "from-violet-600 to-purple-600 dark:from-violet-500 dark:to-fuchsia-400",
      textColor: "text-violet-600 dark:text-purple-300",
    },
    {
      title: t({ section: "admin_portal", key: "stat_open_reqs" }),
      value: lang === "ar"
        ? `${totals.openRequests ?? 0} مفتوح (منذ ${totals.requests ?? 0})`
        : `${totals.openRequests ?? 0} Open (out of ${totals.requests ?? 0})`,
      badge: `+${today.requests ?? 0} ${t({ section: "admin_portal", key: "stat_today" })}`,
      icon: FileText,
      color: "from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-400",
      textColor: "text-emerald-600 dark:text-emerald-300",
    },
    {
      title: t({ section: "admin_portal", key: "stat_offers" }),
      value: totals.offers ?? 0,
      badge: `+${today.offers ?? 0} ${t({ section: "admin_portal", key: "stat_today" })}`,
      icon: Tag,
      color: "from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-400",
      textColor: "text-amber-600 dark:text-amber-300",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>{t({ section: "admin_portal", key: "live_stats_title" })}</span>
        </h3>
        <span className="text-xs font-semibold text-slate-400">
          {t({ section: "admin_portal", key: "live_stats_update" })}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const LucideIcon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">{card.title}</span>
                <div className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                  <LucideIcon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className={`text-xl md:text-2xl font-black ${card.textColor} tracking-tight truncate`}>
                  {card.value}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-extrabold text-slate-400">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{card.badge}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
