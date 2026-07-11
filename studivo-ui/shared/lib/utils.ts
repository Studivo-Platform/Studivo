import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// shadcn/ui cn helper — merges Tailwind classes intelligently
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price in EGP
export const formatPrice = (price: number, locale: string = 'ar') => {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    style:    'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(price);
};

// Format relative time (e.g. "منذ ٣ ساعات")
export const formatRelativeTime = (dateStr: string, locale: string = 'ar') => {
  const rtf = new Intl.RelativeTimeFormat(locale === 'ar' ? 'ar' : 'en', { numeric: 'auto' });
  const diff = (new Date(dateStr).getTime() - Date.now()) / 1000;
  if (Math.abs(diff) < 60)     return rtf.format(Math.round(diff), 'second');
  if (Math.abs(diff) < 3600)   return rtf.format(Math.round(diff / 60), 'minute');
  if (Math.abs(diff) < 86400)  return rtf.format(Math.round(diff / 3600), 'hour');
  return rtf.format(Math.round(diff / 86400), 'day');
};

// Source badge colors for marketplace results
export const SOURCE_COLORS: Record<string, string> = {
  amazon: '#FF9900', noon: '#FEEE00', olx: '#002F5F',
  aqar: '#00B140', btech: '#E30613', local: '#0F2C59',
};
