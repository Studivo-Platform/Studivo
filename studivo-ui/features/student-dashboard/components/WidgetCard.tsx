"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { WidgetConfigItem, WidgetApiData } from "../types/widgetItem.type";

export function WidgetCard({ config, value, change }: { config: WidgetConfigItem } & WidgetApiData) {
  const { t } = useTranslation();
  const LucideIcon = (Icons as any)[config.icon] as React.ComponentType<{ className?: string }>;

  return (
    <Link href={config.href} className="block p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-gradient-to-br dark:from-[#131b2e] dark:to-[#0d1322] hover:border-blue-500 dark:hover:border-indigo-500/60 shadow-sm transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 bg-slate-50 dark:bg-indigo-950/40 border-slate-200 dark:border-indigo-500/30 text-blue-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
          {LucideIcon && <LucideIcon className="h-5 w-5" />}
        </div>
        {change && (
          <span className="text-[11px] font-semibold text-slate-500 dark:text-cyan-300/90 bg-slate-100 dark:bg-cyan-950/50 border border-transparent dark:border-cyan-800/50 px-2 py-0.5 rounded-full">
            {change}
          </span>
        )}
      </div>
      <div className="mt-3 space-y-0.5">
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{value}</h3>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
          {t({ section: "dashboard_widgets", key: config.labelKey })}
        </p>
      </div>
    </Link>
  );
}