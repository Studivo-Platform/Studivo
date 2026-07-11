"use client";

import React, { useState } from "react";
import { Shield, Lock, User as UserIcon, LogIn, Loader2, AlertCircle } from "lucide-react";
import { loginUser } from "@/features/auth/API/auth.api";
import { useAuthStore } from "@/shared/store/auth.store";
import { useTranslation } from "@/shared/hooks/useTranslation";

export function AdminLoginForm() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Studivo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser({
        email: username,
        password: password,
      });

      const { accessToken, user } = response.data;

      if (user.role !== "admin") {
        setError("عذراً، هذا الحساب لا يملك صلاحيات مدير المنصة (Admin).");
        setLoading(false);
        return;
      }

      // Update global Zustand store
      useAuthStore.getState().setAuth(user, accessToken);

      // Set cookie for Next.js middleware
      document.cookie = `refreshToken=${accessToken}; path=/; max-age=${30 * 60}; SameSite=Lax; Secure`;

    } catch (err: any) {
      const msg = err.response?.data?.message || "تعذر تسجيل الدخول. يرجى التأكد من اسم المستخدم وكلمة السر.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Top Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-amber-400 border border-amber-400/30 flex items-center justify-center shadow-xl">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t({ section: "admin_portal", key: "login_title" })}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {t({ section: "admin_portal", key: "login_desc" })}
          </p>
        </div>

        {/* Login Card */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-5">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-600 dark:text-rose-400 text-xs font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t({ section: "admin_portal", key: "login_username" })}
            </label>
            <div className="relative">
              <UserIcon className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full ps-10 pe-4 py-3 text-xs md:text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 font-bold transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t({ section: "admin_portal", key: "login_password" })}
            </label>
            <div className="relative">
              <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full ps-10 pe-4 py-3 text-xs md:text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 font-bold transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-[#fff4b7] dark:to-amber-300 text-white dark:text-[#060913] font-black text-xs md:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{t({ section: "admin_portal", key: "login_btn" })}</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-400 font-semibold">
          {t({ section: "admin_portal", key: "login_footer" })}
        </p>
      </div>
    </div>
  );
}
