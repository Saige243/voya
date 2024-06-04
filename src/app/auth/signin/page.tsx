import { getProviders, getSession } from "next-auth/react";
import { authOptions } from "~/server/auth";
import { redirect } from "next/navigation";
import AuthClient from "../../_components/auth/AuthClient";

export default async function SignInPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  const providers = await getProviders();

  return <AuthClient providers={providers} />;
}
