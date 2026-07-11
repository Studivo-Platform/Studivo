"use client";

import { useState } from "react";
import { FileText, Trash2, Loader2 } from "lucide-react";
import axiosInstance from "@/shared/APIs/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";

const statusStyles = {
  open: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  matched: "bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/20",
  closed: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20",
};

export function RequestCard({ item, onDelete }: { item: any; onDelete?: () => void }) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const title = item.title || item.rawText || item.parsedData?.title || "Student Request";
  const category = item.category || item.parsedData?.category || "General";
  const minBudget = item.budget?.min ?? item.parsedData?.budget?.min ?? 0;
  const maxBudget = item.budget?.max ?? item.parsedData?.budget?.max ?? 0;
  const currency = item.budget?.currency ?? item.parsedData?.budget?.currency ?? "EGP";
  const location = item.location || item.parsedData?.location || "Online";
  const status = item.status || "open";
  const offersCount = item.offersCount ?? item.offers?.length ?? 0;
  const badgeClass = statusStyles[status as keyof typeof statusStyles] || statusStyles.open;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const reqId = item._id || item.id;
    if (!reqId) return;

    if (!confirm("هل أنت تأكد من رغبتك في حذف هذا الطلب نهائياً؟")) return;

    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/requests/${reqId}`);
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
      await queryClient.invalidateQueries({ queryKey: ["widgets"] });
      if (onDelete) onDelete();
    } catch (err) {
      console.error("Failed to delete request:", err);
      alert("تعذر حذف الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-200 last:border-b-0 gap-3">
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-indigo-950/40 border border-slate-200 dark:border-indigo-500/30 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <h6 className="font-bold text-sm text-slate-900 dark:text-white truncate">{title}</h6>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
            {category} · <span className="text-blue-600 dark:text-cyan-300 font-semibold">{minBudget.toLocaleString()}–{maxBudget.toLocaleString()} {currency}</span> · {location}
          </p>
        </div>
      </div>
      <div className="text-end shrink-0 flex items-center gap-3">
        <div className="flex flex-col items-end gap-1">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
            {status}
          </span>
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{offersCount} offers</p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          title="حذف الطلب"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
        >
          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}