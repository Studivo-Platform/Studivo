import axiosInstance from "@/shared/APIs/axiosInstance";
import { OfferFormState } from "../types/submitOfferForm.type";

export async function submitOfferAction(
  requestId: string,
  data: OfferFormState,
  offerId?: string | null
): Promise<{ success: boolean }> {
  let combinedDescription = data.offerTitle
    ? `${data.offerTitle} — ${data.description}`
    : data.description;

  if (combinedDescription.length < 20) {
    combinedDescription = combinedDescription + ` (Condition: ${data.condition || "good"})`;
  }
  if (combinedDescription.length < 20) {
    combinedDescription = combinedDescription.padEnd(20, ".");
  }

  const formData = new FormData();
  formData.append("requestId", requestId);
  formData.append("price", String(data.price));
  formData.append("description", combinedDescription);

  const delivery = data.deliveryTime || data.deliveryArea;
  if (delivery) {
    formData.append("deliveryNote", delivery);
  }

  const existingImages: string[] = [];
  data.images.forEach((img) => {
    if (typeof img === "string") {
      existingImages.push(img);
    } else if (img) {
      const fileObj = img as File;
      formData.append("images", fileObj, fileObj.name || "offer.png");
    }
  });

  if (existingImages.length > 0) {
    formData.append("existingImages", JSON.stringify(existingImages));
  }

  let response;
  if (offerId) {
    response = await axiosInstance.patch(`/offers/${offerId}`, formData);
  } else {
    response = await axiosInstance.post("/offers", formData);
  }

  return response.data;
}