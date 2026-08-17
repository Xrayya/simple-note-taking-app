import { Toaster } from "#/components/ui/toast.tsx";
import { TooltipProvider } from "#/components/ui/tooltip.tsx";
import { ThemeProvider } from "#/contexts/theme-context.tsx";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import "../styles.css";

export const queryClient = new QueryClient();

export const Route = createRootRouteWithContext<{
  queryClient: typeof queryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <TooltipProvider>
            <Outlet />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
      <Toaster />
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "TanStack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  );
}
