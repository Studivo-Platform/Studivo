"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserRole, getMe } from "../API/auth.api";
import { useAuthStore } from "@/shared/store/auth.store";

type TokenPayload = {
  purpose?: string;
  role?: UserRole;
};

const getDashboardPath = (role?: UserRole) => {
  if (role === "seller") return "/dashboard/seller";
  return "/dashboard/student";
};

const decodeTokenPayload = (token: string): TokenPayload | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "="
    );

    return JSON.parse(window.atob(paddedPayload)) as TokenPayload;
  } catch {
    return null;
  }
};

const storeProfileCompletionToken = (token: string) => {
  sessionStorage.setItem("completeProfileToken", token);
};

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const profileCompletionToken = searchParams.get("profileCompletionToken");
    const requiresRole = searchParams.get("requiresRole") === "true";
    const error = searchParams.get("error");

    if (error) {
      router.replace(`/auth/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (requiresRole && profileCompletionToken) {
      storeProfileCompletionToken(profileCompletionToken);
      router.replace("/auth/complete-profile");
      return;
    }

    if (token) {
      const payload = decodeTokenPayload(token);

      if (payload?.purpose === "complete_profile") {
        storeProfileCompletionToken(token);
        router.replace("/auth/complete-profile");
        return;
      }

      localStorage.setItem("accessToken", token);
      document.cookie = `refreshToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure`;

      // Fetch user profile and set Zustand state
      getMe(token)
        .then((res) => {
          if (res.data) {
            useAuthStore.getState().setAuth(res.data as any, token);
            router.replace(getDashboardPath(res.data.role));
          } else {
            router.replace(getDashboardPath(payload?.role));
          }
        })
        .catch(() => {
          router.replace(getDashboardPath(payload?.role));
        });
      return;
    }

    router.replace("/auth/login?error=google_failed");
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-gray-500">
        <svg className="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-sm">Signing you in...</p>
      </div>
    </div>
  );
}
