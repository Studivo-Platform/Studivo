"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { verifyEmailToken } from "../API/auth.api";

type VerifyState = "loading" | "success" | "error";

type VerificationResult = {
  status: VerifyState;
  message: string;
};

const verificationRequests = new Map<string, Promise<VerificationResult>>();
const successfulVerifications = new Map<string, VerificationResult>();

const getVerificationResult = (token: string): Promise<VerificationResult> => {
  const cachedResult = successfulVerifications.get(token);
  if (cachedResult) {
    return Promise.resolve(cachedResult);
  }

  const inFlightRequest = verificationRequests.get(token);
  if (inFlightRequest) {
    return inFlightRequest;
  }

  const request = verifyEmailToken(token)
    .then((data) => {
      const result: VerificationResult = {
        status: "success",
        message: data.message || "Your email has been verified successfully.",
      };

      successfulVerifications.set(token, result);
      return result;
    })
    .catch((err) => {
      const axiosErr = err as AxiosError<{ message?: string }>;

      return {
        status: "error",
        message:
          axiosErr.response?.data?.message ||
          "We could not verify this email link. It may be expired or already used.",
      } satisfies VerificationResult;
    })
    .finally(() => {
      verificationRequests.delete(token);
    });

  verificationRequests.set(token, request);
  return request;
};

export default function VerifyEmailStatus() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<VerifyState>("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    let isMounted = true;

    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing. Please open the latest link from your email.");
        return;
      }

      try {
        const result = await getVerificationResult(token);

        if (!isMounted) return;

        setStatus(result.status);
        setMessage(result.message);
      } catch {
        if (isMounted) {
          setStatus("error");
          setMessage("We could not verify this email link. It may be expired or already used.");
        }
      }
    };

    verifyEmail();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const isSuccess = status === "success";
  const isLoading = status === "loading";

  return (
    <div className="space-y-7 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
        {isLoading ? (
          <svg className="h-7 w-7 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : isSuccess ? (
          <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {isLoading ? "Checking your link" : isSuccess ? "Email verified" : "Verification failed"}
        </h1>
        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">{message}</p>
      </div>

      <div className="space-y-3">
        <Link
          href={isSuccess ? "/auth/login?verified=true" : "/auth/signup"}
          className="flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-sm font-bold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)" }}
        >
          {isSuccess ? "Continue to sign in" : "Create a new account"}
        </Link>

        {!isLoading && (
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-900"
          >
            Back to home
          </Link>
        )}
      </div>
    </div>
  );
}
