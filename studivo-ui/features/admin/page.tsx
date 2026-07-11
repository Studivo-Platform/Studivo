"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, Users, FileText, Tag, BarChart3, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/shared/store/auth.store";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { getAdminStatsApi } from "./APIs/getAdminStats.api";
import { AdminStatsOverview } from "./components/AdminStatsOverview";
import { AdminUsersTable } from "./components/AdminUsersTable";
import { AdminRequestsTable } from "./components/AdminRequestsTable";
import { AdminOffersTable } from "./components/AdminOffersTable";
import Link from "next/link";

import { AdminLoginForm } from "./components/AdminLoginForm";

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<"stats" | "users" | "requests" | "offers">("stats");
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setStatsLoading(true);
      try {
        const data = await getAdminStatsApi();
        setStats(data);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setStatsLoading(false);
      }
    }
    if (user?.role === "admin") {
      loadStats();
    }
  }, [user]);

  // Render Admin Login Gateway if not authenticated as admin
  if (!user || user.role !== "admin") {
    return <AdminLoginForm />;
  }

  const tabs = [
    { id: "stats", label: t({ section: "admin_portal", key: "tab_stats" }), icon: BarChart3 },
    { id: "users", label: t({ section: "admin_portal", key: "tab_users" }), icon: Users },
    { id: "requests", label: t({ section: "admin_portal", key: "tab_requests" }), icon: FileText },
    { id: "offers", label: t({ section: "admin_portal", key: "tab_offers" }), icon: Tag },
  ] as const;

  return (
    <div className="p-3 sm:p-4 md:p-8 max-w-7xl mx-auto space-y-5 md:space-y-8 bg-transparent min-h-screen">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 relative overflow-hidden">
        <div className="absolute -end-10 -bottom-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 md:space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] md:text-xs font-extrabold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t({ section: "admin_portal", key: "sub_title" })}</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tight text-white">
            {t({ section: "admin_portal", key: "title" })}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
            {t({ section: "admin_portal", key: "desc" })}
          </p>
        </div>

        <div className="z-10 shrink-0">
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all border border-white/10">
            <span>{t({ section: "admin_portal", key: "personal_dashboard" })}</span>
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>

      {/* Tabs Navigation — Horizontal Scrollable */}
      <div className="flex items-center gap-2 p-1.5 md:p-2 rounded-2xl md:rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-x-auto">
        {tabs.map((tab) => {
          const LucideIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-amber-300 text-white dark:text-[#060913] shadow-md scale-100"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <LucideIcon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Rendering */}
      <div className="space-y-6">
        {activeTab === "stats" && <AdminStatsOverview stats={stats} isLoading={statsLoading} />}
        {activeTab === "users" && <AdminUsersTable />}
        {activeTab === "requests" && <AdminRequestsTable />}
        {activeTab === "offers" && <AdminOffersTable />}
      </div>
    </div>
  );
}
