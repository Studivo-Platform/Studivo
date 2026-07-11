import { useQuery } from "@tanstack/react-query";
import { getWidgetsApi } from "../APIs/getWidgets.api";

export function useGetWidgets() {
  return useQuery({ queryKey: ["dashboard_widgets_stats"], queryFn: getWidgetsApi });
}