"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Tag, Clock, TrendingUp, MessageSquare, ShieldCheck, Image as ImageIcon, Loader2 } from "lucide-react";
import axiosInstance from "@/shared/APIs/axiosInstance";

interface OfferDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: any | null;
}

export function OfferDetailsModal({ isOpen, onClose, offer }: OfferDetailsModalProps) {
  const router = useRouter();
  const [loadingChat, setLoadingChat] = useState(false);

  if (!isOpen || !offer) return null;

  const reqData = typeof offer.requestId === "object" ? offer.requestId : null;
  const requestTitle = reqData?.rawText?.slice(0, 80) || reqData?.parsedData?.subCategory || "";
  const requestCategory = reqData?.parsedData?.category || "عام";
  const title = offer.title || offer.description || requestTitle || "تفاصيل العرض";

  const sellerObj = typeof offer.sellerId === "object" ? offer.sellerId : null;
  const sellerName = offer.seller || sellerObj?.name || "البائع";
  const sellerAvatar = sellerObj?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=3b82f6&color=fff`;

  const price = offer.price ?? 0;
  const deliveryNote = offer.deliveryNote || offer.deliveryTime || offer.deliveryArea || null;
  const condition = offer.condition || offer.productCondition || "new";
  const rawImages = Array.isArray(offer.images) ? offer.images : [];
  const images = rawImages.length > 0 ? rawImages : offer.imageURL ? [{ url: offer.imageURL }] : offer.imageUrl ? [{ url: offer.imageUrl }] : [];

  const conditionLabels: Record<string, string> = {
    new: "جديد (New)",
    used: "مستعمل (Used)",
    refurbished: "مجدد (Refurbished)",
  };

  const statusStyles: Record<string, { label: string; style: string }> = {
    pending: { label: "قيد الانتظار", style: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
    accepted: { label: "مقبول", style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
    rejected: { label: "مرفوض", style: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
    withdrawn: { label: "مسحوب", style: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20" },
  };

  const handleStartChat = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const sellerId = sellerObj?._id || (typeof offer.sellerId === "string" ? offer.sellerId : null);
    const requestId = reqData?._id || (typeof offer.requestId === "string" ? offer.requestId : null);

    if (!sellerId || !requestId) {
      router.push("/dashboard/chat");
      return;
    }

    try {
      setLoadingChat(true);
      const res = await axiosInstance.post("/chat", {
        requestId,
        sellerId,
        offerId: offer._id || offer.id,
      });
      const convData = res.data?.data || res.data;
      const convId = convData?._id || convData?.id;

      onClose();
      if (convId) {
        router.push(`/dashboard/chat?conversationId=${convId}`);
      } else {
        router.push("/dashboard/chat");
      }
    } catch (err) {
      console.error("Failed to start conversation:", err);
      router.push("/dashboard/chat");
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-start">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#060913]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white">تفاصيل العرض</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">معاينة كامل بيانات ومعلومات العرض المقدم</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Seller Header Info & Chat Button */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#060913]/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <img src={sellerAvatar} alt={sellerName} className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white truncate">{sellerName}</h4>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-indigo-400 border border-blue-500/20">
                    <ShieldCheck className="w-3 h-3" /> بائع
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">قدم هذا العرض لتلبية طلبك</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartChat}
              disabled={loadingChat}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-amber-300 text-white dark:text-[#060913] text-xs md:text-sm font-black shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {loadingChat ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
              <span>تحدث مع البائع الآن</span>
            </button>
          </div>

          {/* Offer Title & Price Badge */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyles[offer.status]?.style || statusStyles.pending.style}`}>
                ● {statusStyles[offer.status]?.label || offer.status}
              </span>
              <div className="text-xl md:text-2xl font-black text-blue-600 dark:text-cyan-300">
                {price.toLocaleString()} <span className="text-xs font-extrabold text-slate-400">ج.م (EGP)</span>
              </div>
            </div>

            <h2 className="text-base md:text-lg font-black text-slate-900 dark:text-white leading-relaxed">
              {title}
            </h2>

            {requestTitle && (
              <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400">
                مقدم خصيصاً للطلب: <span className="text-blue-600 dark:text-indigo-400 font-bold">"{requestTitle}"</span>
              </p>
            )}
          </div>

          {/* Quick Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#060913] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 block">حالة المنتج</span>
              <span className="text-xs md:text-sm font-black text-slate-900 dark:text-white capitalize">
                {conditionLabels[condition] || condition}
              </span>
            </div>
            {deliveryNote && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#060913] border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block">التوصيل / التسليم</span>
                <span className="text-xs md:text-sm font-black text-emerald-600 dark:text-emerald-400 truncate block">
                  {deliveryNote}
                </span>
              </div>
            )}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#060913] border border-slate-200/80 dark:border-slate-800 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-slate-400 block">التصنيف</span>
              <span className="text-xs md:text-sm font-black text-slate-900 dark:text-white capitalize truncate block">
                {requestCategory}
              </span>
            </div>
          </div>

          {/* Full Description */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">تفاصيل ومواصفات العرض:</h4>
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#060913]/80 border border-slate-200/80 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium">
              {offer.description || "لا توجد تفاصيل إضافية لهذا العرض."}
            </div>
          </div>

          {/* Product Images (if any) */}
          {images.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600 dark:text-indigo-400" />
                <span>صور المنتج المرفقة ({images.length}):</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img: any, idx: number) => {
                  const url = typeof img === "string" ? img : (img?.url || img?.secure_url || "");
                  if (!url) return null;
                  return (
                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 block group relative">
                      <img src={url} alt={`Offer Image ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#060913]/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs md:text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
}
