import { Request } from "../types/Request.type";

export const mockRequests: Request[] = [
  { _id: "1", buyerID: "user_id_1", title: "Laptop for Software Development", category: "Electronics", budget: { min: 6000, max: 8000, currency: "EGP" }, location: "Cairo", status: "open", offersCount: 8, createdAt: "2026-06-25T12:00:00Z" },
  { _id: "2", buyerID: "user_id_12", title: "Mechanical Engineering Textbooks", category: "Books", budget: { min: 300, max: 600, currency: "EGP" }, location: "Giza", status: "matched", offersCount: 5, createdAt: "2026-06-25T12:00:00Z" },
  { _id: "3", buyerID: "user_id_123", title: "Studio Apartment near Campus", category: "Housing", budget: { min: 3000, max: 4500, currency: "EGP" }, location: "Cairo", status: "closed", offersCount: 12, createdAt: "2026-06-25T12:00:00Z" },
  { _id: "4", buyerID: "user_id_1234", title: "Office Desk and Chair", category: "Furniture", budget: { min: 800, max: 2000, currency: "EGP" }, location: "Alexandria", status: "open", offersCount: 3, createdAt: "2026-06-25T12:00:00Z" },
];