import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useNavigate } from "@tanstack/react-router";
import { Archive, GalleryVerticalEndIcon, Notebook } from "lucide-react";
import type { ComponentProps } from "react";
import { Route as activeNotesRoute } from "../routes/_notes-guard";
import { Route as archivedNotesRoute } from "../routes/_notes-guard/archive";
import { ThemeToggle } from "./theme-toggle";

const mockUserData = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();

  const mockNavData: ComponentProps<typeof NavMain>["items"] = [
    {
      title: "Active Notes",
      icon: <Notebook />,
      itemArgs: {
        onClick: () => {
          navigate({ to: activeNotesRoute.to });
        },
      },
    },
    {
      title: "Archived Notes",
      icon: <Archive />,
      itemArgs: {
        onClick: () => {
          navigate({ to: archivedNotesRoute.to });
        },
      },
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEndIcon />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Simple</span>
                <span className="truncate text-xs">Note Taking App</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={mockNavData} />
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
        <NavUser user={mockUserData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
