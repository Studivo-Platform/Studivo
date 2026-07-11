import { useQuery } from "@tanstack/react-query";
import { getSellerRequestsAction } from "../APIs/getSellerRequests.action";

export function useGetSellerRequests() {
  return useQuery({
    queryKey: ["seller_matching_requests"],
    queryFn: getSellerRequestsAction,
  });
}