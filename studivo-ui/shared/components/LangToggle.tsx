// shared/components/LangToggle.tsx
"use client";

import { useTranslation } from "@/shared/hooks/useTranslation";

export function LangToggle({className}: {className?: string}) {
  const { lang, changeLanguage } = useTranslation();

  return (
    <button
      onClick={() => changeLanguage(lang === "ar" ? "en" : "ar")}
      className="px-2 py-1 text-[10px] md:text-[12px] md:px-3 md:py-2  font-medium rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
    >
      {lang === "ar" ? "English" : "العربية"}
    </button>
  );
}