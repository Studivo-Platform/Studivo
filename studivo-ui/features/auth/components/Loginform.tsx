"use client";

import Link from "next/link";
import { useLogin } from "../Hooks/useLogin";

export default function LoginForm() {
  const {
    form,
    loading,
    error,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    handleChange,
    handleGoogleLogin,
    handleSubmit,
    t,
  } = useLogin();

  return (
    <div className="space-y-7 text-start">

      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-[#fff4b7] tracking-tight">
          {t({ section: "login_form", key: "title" })}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-xs md:text-sm font-medium">
          {t({ section: "login_form", key: "subtitle" })}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl px-4 py-3 text-xs md:text-sm text-rose-600 dark:text-rose-400 font-bold">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs md:text-sm font-bold text-slate-900 dark:text-white">
            {t({ section: "login_form", key: "email_label" })}
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rtl:left-auto rtl:right-3.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder={t({ section: "login_form", key: "email_placeholder" })}
              className="w-full pl-10 pr-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-[#fff4b7] transition-all py-3 rtl:pl-4 rtl:pr-10 font-medium"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-xs md:text-sm font-bold text-slate-900 dark:text-white">
              {t({ section: "login_form", key: "password_label" })}
            </label>
            <Link href="/auth/forgot-password" className="text-xs md:text-sm text-blue-600 dark:text-[#fff4b7] hover:underline font-bold">
              {t({ section: "login_form", key: "forgot_password" })}
            </Link>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rtl:left-auto rtl:right-3.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder={t({ section: "login_form", key: "password_placeholder" })}
              className="w-full pl-10 pr-11 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-[#fff4b7] transition-all py-3 rtl:pl-11 rtl:pr-10 font-medium"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer rtl:right-auto rtl:left-3.5"
              role="button"
              aria-label={showPassword ? t({ section: "login_form", key: "aria_hide_password" }) : t({ section: "login_form", key: "aria_show_password" })}
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </span>
          </div>
        </div>

        {/* Remember me */}
        <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 accent-blue-600 dark:accent-[#fff4b7] cursor-pointer rounded"
          />
          <span className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
            {t({ section: "login_form", key: "remember_me" })}
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl font-black text-xs md:text-sm text-white dark:text-[#060913] bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-amber-300 shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t({ section: "login_form", key: "signing_in" })}
            </>
          ) : (
            t({ section: "login_form", key: "sign_in" })
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs text-slate-400 font-bold whitespace-nowrap">
            {t({ section: "login_form", key: "or_continue" })}
          </span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        </div>

      </form>

      {/* Google + Apple */}
      <div className="grid grid-cols-2 gap-3">

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2.5 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 text-xs md:text-sm font-bold text-slate-700 dark:text-white bg-slate-50 dark:bg-[#060913] hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all active:scale-95"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t({ section: "login_form", key: "google" })}
        </button>

        {/* Apple */}
        <button
          type="button"
          disabled
          title="Coming soon"
          className="flex items-center justify-center gap-2.5 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl py-3 text-xs md:text-sm font-bold text-slate-400 transition-all cursor-not-allowed opacity-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          {t({ section: "login_form", key: "apple" })}
        </button>

      </div>

      <p className="text-center text-xs md:text-sm font-semibold text-slate-500">
        {t({ section: "login_form", key: "no_account" })}
        <Link href="/auth/signup" className="text-blue-600 dark:text-[#fff4b7] font-black hover:underline mx-1">
          {t({ section: "login_form", key: "sign_up" })}
        </Link>
      </p>

    </div>
  );
}