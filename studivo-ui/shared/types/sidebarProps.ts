// shared/types/sidebarProps.ts

import * as Icons from "lucide-react";

export type SidebarLink = {
  labelKey: string;
  icon: keyof typeof Icons;
  href: string;
  badgeKey?: "messages" | "notifications" | "my_requests";
};

export type SidebarSection = {
  titleKey: string;
  links: SidebarLink[];
};