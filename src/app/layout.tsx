import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "./_components/Navbar";
import { getServerAuthSession } from "~/server/auth";

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
  const session = await getServerAuthSession();

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <div className="bg-gradient-to-b from-[#2e026d] to-[#15162c] px-12 text-white ">
            {session && <Navbar />}
            {children}
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
