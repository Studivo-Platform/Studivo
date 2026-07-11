"use client";

import * as Icons from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { SellerStatItem } from "../types/sellerStats.type";

export function SellerStatCard({ stat }: { stat: SellerStatItem }) {
  const { t } = useTranslation();
  const LucideIcon = Icons[stat.icon] as React.ComponentType<{ className?: string }>;

  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-[#131b2e] dark:to-[#0d1322] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between group hover:border-blue-500 dark:hover:border-indigo-500/60 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 bg-slate-50 dark:bg-indigo-950/40 border-slate-200 dark:border-indigo-500/30 text-blue-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
          {LucideIcon && <LucideIcon className="h-5 w-5" />}
        </div>
        {stat.change && (
          <div className="flex items-center gap-1 font-semibold text-xs text-slate-500 dark:text-cyan-300/90 bg-slate-100 dark:bg-cyan-950/50 border border-transparent dark:border-cyan-800/50 px-2 py-0.5 rounded-full">
            <Icons.TrendingUp className="w-3.5 h-3.5 shrink-0" />
            <span>{stat.change}</span>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-0.5">
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {stat.value}
        </h3>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
          {t({ section: "seller_dashboard_widgets", key: stat.labelKey })}
        </p>
      </div>
    </div>
  );
}