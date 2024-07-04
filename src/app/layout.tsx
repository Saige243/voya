import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "./_components/Navbar";
import { getServerAuthSession } from "~/server/auth";

export async function fetchSession() {
  return await getServerAuthSession();
}

export const metadata = {
  title: "Welcome to Voya",
  description: "Time to Travel",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          {session && <Navbar />}
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}

async function getSession() {
  const res = await fetchSession();

  return res;
}
