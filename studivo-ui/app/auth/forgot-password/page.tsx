import AuthLayout from "../../../features/auth/components/authlayout";
import ForgotPasswordForm from "../../../features/auth/components/ForgotPasswordForm";

export const metadata = { title: "Forgot password - Studivo" };

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
