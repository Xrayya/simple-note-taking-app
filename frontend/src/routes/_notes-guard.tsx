import { NotesProvider } from "@/contexts/notes-context";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_notes-guard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <NotesProvider>
      <Outlet />
    </NotesProvider>
  );
}
