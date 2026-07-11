import { Suspense } from "react";
import AuthLayout from "@/features/auth/components/authlayout";
import VerifyEmailStatus from "@/features/auth/components/VerifyEmailStatus";

export const metadata = { title: "Verify email - Studivo" };

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <Suspense
        fallback={
          <div className="space-y-7 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
              <svg className="h-7 w-7 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Checking your link</h1>
              <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">Verifying your email...</p>
            </div>
          </div>
        }
      >
        <VerifyEmailStatus />
      </Suspense>
    </AuthLayout>
  );
}
