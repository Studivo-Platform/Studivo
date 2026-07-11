import { QuickActionItem } from "../types/quickActionItem.type";

export const quickActionsConfig: QuickActionItem[] = [
  { labelKey: "new_request", icon: "Plus", href: "/dashboard/student/requests/new", color: "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 border-gray-200 dark:border-gray-800 hover:border-indigo-400" },
  { labelKey: "search", icon: "Search", href: "/dashboard/student/search", color: "text-amber-600 dark:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 border-gray-200 dark:border-gray-800 hover:border-amber-400" },
  { labelKey: "messages", icon: "MessageSquare", href: "/dashboard/chat", color: "text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 border-gray-200 dark:border-gray-800 hover:border-rose-400" },
  { labelKey: "notifications", icon: "Bell", href: "/dashboard/student/requests", color: "text-amber-600 dark:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 border-gray-200 dark:border-gray-800 hover:border-amber-400" },
];