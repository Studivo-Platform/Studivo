import { BuyerSearchOfferItem } from "../types/buyerSearch.type";
import { mockBuyerSearchOffers } from "../data/buyerSearch.mock";

export async function getBuyerSearchApi(search?: string, category?: string): Promise<BuyerSearchOfferItem[]> {
  await new Promise((r) => setTimeout(r, 400));
  return mockBuyerSearchOffers.filter((offer) => {
    const matchesSearch = search
      ? offer.title.toLowerCase().includes(search.toLowerCase()) || offer.description.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesCategory = category && category !== "all" ? offer.category === category : true;
    return matchesSearch && matchesCategory;
  });
}