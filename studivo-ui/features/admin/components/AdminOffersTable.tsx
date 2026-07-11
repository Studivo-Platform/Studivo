"use client";

import React, { useState, useEffect } from "react";
import { Filter, Trash2, Loader2, Tag, Image as ImageIcon } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { getAdminOffersApi } from "../APIs/getAdminOffers.api";
import { deleteOfferAdminApi } from "../APIs/adminActions.api";

export function AdminOffersTable() {
  const { t } = useTranslation();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const data = await getAdminOffersApi({
        status: status !== "all" ? status : undefined,
        limit: 50,
      });
      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.docs)
        ? data.docs
        : Array.isArray(data?.offers)
        ? data.offers
        : Array.isArray(data)
        ? data
        : [];
      setOffers(list);
    } catch (err) {
      console.error("Failed to fetch admin offers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [status]);

  const handleDelete = async (offerId: string) => {
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذا العرض نهائياً؟")) return;
    setActionLoading(offerId);
    try {
      await deleteOfferAdminApi(offerId);
      await fetchOffers();
    } catch (err: any) {
      alert(err.response?.data?.message || "تعذر حذف العرض.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ms-1" />
          <span className="text-xs font-bold text-slate-500">{t({ section: "admin_portal", key: "status_req_all" })}:</span>
          {["all", "pending", "accepted", "rejected", "withdrawn"].map((st) => (
            <button
              key={st}
              onClick={() => setStatus(st)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                status === st
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-amber-300 text-white dark:text-[#060913] shadow-md"
                  : "bg-slate-100 dark:bg-[#060913] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {st === "all" ? t({ section: "admin_portal", key: "status_req_all" }) : st}
            </button>
          ))}
        </div>
      </div>

      {/* Offers Table */}
      <div className="rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#060913]/40 text-slate-500 dark:text-slate-400 font-bold">
                <th className="p-4 text-start">{t({ section: "admin_portal", key: "th_offer" })}</th>
                <th className="p-4 text-start">{t({ section: "admin_portal", key: "th_offer_seller" })}</th>
                <th className="p-4 text-start">{t({ section: "admin_portal", key: "th_offer_price" })}</th>
                <th className="p-4 text-start">{t({ section: "admin_portal", key: "th_offer_status" })}</th>
                <th className="p-4 text-end">{t({ section: "admin_portal", key: "th_actions" })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 animate-pulse font-semibold">
                    {t({ section: "admin_portal", key: "loading_offers" })}
                  </td>
                </tr>
              ) : offers.length > 0 ? (
                offers.map((o) => {
                  const oId = o._id || o.id;
                  const sellerObj = typeof o.sellerId === "object" ? o.sellerId : null;
                  const sellerName = sellerObj?.name || "Seller";
                  const price = o.price ?? 0;
                  const imgCount = Array.isArray(o.images) ? o.images.length : 0;

                  return (
                    <tr key={oId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <Tag className="w-4 h-4" />
                          </div>
                          <div className="font-bold text-slate-900 dark:text-white truncate max-w-[260px]" title={o.description}>
                            {o.description}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-700 dark:text-slate-300 font-medium truncate max-w-[150px]">{sellerName}</td>
                      <td className="p-4 font-black text-blue-600 dark:text-cyan-300">{price.toLocaleString()} EGP</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border capitalize ${
                            o.status === "accepted" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : o.status === "rejected" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" : o.status === "withdrawn" ? "bg-slate-500/10 text-slate-500 border-slate-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }`}>
                            {o.status || "pending"}
                          </span>
                          {imgCount > 0 && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                              <ImageIcon className="w-3 h-3" /> {imgCount}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-end">
                        <button
                          type="button"
                          onClick={() => handleDelete(oId)}
                          disabled={actionLoading === oId}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/40 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading === oId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                          <span>{t({ section: "admin_portal", key: "btn_delete" })}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 font-bold">
                    {t({ section: "admin_portal", key: "no_offers" })}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
