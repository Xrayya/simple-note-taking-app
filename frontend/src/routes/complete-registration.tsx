import { Button } from "#/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import { toast } from "#/components/ui/toast.tsx";
import {
  googleCompleteRegisterSchema,
  registerSchema,
} from "#/schema-validation/auth.ts";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GalleryVerticalEnd, LoaderCircle } from "lucide-react";
import type { z } from "zod";
import { Route as loginRoute } from "./login.tsx";

export const Route = createFileRoute("/complete-registration")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const register = useMutation({
    mutationFn: async (
      registerInfo: z.infer<typeof googleCompleteRegisterSchema>,
    ): Promise<{
      email: string;
      username: string;
      timestamp: Date;
    }> => {
      const url = new URL(
        `/api/auth/google/complete-registration`,
        window.location.origin,
      );

      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ ...registerInfo }),
      });

      if (!response.ok) {
        const payload = await response.json();

        throw new Error(
          payload?.error?.message || "An error occurred while fetching data",
          { cause: payload?.error?.name },
        );
      }

      const payload = await response.json();
      return payload.newUser;
    },
    onSuccess: () => {
      toast.add({
        type: "success",
        description: "Register new account succesfully",
      });

      setTimeout(() => {
        navigate({
          to: loginRoute.to,
        });
      }, 500);
    },
  });

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onChange: googleCompleteRegisterSchema,
    },
    onSubmit: ({ value }) => {
      register.mutate({ ...value });
    },
  });

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Simple Note Taking App
        </a>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">One More Step</CardTitle>
              <CardDescription>Complete your registration</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit, isSubmitting]) => (
                    <FieldSet>
                      <FieldGroup>
                        <form.Field name="username">
                          {(field) => (
                            <Field>
                              <FieldLabel htmlFor={field.name}>
                                Username
                              </FieldLabel>
                              <Input
                                type="text"
                                id={field.name}
                                name={field.name}
                                disabled={isSubmitting}
                                onBlur={field.handleBlur}
                                onChange={(e) => {
                                  field.handleChange(e.target.value);
                                }}
                                placeholder="John Doe"
                                required
                              />
                            </Field>
                          )}
                        </form.Field>
                        <form.Field name="password">
                          {(field) => (
                            <Field>
                              <FieldLabel htmlFor={field.name}>
                                Password
                              </FieldLabel>
                              <Input
                                type="password"
                                id={field.name}
                                name={field.name}
                                disabled={isSubmitting}
                                onBlur={field.handleBlur}
                                onChange={(e) => {
                                  field.handleChange(e.target.value);
                                }}
                                required
                              />
                            </Field>
                          )}
                        </form.Field>
                        <Field>
                          <Button type="submit" disabled={!canSubmit}>
                            {isSubmitting ? (
                              <LoaderCircle className="animate-spin" />
                            ) : null}
                            Register
                          </Button>
                          <FieldDescription className="text-center">
                            <span>Already have an account? </span>
                            <Link to={loginRoute.to}>Login</Link>
                          </FieldDescription>
                        </Field>
                      </FieldGroup>
                    </FieldSet>
                  )}
                </form.Subscribe>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
