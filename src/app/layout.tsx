import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import { getServerAuthSession } from "~/server/auth";
import SessionWrapper from "./auth/_components/SessionWrapper";
import { SidebarProvider, SidebarTrigger } from "~/_components/ui/sidebar";
import { AppSidebar } from "~/_components/ui/app-sidebar";
import { TripProvider } from "./trips/contexts/TripContext";
import getAllSortedTrips from "./trips/actions/getAllSortedTrips";
import { Toaster } from "~/_components/ui/sonner";
import { ToastHandler } from "~/_components/common/Toast";

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
  const allTrips = session ? await getAllSortedTrips() : [];
  const initialTrip = allTrips && allTrips.length > 0 ? allTrips[0] : null;

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <SessionWrapper session={session}>
            <div className="bg-gradient-to-b from-[#74ebd5] to-[#ACB6E5]">
              <TripProvider trip={initialTrip ?? null}>
                <Toaster />
                <ToastHandler />
                <SidebarProvider>
                  {session && <AppSidebar />}
                  {session && <SidebarTrigger />}
                  <div className="w-screen overflow-x-hidden px-12 py-12 text-white">
                    {children}
                  </div>
                </SidebarProvider>
              </TripProvider>
            </div>
          </SessionWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
