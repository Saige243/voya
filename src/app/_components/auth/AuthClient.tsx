"use client";

import { type BuiltInProviderType } from "next-auth/providers/index";
import {
  type ClientSafeProvider,
  type LiteralUnion,
  signIn,
} from "next-auth/react";
import { Button, ImageButton } from "~/app/_components/Button";
import { Card } from "../Card";
import { TextInput } from "../TextInput";
import { Toast } from "~/app/_components/Toast";
import { useState } from "react";

const providerLogoSrc = (name: string) =>
  `https://authjs.dev/img/providers/${name}.svg`;

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
        className="btn-primary w-full dark:text-white"
        onClick={handleSignIn}
      >
        Sign in
      </Button>
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
      <Button className="btn-primary w-full text-white" onClick={handleSignIn}>
        Sign Up
      </Button>
      {showToast && (
        <Toast toastText="Sign in failed!" className="" toastType="error" />
      )}
    </div>
  );

  const mappedProviders = (
    <>
      {Object.values(providers).map((provider) => {
        console.log("logo src", providerLogoSrc(provider.name));
        return (
          <div key={provider.name}>
            <ImageButton
              onClick={() => signIn(provider.id, { callbackUrl: "/dashboard" })}
              className="btn-primary flex flex-row dark:text-white"
              src={providerLogoSrc(provider.id)}
              alt={provider.name}
              height={24}
              width={24}
            >
              {`Sign in with ${provider.name}`}
            </ImageButton>
          </div>
        );
      })}
    </>
  );

  const toggleAuthButton = (
    <Button className="btn-ghost w-full" onClick={() => setIsSignIn(!isSignIn)}>
      {isSignIn
        ? "Don't have an account? Sign Up"
        : "Already have an account? Sign in"}
    </Button>
  );

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card
        title={isSignIn ? "Sign In to Voya" : "Sign Up for Voya"}
        description={isSignIn ? "Sign in to your account" : "Create an account"}
        className="w-96 text-black dark:text-white"
      >
        <div className="flex space-x-2">{mappedProviders}</div>
        {isSignIn ? signInForm : signUpForm}
        {toggleAuthButton}
      </Card>
    </div>
  );
}
