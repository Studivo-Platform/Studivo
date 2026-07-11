// Matches the actual backend response from GET /requests/:id
export type TargetRequestSummary = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email?: string;
    profileImage?: string;
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