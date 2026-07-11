import axios from "axios";
import axiosInstance from "@/shared/APIs/axiosInstance";

// 1. الأشكال (Interfaces) الخاصة بالبيانات اللي هتبعتها للـ Backend
export interface RegisterPayload {
  name: string;
  email: string;
  role: "student" | "seller";
  password?: string;        // اختياري لو الـ backend مش محتاجه، بس أنت بتبعته
  confirmPassword?: string; // اختياري حسب الـ backend عندك بيطلب المطابقة ولا لأ
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

// 2. الشكل المتوقع للـ Response اللي راجع من الـ Backend في الـ Login
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "seller" | "admin";
  profileImage: string | null;
  isProfileCompleted: boolean;
  phone?: string;
  university?: string;
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  };
}

export interface GetMeResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    role: "student" | "seller" | "admin";
    profileImage: string | null;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    isProfileCompleted: boolean;
  };
}

export interface VerifyEmailResponse {
  message?: string;
}

export interface RegisterResponse {
  message?: string;
}

export interface PasswordActionResponse {
  message?: string;
}

export type UserRole = "student" | "seller" | "admin";

export interface CompleteProfileResponse {
  message?: string;
  token?: string;
  accessToken?: string;
  user?: {
    role?: UserRole;
  };
}

// 3. الدوال (Functions) الخاصة بالـ API
export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const { data } = await axiosInstance.post("/auth/register", payload);
  return data;
};

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post("/auth/login", payload, {
    withCredentials: true, // لازم عشان الـ backend يبعت الـ refreshToken كـ cookie
  });
  return data;
};

export const getMe = async (accessToken: string): Promise<GetMeResponse> => {
  const { data } = await axiosInstance.get<GetMeResponse>("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};

export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<PasswordActionResponse> => {
  const { data } = await axiosInstance.post("/auth/forgot-password", payload);
  return data;
};

export const resetPassword = async (
  payload: ResetPasswordPayload
): Promise<PasswordActionResponse> => {
  const { data } = await axiosInstance.patch("/auth/reset-password", payload);
  return data;
};

export const verifyEmailToken = async (token: string): Promise<VerifyEmailResponse> => {
  const { data } = await axiosInstance.get<VerifyEmailResponse>(
    `/auth/verify/${encodeURIComponent(token)}`
  );

  return data;
};

export const completeProfile = async (
  token: string,
  role: UserRole
): Promise<any> => {
  const { data } = await axiosInstance.post(
    "/auth/complete-profile",
    { role, profileCompletionToken: token },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};
