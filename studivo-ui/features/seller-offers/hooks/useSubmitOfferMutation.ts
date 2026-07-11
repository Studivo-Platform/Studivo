import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitOfferAction } from "../APIs/submitOffer.action";
import { OfferFormState } from "../types/submitOfferForm.type";

export function useSubmitOfferMutation(requestId: string, offerId?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OfferFormState) => submitOfferAction(requestId, data, offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller_submitted_offers"] });
      queryClient.invalidateQueries({ queryKey: ["seller_offers_stats"] });
      queryClient.invalidateQueries({ queryKey: ["buyer-request", requestId] });
    },
  });
}