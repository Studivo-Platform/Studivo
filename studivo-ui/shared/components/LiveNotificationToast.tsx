"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, MessageSquare, Tag, FileText, Info, X } from "lucide-react";
import { getSocket } from "@/shared/lib/socket";
import { useAuthStore } from "@/shared/store/auth.store";
import { NotificationItem } from "./NotificationCenter";

function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    // Tone 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: B5 (987.77 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(987.77, now + 0.1);
    gain2.gain.setValueAtTime(0.18, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.5);
  } catch (e) {
    // AudioContext fallback
  }
}

export function LiveNotificationToast() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    const socket = getSocket();

    function handleEvent(data: any, defaultType: "new_offer" | "new_message" | "new_notification") {
      let notif: NotificationItem;
      if (data.notification) {
        notif = data.notification;
      } else if (defaultType === "new_offer") {
        notif = {
          _id: data.offerId || Math.random().toString(),
          type: "new_offer",
          message: `وصول عرض جديد من البائع (${data.sellerName || 'بائع'}) بقيمة ${data.price || 0} ج.م على طلبك`,
          resourceId: data.requestId,
          resourceType: "Request",
          read: false,
          createdAt: data.timestamp || new Date().toISOString(),
        };
      } else if (defaultType === "new_message") {
        const msgObj = data.message || data;
        notif = {
          _id: msgObj._id || Math.random().toString(),
          type: "new_message",
          message: `رسالة جديدة في المحادثة`,
          resourceId: data.conversationId || msgObj.conversationId,
          resourceType: "Conversation",
          read: false,
          createdAt: new Date().toISOString(),
        };
      } else {
        notif = data;
      }

      if (!notif || !notif.message) return;

      playNotificationChime();
      setActiveToast(notif);

      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 6000);

      return () => clearTimeout(timer);
    }

    const onNotification = (data: any) => handleEvent(data, "new_notification");
    const onOffer = (data: any) => handleEvent(data, "new_offer");

    socket.on("new_notification", onNotification);
    socket.on("new_offer", onOffer);

    return () => {
      socket.off("new_notification", onNotification);
      socket.off("new_offer", onOffer);
    };
  }, [currentUser]);

  if (!activeToast) return null;

  const iconMap = {
    new_offer: <Tag className="w-5 h-5 text-emerald-500" />,
    new_message: <MessageSquare className="w-5 h-5 text-blue-500" />,
    new_request: <FileText className="w-5 h-5 text-indigo-500" />,
    system: <Info className="w-5 h-5 text-amber-500" />,
  };

  const handleClick = () => {
    const notif = activeToast;
    setActiveToast(null);

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

  return (
    <div className="fixed top-5 end-5 z-[100] max-w-sm w-full animate-in slide-in-from-top-5 duration-300 pointer-events-auto">
      <div
        onClick={handleClick}
        className="p-4 rounded-3xl bg-slate-900/95 text-white border border-slate-700/80 shadow-2xl backdrop-blur-xl flex items-start gap-3.5 cursor-pointer hover:border-blue-500 transition-all group"
      >
        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-105 transition-transform">
          {iconMap[activeToast.type] || <Bell className="w-5 h-5 text-blue-400" />}
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
              إشعار جديد
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveToast(null);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs md:text-sm font-bold leading-snug text-slate-100">
            {activeToast.message}
          </p>
        </div>
      </div>
    </div>
  );
}
