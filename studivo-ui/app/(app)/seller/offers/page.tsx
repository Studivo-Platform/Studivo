"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacySellerOffersRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/seller/offers");
  }, [router]);
  return null;
}