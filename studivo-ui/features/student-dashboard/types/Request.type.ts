export type Request = {
  _id: string;
  buyerID: string;
  title: string;
  category: string;
  budget: { min: number; max: number; currency: string };
  location: string;
  status: "open" | "matched" | "closed";
  offersCount: number;
  createdAt: string;
};