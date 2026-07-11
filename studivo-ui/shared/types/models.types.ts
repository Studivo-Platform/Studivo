// ─── Shared TypeScript types matching backend Mongoose models ───

export type Role = 'student' | 'seller' | 'admin';
export type Locale = 'ar' | 'en';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  university?: string;
  phone?: string;
  profileImage: string | null;
  isVerified: boolean;
  isActive: boolean;
  isProfileCompleted: boolean;
  createdAt: string;
}

export interface ParsedData {
  category: 'electronics' | 'housing' | 'books' | 'services' | 'transport' | 'food' | 'other';
  subCategory: string | null;
  specs: Record<string, string>;
  budget: { min: number | null; max: number | null; currency: string };
  location: string | null;
  keywords: string[];
}

export interface StudentRequest {
  _id: string;
  userId: string | User;
  rawText: string;
  parsedData: ParsedData;
  status: 'open' | 'matched' | 'closed';
  viewCount: number;
  expiresAt: string;
  createdAt: string;
}

export interface Offer {
  _id: string;
  requestId: string;
  sellerId: string | User;
  price: number;
  description: string;
  images: { url: string; publicId: string }[];
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  deliveryNote: string | null;
  createdAt: string;
}

export interface ScrapedResult {
  _id: string;
  requestId: string;
  source: 'amazon' | 'noon' | 'olx' | 'aqar' | 'btech';
  title: string;
  price: number | null;
  originalUrl: string;
  affiliateUrl: string | null;
  imageUrl: string | null;
  metadata?: Record<string, unknown>;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string | User;
  text: string;
  attachments: string[];
  readAt: string | null;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  conversationKey: string;
  participants: User[];
  requestId: string | StudentRequest;
  offerId: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  lastSenderId: string | null;
  status: 'active' | 'closed';
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'new_offer' | 'new_message' | 'new_request' | 'system';
  message: string;
  resourceId: string | null;
  resourceType: 'Request' | 'Offer' | 'Conversation' | null;
  read: boolean;
  createdAt: string;
}

// ─── API Response wrapper ───

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}

// ─── Auth types ───

export interface AuthUser {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: Role;
  profileImage: string | null;
  isProfileCompleted: boolean;
  phone?: string;
  university?: string;
  hasPassword?: boolean;
  isGoogleUser?: boolean;
}



export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
}
