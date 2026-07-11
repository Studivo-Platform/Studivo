import { WidgetApiData } from "../types/widgetItem.type";

export const mockWidgets: WidgetApiData[] = [
  { id: "active_requests", value: "3", change: "+1" },
  { id: "closed_requests", value: "9", change: "+2" },
  { id: "new_offers", value: "8", change: "+5" },
  { id: "unread_messages", value: "3", change: "" },
];