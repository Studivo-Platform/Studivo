"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

function Faqsection() {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const faqData = [
    {
      id: 1,
      question: t({ section: "faq_section", key: "q1" }),
      answer: t({ section: "faq_section", key: "a1" }),
    },
    {
      id: 2,
      question: t({ section: "faq_section", key: "q2" }),
      answer: t({ section: "faq_section", key: "a2" }),
    },
    {
      id: 3,
      question: t({ section: "faq_section", key: "q3" }),
      answer: t({ section: "faq_section", key: "a3" }),
    },
    {
      id: 4,
      question: t({ section: "faq_section", key: "q4" }),
      answer: t({ section: "faq_section", key: "a4" }),
    },
    {
      id: 5,
      question: t({ section: "faq_section", key: "q5" }),
      answer: t({ section: "faq_section", key: "a5" }),
    },
  ];

  return (
    <section id="faq" className="w-full py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Header */}
        <div className="mb-14 space-y-3">
          <p className="uppercase font-extrabold text-blue-600 dark:text-[#fff4b7] text-xs md:text-sm tracking-widest">
            {t({ section: "faq_section", key: "badge" })}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t({ section: "faq_section", key: "title" })}
          </h2>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 text-start">
          {faqData.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div 
                key={faq.id} 
                className="bg-white dark:bg-gradient-to-br dark:from-[#131b2e] dark:to-[#0d1322] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all overflow-hidden"
              >
                {/* FAQ Header */}
                <div 
                  className="flex items-center justify-between gap-4 p-5 md:p-6 cursor-pointer select-none"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg leading-6 flex-1">
                    {faq.question}
                  </h3>
                  
                  <div className={`w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-blue-50 dark:bg-indigo-950/60" : ""}`}>
                    <ChevronDown
                      className={`w-4 h-4 transition-colors ${
                        isOpen ? "text-blue-600 dark:text-[#fff4b7]" : "text-slate-400"
                      }`}
                    />
                  </div>
                </div>

                {/* FAQ Body */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out px-5 md:px-6 ${
                    isOpen 
                      ? "grid-rows-[1fr] opacity-100 pb-6" 
                      : "grid-rows-[0fr] opacity-0 pb-0" 
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-xs md:text-sm leading-relaxed pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      {faq.answer}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Faqsection;