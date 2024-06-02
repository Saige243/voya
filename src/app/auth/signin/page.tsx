// src/app/auth/signin/page.tsx

import { getProviders, getSession } from "next-auth/react";
import { authOptions } from "~/server/auth";
import { redirect } from "next/navigation";
import SignInClient from "../../_components/auth/SignInClient";

export default async function SignInPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  const providers = await getProviders();

  return <SignInClient providers={providers} />;
}
