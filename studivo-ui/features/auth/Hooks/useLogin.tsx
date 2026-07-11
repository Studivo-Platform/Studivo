import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { loginUser } from "../API/auth.api"; // مسار ملف الـ API
import { AxiosError } from "axios";
import { useAuthStore } from "@/shared/store/auth.store";

export function useLogin() {
  const { t } = useTranslation();
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Google OAuth
  const handleGoogleLogin = () => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    window.location.href = `${baseURL}/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser({
        email: form.email,
        password: form.password,
      });

      const { accessToken, user } = response.data;

      // Update global Zustand store
      useAuthStore.getState().setAuth(user, accessToken);

      // Set cookie for Next.js middleware (proxy.ts)
      document.cookie = `refreshToken=${accessToken}; path=/; max-age=${30 * 60}; SameSite=Lax; Secure`;

      // Navigate to the correct dashboard based on user role
      const dashboardPath =
        user.role === "admin"
          ? "/admin"
          : user.role === "seller"
            ? "/dashboard/seller"
            : "/dashboard/student";
      router.push(dashboardPath);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const message =
        axiosErr.response?.data?.message ||
        t({ section: "login_form", key: "error_fallback" });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    error,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    handleChange,
    handleGoogleLogin, // ضفناها هنا عشان نقدر نستخدمها في الـ UI
    handleSubmit,
    t,
  };
}