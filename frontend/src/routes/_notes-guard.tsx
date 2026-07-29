import { AppSidebar } from "#/components/app-sidebar.tsx";
import { NoteDetailDrawer } from "#/components/note-detail.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#/components/ui/breadcrumb.tsx";
import { Separator } from "#/components/ui/separator.tsx";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "#/components/ui/sidebar.tsx";
import { useIsMobile } from "#/hooks/use-mobile.ts";
import { authMeOption } from "#/lib/api.ts";
import { cn } from "#/lib/utils.ts";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Route as loginRoute } from "./login.tsx";

export const Route = createFileRoute("/_notes-guard")({
  beforeLoad: async ({ context }) => {
    try {
      const data = await context.queryClient.fetchQuery(authMeOption);
      return { user: data };
    } catch {
      return { user: null };
    }
  },
  component: RouteComponent,
});

function RouteLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  const { setOpen } = useSidebar();

  if (isDrawerOpen && window.innerWidth <= 1056) {
    setOpen(false);
  }

  window.addEventListener("resize", () => {
    if (isDrawerOpen && window.innerWidth <= 1056) {
      setOpen(false);
    }
  });

  const handleDrawerOpenChange = (nextOpen: boolean) => {
    setIsDrawerOpen(nextOpen);
  };

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Build Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div
          className={cn(
            "@container/main transition-all duration-250 px-8 xl:px-32",
            !isMobile && isDrawerOpen
              ? "xl:pr-130 md:pr-106"
              : "xl:pr-32 md:pr-8",
          )}
        >
          <Outlet />
          <NoteDetailDrawer onOpenChange={handleDrawerOpenChange} />
        </div>
      </SidebarInset>
    </>
  );
}

function RouteComponent() {
  const { user } = Route.useRouteContext();

  if (!user) {
    return <Navigate to={loginRoute.to} />;
  }

  return (
    <SidebarProvider>
      <RouteLayout />
    </SidebarProvider>
  );
}
