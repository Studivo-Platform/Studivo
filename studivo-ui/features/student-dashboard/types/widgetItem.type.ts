import * as Icons from "lucide-react";

export type WidgetConfigItem = {
  id: string;
  labelKey: string;
  icon: keyof typeof Icons;
  color: string;
  href: string;
};

export type WidgetApiData = {
  id: string;
  value: string;
  change: string;
};