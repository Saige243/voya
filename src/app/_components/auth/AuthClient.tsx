"use client";

import { type BuiltInProviderType } from "next-auth/providers/index";
import {
  type ClientSafeProvider,
  type LiteralUnion,
  signIn,
} from "next-auth/react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Toast } from "~/app/_components/common/Toast";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

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
    setShowToast(true);
  };

  const signInForm = (
    <div className="py-4">
      <Label htmlFor="email">Email</Label>
      <Input placeholder="johndoe@example.com" className="mb-4" />
      <Label htmlFor="password">Password</Label>
      <Input placeholder="••••••••" className="mb-4" type="password" />
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
      <Label htmlFor="email">Email</Label>
      <Input placeholder="Email" className="mb-4" />
      <Label htmlFor="password">Password</Label>
      <Input placeholder="Password" className="mb-4" />
      <Label htmlFor="confirm-password">Confirm Password</Label>
      <Input placeholder="Confirm Password" className="mb-4" />
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
        const logoSrc = `/logos/${provider.name.toLowerCase()}.svg`;
        return (
          <div key={provider.name}>
            <Button
              onClick={() => signIn(provider.id, { callbackUrl: "/dashboard" })}
              className="btn-primary flex flex-row rounded-full dark:text-white"
            >
              <Image
                src={logoSrc}
                alt={provider.name}
                height={24}
                width={24}
                className="mr-2"
              />
              {`Sign in with ${provider.name}`}
            </Button>
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
      <Card className="text-black dark:text-white">
        <CardContent>
          <CardHeader>
            <CardTitle>
              {isSignIn ? "Sign in to Voya" : "Sign Up for Voya"}
            </CardTitle>
            <CardDescription>
              {isSignIn ? "Sign in to your account" : "Create an account"}
            </CardDescription>
          </CardHeader>
          <div className="flex justify-between space-x-2 contain-content">
            {mappedProviders}
          </div>
          {isSignIn ? signInForm : signUpForm}
          {toggleAuthButton}
        </CardContent>
      </Card>
    </div>
  );
}
