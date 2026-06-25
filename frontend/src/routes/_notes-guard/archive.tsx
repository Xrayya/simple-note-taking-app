import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_notes-guard/archive")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello _notes-guard/archive</div>;
}
