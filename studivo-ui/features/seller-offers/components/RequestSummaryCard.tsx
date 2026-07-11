"use client";

import { Tag } from "lucide-react";
import { TargetRequestSummary } from "../types/targetRequest.type";

export function RequestSummaryCard({ request }: { request: TargetRequestSummary }) {
  const title = request.parsedData?.subCategory
    ? `${request.parsedData.subCategory} — ${request.parsedData.category}`
    : request.rawText?.slice(0, 80) || "Request";

  const buyerName = request.userId?.name || "Student";
  const location = request.parsedData?.location || "—";
  const budgetMin = request.parsedData?.budget?.min ?? 0;
  const budgetMax = request.parsedData?.budget?.max ?? 0;
  const currency = request.parsedData?.budget?.currency || "EGP";

  const budgetText =
    budgetMin > 0 && budgetMax > 0
      ? `${budgetMin.toLocaleString()}–${budgetMax.toLocaleString()} ${currency}`
      : budgetMax > 0
        ? `Up to ${budgetMax.toLocaleString()} ${currency}`
        : budgetMin > 0
          ? `From ${budgetMin.toLocaleString()} ${currency}`
          : "—";

  return (
    <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#060913]">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-[#131b2e] shrink-0 border border-slate-200 dark:border-slate-800 shadow-sm">
          <Tag className="w-5 h-5 text-blue-600 dark:text-indigo-400" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{title}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
            بواسطة {buyerName} · {location} · الميزانية: <span className="font-bold text-blue-600 dark:text-indigo-400">{budgetText}</span>
          </p>
        </div>
      </div>
      <span className="text-xs font-bold px-3 py-1 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 rounded-full shrink-0 uppercase">● {request.status}</span>
    </div>
  );
}