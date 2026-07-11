import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Clock, Tag, TrendingUp, Trash2, Edit3, Loader2, Eye } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/shared/APIs/axiosInstance";
import { OfferDetailsModal } from "@/shared/components/OfferDetailsModal";
import { SellerOfferItem } from "../types/submittedOffers.type";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  accepted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  rejected: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  withdrawn: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export function SubmittedOfferCard({ item }: { item: SellerOfferItem }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const offerId = item._id || (item as any).id;
  const reqData = typeof item.requestId === "object" ? item.requestId : null;
  const requestIdStr = reqData?._id || (reqData as any)?.id || (typeof item.requestId === "string" ? item.requestId : "");
  const requestTitle = reqData?.rawText?.slice(0, 60) || "Request";
  const requestCategory = reqData?.parsedData?.category || "—";
  const hasImage = item.images && item.images.length > 0 && item.images[0].url;
  const posted = item.createdAt ? timeAgo(item.createdAt) : "—";

  const handleWithdraw = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!offerId) return;
    if (!confirm("هل أنت تأكد من سحب هذا العرض؟")) return;
    setIsWithdrawing(true);
    try {
      await axiosInstance.delete(`/offers/${offerId}`);
      queryClient.invalidateQueries({ queryKey: ["seller_submitted_offers"] });
      queryClient.invalidateQueries({ queryKey: ["seller_offers_stats"] });
    } catch (err) {
      alert("تعذر سحب العرض، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (requestIdStr) {
      router.push(`/dashboard/seller/offers/${requestIdStr}/submit?offerId=${offerId}`);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsDetailsOpen(true)}
        className="bg-white dark:bg-[#131b2e] p-4 md:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-slate-50 dark:bg-[#060913] border border-slate-200/80 dark:border-slate-800 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
            {hasImage ? (
              <img src={item.images![0].url} alt="Offer" className="w-full h-full object-cover" />
            ) : (
              <Package className="w-6 h-6 text-slate-400 dark:text-slate-600" />
            )}
          </div>
          <div className="min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-[#fff4b7] transition-colors">
                {item.description?.slice(0, 50) || "Your Offer"}
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${statusStyles[item.status] || statusStyles.pending}`}>
                {item.status}
              </span>
            </div>
            <p className="text-xs text-blue-600 dark:text-indigo-400 font-semibold truncate">
              For: {requestTitle}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {item.price?.toLocaleString() || 0} <span className="text-[10px] text-slate-400">EGP</span>
              </span>
              <div className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span className="capitalize">{requestCategory}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />{posted}
              </div>
              {item.deliveryNote && (
                <div className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-900/20 text-[10px]">
                  <TrendingUp className="w-3 h-3" /><span>Delivery: {item.deliveryNote}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 shrink-0 border-t border-slate-100 dark:border-slate-800/60 md:border-t-0 pt-3 md:pt-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDetailsOpen(true);
            }}
            className="flex items-center gap-1 text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 cursor-pointer"
            title="معاينة التفاصيل"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>عرض</span>
          </button>
          {item.status === "pending" && (
            <button
              type="button"
              onClick={handleEdit}
              className="flex items-center gap-1 text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تعديل</span>
            </button>
          )}
          {item.status !== "withdrawn" && (
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              className="flex items-center gap-1 text-xs md:text-sm font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 cursor-pointer disabled:opacity-50"
            >
              {isWithdrawing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              <span>سحب العرض</span>
            </button>
          )}
        </div>
      </div>

      <OfferDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        offer={item}
      />
    </>
  );
}