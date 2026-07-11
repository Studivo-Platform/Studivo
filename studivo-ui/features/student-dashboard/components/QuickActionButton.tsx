"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { QuickActionItem } from "../types/quickActionItem.type";

export function QuickActionButton({ action }: { action: QuickActionItem }) {
  const { t } = useTranslation();
  const LucideIcon = (Icons as any)[action.icon] as React.ComponentType<{ className?: string }>;

  return (
    <Link href={action.href} className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border border-[#95CCDD]/40 dark:border-[#006A67]/60 bg-white dark:bg-[#003161] hover:border-[#4274D9] dark:hover:border-[#FFF4B7] text-[#293681] dark:text-white hover:text-[#4274D9] dark:hover:text-[#FFF4B7] transition-all duration-300 shadow-sm active:scale-95">
      {LucideIcon && <LucideIcon className="h-4 w-4 md:h-5 md:w-5 shrink-0 text-[#4274D9] dark:text-[#FFF4B7]" />}
      <span className="text-xs md:text-sm font-bold truncate">
        {t({ section: "quick_actions", key: action.labelKey })}
      </span>
    </Link>
  );
}