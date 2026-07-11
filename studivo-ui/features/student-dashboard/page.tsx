"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle, FileText, Tag } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { WidgetCard } from "@/features/student-dashboard/components/WidgetCard";
import { RequestCard } from "@/features/student-dashboard/components/RequestCard";
import { RecentOffersCard } from "@/features/student-dashboard/components/RecentOffersCard";
import { widgetsConfig } from "@/features/student-dashboard/data/widgets.config";
import { useGetWidgets } from "@/features/student-dashboard/hooks/useGetWidgets";
import { useGetRequests } from "@/features/student-dashboard/hooks/useGetRequests";
import { useGetOffers } from "@/features/student-dashboard/hooks/useGetOffers";
import { useAuthStore } from "@/shared/store/auth.store";
import { ViewAllModal } from "@/features/student-dashboard/components/ViewAllModal";

export default function StudentDashboardPage() {
  const { t, lang } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const { data: widgetsData, isLoading: isLoadingWidgets } = useGetWidgets();
  const { data: requests, isLoading: isLoadingRequests } = useGetRequests();
  const { data: offers, isLoading: isLoadingOffers } = useGetOffers();

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    type: "requests" | "offers";
    items: any[];
  }>({
    isOpen: false,
    title: "",
    type: "requests",
    items: [],
  });

  if (isLoadingWidgets || isLoadingRequests || isLoadingOffers) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading Student Dashboard...</p>
        </div>
      </div>
    );
  }

  const userName = user?.name ? user.name : (lang === "ar" ? "المستخدم" : "User");
  const requestList = Array.isArray(requests) ? requests : [];
  const offerList = Array.isArray(offers) ? offers : [];

  const openModal = (type: "requests" | "offers") => {
    if (type === "requests") {
      setModalConfig({
        isOpen: true,
        title: lang === "ar" ? "جميع الطلبات" : "All Requests",
        type: "requests",
        items: requestList,
      });
    } else {
      setModalConfig({
        isOpen: true,
        title: lang === "ar" ? "جميع العروض" : "All Offers",
        type: "offers",
        items: offerList,
      });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 🌟 Minimalist Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {lang === "ar" ? `مرحباً بعودتك، ${userName}! 👋` : `Welcome back, ${userName}! 👋`}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {lang === "ar" ? "إليك نظرة سريعة ومبسطة على طلباتك وعروضك اليوم." : "Here is a quick clean overview of your requests and offers today."}
          </p>
        </div>

        <Link
          href="/requests/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-amber-300 dark:to-amber-400 dark:hover:from-amber-400 dark:hover:to-amber-500 text-white dark:text-[#060913] font-bold text-xs md:text-sm shadow-md transition-all active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{lang === "ar" ? "طلب جديد" : "New Request"}</span>
        </Link>
      </div>

      {/* 📊 Clean 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {widgetsConfig.map((config) => {
          const apiWidget = widgetsData?.find((w) => w.id === config.id);
          return <WidgetCard key={config.id} id={config.id} config={config} value={apiWidget?.value || "0"} change={apiWidget?.change || ""} />;
        })}
      </div>

      {/* 🏛️ Clean Airy 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Requests */}
        <div className="lg:col-span-7 bg-white dark:bg-gradient-to-br dark:from-[#131b2e] dark:to-[#0d1322] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 p-4 bg-slate-50/50 dark:bg-slate-800/20">
            <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>{t({ section: "recent_requests", key: "title" })}</span>
            </h2>
            <button
              onClick={() => openModal("requests")}
              className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline transition-all"
            >
              {t({ section: "recent_requests", key: "view_all" })}
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 flex-1">
            {requestList.length > 0 ? (
              requestList.slice(0, 5).map((item: any, index: number) => (
                <RequestCard key={item._id || item.id || index} item={item} />
              ))
            ) : (
              <div className="p-10 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
                {lang === "ar" ? "لا توجد طلبات حالياً." : "No requests found."}
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Columns: Offers */}
        <div className="lg:col-span-5 bg-white dark:bg-gradient-to-br dark:from-[#131b2e] dark:to-[#0d1322] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 p-4 bg-slate-50/50 dark:bg-slate-800/20">
            <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>{t({ section: "recent_offers", key: "title" })}</span>
            </h2>
            <button
              onClick={() => openModal("offers")}
              className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline transition-all"
            >
              {t({ section: "recent_offers", key: "view_all" })}
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 flex-1">
            {offerList.length > 0 ? (
              offerList.slice(0, 5).map((item: any, index: number) => (
                <RecentOffersCard key={item._id || item.id || index} offer={item} />
              ))
            ) : (
              <div className="p-10 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
                {lang === "ar" ? "لم تتلق أي عروض بعد." : "No offers received yet."}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popup View All Modal */}
      <ViewAllModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        title={modalConfig.title}
        type={modalConfig.type}
        items={modalConfig.items}
      />
    </div>
  );
}