import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "../components/common/Navbar";
import { getServerAuthSession } from "~/server/auth";
import SessionWrapper from "../components/auth/SessionWrapper";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/ui/app-sidebar";

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
            <div className="bg-gradient-to-b from-[#74ebd5] to-[#ACB6E5]">
              <SidebarProvider>
                {/* <div className="w-screen overflow-x-hidden px-12 text-white"> */}
                {/* {session && <Navbar />} */}
                <AppSidebar />
                <SidebarTrigger />
                {children}
                {/* </div> */}
              </SidebarProvider>
            </div>
          </SessionWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
