"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Search, ArrowRight, ArrowLeft, ChevronRight, ChevronLeft, FileText, Loader2, Clock } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import axiosInstance from "@/shared/APIs/axiosInstance";

export default function HeroSection() {
  const { t, lang } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [demoRequests, setDemoRequests] = useState<any[]>([]);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const fetchDemoRequests = async (query: string = "") => {
    try {
      setIsLoadingDemo(true);
      const url = query.trim() ? `/search?q=${encodeURIComponent(query)}` : `/search?limit=4`;
      const res = await axiosInstance.get(url);
      const data = res.data?.data || res.data;
      const local = Array.isArray(data?.local) ? data.local : (Array.isArray(data) ? data : []);
      setDemoRequests(local);
    } catch (err) {
      console.error("Failed to fetch demo requests:", err);
    } finally {
      setIsLoadingDemo(false);
    }
  };

  useEffect(() => {
    fetchDemoRequests();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDemoRequests(searchQuery);
  };

  const formatRequestTime = (dateStr: string) => {
    if (!dateStr) return lang === "ar" ? "حديثاً" : "Recently";
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return lang === "ar" ? "منذ لحظات" : "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return lang === "ar" ? `منذ ${diffInMinutes} دقيقة` : `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return lang === "ar" ? `منذ ${diffInHours} ساعة` : `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return lang === "ar" ? `منذ ${diffInDays} يوم` : `${diffInDays}d ago`;

    return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { month: 'short', day: 'numeric' });
  };

  return (
    <section id="hero" className="min-h-[90vh] w-full flex items-center pt-28 pb-16 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 to-cyan-500/20 dark:from-indigo-600/30 dark:to-cyan-600/30 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2.5 bg-blue-50 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 rounded-full px-5 py-2 text-xs md:text-sm text-blue-600 dark:text-[#fff4b7] font-bold shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-[#fff4b7]" />
            <span>{t({ section: "hero_section", key: "badge" })}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            {t({ section: "hero_section", key: "title_line1" })}
            <br />
            {t({ section: "hero_section", key: "title_line2" })}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-[#fff4b7] dark:via-amber-300 dark:to-cyan-400">
              {t({ section: "hero_section", key: "title_gradient" })}
            </span>
          </h1>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-medium">
            {t({ section: "hero_section", key: "description" })}
          </p>

          {/* 🔍 Interactive Live Demo Search Box */}
          <div className="w-full max-w-2xl space-y-3 pt-2">
            <p className="text-xs md:text-sm font-bold text-blue-600 dark:text-[#fff4b7] uppercase tracking-wider">
              {lang === "ar" ? "اكتب وصفاً لما تحتاجه. ودع العروض تأتي إليك." : "Type what you need. Let offers come to you."}
            </p>
            <form onSubmit={handleSearchSubmit} className="gap-3 flex items-center w-full">
              <Search className="absolute start-4 text-slate-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === "ar" ? "ابحث في طلبات الطلاب المتاحة بالداتابيز... (مثال: لابتوب، تصميم، برمجة)" : "Search real live student requests from DB... (e.g. Laptop, Design)"}
                className="w-full ps-12 pe-32 py-4 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2e] text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-indigo-400 shadow-xl transition-all font-medium"
              />
              <button
                type="submit"
                disabled={isLoadingDemo}
                className=" px-4 py-2.5 w-40 text-center rounded-full hover:opacity-30 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-amber-300 text-white dark:text-[#060913] font-bold text-xs md:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isLoadingDemo ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="text-center mx-auto w-full">{lang === "ar" ? "بحث حقيقي" : "Live Search"}</span>}
              </button>
            </form>
          </div>

          {/* 📦 Live DB Search Demo Results Grid */}
          <div className="w-full max-w-3xl pt-2 space-y-3 text-start">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                {searchQuery.trim()
                  ? (lang === "ar" ? `نتائج البحث لـ "${searchQuery}"` : `Search results for "${searchQuery}"`)
                  : (lang === "ar" ? "أحدث 4 طلبات من الطلاب (Live DB Demo)" : "Latest 4 Student Requests (Live DB Demo)")}
              </span>
              <span className="text-xs font-semibold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-indigo-500/30">
                {demoRequests.length} {lang === "ar" ? "طلبات متاحة" : "Open Requests"}
              </span>
            </div>

            {isLoadingDemo ? (
              <div className="p-8 text-center bg-white/50 dark:bg-[#131b2e]/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 dark:text-[#fff4b7]" />
              </div>
            ) : demoRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {demoRequests.slice(0, 4).map((req, idx) => {
                  const reqTitle = req.rawText || req.title || req.parsedData?.title || "طلب طالب";
                  const minB = req.budget?.min ?? req.parsedData?.budget?.min ?? 0;
                  const maxB = req.budget?.max ?? req.parsedData?.budget?.max ?? 0;
                  const curr = req.budget?.currency ?? req.parsedData?.budget?.currency ?? "EGP";
                  const timeFormatted = formatRequestTime(req.createdAt);
                  const userName = req.userId?.name || (lang === "ar" ? "طالب" : "Student");

                  return (
                    <div key={req._id || idx} className="p-4 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#131b2e] dark:to-[#0d1322] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3 hover:border-blue-500 dark:hover:border-indigo-500/60 transition-all group">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-indigo-950/50 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-indigo-500/30 font-bold text-xs">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-[#fff4b7] transition-colors">{reqTitle}</h5>
                            <p className="text-[10px] font-semibold text-slate-400">{userName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 shrink-0 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{timeFormatted}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                        <span className="text-blue-600 dark:text-[#fff4b7] font-bold text-xs">
                          {maxB > 0 ? `${minB > 0 ? `${minB.toLocaleString()}–` : ''}${maxB.toLocaleString()} ${curr}` : (lang === "ar" ? "ميزانية مفتوحة" : "Open Budget")}
                        </span>
                        <Link href="/auth/signup" className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
                          <span>{lang === "ar" ? "قدم عرضك الآن" : "Submit Offer"}</span>
                          <span className="rtl:rotate-180">→</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center bg-white/50 dark:bg-[#131b2e]/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 text-xs font-medium text-slate-400">
                {lang === "ar" ? "لا توجد نتائج مطابقة حالياً. جرب كلمات أخرى!" : "No matching requests found."}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 justify-center pt-4">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2.5 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-amber-300 dark:hover:from-amber-300 dark:hover:to-amber-200 text-white dark:text-[#060913] px-4 py-2 rounded-2xl font-bold group"
            >
              <span>{t({ section: "hero_section", key: "primary_btn" })}</span>
              {lang === "ar" ? (
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2.5 bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 px-7 py-4 rounded-2xl font-bold text-sm md:text-base transition-all active:scale-95"
            >
              <span>{t({ section: "hero_section", key: "secondary_btn" })}</span>
              {lang === "ar" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-200 dark:border-slate-800 w-full max-w-2xl">
            <div className="space-y-1">
              <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-[#fff4b7]">100%</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">موثوق وآمن</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl md:text-3xl font-black text-blue-600 dark:text-cyan-400">24/7</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">دعم واستجابة</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-[#fff4b7]">0%</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">عمولات خفية</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}