"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { MessageCircle, Search, Send, ArrowRight } from "lucide-react";
import axiosInstance from "@/shared/APIs/axiosInstance";
import { getSocket } from "@/shared/lib/socket";
import { useAuthStore } from "@/shared/store/auth.store";

interface MessageItem {
  id: string;
  sender: "me" | "other";
  content: string;
  time: string;
}

interface ConversationItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  topicTitle?: string;
  topicCategory?: string;
  messages: MessageItem[];
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const paramConversationId = searchParams.get("conversationId");

  const [socketConnected, setSocketConnected] = useState(false);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [isLoadingChats, setIsLoadingChats] = useState(true);

  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?._id
    ? currentUser._id.toString()
    : currentUser?.id
    ? currentUser.id.toString()
    : null;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, activeConversationId]);

  useEffect(() => {
    const socket = getSocket();

    function onConnect() {
      setSocketConnected(true);
    }
    function onDisconnect() {
      setSocketConnected(false);
    }

    if (socket.connected) {
      setSocketConnected(true);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (paramConversationId) {
      setActiveConversationId(paramConversationId);
    }
  }, [paramConversationId]);

  const fetchConversations = async () => {
    try {
      setIsLoadingChats(true);
      const res = await axiosInstance.get("/chat/my?limit=50");
      const rawData = res.data?.data || res.data || {};
      const list = Array.isArray(rawData) ? rawData : rawData.conversations || [];

      const mapped: ConversationItem[] = list.map((item: any) => {
        const participants = item.participants || [];
        const otherUser = Array.isArray(participants)
          ? participants.find((p: any) => {
              const pId = p?._id ? p._id.toString() : p?.id ? p.id.toString() : p?.toString();
              return pId && currentUserId && pId !== currentUserId;
            })
          : item.participant || item.sellerId || item.studentId;

        const name = otherUser?.name || "المستخدم";
        const avatar = otherUser?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`;
        const lastMsgObj = item.lastMessage;
        const lastMsgText = typeof lastMsgObj === "object" ? lastMsgObj?.content || lastMsgObj?.text : lastMsgObj || "لا توجد رسائل بعد";

        const reqObj = item.requestId || {};
        const topicTitle = reqObj.rawText?.slice(0, 60) || reqObj.parsedData?.subCategory || "طلب بدون عنوان";
        const topicCategory = reqObj.parsedData?.category || "عام";

        return {
          id: item._id || item.id,
          name,
          avatar,
          lastMessage: lastMsgText,
          time: item.updatedAt ? new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
          topicTitle,
          topicCategory,
          messages: [],
        };
      });

      setConversations(mapped);

      if (paramConversationId) {
        setActiveConversationId(paramConversationId);
      } else if (mapped.length > 0 && !activeConversationId && window.innerWidth >= 1280) {
        setActiveConversationId(mapped[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    } finally {
      setIsLoadingChats(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [currentUserId]);

  const fetchMessagesForConv = async (convId: string) => {
    try {
      const res = await axiosInstance.get(`/chat/${convId}/messages?limit=100`);
      const rawData = res.data?.data || res.data || {};
      const msgList = Array.isArray(rawData) ? rawData : rawData.messages || [];

      const mappedMsgs: MessageItem[] = msgList.map((m: any) => {
        const rawSender = m.senderId;
        const senderIdStr = typeof rawSender === "object"
          ? (rawSender?._id || rawSender?.id)?.toString()
          : rawSender?.toString();

        const isMe = Boolean(senderIdStr && currentUserId && senderIdStr === currentUserId) || m.sender === "me";
        return {
          id: m._id || m.id || Math.random().toString(),
          sender: isMe ? "me" : "other",
          content: m.text || m.content || "",
          time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
        };
      });

      setConversations((prev) => {
        const exists = prev.some((c) => c.id === convId);
        if (!exists) {
          return prev;
        }
        return prev.map((c) => (c.id === convId ? { ...c, messages: mappedMsgs } : c));
      });
    } catch (err) {
      console.error("Failed to fetch messages for conversation:", err);
    }
  };

  useEffect(() => {
    if (!activeConversationId) return;

    const socket = getSocket();
    socket.emit("join_room", activeConversationId);

    fetchMessagesForConv(activeConversationId);

    function onNewMessage(data: any) {
      const msgObj = data.message || data;
      const msgConvId = data.conversationId || msgObj.conversationId;
      const rawSender = msgObj.senderId;
      const senderIdStr = typeof rawSender === "object"
        ? (rawSender?._id || rawSender?.id)?.toString()
        : rawSender?.toString();

      const isMe = Boolean(senderIdStr && currentUserId && senderIdStr === currentUserId) || msgObj.sender === "me";

      const newMsg: MessageItem = {
        id: msgObj._id || msgObj.id || Math.random().toString(),
        sender: isMe ? "me" : "other",
        content: msgObj.text || msgObj.content || "",
        time: msgObj.createdAt
          ? new Date(msgObj.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === msgConvId) {
            const exists = c.messages.some((m) => m.id === newMsg.id);
            if (exists) return c;
            return {
              ...c,
              lastMessage: newMsg.content,
              time: newMsg.time,
              messages: [...c.messages, newMsg],
            };
          }
          return c;
        })
      );
    }

    socket.on("new_message", onNewMessage);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.emit("leave_room", activeConversationId);
    };
  }, [activeConversationId, currentUserId]);

  const handleConversationSelect = (id: string) => {
    setActiveConversationId(id);
  };

  const activeConversation = conversations.find(
    (item) => item.id === activeConversationId
  );

  const handleSend = (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !activeConversationId) return;

    getSocket().emit("send_message", {
      conversationId: activeConversationId,
      text: text,
    });

    setDraft("");
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-4.5rem)] md:h-[calc(100vh-5rem)] p-2 sm:p-4 lg:p-6 flex flex-col gap-3 md:gap-4 overflow-hidden">
      {/* Page Title Header (Hidden on mobile when chat is open for maximum chat space) */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0 ${activeConversationId ? "hidden xl:flex" : "flex"}`}>
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl md:rounded-3xl bg-blue-600 dark:bg-[#fff4b7] text-white dark:text-[#060913] shadow-sm shrink-0 font-bold">
            <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <p className="text-xs md:text-sm font-semibold text-blue-600 dark:text-cyan-400">المحادثات المباشرة</p>
            <h1 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white">
              غرفة التواصل المباشر 💬
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${
              socketConnected
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                : "border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${socketConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
            />
            {socketConnected ? "متصل الآن" : "غير متصل"}
          </span>
        </div>
      </div>

      {/* Grid container with mobile toggle visibility */}
      <div className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-4 flex-1 min-h-0 overflow-hidden">
        {/* Conversations List — visible on desktop OR when no active conversation on mobile */}
        <section className={`rounded-[24px] md:rounded-[28px] border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-gradient-to-br dark:from-[#131b2e] dark:to-[#0d1322] p-3.5 md:p-4 shadow-sm flex-col h-full min-h-0 overflow-hidden ${activeConversationId ? "hidden xl:flex" : "flex"}`}>
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
            <div>
              <p className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                قائمة المحادثات
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                جهة الاتصال والمحادثات النشطة
              </p>
            </div>
          </div>

          <div className="relative mt-3 shrink-0">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="ابحث في المحادثات..."
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] py-2.5 ps-10 pe-3 text-xs md:text-sm text-slate-900 dark:text-white outline-none transition focus:border-blue-600 dark:focus:border-[#fff4b7]"
            />
          </div>

          <div className="mt-3 space-y-2 flex-1 overflow-y-auto pe-1">
            {isLoadingChats ? (
              <p className="text-xs font-semibold text-slate-400 text-center py-8 animate-pulse">جاري تحميل المحادثات...</p>
            ) : conversations.length > 0 ? (
              conversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;
                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => handleConversationSelect(conversation.id)}
                    className={`w-full rounded-2xl p-3 text-start transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-50 dark:bg-indigo-950/50 text-blue-900 dark:text-[#fff4b7] shadow-sm border border-blue-200 dark:border-indigo-500/40"
                        : "border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={conversation.avatar}
                        alt={conversation.name}
                        className="h-10 w-10 md:h-11 md:w-11 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h2 className="truncate text-xs md:text-sm font-bold text-slate-900 dark:text-white">
                            {conversation.name}
                          </h2>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0">
                            {conversation.time}
                          </span>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500">لا توجد محادثات سابقة حتى الآن.</p>
              </div>
            )}
          </div>
        </section>

        {/* Active Chat Window — visible on desktop OR when active conversation is selected on mobile */}
        <section className={`flex-col h-full min-h-0 overflow-hidden rounded-[24px] md:rounded-[28px] border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-gradient-to-br dark:from-[#131b2e] dark:to-[#0d1322] shadow-sm ${activeConversationId ? "flex" : "hidden xl:flex"}`}>
          {activeConversation ? (
            <>
              {/* Chat Window Top Bar */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 p-3 md:p-4 shrink-0 bg-slate-50/50 dark:bg-[#060913]/30">
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                  {/* Back button for mobile screens */}
                  <button
                    type="button"
                    onClick={() => setActiveConversationId(null)}
                    className="xl:hidden p-2 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-all shrink-0 cursor-pointer"
                    title="العودة للمحادثات"
                  >
                    <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                  </button>

                  <img
                    src={activeConversation.avatar}
                    alt={activeConversation.name}
                    className="h-9 w-9 md:h-11 md:w-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xs md:text-base font-bold text-slate-900 dark:text-white truncate">
                        {activeConversation.name}
                      </h2>
                      <span className="text-[9px] md:text-[10px] font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full shrink-0">
                        متاح
                      </span>
                    </div>
                    {activeConversation.topicTitle && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[180px] md:max-w-md">
                        الموضوع: "{activeConversation.topicTitle}"
                      </p>
                    )}
                  </div>
                </div>
                {activeConversation.topicCategory && (
                  <span className="text-[10px] md:text-xs font-bold px-2.5 py-1 bg-blue-50 dark:bg-indigo-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-indigo-500/30 rounded-xl uppercase shrink-0 hidden sm:inline-block">
                    {activeConversation.topicCategory}
                  </span>
                )}
              </div>

              {/* Scrollable messages container */}
              <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-6 bg-slate-50/50 dark:bg-[#060913]/40">
                <div className="space-y-3.5 md:space-y-4">
                  {activeConversation.messages?.map((message) => {
                    const isMe = message.sender === "me";
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 py-2.5 md:px-4 md:py-3 text-xs md:text-sm leading-6 shadow-sm ${
                            isMe
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white dark:from-indigo-600 dark:to-violet-600 dark:text-white"
                              : "bg-slate-100 text-slate-900 border border-slate-200 dark:bg-[#060913] dark:text-white dark:border-slate-800"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                          <div className="mt-1 flex items-center justify-end text-[9px] md:text-[10px] opacity-75">
                            <span>{message.time}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSend}
                className="border-t border-slate-100 dark:border-slate-800/80 p-2.5 md:p-4 shrink-0 bg-white dark:bg-[#131b2e]"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    className="min-w-0 flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] px-3.5 py-2.5 md:py-3 text-xs md:text-sm text-slate-900 dark:text-white outline-none transition focus:border-blue-600 dark:focus:border-[#fff4b7]"
                    placeholder="اكتب رسالتك هنا..."
                  />
                  <button
                    type="submit"
                    className="inline-flex h-10 md:h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-amber-300 px-4 md:px-5 text-xs md:text-sm font-bold text-white dark:text-[#060913] transition-all shrink-0 shadow-sm cursor-pointer"
                  >
                    <Send className="h-4 w-4 me-1.5 rtl:rotate-180" />
                    <span>إرسال</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center">
              <MessageCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400">اختر محادثة من القائمة للبدء أو إرسال رسالة جديدة.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
