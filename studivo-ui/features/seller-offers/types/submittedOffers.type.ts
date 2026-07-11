export type OfferStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export type SellerOfferItem = {
  _id: string;
  requestId: {
    _id: string;
    rawText: string;
    status: string;
    parsedData?: {
      category?: string;
      budget?: { min: number | null; max: number | null; currency?: string };
    };
  } | string;
  sellerId: string;
  price: number;
  description: string;
  deliveryNote?: string;
  images?: { url: string; publicId: string }[];
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
};