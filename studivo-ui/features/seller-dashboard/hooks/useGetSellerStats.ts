import { useQuery } from "@tanstack/react-query";
import { getSellerStatsAction } from "../APIs/getSellerStats.action";

export function useGetSellerStats() {
  return useQuery({
    queryKey: ["seller_dashboard_stats"],
    queryFn: getSellerStatsAction,
    staleTime: 1000 * 60 * 5,
  });
}