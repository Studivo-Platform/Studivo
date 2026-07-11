"use client";

import { useState, useEffect } from "react";
import Header from "@/shared/components/header";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Search, FileText, Tag, Store, Clock, UserCheck, Phone, Mail, GraduationCap, Loader2 } from "lucide-react";
import axiosInstance from "@/shared/APIs/axiosInstance";
import Link from "next/link";

export default function StudentSearchPage() {
  const { t, lang } = useTranslation();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"requests" | "offers" | "sellers">("requests");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ requests: any[]; offers: any[]; sellers: any[] }>({
    requests: [],
    offers: [],
    sellers: [],
  });

  const fetchSearchResults = async (searchQ: string = "") => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(`/search?q=${encodeURIComponent(searchQ)}`);
      const data = res.data?.data || res.data;
      setResults({
        requests: Array.isArray(data?.requests) ? data.requests : (Array.isArray(data?.local) ? data.local : []),
        offers: Array.isArray(data?.offers) ? data.offers : [],
        sellers: Array.isArray(data?.sellers) ? data.sellers : [],
      });
    } catch (err) {
      console.error("Failed to fetch search results:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSearchResults(query);
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return lang === "ar" ? "مؤخراً" : "Recently";
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <Header
        title={lang === "ar" ? "محرك البحث الشامل" : "Unified Search Engine"}
        description={lang === "ar" ? "ابحث في داتابيز الطلبات، العروض المتاحة، ودليل البائعين المعتمدين" : "Search student requests, seller offers, and verified sellers database"}
      />

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative flex gap-3 items-center w-full">
        <Search className="absolute start-4 text-slate-400 w-5 h-5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lang === "ar" ? "ابحث عن أي طلب، عرض، أو بائع... (مثال: لابتوب، تصميم، أحمد)" : "Search requests, offers, or sellers... (e.g. Laptop, Design)"}
          className="w-full ps-12 pe-32 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2e] text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-indigo-400 shadow-sm transition-all font-medium"
        />
        <button
          type="submit"
          disabled={isLoading}
          className=" end-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-amber-300 text-white dark:text-[#060913] font-bold text-xs md:text-sm shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{lang === "ar" ? "بحث" : "Search"}</span>}
        </button>
      </form>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: "requests", label: lang === "ar" ? "الطلبات" : "Requests", count: results.requests.length, icon: FileText },
          { id: "offers", label: lang === "ar" ? "العروض المتاحة" : "Offers", count: results.offers.length, icon: Tag },
          { id: "sellers", label: lang === "ar" ? "البائعين" : "Sellers", count: results.sellers.length, icon: Store },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 dark:bg-[#fff4b7] text-white dark:text-[#060913] shadow-sm"
                  : "bg-white dark:bg-[#131b2e] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] ${isActive ? "bg-white/20 dark:bg-black/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Panels */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center bg-white dark:bg-[#131b2e] rounded-2xl border border-slate-200 dark:border-slate-800">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 dark:text-[#fff4b7] mb-2" />
            <p className="text-xs font-bold text-slate-400">{lang === "ar" ? "جاري جلب البيانات الفعلية من الداتابيز..." : "Fetching real database records..."}</p>
          </div>
        ) : activeTab === "requests" ? (
          /* 1. Requests Panel */
          results.requests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.requests.map((req, idx) => {
                const reqTitle = req.title || req.rawText || req.parsedData?.title || "طلب طالب";
                const minB = req.budget?.min ?? req.parsedData?.budget?.min ?? 0;
                const maxB = req.budget?.max ?? req.parsedData?.budget?.max ?? 0;
                const curr = req.budget?.currency ?? req.parsedData?.budget?.currency ?? "EGP";
                const studentName = req.userId?.name || (lang === "ar" ? "طالب" : "Student");
                const univ = req.userId?.university;

                return (
                  <div key={req._id || idx} className="p-5 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#131b2e] dark:to-[#0d1322] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-blue-500 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-indigo-950/50 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-indigo-500/30">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{reqTitle}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{studentName} {univ ? `• ${univ}` : ''}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40 shrink-0">
                        {req.status || "open"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <span className="text-blue-600 dark:text-[#fff4b7] font-extrabold text-sm">
                        {maxB > 0 ? `${minB > 0 ? `${minB.toLocaleString()}–` : ''}${maxB.toLocaleString()} ${curr}` : (lang === "ar" ? "ميزانية مفتوحة" : "Open Budget")}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTime(req.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-[#131b2e] rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400">
              {lang === "ar" ? "لا توجد طلبات طلاب تطابق البحث حالياً." : "No matching student requests found."}
            </div>
          )
        ) : activeTab === "offers" ? (
          /* 2. Offers Panel */
          results.offers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.offers.map((off, idx) => {
                const sellerName = off.sellerId?.name || (lang === "ar" ? "بائع معتمد" : "Verified Seller");
                const price = off.price ?? 0;
                const reqTitle = off.requestId?.parsedData?.title || off.requestId?.rawText || (lang === "ar" ? "طلب مرتبط" : "Related Request");

                return (
                  <div key={off._id || idx} className="p-5 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#131b2e] dark:to-[#0d1322] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-indigo-500 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={off.sellerId?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=6366f1&color=fff`}
                          alt={sellerName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{sellerName}</h4>
                          <p className="text-xs text-blue-600 dark:text-cyan-400 font-semibold truncate">على: {reqTitle}</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-blue-600 dark:text-[#fff4b7] bg-blue-50 dark:bg-indigo-950/60 px-3 py-1 rounded-xl shrink-0">
                        {price.toLocaleString()} EGP
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
                      {off.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <span>{lang === "ar" ? "الحالة: " : "Status: "}<strong className="text-amber-500">{off.status}</strong></span>
                      <span>{formatTime(off.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-[#131b2e] rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400">
              {lang === "ar" ? "لا توجد عروض بائعين تطابق البحث حالياً." : "No matching seller offers found."}
            </div>
          )
        ) : (
          /* 3. Sellers Directory Panel */
          results.sellers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {results.sellers.map((sel, idx) => {
                return (
                  <div key={sel._id || idx} className="p-5 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#131b2e] dark:to-[#0d1322] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-3 hover:border-blue-500 transition-all">
                    <img
                      src={sel.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(sel.name)}&background=3b82f6&color=fff`}
                      alt={sel.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center justify-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{sel.name}</h4>
                        <UserCheck className="w-4 h-4 text-blue-500 shrink-0" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 flex items-center justify-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>{sel.university || (lang === "ar" ? "جامعة مصرية" : "Egyptian University")}</span>
                      </p>
                    </div>

                    <div className="w-full pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-around text-xs text-slate-500 font-semibold">
                      {sel.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-500" />
                          <span>{sel.phone}</span>
                        </span>
                      )}
                      <span className="text-blue-600 dark:text-cyan-400 font-bold">بائع معتمد</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-[#131b2e] rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400">
              {lang === "ar" ? "لا يوجد بائعون يطابقون البحث حالياً." : "No matching sellers found."}
            </div>
          )
        )}
      </div>
    </div>
  );
}