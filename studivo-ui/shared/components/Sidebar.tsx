"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Search,
  FileText,
  PlusCircle,
  MessageSquare,
  Layers,
  X,
  Bell,
  User,
  Settings,
  Menu,
  LogOut,
  Shield
} from "lucide-react";
import { useSidbar } from "@/shared/hooks/useSidbar";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useAuthStore } from "@/shared/store/auth.store";
import axiosInstance, { performLogout } from "@/shared/APIs/axiosInstance";
import { getSocket } from "@/shared/lib/socket";
import { NotificationCenter } from "./NotificationCenter";
import { LiveNotificationToast } from "./LiveNotificationToast";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Search,
  FileText,
  PlusCircle,
  MessageSquare,
  Bell,
  User,
  Settings,
  Shield
};

export function Sidebar() {
  const { toggelSidebar, closeSidebar, isOpen, pathname, t } = useSidbar();
  const { lang } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isSeller = user?.role === "seller";
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!user) return;
    axiosInstance.get("/notifications?limit=1").then((res) => {
      const dataObj = res.data?.data || res.data || {};
      if (typeof dataObj.unreadCount === "number") {
        setUnreadCount(dataObj.unreadCount);
      }
    }).catch(() => { });

    const socket = getSocket();
    function onLiveNotification() {
      setUnreadCount((prev) => prev + 1);
    }
    socket.on("new_notification", onLiveNotification);
    return () => {
      socket.off("new_notification", onLiveNotification);
    };
  }, [user]);

  const dynamicSections = isAdmin
    ? [
      {
        titleKey: "overview",
        links: [
          { labelKey: "admin_portal", labelFallback: "Admin Portal", icon: "Shield", href: "/admin" },
        ],
      },
      {
        titleKey: "account",
        links: [
          { labelKey: "messages", labelFallback: lang === "ar" ? "المحادثات" : "Messages", icon: "MessageSquare", href: "/dashboard/chat" },
          { labelKey: "profile", labelFallback: lang === "ar" ? "الملف الشخصي" : "Profile", icon: "User", href: "/dashboard/profile" },
        ],
      },
    ]
    : isSeller
      ? [
        {
          titleKey: "overview",
          links: [
            { labelKey: "dashboard", labelFallback: lang === "ar" ? "لوحة التحكم" : "Dashboard", icon: "LayoutDashboard", href: "/dashboard/seller" },
            { labelKey: "search", labelFallback: lang === "ar" ? "البحث الشامل" : "Search", icon: "Search", href: "/dashboard/seller/search" },
          ],
        },
        {
          titleKey: "offers",
          links: [
            { labelKey: "my_offers", labelFallback: lang === "ar" ? "عروضي المتاحة" : "My Offers", icon: "FileText", href: "/dashboard/seller/offers" },
          ],
        },
        {
          titleKey: "account",
          links: [
            { labelKey: "messages", labelFallback: lang === "ar" ? "المحادثات" : "Messages", icon: "MessageSquare", href: "/dashboard/chat" },
            { labelKey: "profile", labelFallback: lang === "ar" ? "الملف الشخصي" : "Profile", icon: "User", href: "/dashboard/profile" },
          ],
        },
      ]
      : [
        {
          titleKey: "overview",
          links: [
            { labelKey: "dashboard", labelFallback: lang === "ar" ? "لوحة التحكم" : "Dashboard", icon: "LayoutDashboard", href: "/dashboard/student" },
            { labelKey: "search", labelFallback: lang === "ar" ? "البحث الشامل" : "Search", icon: "Search", href: "/dashboard/student/search" },
          ],
        },
        {
          titleKey: "requests",
          links: [
            { labelKey: "my_requests", labelFallback: lang === "ar" ? "طلباتي" : "My Requests", icon: "FileText", href: "/dashboard/student/requests" },
            { labelKey: "create_request", labelFallback: lang === "ar" ? "إنشاء طلب جديد" : "New Request", icon: "PlusCircle", href: "/requests/new" },
          ],
        },
        {
          titleKey: "account",
          links: [
            { labelKey: "messages", labelFallback: lang === "ar" ? "المحادثات" : "Messages", icon: "MessageSquare", href: "/dashboard/chat" },
            { labelKey: "profile", labelFallback: lang === "ar" ? "الملف الشخصي" : "Profile", icon: "User", href: "/dashboard/profile" },
          ],
        },
      ];

  return (
    <>
      <LiveNotificationToast />
      <NotificationCenter
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        unreadCount={unreadCount}
        setUnreadCount={setUnreadCount}
      />

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggelSidebar}
        className="md:hidden fixed bottom-6 start-6 z-50 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-95 border border-white/20 cursor-pointer"
        aria-label="Toggle Navigation Menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer"
          onClick={closeSidebar}
        />
      )}

      {/* Persistent Desktop & Slide-Over Mobile Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 start-0 h-screen w-64 bg-white dark:bg-[#060913]/95 backdrop-blur-xl flex flex-col justify-between z-40 transition-transform duration-300 border-e border-slate-200/80 dark:border-slate-800/80 md:translate-x-0 rtl:md:translate-x-0
          ${isOpen ? "translate-x-0 rtl:translate-x-0" : "-translate-x-full rtl:translate-x-full"}
        `}
      >
        <div>
          {/* Header Logo */}
          <div className="h-16 px-6 border-b border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 dark:from-indigo-500 dark:to-cyan-400 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Layers className="h-4 w-4 text-white" />
              </div>
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">Studivo</span>
            </Link>

            <div className="flex items-center gap-2">
              {/* Notification Bell Button */}
              <button
                type="button"
                onClick={() => setIsNotifOpen(true)}
                className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 cursor-pointer"
                title={lang === "ar" ? "الإشعارات" : "Notifications"}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -end-1.5 w-5 h-5 bg-red-600/80 text-white font-black text-[12px] rounded-full flex items-center justify-center border-2 border-white dark:border-[#060913]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={closeSidebar}
                className="md:hidden p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Links Section */}
          <div className="p-4 space-y-6 overflow-y-auto">
            {dynamicSections.map((section, sIndex) => (
              <div key={sIndex} className="space-y-1.5">
                <h4 className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {t({ section: "sidebar", key: `sections.${section.titleKey}` }) || section.titleKey}
                </h4>
                <ul className="space-y-1">
                  {section.links.map((link, lIndex) => {
                    const LucideIcon = iconMap[link.icon] || FileText;
                    const isActive = pathname === link.href;
                    const labelText = t({ section: "sidebar", key: `links.${link.labelKey}` }) || link.labelFallback;

                    return (
                      <li key={lIndex}>
                        <Link
                          href={link.href}
                          onClick={closeSidebar}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200
                            ${isActive
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white dark:from-indigo-600 dark:to-violet-600 dark:text-white shadow-md"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            {LucideIcon && <LucideIcon className="h-4 w-4 shrink-0" />}
                            <span>{labelText}</span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            {/* Quick Notification Drawer Link */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  closeSidebar();
                  setIsNotifOpen(true);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 shrink-0 text-amber-500" />
                  <span>{lang === "ar" ? "الإشعارات" : "Notifications"}</span>
                </div>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500 text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* User Card Footer & Logout */}
        <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-[#131b2e]/50">
          <Link href="/dashboard/profile" onClick={closeSidebar} className="flex items-center gap-3 min-w-0 flex-1 group cursor-pointer p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
            <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 dark:border-indigo-500/30 shrink-0 bg-blue-100 dark:bg-indigo-950 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="font-bold text-blue-600 dark:text-indigo-400 text-sm">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="text-xs md:text-sm font-bold truncate text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#fff4b7] transition-colors">{user?.name || "Studivo User"}</h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">{user?.email || "user@studivo.com"}</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => {
              closeSidebar();
              performLogout();
            }}
            title={lang === "ar" ? "تسجيل الخروج" : "Logout"}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40 transition-all shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}