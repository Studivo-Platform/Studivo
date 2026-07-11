

import AuthLayout from "@/features/auth/components/authlayout";
import CompleteProfileForm from "@/features/auth/components/CompleteProfileForm";

export const metadata = { title: "Complete profile - Studivo" };

export default function CompleteProfilePage() {
  return (
    <AuthLayout>
      <CompleteProfileForm />
    </AuthLayout>
  );
}
