import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { resetPassword } from "../API/auth.api";

const getResetToken = (searchParams: ReturnType<typeof useSearchParams>) =>
  searchParams.get("token") ||
  searchParams.get("resetToken") ||
  searchParams.get("reset_token") ||
  "";

export function useResetPassword() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = getResetToken(searchParams);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    token ? null : t({ section: "reset_password_form", key: "missing_token" })
  );
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const passwordsMatch =
    form.confirmPassword === "" || form.password === form.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError(t({ section: "reset_password_form", key: "missing_token" }));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError(t({ section: "reset_password_form", key: "password_mismatch" }));
      return;
    }

    if (form.password.length < 8) {
      setError(t({ section: "reset_password_form", key: "password_too_short" }));
      return;
    }

    setLoading(true);

    try {
      const data = await resetPassword({
        token,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      setSuccess(
        data.message ||
          t({ section: "reset_password_form", key: "success_message" })
      );

      setTimeout(() => {
        router.push("/auth/login?passwordReset=true");
      }, 1800);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(
        axiosErr.response?.data?.message ||
          t({ section: "reset_password_form", key: "error_fallback" })
      );
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
    hasToken: Boolean(token),
    handleChange,
    handleSubmit,
    t,
  };
}
