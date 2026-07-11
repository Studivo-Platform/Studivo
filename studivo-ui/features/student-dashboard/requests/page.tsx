"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Funnel, MapPin, ChevronDown, FileText } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useGetRequests } from "@/features/student-dashboard/hooks/useGetRequests";
import { RequestCard } from "@/features/student-dashboard/components/RequestCard";

const statusStyles: Record<string, string> = {
  open: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40",
  matched: "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300 border border-violet-200 dark:border-violet-800/40",
  closed: "bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700",
};

const statusOptions = ["all", "open", "matched", "closed"] as const;

export default function StudentRequestsPage() {
  const { t, lang } = useTranslation();
  const { data: requestsData, isLoading } = useGetRequests();
  const [selectedStatus, setSelectedStatus] = useState<typeof statusOptions[number]>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const requestsList = Array.isArray(requestsData) ? requestsData : [];

  const filteredRequests = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    return requestsList.filter((r: any) => {
      const status = r.status || "open";
      const title = r.title || r.rawText || r.parsedData?.title || "";
      const category = r.category || r.parsedData?.category || "";
      const location = r.location || r.parsedData?.location || "";

      const matchesStatus = selectedStatus === "all" || status === selectedStatus;
      const matchesSearch = !normalized || [title, category, location].some((f) => f.toLowerCase().includes(normalized));
      return matchesStatus && matchesSearch;
    });
  }, [requestsList, selectedStatus, searchTerm]);

  return (
    <main className="bg-transparent px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t({ section: "requests", key: "title" })}
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t({ section: "requests", key: "title_description" })}
          </p>
        </div>
        <Link href="/dashboard/student/requests/new" className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition shadow-sm">
          <Plus className="h-4 w-4" />
          {t({ section: "requests", key: "button_new_request" })}
        </Link>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-zinc-950">
        <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t({ section: "requests", key: "search_bar" })}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-800 dark:bg-zinc-900 dark:text-white"
            />
          </div>
          <div className="relative">
            <button onClick={() => setIsFilterOpen((p) => !p)} className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-zinc-900 dark:text-gray-300">
              <Funnel className="h-4 w-4" />
              {t({ section: "requests", key: `filter_${selectedStatus}` })}
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 z-20 mt-2 min-w-[10rem] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-zinc-900">
                {statusOptions.map((status) => (
                  <button key={status} onClick={() => { setSelectedStatus(status); setIsFilterOpen(false); }}
                    className={`w-full px-4 py-3 text-left text-sm transition ${selectedStatus === status ? "bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-white" : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-zinc-800/60"}`}>
                    {t({ section: "requests", key: `filter_${status}` })}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
          {isLoading ? (
            <div className="p-12 text-center">
              <p className="text-sm font-semibold text-gray-400 animate-pulse">جاري تحميل طلباتك من قاعدة البيانات...</p>
            </div>
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((request: any, index: number) => (
              <RequestCard key={request._id || request.id || index} item={request} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
              <FileText className="w-12 h-12 text-gray-300 dark:text-zinc-800" />
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400">لا توجد طلبات سابقة خاصة بك في الوقت الحالي.</p>
              <Link href="/dashboard/student/requests/new" className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition">
                <Plus className="h-4 w-4" />
                انشر أول طلب لك الآن
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}