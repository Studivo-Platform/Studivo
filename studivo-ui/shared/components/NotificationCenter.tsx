"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  MessageSquare,
  Tag,
  FileText,
  Info,
  X,
  ExternalLink,
  Loader2
} from "lucide-react";
import axiosInstance from "@/shared/APIs/axiosInstance";
import { getSocket } from "@/shared/lib/socket";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useAuthStore } from "@/shared/store/auth.store";

export interface NotificationItem {
  _id: string;
  type: "new_offer" | "new_message" | "new_request" | "system";
  message: string;
  resourceId?: string;
  resourceType?: "Request" | "Offer" | "Conversation" | null;
  read: boolean;
  createdAt: string;
}

export function NotificationCenter({
  isOpen,
  onClose,
  unreadCount,
  setUnreadCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const router = useRouter();
  const { lang } = useTranslation();
  const currentUser = useAuthStore((state) => state.user);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  // Fetch initial notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/notifications?limit=30");
      const dataObj = res.data?.data || res.data || {};
      const list = Array.isArray(dataObj) ? dataObj : dataObj.notifications || [];
      const count = dataObj.unreadCount ?? list.filter((n: any) => !n.read).length;

      setNotifications(list);
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  // Listen for live socket notifications
  useEffect(() => {
    if (!currentUser) return;
    const socket = getSocket();

    function onLiveNotification(data: any) {
      const notif: NotificationItem = data.notification || data;
      if (!notif) return;

      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    }

    socket.on("new_notification", onLiveNotification);

    return () => {
      socket.off("new_notification", onLiveNotification);
    };
  }, [currentUser]);

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);
      await axiosInstance.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all read:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleItemClick = (notif: NotificationItem) => {
    if (!notif.read) {
      axiosInstance.patch(`/notifications/${notif._id}/read`).catch(() => {});
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    onClose();

    // Smart Navigation based on resource type
    if (notif.resourceType === "Conversation" || notif.type === "new_message") {
      router.push(`/dashboard/chat${notif.resourceId ? `?conversationId=${notif.resourceId}` : ''}`);
    } else if (notif.type === "new_offer") {
      router.push("/dashboard/student/requests");
    } else if (notif.type === "new_request") {
      router.push("/dashboard/seller/search");
    } else {
      router.push("/dashboard");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-end p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden mt-12 md:mt-2">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-[#060913]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-[#fff4b7] text-white dark:text-[#060913] flex items-center justify-center font-bold shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{lang === "ar" ? "مركز الإشعارات" : "Notification Center"}</span>
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {unreadCount} {lang === "ar" ? "جديد" : "new"}
                  </span>
                )}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions bar */}
        {notifications.length > 0 && (
          <div className="px-5 py-2.5 bg-slate-100/60 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500 dark:text-slate-400">
              {lang === "ar" ? `إجمالي الإشعارات: ${notifications.length}` : `Total: ${notifications.length}`}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markingAll}
                className="text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-bold disabled:opacity-50 cursor-pointer"
              >
                {markingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                <span>{lang === "ar" ? "تحديد الكل كتمت القراءة" : "Mark all read"}</span>
              </button>
            )}
          </div>
        )}

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {loading ? (
            <div className="p-10 text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 dark:text-cyan-400" />
              <p className="text-xs text-slate-400 font-semibold">{lang === "ar" ? "جاري تحميل الإشعارات..." : "Loading notifications..."}</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((item) => {
              const iconMap = {
                new_offer: <Tag className="w-4 h-4 text-emerald-500" />,
                new_message: <MessageSquare className="w-4 h-4 text-blue-500" />,
                new_request: <FileText className="w-4 h-4 text-indigo-500" />,
                system: <Info className="w-4 h-4 text-amber-500" />,
              };

              return (
                <div
                  key={item._id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group flex items-start gap-3 ${
                    !item.read
                      ? "bg-blue-50/70 dark:bg-indigo-950/40 border-blue-200 dark:border-indigo-500/40 shadow-sm"
                      : "bg-white dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                    {iconMap[item.type] || <Bell className="w-4 h-4 text-slate-400" />}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-xs md:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {item.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      <span>{new Date(item.createdAt).toLocaleString(lang === "ar" ? "ar-EG" : "en-US", { dateStyle: "short", timeStyle: "short" })}</span>
                      <span className="flex items-center gap-1 text-blue-600 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                        <span>{lang === "ar" ? "عرض التفاصيل" : "View"}</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {!item.read && (
                    <button
                      onClick={(e) => handleMarkRead(item._id, e)}
                      title={lang === "ar" ? "تحديد كتمت القراءة" : "Mark as read"}
                      className="p-1 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-slate-800 transition-colors shrink-0"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-cyan-400 block" />
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {lang === "ar" ? "لا توجد إشعارات حالياً." : "No notifications right now."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
