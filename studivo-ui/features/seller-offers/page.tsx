"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import Header from "@/shared/components/header";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { SellerOffersStatCard } from "./components/SellerOffersStatCard";
import { SubmittedOfferCard } from "./components/SubmittedOfferCard";
import { useGetSellerOffersStats } from "./hooks/useGetSellerOffersStats";
import { useGetSubmittedOffers } from "./hooks/useGetSubmittedOffers";

export default function SellerOffersPage() {
  const { t } = useTranslation();
  const { data: stats, isLoading: isLoadingStats } = useGetSellerOffersStats();
  const { data: offers, isLoading: isLoadingOffers } = useGetSubmittedOffers();

  if (isLoadingStats || isLoadingOffers) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sm font-semibold text-gray-400 animate-pulse">Loading Your Offers...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Header
          title={t({ section: "header_seller_offers", key: "title" })}
          description={t({ section: "header_seller_offers", key: "description" })}
        />
        <Link href="/dashboard/seller/search" className="flex items-center gap-1.5 px-5 py-2.5 text-xs md:text-sm font-black text-white dark:text-[#060913] bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-amber-300 rounded-2xl shadow-md hover:shadow-lg transition self-start sm:self-center shrink-0 cursor-pointer">
          <Plus className="w-4 h-4" /><span>البحث عن طلبات لتقديم عرض</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {Array.isArray(stats) ? stats.map((stat: any) => <SellerOffersStatCard key={stat.id} stat={stat} />) : null}
      </div>

      <div className="space-y-3.5">
        {Array.isArray(offers) ? offers.map((item: any, index: number) => <SubmittedOfferCard key={item._id || item.id || index} item={item} />) : null}
      </div>
    </div>
  );
}