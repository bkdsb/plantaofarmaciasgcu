import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; error_code?: string }>;
}) {
  const params = await searchParams;

  return <LoginForm urlError={params.error} urlErrorCode={params.error_code} />;
}
