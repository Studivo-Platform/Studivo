import { useState } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { usePathname } from "next/navigation";

export function useSidbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const toggelSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  return { toggelSidebar, closeSidebar, isOpen, pathname, t };
}