"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Trash2, Loader2, FileText } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { getAdminRequestsApi } from "../APIs/getAdminRequests.api";
import { deleteRequestAdminApi } from "../APIs/adminActions.api";

export function AdminRequestsTable() {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("all");
  const [category, setCategory] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getAdminRequestsApi({
        status: status !== "all" ? status : undefined,
        category: category.trim() || undefined,
        limit: 50,
      });
      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.docs)
        ? data.docs
        : Array.isArray(data?.requests)
        ? data.requests
        : Array.isArray(data)
        ? data
        : [];
      setRequests(list);
    } catch (err) {
      console.error("Failed to fetch admin requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [status, category]);

  const handleDelete = async (reqId: string) => {
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذا الطلب نهائياً وكافة العروض المرتبطة به؟")) return;
    setActionLoading(reqId);
    try {
      await deleteRequestAdminApi(reqId);
      await fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || "تعذر حذف الطلب.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={t({ section: "admin_portal", key: "filter_req_category" })}
            className="w-full ps-10 pe-4 py-2.5 text-xs md:text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ms-1" />
          {["all", "open", "matched", "closed"].map((st) => (
            <button
              key={st}
              onClick={() => setStatus(st)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                status === st
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-amber-300 text-white dark:text-[#060913] shadow-md"
                  : "bg-slate-100 dark:bg-[#060913] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {st === "all" ? t({ section: "admin_portal", key: "status_req_all" }) : st === "open" ? t({ section: "admin_portal", key: "status_req_open" }) : st === "matched" ? t({ section: "admin_portal", key: "status_req_matched" }) : t({ section: "admin_portal", key: "status_req_closed" })}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#060913]/40 text-slate-500 dark:text-slate-400 font-bold">
                <th className="p-4 text-start">{t({ section: "admin_portal", key: "th_req_title" })}</th>
                <th className="p-4 text-start">{t({ section: "admin_portal", key: "th_req_owner" })}</th>
                <th className="p-4 text-start">{t({ section: "admin_portal", key: "th_req_budget" })}</th>
                <th className="p-4 text-start">{t({ section: "admin_portal", key: "th_req_status" })}</th>
                <th className="p-4 text-end">{t({ section: "admin_portal", key: "th_actions" })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 animate-pulse font-semibold">
                    {t({ section: "admin_portal", key: "loading_reqs" })}
                  </td>
                </tr>
              ) : requests.length > 0 ? (
                requests.map((r) => {
                  const reqId = r._id || r.id;
                  const title = r.title || r.rawText || r.parsedData?.title || "Request";
                  const userObj = typeof r.userId === "object" ? r.userId : null;
                  const userName = userObj?.name || "Student";
                  const categoryName = r.category || r.parsedData?.category || "General";
                  const minB = r.budget?.min ?? r.parsedData?.budget?.min ?? 0;
                  const maxB = r.budget?.max ?? r.parsedData?.budget?.max ?? 0;

                  return (
                    <tr key={reqId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="font-bold text-slate-900 dark:text-white truncate max-w-[240px]" title={title}>{title}</div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-700 dark:text-slate-300 font-medium truncate max-w-[150px]">{userName}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{minB}–{maxB} EGP</div>
                        <div className="text-[11px] text-slate-400 font-medium">{categoryName}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border capitalize ${
                          r.status === "open" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : r.status === "matched" ? "bg-violet-500/10 text-violet-600 border-violet-500/20" : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                        }`}>
                          {r.status || "open"}
                        </span>
                      </td>
                      <td className="p-4 text-end">
                        <button
                          type="button"
                          onClick={() => handleDelete(reqId)}
                          disabled={actionLoading === reqId}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/40 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading === reqId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                          <span>{t({ section: "admin_portal", key: "btn_delete" })}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 font-bold">
                    {t({ section: "admin_portal", key: "no_reqs" })}
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
