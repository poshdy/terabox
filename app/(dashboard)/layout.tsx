import { FilesContextProvider } from "@/components/pages/files/context";
import { isAuthenticated } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/side-bar";
import { Toaster } from "@/components/ui/sonner";
type Props = {
  children: React.ReactNode;
};

export default async function DashboardLayoyt({ children }: Props) {
  if (!isAuthenticated()) {
    const { redirectToSignIn } = await auth();
    redirectToSignIn({
      returnBackUrl: "/files",
    });
  }
  return (
    <main>
      <FilesContextProvider>
        <SidebarProvider
          className="bg-card"
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <Toaster position="bottom-right" />
          <AppSidebar variant="inset" />
          <SidebarInset>
            <AppHeader />
            <div className=" flex flex-col flex-1 px-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </FilesContextProvider>
    </main>
  );
}
