// Matches the actual backend Request model shape from GET /requests
export type SellerMatchingRequestItem = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    university?: string;
  };
  rawText: string;
  parsedData: {
    category: string;
    subCategory?: string;
    specs?: Record<string, string>;
    budget: {
      min: number | null;
      max: number | null;
      currency: string;
    };
    location?: string | null;
    keywords?: string[];
  };
  status: "open" | "matched" | "closed";
  viewCount: number;
  createdAt: string;
  updatedAt: string;
};