import { RecentOffers } from "../types/recentOffers";

export const mockOffers: RecentOffers[] = [
  { _id: "1", requestId: "req_12345", sellerId: "seller_id_123", imageURL: "", title: "Laptop for Software Development", description: "لابتوب ديل بمواصفات ممتازة", seller: "John Doe", status: "accepted", price: 3000 },
  { _id: "2", requestId: "req_12345", sellerId: "seller_id_123", imageURL: "", title: "Mechanical Engineering Textbooks", description: "تكست بوكس هندسة ميكانيكية", seller: "Jane Smith", status: "rejected", price: 1500 },
  { _id: "3", requestId: "req_12345", sellerId: "seller_id_123", imageURL: "", title: "Studio Apartment near Campus", description: "شقة 4 غرف تحفة", seller: "Amazon", status: "pending", price: 2500 },
  { _id: "4", requestId: "req_12345", sellerId: "seller_id_123", imageURL: "", title: "Mechanical Engineering Textbooks", description: "لابتوب ديل بمواصفات ممتازة", seller: "Noon", status: "accepted", price: 1500 },
];