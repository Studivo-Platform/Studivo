export type BuyerSearchOfferItem = {
  _id: string;
  requestId: string;
  sellerId: string;
  imageURL: string;
  title: string;
  description: string;
  seller: string;
  status: "pending" | "accepted" | "rejected";
  price: number;
  category: string;
  createdAt: string;
};