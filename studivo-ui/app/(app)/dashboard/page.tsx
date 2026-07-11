"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/auth.store";

export default function DashboardRootPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user?.role === "admin") {
      router.replace("/admin");
    } else if (user?.role === "seller") {
      router.replace("/dashboard/seller");
    } else {
      router.replace("/dashboard/student");
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-sm font-semibold text-gray-400 animate-pulse">Redirecting to your Dashboard...</p>
    </div>
  );
}
