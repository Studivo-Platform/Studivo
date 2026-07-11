
"use client";

import { useState, useEffect } from "react";
import { translations, defaultLang, Language } from "../lib/translations";

export function useTranslation() {
  const [lang, setLang] = useState<Language>(defaultLang);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language;
    const effectiveLang = savedLang || defaultLang;
    setLang(effectiveLang);
    document.documentElement.lang = effectiveLang;
    document.documentElement.dir = effectiveLang === "ar" ? "rtl" : "ltr";
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
    if (typeof window !== "undefined") {
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
      window.location.reload();
    }
  };

  const t = ({ section, key }: { section: keyof typeof translations[Language]; key: string }) => {
    try {
      const keys = key.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let value: any = (translations[lang] as any)?.[section];
      
      for (const k of keys) {
        value = value?.[k];
      }

      return value || key;
    } catch {
      return key;
    }
  };

  return { t, lang, changeLanguage };
}