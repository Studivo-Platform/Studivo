import { useQuery } from "@tanstack/react-query";
import { getBuyerSearchApi } from "../APIs/getBuyerSearch.api";

export function useGetBuyerSearch(search: string, category: string) {
  return useQuery({
    queryKey: ["buyer_search_offers", search, category],
    queryFn: () => getBuyerSearchApi(search, category),
  });
}