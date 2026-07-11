"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacySellerSearchRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/seller/search");
  }, [router]);
  return null;
}
