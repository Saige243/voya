import { getProviders, getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AuthClient from "../../../components/auth/AuthClient";

export default async function SignInPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  const providers = await getProviders();

  return <AuthClient providers={providers} />;
}
