"use client";

import Link from "next/link";
import { useForgotPassword } from "../Hooks/useForgotPassword";

export default function ForgotPasswordForm() {
  const { email, setEmail, loading, error, success, handleSubmit, t } =
    useForgotPassword();

  return (
    <div className="space-y-7 text-start">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {t({ section: "forgot_password_form", key: "title" })}
        </h1>
        <p className="mt-1.5 text-sm text-gray-400">
          {t({ section: "forgot_password_form", key: "subtitle" })}
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
          <label htmlFor="email" className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            {t({ section: "forgot_password_form", key: "email_label" })}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 rtl:left-auto rtl:right-3.5">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t({ section: "forgot_password_form", key: "email_placeholder" })}
              className="w-full rounded-xl border border-gray-200 bg-transparent py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:text-white rtl:pl-4 rtl:pr-10"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)" }}
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t({ section: "forgot_password_form", key: "submitting_btn" })}
            </>
          ) : (
            t({ section: "forgot_password_form", key: "submit_btn" })
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        <Link href="/auth/login" className="font-bold text-indigo-600 hover:underline">
          {t({ section: "forgot_password_form", key: "back_to_login" })}
        </Link>
      </p>
    </div>
  );
}
