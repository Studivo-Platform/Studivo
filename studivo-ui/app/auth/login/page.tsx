// import { AuthLayout, LoginForm } from "../../../";
import AuthLayout from '../../../features/auth/components/authlayout'
import LoginForm from '../../../features/auth/components/Loginform'



export const metadata = { title: "Sign in — Studivo" };

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}