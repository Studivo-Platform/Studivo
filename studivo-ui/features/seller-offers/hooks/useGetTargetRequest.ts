import { useQuery } from "@tanstack/react-query";
import { getTargetRequestAction } from "../APIs/getTargetRequest.action";

export function useGetTargetRequest(requestId: string) {
  return useQuery({
    queryKey: ["target_request", requestId],
    queryFn: () => getTargetRequestAction(requestId),
    enabled: !!requestId,
  });
}