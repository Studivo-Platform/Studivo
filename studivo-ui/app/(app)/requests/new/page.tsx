"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyNewRequestRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/student/requests/new");
  }, [router]);
  return null;
}
