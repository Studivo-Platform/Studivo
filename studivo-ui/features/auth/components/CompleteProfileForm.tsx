"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { completeProfile, UserRole } from "../API/auth.api";
import { useAuthStore } from "@/shared/store/auth.store";

const roles: Array<{
  value: UserRole;
  title: string;
  description: string;
}> = [
  {
    value: "student",
    title: "Student",
    description: "Find offers, request services, and manage your student needs.",
  },
  {
    value: "seller",
    title: "Seller",
    description: "Receive requests, submit offers, and manage your selling workflow.",
  },
];

const getDashboardPath = (role: UserRole) => {
  if (role === "seller") return "/dashboard/seller";
  return "/dashboard/student";
};

export default function CompleteProfileForm() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [profileToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("completeProfileToken");
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileToken) {
      router.replace("/auth/login?error=complete_profile_required");
    }
  }, [profileToken, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileToken) return;

    setLoading(true);
    setError(null);

    try {
      const res: any = await completeProfile(profileToken, selectedRole);
      const authData = res.data || res;
      const authToken = authData.accessToken || authData.token;
      const user = authData.user;
      const role = user?.role || selectedRole;

      if (authToken) {
        if (user) {
          useAuthStore.getState().setAuth(user, authToken);
        }
        localStorage.setItem("accessToken", authToken);
        document.cookie = `refreshToken=${authToken}; path=/; max-age=${30 * 60}; SameSite=Lax; Secure`;
      }

      sessionStorage.removeItem("completeProfileToken");
      router.replace(getDashboardPath(role));
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(
        axiosErr.response?.data?.message ||
          "We could not complete your profile. Please try signing in again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-7 text-start">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Complete your profile</h1>
        <p className="mt-1.5 text-sm text-gray-400">Choose how you want to use Studivo.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-3">
          {roles.map((role) => {
            const isSelected = selectedRole === role.value;

            return (
              <button
                key={role.value}
                type="button"
                onClick={() => setSelectedRole(role.value)}
                className={`rounded-xl border px-4 py-4 text-start transition-colors ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50 text-indigo-950 dark:bg-indigo-950/30 dark:text-indigo-100"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-900"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span>
                    <span className="block text-sm font-bold">{role.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">
                      {role.description}
                    </span>
                  </span>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      isSelected ? "border-indigo-600 bg-indigo-600" : "border-gray-300 dark:border-zinc-700"
                    }`}
                  >
                    {isSelected && (
                      <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={loading || !profileToken}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)" }}
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Completing...
            </>
          ) : (
            "Continue"
          )}
        </button>
      </form>
    </div>
  );
}
