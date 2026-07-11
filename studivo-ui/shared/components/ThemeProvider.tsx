"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useMounted } from "../hooks/useMounted"; // 💡 استدعينا الهوك المشترك هنا

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  const mounted = useMounted(); // 💡 استخدام الهوك مباشرة

  // لو لسه على السيرفر، مرر الـ children علطول من غير الـ Provider
  if (!mounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}