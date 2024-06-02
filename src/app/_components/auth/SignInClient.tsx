"use client";

import { type BuiltInProviderType } from "next-auth/providers/index";
import {
  type ClientSafeProvider,
  type LiteralUnion,
  signIn,
} from "next-auth/react";
import { Button } from "~/app/_components/Button";
import { Card } from "../Card";

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

  const mappedProviders = (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <Button
            onClick={() => signIn(provider.id)}
            buttonText={`Sign in with ${provider.name}`}
            className="btn-primary w-full"
          />
        </div>
      ))}
    </>
  );

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card
        title="Sign in"
        description="Sign in to access your account."
        buttonText="Sign in"
      >
        {mappedProviders}
      </Card>
    </div>
  );
}
