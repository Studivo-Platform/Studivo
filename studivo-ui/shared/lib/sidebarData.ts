// shared/lib/sidebarData.ts

import { SidebarSection } from "../types/sidebarProps";

export const sidebarSections: SidebarSection[] = [
  {
    titleKey: "overview",
    links: [
      { labelKey: "dashboard", icon: "LayoutDashboard", href: "/dashboard/student" },
      { labelKey: "search", icon: "Search", href: "/dashboard/student/search" },
    ],
  },
  {
    titleKey: "requests",
    links: [
      { labelKey: "my_requests", icon: "FileText", href: "/dashboard/student/requests", badgeKey: "my_requests" },
      { labelKey: "create_request", icon: "PlusCircle", href: "/dashboard/student/requests/new" }
    ]
  },
  {
    titleKey: "account",
    links: [
      {
        labelKey: "messages",
        icon: "MessageSquare",
        href: "/dashboard/chat",
        badgeKey: "messages",
      },
    ],
  },
];
