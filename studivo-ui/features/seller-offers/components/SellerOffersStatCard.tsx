"use client";

import * as Icons from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { SellerOffersStatItem } from "../types/sellerOffersStats.type";

export function SellerOffersStatCard({ stat }: { stat: SellerOffersStatItem }) {
  const { t } = useTranslation();
  const LucideIcon = Icons[stat.icon] as React.ComponentType<{ className?: string }>;

  return (
    <div className="bg-white dark:bg-[#131b2e] p-4 md:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${stat.color}`}>
        {LucideIcon && <LucideIcon className="h-5 w-5" />}
      </div>
      <div className="space-y-0.5 min-w-0">
        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</h3>
        <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 truncate">
          {t({ section: "seller_offers_widgets", key: stat.labelKey })}
        </p>
      </div>
    </div>
  );
}