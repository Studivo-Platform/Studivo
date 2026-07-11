"use client";

import { useState, useMemo } from "react";
import { X, Search, Filter, Layers } from "lucide-react";
import { RequestCard } from "./RequestCard";
import { RecentOffersCard } from "./RecentOffersCard";

interface ViewAllModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: "requests" | "offers";
  items: any[];
}

export function ViewAllModal({ isOpen, onClose, title, type, items }: ViewAllModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract unique categories from items
  const categories = useMemo(() => {
    const set = new Set<string>();
    items?.forEach((item) => {
      const cat = item.category || item.parsedData?.category || (type === "offers" ? "General" : null);
      if (cat) set.add(cat.toLowerCase());
    });
    return ["all", ...Array.from(set)];
  }, [items, type]);

  // Filter items by category & search query
  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter((item) => {
      const cat = (item.category || item.parsedData?.category || (type === "offers" ? "General" : "")).toLowerCase();
      const matchesCategory = selectedCategory === "all" || cat === selectedCategory;

      const itemTitle = item.title || item.rawText || item.description || "";
      const matchesSearch = !searchQuery.trim() || itemTitle.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery, type]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-zinc-950 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                إجمالي العناصر: <span className="font-bold text-indigo-600 dark:text-indigo-400">{filteredItems.length}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 space-y-3 border-b border-gray-100 dark:border-gray-800/60 bg-white dark:bg-zinc-950">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث داخل العناصر..."
              className="w-full ps-10 pe-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/50 focus:outline-none focus:border-indigo-500 dark:text-white transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 ms-1" />
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800"
                  }`}
                >
                  {cat === "all" ? "الكل (All)" : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Items Scrollable List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60 p-2">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) =>
              type === "requests" ? (
                <RequestCard key={item._id || item.id || index} item={item} />
              ) : (
                <RecentOffersCard key={item._id || item.id || index} offer={item} />
              )
            )
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <p className="text-sm font-bold text-gray-400">لا توجد عناصر مطابقة لهذا القسم أو البحث.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-zinc-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 text-xs font-bold hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
}
