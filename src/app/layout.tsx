import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "../components/common/Navbar";
import { getServerAuthSession } from "~/server/auth";
import SessionWrapper from "../components/auth/SessionWrapper";

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
          <SessionWrapper session={session}>
            <div className="bg-gradient-to-b from-[#74ebd5] to-[#ACB6E5] px-12 text-white">
              {session && <Navbar />}
              {children}
            </div>
          </SessionWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
