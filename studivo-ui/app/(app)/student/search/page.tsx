"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyStudentSearchRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/student/search");
  }, [router]);
  return null;
}