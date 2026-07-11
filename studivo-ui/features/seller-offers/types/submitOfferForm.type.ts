export type ProductCondition = "new" | "used" | "refurbished";

export interface OfferFormState {
  offerTitle: string;
  price: number;
  deliveryTime: string;
  condition: ProductCondition;
  description: string;
  images: (string | File)[];
  pickupLocation: string;
  deliveryArea: string;
}