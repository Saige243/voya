import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import { getServerAuthSession } from "~/server/auth";
import SessionWrapper from "../components/auth/SessionWrapper";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/ui/app-sidebar";
import { TripProvider } from "./trips/contexts/TripContext";

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
                <AppSidebar />
                <TripProvider trip={""}>
                  <SidebarTrigger />
                  <div className="w-screen overflow-x-hidden px-12 py-12 text-white">
                    {children}
                  </div>
                </TripProvider>
              </SidebarProvider>
            </div>
          </SessionWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
