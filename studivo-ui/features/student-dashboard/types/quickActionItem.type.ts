import * as Icons from "lucide-react";

export type QuickActionItem = {
  labelKey: string;
  icon: keyof typeof Icons;
  href: string;
  color: string;
};