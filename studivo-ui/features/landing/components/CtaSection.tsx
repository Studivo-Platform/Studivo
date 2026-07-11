"use client";

import React from "react";
import Link from "next/link";
// 💡 استيراد الـ Hook الخاص بك
import { useTranslation } from "@/shared/hooks/useTranslation";

export default function CtaSection() {
  // استدعاء دالة الترجمة
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-indigo-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* العنوان الرئيسي */}
        <h2 className="text-4xl font-extrabold text-white mb-4">
          {t({ section: "cta_section", key: "title" })}
        </h2>
        
        {/* الوصف المترجم */}
        <p className="text-indigo-200 text-lg mb-10 max-w-xl mx-auto">
          {t({ section: "cta_section", key: "description" })}
        </p>
        
        {/* أزرار التنقل */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/auth/signup"
            className="bg-white text-indigo-700 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg"
          >
            {t({ section: "cta_section", key: "primary_btn" })}
          </Link>
          <Link
            href="/auth/login"
            className="border border-indigo-400 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-500 transition-colors"
          >
            {t({ section: "cta_section", key: "secondary_btn" })}
          </Link>
        </div>
      </div>
    </section>
  );
}