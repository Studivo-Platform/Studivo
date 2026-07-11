import { useState } from "react";
import { AxiosError } from "axios";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { forgotPassword } from "../API/auth.api";

export function useForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const data = await forgotPassword({ email });
      setSuccess(
        data.message ||
          t({ section: "forgot_password_form", key: "success_message" })
      );
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(
        axiosErr.response?.data?.message ||
          t({ section: "forgot_password_form", key: "error_fallback" })
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    error,
    success,
    handleSubmit,
    t,
  };
}
