"use client";

import { MapPin } from "lucide-react";
import { OfferFormState } from "../types/submitOfferForm.type";

export function LocationFields({ form, onChange }: { form: OfferFormState; onChange: (field: keyof OfferFormState, value: any) => void }) {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 text-sm md:text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
        <MapPin className="w-4 h-4 text-slate-400" /><span>Location</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">Pickup Location</label>
          <input type="text" required value={form.pickupLocation} onChange={(e) => onChange("pickupLocation", e.target.value)}
            placeholder="e.g. Cairo - Nasr City"
            className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-xs md:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-indigo-400 transition-all font-medium" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300">Delivery Area</label>
          <input type="text" required value={form.deliveryArea} onChange={(e) => onChange("deliveryArea", e.target.value)}
            placeholder="e.g. All Cairo"
            className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-xs md:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-indigo-400 transition-all font-medium" />
        </div>
      </div>
    </div>
  );
}