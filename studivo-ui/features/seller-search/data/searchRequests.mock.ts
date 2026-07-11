import { BuyerRequestForSeller } from "../types/search.type";

export const mockBuyerRequests: BuyerRequestForSeller[] = [
  {
    _id: "req_1",
    userId: { _id: "u1", name: "Ahmed" },
    rawText: "I need a laptop for programming under 8000 EGP.",
    parsedData: { category: "electronics", subCategory: "Laptop", budget: { min: 6000, max: 8000, currency: "EGP" }, location: "Cairo" },
    status: "open",
    viewCount: 1,
    createdAt: "2026-06-25T12:34:56.789Z",
    updatedAt: "2026-06-25T12:34:56.789Z",
  },
  {
    _id: "req_2",
    userId: { _id: "u2", name: "Sara" },
    rawText: "Looking for used textbooks for 3rd year mechanical engineering.",
    parsedData: { category: "books", subCategory: "Textbooks", budget: { min: 300, max: 600, currency: "EGP" }, location: "Giza" },
    status: "matched",
    viewCount: 4,
    createdAt: "2026-06-24T10:15:00.000Z",
    updatedAt: "2026-06-24T10:15:00.000Z",
  },
];