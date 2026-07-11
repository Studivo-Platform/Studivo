"use client";

import { Search } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

export function SearchInput({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full">
      <span className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
        <Search className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t({ section: "navbar", key: "search_placeholder" })}
        className="w-full p-3.5 ps-11 text-sm md:text-base rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
      />
    </div>
  );
}