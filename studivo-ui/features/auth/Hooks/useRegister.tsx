import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { registerUser } from "../API/auth.api";
import { AxiosError } from "axios";
import { useAuthStore } from "@/shared/store/auth.store";

export function useRegister() {
  const { t } = useTranslation();
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "seller",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const changeRole = (role: "student" | "seller") => {
    setForm((prev) => ({ ...prev, role }));
  };

  const passwordsMatch = form.confirmPassword === "" || form.password === form.confirmPassword;

  // ✅ Google OAuth
  const handleGoogleLogin = () => {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    window.location.href = `${baseURL}/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.password !== form.confirmPassword) {
      setError(t({ section: "register_form", key: "password_mismatch" }));
      return;
    }

    if (form.password.length < 8) {
      setError(t({ section: "register_form", key: "password_too_short" }));
      return;
    }

    setLoading(true);
    try {
      const res: any = await registerUser({
        name: form.fullName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: form.role,
      });

      if (res.data?.accessToken && res.data?.user) {
        useAuthStore.getState().setAuth(res.data.user, res.data.accessToken);
        document.cookie = `refreshToken=${res.data.accessToken}; path=/; max-age=${30 * 60}; SameSite=Lax; Secure`;
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => {
          const dashboardPath = form.role === "seller" ? "/dashboard/seller" : "/dashboard/student";
          router.push(dashboardPath);
        }, 1500);
      } else {
        setSuccess("Account created successfully!");
        setTimeout(() => {
          router.push("/auth/login?registered=true");
        }, 2000);
      }
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const message =
        axiosErr.response?.data?.message ||
        t({ section: "register_form", key: "error_fallback" });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    error,
    success,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    passwordsMatch,
    handleChange,
    changeRole,
    handleSubmit,
    handleGoogleLogin,
    t,
  };
}
