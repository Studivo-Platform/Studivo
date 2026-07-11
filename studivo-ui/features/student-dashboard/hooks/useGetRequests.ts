
import { useQuery } from "@tanstack/react-query";
import { getRequestsApi } from "../APIs/getRequests.api";

export function useGetRequests() {
  return useQuery({ queryKey: ["requests"], queryFn: getRequestsApi });
}