"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useGetTargetRequest } from "../hooks/useGetTargetRequest";
import { useSubmitOfferForm } from "../hooks/useSubmitOfferForm";
import { RequestSummaryCard } from "../components/RequestSummaryCard";
import { OfferDetailsFields } from "../components/OfferDetailsFields";
import { LocationFields } from "../components/LocationFields";

function SubmitOfferContent() {
  const params = useParams();
  const requestId = params.requestId as string;
  const { data: request, isLoading } = useGetTargetRequest(requestId);
  const { form, isPending, isEditing, errorMessage, updateField, handleSubmit, back } = useSubmitOfferForm(requestId);

  if (isLoading || !request) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sm font-semibold text-slate-400 animate-pulse">جاري تحميل تفاصيل الطلب...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 bg-transparent min-h-screen">
      <button type="button" onClick={back} className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer">
        <ChevronLeft className="w-4 h-4 rtl:rotate-180" /><span>الرجوع</span>
      </button>

      <form onSubmit={handleSubmit} className="p-5 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-6 bg-white dark:bg-[#131b2e]">
        <RequestSummaryCard request={request} />
        <OfferDetailsFields form={form} onChange={updateField} />
        <LocationFields form={form} onChange={updateField} />

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-600 dark:text-rose-400 text-xs md:text-sm font-bold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <button type="button" onClick={back} className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer">إلغاء</button>
          <button type="submit" disabled={isPending} className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-amber-300 text-white dark:text-[#060913] text-xs md:text-sm font-black shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isPending ? "جاري الحفظ..." : isEditing ? "تحديث العرض" : "تقديم العرض"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function SubmitOfferPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs font-semibold text-slate-400">جاري التحميل...</div>}>
      <SubmitOfferContent />
    </Suspense>
  );
}