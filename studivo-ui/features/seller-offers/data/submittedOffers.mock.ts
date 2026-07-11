import { SellerOfferItem } from "../types/submittedOffers.type";

export const mockSubmittedOffers: SellerOfferItem[] = [
  {
    _id: "off_1",
    requestId: {
      _id: "req_101",
      rawText: "Laptop for Software Development",
      status: "open",
      parsedData: { category: "electronics" },
    },
    sellerId: "s1",
    price: 7200,
    description: "Dell Latitude 5490",
    deliveryNote: "Cairo - Nasr City",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "off_2",
    requestId: {
      _id: "req_102",
      rawText: "Laptop for Software Development",
      status: "open",
      parsedData: { category: "electronics" },
    },
    sellerId: "s1",
    price: 7600,
    description: "Lenovo ThinkPad T480",
    deliveryNote: "Cairo - Maadi",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];