import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { BaseError } from "./exceptions/base";
import { InvalidRequestError } from "./exceptions/validation";

const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.json({
    message: "You are entering simple note taking app backend route",
  });
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      { error: { name: err.name, message: err.message } },
      err.status,
    );
  }

  if (err instanceof InvalidRequestError) {
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
