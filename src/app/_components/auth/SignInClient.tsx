"use client";

import { type BuiltInProviderType } from "next-auth/providers/index";
import {
  type ClientSafeProvider,
  type LiteralUnion,
  signIn,
} from "next-auth/react";

export default function SignInClient({
  providers,
}: {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}) {
  console.log("PROVIDERS:", providers);

  if (!providers) {
    return null;
  }

  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>
  );
}
