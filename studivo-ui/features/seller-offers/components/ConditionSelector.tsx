"use client";

import { ProductCondition } from "../types/submitOfferForm.type";

export function ConditionSelector({ value, onChange }: { value: ProductCondition; onChange: (c: ProductCondition) => void }) {
  const options: { id: ProductCondition; label: string }[] = [
    { id: "new", label: "جديد (New)" },
    { id: "used", label: "مستعمل (Used)" },
    { id: "refurbished", label: "مجدد (Refurbished)" },
  ];

  return (
    <div className="space-y-2">
      <label className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">حالة المنتج</label>
      <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-[#060913] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        {options.map((option) => (
          <button key={option.id} type="button" onClick={() => onChange(option.id)}
            className={`py-2.5 px-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer ${value === option.id ? "bg-white dark:bg-[#131b2e] text-blue-600 dark:text-[#fff4b7] border border-slate-200 dark:border-slate-700 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}