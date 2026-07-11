"use client";

import Link from "next/link";
import { useResetPassword } from "../Hooks/useResetPassword";

export default function ResetPasswordForm() {
  const {
    form,
    loading,
    error,
    success,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    passwordsMatch,
    hasToken,
    handleChange,
    handleSubmit,
    t,
  } = useResetPassword();

  return (
    <div className="space-y-7 text-start">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {t({ section: "reset_password_form", key: "title" })}
        </h1>
        <p className="mt-1.5 text-sm text-gray-400">
          {t({ section: "reset_password_form", key: "subtitle" })}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            {t({ section: "reset_password_form", key: "password_label" })}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 rtl:left-auto rtl:right-3.5">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              onChange={handleChange}
              placeholder={t({ section: "reset_password_form", key: "password_placeholder" })}
              className="w-full rounded-xl border border-gray-200 bg-transparent py-3 pl-10 pr-11 text-sm text-gray-900 placeholder-gray-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:text-white rtl:pl-11 rtl:pr-10"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-gray-600 rtl:right-auto rtl:left-3.5"
              role="button"
              aria-label={
                showPassword
                  ? t({ section: "reset_password_form", key: "aria_hide_password" })
                  : t({ section: "reset_password_form", key: "aria_show_password" })
              }
            >
              {showPassword ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            {t({ section: "reset_password_form", key: "confirm_password_label" })}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 rtl:left-auto rtl:right-3.5">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              required
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder={t({ section: "reset_password_form", key: "confirm_password_placeholder" })}
              className={`w-full rounded-xl border bg-transparent py-3 pl-10 pr-11 text-sm text-gray-900 placeholder-gray-400 transition focus:border-transparent focus:outline-none focus:ring-2 dark:text-white rtl:pl-11 rtl:pr-10 ${
                !passwordsMatch
                  ? "border-red-300 bg-red-50 focus:ring-red-400"
                  : "border-gray-200 focus:ring-indigo-500 dark:border-zinc-800"
              }`}
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-gray-600 rtl:right-auto rtl:left-3.5"
              role="button"
              aria-label={
                showConfirm
                  ? t({ section: "reset_password_form", key: "aria_hide_password" })
                  : t({ section: "reset_password_form", key: "aria_show_password" })
              }
            >
              {showConfirm ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </span>
          </div>
          {!passwordsMatch && (
            <p className="mt-1 text-xs text-red-500">
              {t({ section: "reset_password_form", key: "password_mismatch" })}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !passwordsMatch || !hasToken || !!success}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)" }}
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t({ section: "reset_password_form", key: "submitting_btn" })}
            </>
          ) : (
            t({ section: "reset_password_form", key: "submit_btn" })
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        <Link href="/auth/login" className="font-bold text-indigo-600 hover:underline">
          {t({ section: "reset_password_form", key: "back_to_login" })}
        </Link>
      </p>
    </div>
  );
}
