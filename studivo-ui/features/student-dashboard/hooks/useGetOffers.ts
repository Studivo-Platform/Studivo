import { useQuery } from "@tanstack/react-query";
import { getOffersApi } from "../APIs/getOffers.api";

export function useGetOffers() {
  return useQuery({ queryKey: ["offers"], queryFn: getOffersApi });
}