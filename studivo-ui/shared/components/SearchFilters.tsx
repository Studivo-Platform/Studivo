"use client";

import { useTranslation } from "@/shared/hooks/useTranslation";

type CategoryOption = { key: string; translationKey: string };

export function SearchFilters({ active, onChange, categories }: {
  active: string;
  onChange: (cat: string) => void;
  categories: CategoryOption[];
}) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onChange(cat.key)}
          className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-full border transition-all duration-200 whitespace-nowrap active:scale-95 ${
            active === cat.key
              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
              : "bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-zinc-800"
          }`}
        >
          {cat.key === "all"
            ? t({ section: "categories_section", key: "badge" }) === "الأقسام" ? "الكل" : "All"
            : t({ section: "categories_section", key: cat.translationKey })}
        </button>
      ))}
    </div>
  );
}