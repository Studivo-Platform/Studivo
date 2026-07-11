import { useQuery } from "@tanstack/react-query";
import { getBuyerRequestsForSellerApi } from "../APIs/getSearchRequests.api";

export function useGetBuyerRequestsForSeller(search: string, category: string) {
  return useQuery({
    queryKey: ["buyer_requests_for_seller", search.trim(), category],
    queryFn: () => getBuyerRequestsForSellerApi(search.trim(), category),
    staleTime: 1000 * 60 * 5,
  });
}