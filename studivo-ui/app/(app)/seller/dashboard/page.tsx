"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacySellerDashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/seller");
  }, [router]);
  return null;
}