import { WidgetConfigItem } from "../types/widgetItem.type";

export const widgetsConfig: WidgetConfigItem[] = [
  { id: "active_requests", labelKey: "active_requests", icon: "FileText", color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30", href: "/dashboard/student/requests" },
  { id: "closed_requests", labelKey: "closed_requests", icon: "CheckCircle2", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30", href: "/dashboard/student/requests" },
  { id: "new_offers", labelKey: "new_offers", icon: "Tag", color: "text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30", href: "/dashboard/student/requests" },
  { id: "unread_messages", labelKey: "unread_messages", icon: "MessageSquare", color: "text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30", href: "/dashboard/chat" },
];