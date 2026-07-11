"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Briefcase, Compass } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { SellerStatCard } from "./components/SellerStatCard";
import { SellerRequestCard } from "./components/SellerRequestCard";
import { useGetSellerStats } from "./hooks/useGetSellerStats";
import { useGetSellerRequests } from "./hooks/useGetSellerRequests";
import { useAuthStore } from "@/shared/store/auth.store";

export default function SellerDashboardPage() {
  const { t, lang } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const { data: stats, isLoading: isLoadingStats } = useGetSellerStats();
  const { data: requests, isLoading: isLoadingRequests } = useGetSellerRequests();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  if (isLoadingStats || isLoadingRequests) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading Seller Marketplace...</p>
        </div>
      </div>
    );
  }

  const userName = user?.name ? user.name : (lang === "ar" ? "البائع" : "Seller");
  const requestList = Array.isArray(requests) ? requests : [];

  const categories = Array.from(
    new Set(requestList.map((r: any) => r.parsedData?.category || r.category || "other").filter(Boolean))
  );

  const filteredRequests = requestList.filter((item: any) => {
    const textMatch = (item.rawText || item.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const cat = item.parsedData?.category || item.category || "other";
    const categoryMatch = selectedCategory === "all" || cat === selectedCategory;
    return textMatch && categoryMatch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 🌟 Ultra-Clean Minimalist Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {lang === "ar" ? `سوق الفرص والطلبات، ${userName}! 💼` : `Seller Opportunities Hub, ${userName}! 💼`}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {lang === "ar" ? "استعرض طلبات الطلاب المتاحة وقدم أفضل عروضك مباشرة." : "Explore available student requests and submit your best proposals."}
          </p>
        </div>

        <Link
          href="/dashboard/seller/offers"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-gradient-to-r dark:from-amber-300 dark:to-amber-400 dark:hover:from-amber-400 dark:hover:to-amber-500 text-white dark:text-[#060913] font-bold text-xs md:text-sm shadow-md transition-all active:scale-95 shrink-0"
        >
          <Briefcase className="w-4 h-4" />
          <span>{lang === "ar" ? "عروضي المقدمة" : "My Submitted Offers"}</span>
        </Link>
      </div>

      {/* 📊 Clean 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.isArray(stats) ? stats.map((stat: any) => <SellerStatCard key={stat.id} stat={stat} />) : null}
      </div>

      {/* 🔍 Marketplace Toolbar & Request Stream */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-[#131b2e] dark:to-[#0d1322] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
              {t({ section: "seller_dashboard_sections", key: "matching_requests_title" })}
            </h2>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "ar" ? "ابحث في الطلبات..." : "Search requests..."}
                className="w-full rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 py-2 pl-10 pr-4 text-xs md:text-sm text-slate-900 dark:text-white outline-none transition focus:border-blue-500 dark:focus:border-indigo-400 font-medium"
              />
            </div>

            {categories.length > 0 && (
              <div className="relative w-full sm:w-44">
                <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 py-2 pl-10 pr-4 text-xs md:text-sm text-slate-900 dark:text-white outline-none capitalize transition focus:border-blue-500 dark:focus:border-indigo-400 font-medium"
                >
                  <option value="all">{lang === "ar" ? "جميع الأقسام" : "All Categories"}</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Request Grid */}
        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRequests.map((item: any, index: number) => (
              <SellerRequestCard key={item._id || index} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs md:text-sm font-medium border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            {lang === "ar" ? "لا توجد طلبات مطابقة حالياً" : "No matching requests found"}
          </div>
        )}
      </div>
    </div>
  );
}