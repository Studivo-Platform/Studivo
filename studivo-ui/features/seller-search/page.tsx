"use client";

import { useState } from "react";
import Header from "@/shared/components/header";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { SearchInput } from "@/shared/components/SearchInput";
import { SearchFilters } from "@/shared/components/SearchFilters";
import { SellerRequestCard } from "@/features/seller-dashboard/components/SellerRequestCard";
import { useGetBuyerRequestsForSeller } from "./hooks/useGetSearchRequests";

const categories = [
  { key: "all", translationKey: "badge" },
  { key: "electronics", translationKey: "electronics" },
  { key: "books", translationKey: "books" },
  { key: "housing", translationKey: "housing" },
  { key: "services", translationKey: "services" },
  { key: "transport", translationKey: "transport" },
  { key: "food", translationKey: "food" },
  { key: "other", translationKey: "other" },
];

export default function SellerSearchPage() {
  const { t, lang } = useTranslation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const { data: requests, isLoading, isError } = useGetBuyerRequestsForSeller(query, category);

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-4xl mx-auto">
      <Header
        title={t({ section: "header_search", key: "title" })}
        description={t({ section: "header_search", key: "description" })}
      />
      <div className="space-y-4">
        <SearchInput value={query} onChange={setQuery} />
        <SearchFilters active={category} onChange={setCategory} categories={categories} />
      </div>
      <div className="space-y-3">
        {isLoading && <p className="text-center p-6 text-gray-400 text-sm animate-pulse">{lang === "ar" ? "جاري جلب طلبات السوق..." : "Loading marketplace requests..."}</p>}
        {isError && <p className="text-center p-6 text-red-400 text-sm border border-red-900/20 bg-red-500/5 rounded-2xl">{lang === "ar" ? "عفواً، حدث عطل. يرجى المحاولة لاحقاً." : "Something went wrong. Please try again."}</p>}
        {!isLoading && !isError && requests && requests.length > 0
          ? requests.map((item: any) => <SellerRequestCard key={item._id} item={item} />)
          : !isLoading && !isError && <p className="text-center p-8 text-gray-400 text-sm border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">{lang === "ar" ? "لا توجد طلبات تطابق فلاتر البحث حالياً." : "No requests match your current filters."}</p>
        }
      </div>
    </div>
  );
}