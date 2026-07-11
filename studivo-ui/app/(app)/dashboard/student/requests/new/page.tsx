"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/shared/APIs/axiosInstance";

export default function NewRequestPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t, lang } = useTranslation();
  const strings = t({ section: "requests", key: "new_page" }) as Record<
    string,
    string
  >;

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestionClick = (suggestion: string) => {
    setDescription(suggestion);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = description.trim();

    if (text.length < 10) {
      setError(
        lang === "ar"
          ? "يجب أن يتكون وصف الطلب من 10 حروف على الأقل ليتعرف عليه الذكاء الاصطناعي."
          : "Request description must be at least 10 characters."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axiosInstance.post("/requests", {
        rawText: text,
      });

      await queryClient.invalidateQueries({ queryKey: ["requests"] });
      await queryClient.invalidateQueries({ queryKey: ["widgets"] });

      router.push("/dashboard/student/requests");
    } catch (err: any) {
      console.error("Error creating request:", err);
      const msg =
        err.response?.data?.message ||
        (lang === "ar"
          ? "حدث خطأ أثناء إضافة الطلب. يرجى المحاولة مرة أخرى."
          : "Could not create request. Please try again.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-transparent px-4 py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto"
    >
      <div>
        {/* Header Breadcrumb & Back Button */}
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-zinc-950 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              {strings.breadcrumb || "طلباتي / طلب جديد"}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              {strings.title || "انشر طلبك بالذكاء الاصطناعي"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              {strings.subtitle || "اكتب ما تحتاجه بلغتك البسيطة وسيساعدك الذكاء الاصطناعي في تحليل الطلب وإيجاد أفضل العروض."}
            </p>
          </div>
          <Link
            href="/dashboard/student/requests"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {strings.back_button || "العودة للطلبات"}
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
          <section className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-zinc-950 sm:p-8">
            <div className="rounded-3xl border border-gray-200 bg-gray-50/60 p-6 dark:border-gray-800 dark:bg-zinc-900/60">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    {strings.prompt_title || "صف ما تحتاجه بالتفصيل"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {strings.prompt_subtitle || "اكتب المواصفات، الميزانية المتوقعة، والمنطقة للتعرف عليها تلقائياً."}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm dark:bg-zinc-900 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {strings.ai_ready || "مُحرك AI جاهز"}
                </div>
              </div>

              <textarea
                name="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (error) setError(null);
                }}
                rows={6}
                placeholder={strings.suggestion_1 || "مثال: محتاج لاب توب مستعمل للبرمجة بميزانية 15000 جنيه في القاهرة..."}
                className="mt-4 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-800 dark:bg-zinc-900 dark:text-white dark:focus:ring-indigo-950 leading-relaxed"
              />

              {error && (
                <div className="mt-3 p-3 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40 text-xs font-bold">
                  {error}
                </div>
              )}

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
                  >
                    <span>📎</span>
                    إرفاق صورة
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
                  >
                    <span>🎙️</span>
                    تسجيل صوتي
                  </button>
                </div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {description.length} / 500
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {strings.suggestions_title || "نماذج واقتراحات سريعة"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    strings.suggestion_1 || "لاب توب للبرمجة وتطوير التطبيقات بميزانية 15,000 ج.م",
                    strings.suggestion_2 || "كتب ومرجع هندسة ميكانيكية بحالة جيدة في الجيزة",
                    strings.suggestion_3 || "شقة استوديو قريبة من الجامعة في القاهرة بميزانية 4,000 ج.م",
                    strings.suggestion_4 || "مكتب ورسي للدراسة بحالة ممتازة في الإسكندرية",
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
              <Link
                href="/dashboard/student/requests"
                className="rounded-2xl border border-gray-200 bg-white px-6 py-3 text-center text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
              >
                {strings.cancel_button || "إلغاء"}
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                {loading ? (lang === "ar" ? "جاري التحليل والنشر..." : "Posting Request...") : (strings.submit_button || "نشر الطلب الآن")}
              </button>
            </div>
          </section>

          <aside className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-zinc-950 sm:p-8 self-start">
            <div className="rounded-2xl bg-gray-50 p-5 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {strings.help_title || "💡 كيف تعمل المنصة؟"}
              </h3>
              <ul className="mt-3 space-y-2.5 text-xs text-gray-600 dark:text-gray-300 font-medium">
                {[
                  strings.help_item_specific || "اكتب مواصفات منتجك أو خدمتك بوضوح.",
                  strings.help_item_budget || "حدد نطاق السعر المتوقع لمساعدة الذكاء الاصطناعي.",
                  strings.help_item_brands || "اذكر الماركات أو النماذج المفضلة إن وجدت.",
                  strings.help_item_location || "حدد مدينتك لتلقي عروض قريبة منك.",
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <span className="mt-1.5 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-5 text-white shadow-sm">
              <h3 className="text-base font-bold">
                {strings.ai_confidence_title || "⚡ تحليل ذكي فوري"}
              </h3>
              <p className="mt-2 text-xs leading-5 text-indigo-100">
                {strings.ai_confidence_desc || "يقوم محرك Studivo AI بتحليل طلبك وإشعارات البائعين والمتاجر المطابقة فوراً."}
              </p>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
