"use client";

import { Tag } from "lucide-react";
import { OfferFormState } from "../types/submitOfferForm.type";
import { ConditionSelector } from "./ConditionSelector";
import { ImageUploader } from "./ImageUploader";

export function OfferDetailsFields({ form, onChange }: { form: OfferFormState; onChange: (field: keyof OfferFormState, value: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm md:text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
        <Tag className="w-4 h-4 text-slate-400" /><span>Offer Details</span>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">Offer Title</label>
        <input type="text" required value={form.offerTitle} onChange={(e) => onChange("offerTitle", e.target.value)}
          placeholder="e.g. Dell G15 Gaming Laptop, RTX 3050"
          className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-xs md:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-indigo-400 transition-all font-medium" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">Price (EGP)</label>
          <input type="number" required value={form.price || ""} onChange={(e) => onChange("price", Number(e.target.value))}
            placeholder="0"
            className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-xs md:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-indigo-400 transition-all font-medium" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">Delivery Time</label>
          <input type="text" required value={form.deliveryTime} onChange={(e) => onChange("deliveryTime", e.target.value)}
            placeholder="e.g. 2 days"
            className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-xs md:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-indigo-400 transition-all font-medium" />
        </div>
      </div>
      <ConditionSelector value={form.condition} onChange={(c) => onChange("condition", c)} />
      <div className="space-y-1.5">
        <label className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
        <textarea required rows={4} value={form.description} onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe your product in detail..."
          className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-xs md:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-indigo-400 transition-all resize-none font-medium" />
      </div>
      <ImageUploader images={form.images} onChange={(imgs) => onChange("images", imgs)} />
    </div>
  );
}