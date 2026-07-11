"use client";

import { useTranslation } from "@/shared/hooks/useTranslation";
import { GraduationCap, DollarSign, ShoppingBag, Users, ShieldCheck, Activity } from "lucide-react";

const featuresConfig = [
  {
    id: "bilingual",
    icon: (

      <GraduationCap />
    ),
  },
  {
    id: "price_estimation",
    icon: (

      <DollarSign />

    ),
  },
  {
    id: "seller_matching",
    icon: (

      <Users />
    ),
  },
  {
    id: "integration",
    icon: (

      <ShoppingBag />
    ),
  },
  {
    id: "fraud_detection",
    icon: (


      <ShieldCheck />
    ),
  },
  {
    id: "analytics",
    icon: (

      <Activity />
    ),
  },
];

export default function AiFeaturesSection() {
  const { t } = useTranslation();

  return (
    <section id="ai-features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <p className="text-xs md:text-sm font-extrabold text-blue-600 dark:text-[#fff4b7] uppercase tracking-widest">
            {t({ section: "ai_features_section", key: "badge" })}
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t({ section: "ai_features_section", key: "title" })}
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-medium">
            {t({ section: "ai_features_section", key: "description" })}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresConfig.map(({ id, icon }) => (
            <div
              key={id}
              className="bg-white dark:bg-gradient-to-br dark:from-[#131b2e] dark:to-[#0d1322] rounded-2xl p-6 md:p-7 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-blue-500 dark:hover:border-indigo-500/60 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-indigo-950/50 border border-blue-100 dark:border-indigo-500/30 text-blue-600 dark:text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {icon}
              </div>
              <h3 className="font-bold text-base md:text-lg text-slate-900 dark:text-white mb-2">
                {t({ section: "ai_features_section", key: `${id}_title` })}
              </h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {t({ section: "ai_features_section", key: `${id}_desc` })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}