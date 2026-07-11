"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, UserCheck, UserX, Shield, Loader2, MessageSquare, Trash2 } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { getAdminUsersApi } from "../APIs/getAdminUsers.api";
import { deactivateUserApi, reactivateUserApi, deleteUserAdminApi, startAdminConversationApi } from "../APIs/adminActions.api";

export function AdminUsersTable() {
  const { t } = useTranslation();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsersApi({
        search: search.trim() || undefined,
        role: role !== "all" ? role : undefined,
        limit: 50,
      });
      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.docs)
        ? data.docs
        : Array.isArray(data?.users)
        ? data.users
        : Array.isArray(data)
        ? data
        : [];
      setUsers(list);
    } catch (err) {
      console.error("Failed to fetch admin users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, role]);

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    if (!confirm(`هل أنت تأكد من رغبتك في ${currentActive ? "إيقاف" : "إعادة تفعيل"} حساب هذا المستخدم؟`)) return;
    setActionLoading(userId);
    try {
      if (currentActive) {
        await deactivateUserApi(userId);
      } else {
        await reactivateUserApi(userId);
      }
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || "تعذر تغيير حالة الحساب.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("⚠️ هل أنت تأكد من رغبتك في حذف هذا المستخدم نهائياً (Cascade Delete)؟ سيؤدي ذلك لحذف كافة طلباته وعروضه ورسائله وسجلاته من قاعدة البيانات!")) return;
    setActionLoading(userId);
    try {
      await deleteUserAdminApi(userId);
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || "تعذر حذف المستخدم.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMessageUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      const conv = await startAdminConversationApi(userId);
      const convId = conv?._id || conv?.id;
      if (convId) {
        router.push(`/dashboard/chat?conversationId=${convId}`);
      } else {
        router.push("/dashboard/chat");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "تعذر بدء المحادثة معك هذا المستخدم.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t({ section: "admin_portal", key: "search_user_placeholder" })}
            className="w-full ps-10 pe-4 py-2.5 text-xs md:text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ms-1" />
          {["all", "student", "seller", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                role === r
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-amber-300 text-white dark:text-[#060913] shadow-md"
                  : "bg-slate-100 dark:bg-[#060913] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {r === "all" ? t({ section: "admin_portal", key: "filter_all" }) : r === "student" ? t({ section: "admin_portal", key: "filter_student" }) : r === "seller" ? t({ section: "admin_portal", key: "filter_seller" }) : t({ section: "admin_portal", key: "filter_admin" })}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#060913]/40 text-slate-500 dark:text-slate-400 font-bold">
                <th className="p-4 text-start">{t({ section: "admin_portal", key: "th_user" })}</th>
                <th className="p-4 text-start">{t({ section: "admin_portal", key: "th_email" })}</th>
                <th className="p-4 text-start">{t({ section: "admin_portal", key: "th_role" })}</th>
                <th className="p-4 text-start">{t({ section: "admin_portal", key: "th_status" })}</th>
                <th className="p-4 text-end">{t({ section: "admin_portal", key: "th_actions" })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 animate-pulse font-semibold">
                    {t({ section: "admin_portal", key: "loading_users" })}
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => {
                  const uId = u._id || u.id;
                  const isActive = u.isActive !== false;
                  const isUserAdmin = u.role === "admin";
                  const avatar = u.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "User")}&background=3b82f6&color=fff`;

                  return (
                    <tr key={uId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={avatar} alt={u.name} className="w-9 h-9 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                          <div className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">{u.name}</div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300 font-medium truncate max-w-[200px]">{u.email}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold capitalize border ${
                          isUserAdmin ? "bg-purple-500/10 text-purple-600 border-purple-500/20" : u.role === "seller" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        }`}>
                          {isUserAdmin && <Shield className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                        }`}>
                          ● {isActive ? t({ section: "admin_portal", key: "status_active" }) : t({ section: "admin_portal", key: "status_deactivated" })}
                        </span>
                      </td>
                      <td className="p-4 text-end">
                        {!isUserAdmin && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleMessageUser(uId)}
                              disabled={actionLoading === uId}
                              title={t({ section: "admin_portal", key: "btn_message" })}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-blue-50 dark:bg-indigo-950/40 text-blue-600 dark:text-cyan-300 hover:bg-blue-100 border border-blue-200 dark:border-indigo-800/50 transition-all cursor-pointer disabled:opacity-50"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{t({ section: "admin_portal", key: "btn_message" })}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleActive(uId, isActive)}
                              disabled={actionLoading === uId}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                                isActive
                                  ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 border border-amber-200 dark:border-amber-900/40"
                                  : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-900/40"
                              }`}
                            >
                              {actionLoading === uId ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : isActive ? (
                                <UserX className="w-3.5 h-3.5" />
                              ) : (
                                <UserCheck className="w-3.5 h-3.5" />
                              )}
                              <span>{isActive ? t({ section: "admin_portal", key: "btn_deactivate" }) : t({ section: "admin_portal", key: "btn_activate" })}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteUser(uId)}
                              disabled={actionLoading === uId}
                              title={t({ section: "admin_portal", key: "btn_delete" })}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/40 transition-all cursor-pointer disabled:opacity-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{t({ section: "admin_portal", key: "btn_delete" })}</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 font-bold">
                    {t({ section: "admin_portal", key: "no_users" })}
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
