"use client";

import Link from "next/link";
import { Tag, User, Wallet, ArrowUpRight } from "lucide-react";
import { BuyerSearchOfferItem } from "../types/buyerSearch.type";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/50",
  accepted: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50",
  rejected: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/50",
};

export function BuyerOfferCard({ item }: { item: BuyerSearchOfferItem }) {
  const hasValidImage = item.imageURL && !item.imageURL.includes("placeholder") && item.imageURL.trim() !== "";

  return (
    <Link href={`/dashboard/offers/${item._id}`} className="block p-5 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
            {hasValidImage ? (
              <img src={item.imageURL} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <Tag className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            )}
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors truncate">{item.title}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${statusStyles[item.status]}`}>{item.status}</span>
            </div>
            <p className="text-xs md:text-sm text-gray-500 dark:text-zinc-400 line-clamp-2">{item.description}</p>
          </div>
        </div>
        <div className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 text-gray-400 group-hover:text-indigo-600 transition-colors shrink-0">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/60 text-xs font-medium">
        <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
          <Wallet className="h-4 w-4 shrink-0" />{item.price.toLocaleString()} EGP
        </div>
        <div className="flex items-center gap-1.5 justify-end text-gray-500 truncate">
          <User className="h-3.5 w-3.5 shrink-0 text-gray-400" />{item.seller}
        </div>
      </div>
    </Link>
  );
}