import { useQuery } from "@tanstack/react-query";
import { getSellerOffersStatsAction } from "../APIs/getSellerOffersStats.action";

export function useGetSellerOffersStats() {
  return useQuery({
    queryKey: ["seller_offers_stats"],
    queryFn: getSellerOffersStatsAction,
    staleTime: 1000 * 60 * 5,
  });
}