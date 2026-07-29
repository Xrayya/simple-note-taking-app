import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { BaseError } from "./exceptions/base";
import { InvalidRequestError } from "./exceptions/validation";
import { notesRoute } from "./routes/notes";
import { authRoute } from "./routes/auth";
import { cors } from "hono/cors";
import { env, IS_PROD } from "./env";

console.log("Runtime Check:", {
  IS_PROD,
  NODE_ENV: env.NODE_ENV,
  ALLOWED_ORIGINS: env.ALLOWED_ORIGINS
});

const app = new Hono();

app.use(logger());

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return !IS_PROD ? "*" : null;

      if (env.ALLOWED_ORIGINS.includes(origin)) {
        return origin;
      }

      return null;
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/", (c) => {
  return c.json(
    {
      message: "You are entering simple note taking app backend route",
    },
    200,
  );
});

app.route("/auth", authRoute);
app.route("/notes", notesRoute);

app.onError((err, c) => {
  console.log(err);

  if (err instanceof HTTPException) {
    return c.json(
      { error: { name: err.name, message: err.message } },
      err.status,
    );
  }

  if (err instanceof InvalidRequestError) {
    console.log("traces", err.traces);

    return c.json(
      { error: { name: err.name, message: err.message, traces: err.traces } },
      err.statusCode,
    );
  }

  if (err instanceof BaseError) {
    return c.json(
      { error: { name: err.name, message: err.message } },
      err.statusCode,
    );
  }

  return c.json({ message: "Internal Server Error" }, 500);
});

export default app;
