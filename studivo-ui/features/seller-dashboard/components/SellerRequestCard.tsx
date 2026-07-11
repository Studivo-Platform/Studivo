"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, MapPin, Clock, MessageSquare, PlusCircle, Loader2 } from "lucide-react";
import { SellerMatchingRequestItem } from "../types/sellerRequests.type";
import axiosInstance from "@/shared/APIs/axiosInstance";

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

export function SellerRequestCard({ item }: { item: SellerMatchingRequestItem }) {
  const router = useRouter();
  const [loadingChat, setLoadingChat] = useState(false);

  const title = item.parsedData?.subCategory
    ? `${item.parsedData.subCategory} — ${item.parsedData.category}`
    : item.rawText?.slice(0, 60) || "Untitled Request";

  const buyerName = item.userId?.name || "Student";
  const budgetMin = item.parsedData?.budget?.min ?? 0;
  const budgetMax = item.parsedData?.budget?.max ?? 0;
  const currency = item.parsedData?.budget?.currency || "EGP";
  const location = item.parsedData?.location || "—";
  const posted = item.createdAt ? timeAgo(item.createdAt) : "—";
  const category = item.parsedData?.category || "other";

  const isNew = item.createdAt
    ? Date.now() - new Date(item.createdAt).getTime() < 24 * 60 * 60 * 1000
    : false;

  const handleMessageStudent = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setLoadingChat(true);
      const res = await axiosInstance.post("/chat", {
        requestId: item._id,
      });
      const convData = res.data?.data || res.data;
      const convId = convData?._id || convData?.id;

      if (convId) {
        router.push(`/dashboard/chat?conversationId=${convId}`);
      } else {
        router.push("/dashboard/chat");
      }
    } catch (err) {
      console.error("Failed to start chat with student:", err);
      router.push("/dashboard/chat");
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-[#131b2e] dark:to-[#0d1322] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4 hover:border-blue-500 dark:hover:border-indigo-500/60 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-indigo-950/40 border border-slate-200 dark:border-indigo-500/30 flex items-center justify-center text-blue-600 dark:text-cyan-400 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0 space-y-0.5">
            <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white truncate">{title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">by {buyerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] md:text-xs font-semibold px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full capitalize">
            {category}
          </span>
          {isNew && (
            <span className="text-[10px] md:text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full shrink-0">
              New
            </span>
          )}
        </div>
      </div>

      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-medium line-clamp-2 leading-relaxed">
        {item.rawText}
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80 pb-3">
        {(budgetMin > 0 || budgetMax > 0) && (
          <div className="flex items-center gap-1 text-blue-600 dark:text-cyan-300 font-extrabold">
            <span>💵</span>
            <span>
              {budgetMin > 0 && budgetMax > 0
                ? `${budgetMin.toLocaleString()}–${budgetMax.toLocaleString()} ${currency}`
                : budgetMax > 0
                  ? `Up to ${budgetMax.toLocaleString()} ${currency}`
                  : `From ${budgetMin.toLocaleString()} ${currency}`}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />{location}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />{posted}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-1">
        <button
          onClick={handleMessageStudent}
          disabled={loadingChat}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all"
        >
          {loadingChat ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <MessageSquare className="w-4 h-4 shrink-0" />}
          <span>Message</span>
        </button>
        <Link href={`/dashboard/seller/offers/${item._id}/submit`} className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold text-white dark:text-[#060913] bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-300 dark:to-amber-400 dark:hover:from-amber-400 dark:hover:to-amber-500 rounded-xl shadow-sm transition-all">
          <PlusCircle className="w-4 h-4 shrink-0" />
          <span>Submit Offer</span>
        </Link>
      </div>
    </div>
  );
}