"use client";
import * as React from "react";
import {
  IconCirclePlusFilled,
  IconFileDescription,
  IconFolders,
  IconStar,
  IconTrash,
  IconMail,
  type Icon,
  IconFileUpload,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "./logo";
import Link from "next/link";
const data = {
  navMain: [
    {
      title: "Files",
      url: "/files?resource=all",
      icon: IconFileDescription,
    },
    {
      title: "Folders",
      url: "/files",
      icon: IconFolders,
    },
    {
      title: "Starred",
      url: "/files?resource=starred",
      icon: IconStar,
    },
    {
      title: "Bin",
      url: "/files?resource=deleted",
      icon: IconTrash,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="bg-card" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Logo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarItems items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}

const SidebarItems = ({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) => {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconFileUpload />
              <span className="font-semibold">Quick Upload</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <Link href={item.url}>
                  <span className="text-xs  text-muted-foreground">
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
