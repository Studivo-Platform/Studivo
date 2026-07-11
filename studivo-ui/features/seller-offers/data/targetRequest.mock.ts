import { TargetRequestSummary } from "../types/targetRequest.type";

export const mockTargetRequest: TargetRequestSummary = {
  _id: "req_seller_1",
  userId: { _id: "u1", name: "Layla Ahmed" },
  rawText: "Gaming Laptop under 15000 EGP",
  parsedData: {
    category: "electronics",
    subCategory: "Gaming Laptop",
    budget: { min: 10000, max: 15000, currency: "EGP" },
    location: "Cairo",
  },
  status: "open",
  viewCount: 2,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};