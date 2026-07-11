import { BuyerSearchOfferItem } from "../types/buyerSearch.type";

export const mockBuyerSearchOffers: BuyerSearchOfferItem[] = [
  { _id: "offer_b1", requestId: "req_101", sellerId: "sell_99", imageURL: "", title: "Dell XPS 13 - كسر زيرو للبرمجة", description: "لابتوب بمواصفات ممتازة، رامات 16 جيجا، هارد 512 SSD", seller: "إياد خليل", status: "pending", price: 7500, category: "electronics", createdAt: "2026-06-25T18:00:00Z" },
  { _id: "offer_b2", requestId: "req_102", sellerId: "sell_88", imageURL: "", title: "كتب هندسة ميكانيكية", description: "جميع كتب السنة الثالثة ميكانيكا باور بحالة ممتازة", seller: "أحمد مصطفى", status: "accepted", price: 4500, category: "books", createdAt: "2026-06-24T12:00:00Z" },
];