"use client";

import { type BuiltInProviderType } from "next-auth/providers/index";
import { type ClientSafeProvider, type LiteralUnion } from "next-auth/react";
import { Button } from "~/app/_components/Button";
import { Card } from "../Card";
import { TextInput } from "../TextInput";
import { Toast } from "~/app/_components/Toast";
import { useState } from "react";

export default function SignInClient({
  providers,
}: {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}) {
  const [showToast, setShowToast] = useState(false);

  if (!providers) {
    return null;
  }

  const handleSignUp = () => {
    // Perform sign-in logic here
    // For example, if sign-in fails, show the alert
    setShowToast(true);
  };

  const signUpForm = (
    <div className="py-4">
      {/* <form> */}
      <TextInput placeholder="Email" className="mb-4" />
      <TextInput placeholder="Password" className="mb-4" />
      <Button
        buttonText="Sign in"
        className="btn-primary w-full"
        onClick={handleSignUp}
      />
      {showToast && (
        <Toast toastText="Sign up failed!" className="" toastType="error" />
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card
        title="Sign in to Voya"
        description="Sign to access your account"
        buttonText="Sign in"
      >
        {signUpForm}
      </Card>
    </div>
  );
}
