// shared/components/ThemeToggle.tsx
"use client"; // بنعرف نكست إن الملف ده جافا سكريبت تفاعلي هيشتغل جوه المتصفح مش السيرفر

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; // بنستدعي أيقونات الشمس والقمر من مكتبة lucide

export function ThemeToggle({className}: {className?: string}) {
  // useTheme هو الهوك الجاهز من المكتبة اللي بيعرفنا الثيم الحالي وبيخلينا نغيره بـ setTheme
  const { theme, setTheme } = useTheme();
  
  // الـ state دي معمولة لسر ذكي جداً في الـ Next.js عشان نتاكد إننا جوه المتصفح
  const [mounted, setMounted] = useState(false);

  // useEffect دي مش هتشتغل غير لما الصفحة تفتح بالكامل في متصفح العميل (Client)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🛠️ حل المشكلة (ما وراء الوراء): بدل ما نرجع مربع فاضي ملوش ملامح بيسبب هزة في الصفحة (Layout Shift) وزق لزرار اللغة
  // بنرجع شكل كرتوني (Skeleton) واخد نفس مساحة وطول وعرض وحدود الزرار الحقيقي بالظبط (38px) عشان يحجز مكانه بأدب من أول فمتو ثانية
  if (!mounted) {
    return (
      <div className="w-[38px] h-[38px] rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent" />
    );
  }

  return (
    <button
      // عند الضغط: لو الثيم الحالي dark اقلبه لـ light، والعكس صحيح
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
      aria-label="Toggle Theme"
    >
      {/* لو الثيم دارك اعرض أيقونة الشمس الصفراء، لو لايت اعرض أيقونة القمر */}
      {theme === "dark" ? (
        <Sun className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-yellow-500" />
      ) : (
        <Moon className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-slate-700" />
      )}
    </button>
  );
}