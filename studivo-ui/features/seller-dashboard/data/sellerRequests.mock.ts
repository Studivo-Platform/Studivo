import { SellerMatchingRequestItem } from "../types/sellerRequests.type";

export const mockSellerMatchingRequests: SellerMatchingRequestItem[] = [
  {
    _id: "req_seller_1",
    userId: { _id: "u1", name: "Layla Ahmed" },
    rawText: "Need a gaming laptop for design work. Prefer RTX series GPU.",
    parsedData: {
      category: "electronics",
      subCategory: "Gaming Laptop",
      budget: { min: 10000, max: 15000, currency: "EGP" },
      location: "Cairo",
    },
    status: "open",
    viewCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "req_seller_2",
    userId: { _id: "u2", name: "Ahmed Khaled" },
    rawText: "Looking for core textbooks for third year mechanical engineering.",
    parsedData: {
      category: "books",
      subCategory: "Mechanical Engineering Textbooks",
      budget: { min: 300, max: 600, currency: "EGP" },
      location: "Giza",
    },
    status: "open",
    viewCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];