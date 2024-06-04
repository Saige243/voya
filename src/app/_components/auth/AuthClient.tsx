"use client";

import { type BuiltInProviderType } from "next-auth/providers/index";
import {
  type ClientSafeProvider,
  type LiteralUnion,
  signIn,
} from "next-auth/react";
import { Button } from "~/app/_components/Button";
import { Card } from "../Card";
import { TextInput } from "../TextInput";
import { Toast } from "~/app/_components/Toast";
import { useState } from "react";

export default function AuthClient({
  providers,
}: {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}) {
  const [showToast, setShowToast] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);

  if (!providers) {
    return null;
  }

  const handleSignIn = () => {
    // Perform sign-in logic here
    // For example, if sign-in fails, show the alert
    setShowToast(true);
  };

  const signInForm = (
    <div className="py-4">
      {/* <form> */}
      <TextInput placeholder="Email" className="mb-4" />
      <TextInput placeholder="Password" className="mb-4" />
      <Button
        buttonText="Sign in"
        className="btn-primary w-full"
        onClick={handleSignIn}
      />
      {showToast && (
        <Toast toastText="Sign in failed!" className="" toastType="error" />
      )}
    </div>
  );

  const signUpForm = (
    <div className="py-4">
      {/* <form> */}
      <TextInput placeholder="Email" className="mb-4" />
      <TextInput placeholder="Password" className="mb-4" />
      <TextInput placeholder="Confirm Password" className="mb-4" />
      <Button
        buttonText="Sign Up"
        className="btn-primary w-full"
        onClick={handleSignIn}
      />
      {showToast && (
        <Toast toastText="Sign in failed!" className="" toastType="error" />
      )}
    </div>
  );

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

  const toggleAuthButton = (
    <Button
      buttonText={
        isSignIn
          ? "Don't have an account? Sign Up"
          : "Already have an account? Sign in"
      }
      className="btn-ghost w-full"
      onClick={() => setIsSignIn(!isSignIn)}
    />
  );

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card
        title={isSignIn ? "Sign In to Voya" : "Sign Up for Voya"}
        description={isSignIn ? "Sign in to your account" : "Create an account"}
        buttonText={isSignIn ? "Sign In" : "Sign Up"}
      >
        {mappedProviders}
        {isSignIn ? signInForm : signUpForm}
        {toggleAuthButton}
      </Card>
    </div>
  );
}
