"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyRequestsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/student/requests");
  }, [router]);
  return null;
}
