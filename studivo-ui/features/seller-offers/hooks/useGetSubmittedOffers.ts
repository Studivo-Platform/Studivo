import { useQuery } from "@tanstack/react-query";
import { getSubmittedOffersAction } from "../APIs/getSubmittedOffers.action";

export function useGetSubmittedOffers() {
  return useQuery({
    queryKey: ["seller_submitted_offers"],
    queryFn: getSubmittedOffersAction,
  });
}