import { Suspense } from "react";
import AuthLayout from "../../features/auth/components/authlayout";
import ResetPasswordForm from "../../features/auth/components/ResetPasswordForm";

export const metadata = { title: "Reset password - Studivo" };

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
