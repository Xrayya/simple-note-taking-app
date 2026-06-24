import { AppSidebar } from "#/components/app-sidebar.tsx";
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
} from "#/components/ui/sidebar.tsx";
import { AddNoteForm } from "@/components/add-note-form";
import { NoteGrid } from "@/components/note-grid";
import { SearchAddNote } from "@/components/search-add-note";
import { cn } from "@/lib/utils";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_notes-guard/")({ component: Home });

const notesOptions = queryOptions({
  queryKey: ["notes"],
  queryFn: async (): Promise<{
    notes: {
      id: string;
      createdAt: string;
      updatedAt: string | null;
      title: string;
      body: string;
      isArchived: boolean;
    }[];
  }> => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_ENDPOINT!}/notes`,
    );

    if (!response.ok) {
      const payload = await response.json();

      throw new Error(
        payload?.error?.message || "An error occurred while fetching data",
        { cause: payload?.error?.name },
      );
    }

    const payload = await response.json();
    return payload;
  },
});

function Home() {
  const [isAddNoteFormShowed, setAddNoteFormShowed] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>("");

  const { data, isLoading, error } = useQuery(notesOptions);

  const handleNewNoteButtonClick = () => {
    setAddNoteFormShowed(true);
  };

  const handleSearchChange = (s: string) => {
    setSearchString(s);
  };

  const handleAddNoteFormCancel = () => {
    setAddNoteFormShowed(false);
  };

  const handleAddNoteCompleteSubmit = () => {
    setTimeout(() => {
      setAddNoteFormShowed(false);
    }, 1000);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
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
        <div className="@container/main px-8 xl:px-32">
          <h1 className="my-16 text-center text-2xl">Simple Note Taking App</h1>

          <section className="my-4">
            <SearchAddNote
              onNewNoteButtonClick={handleNewNoteButtonClick}
              onSearchChange={handleSearchChange}
            />
            <AddNoteForm
              className={cn(isAddNoteFormShowed ? null : "hidden")}
              onCompleteSubmit={handleAddNoteCompleteSubmit}
              onCancel={handleAddNoteFormCancel}
            />
          </section>

          <section className="my-8">
            <h2>Active Note</h2>
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>{error.message}</div>
            ) : (
              <NoteGrid
                notes={data?.notes.filter((note) => !note.isArchived) || []}
              />
            )}
          </section>

          <section className="my-8">
            <h2>Archived Note</h2>
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>{error.message}</div>
            ) : (
              <NoteGrid
                notes={data?.notes.filter((note) => note.isArchived) || []}
              />
            )}
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
