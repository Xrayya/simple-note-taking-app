import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { InvalidTokenError } from "../exceptions/auth";
import { validateJsonRequest } from "../middlewares/validation";
import {
  createToken,
  getAuthInfo,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../services/auth";
import { loginSchema, registerSchema } from "../validation-schemas/auth";
import { IS_PROD } from "../env";

export const authRoute = new Hono()
  .post("/register", ...validateJsonRequest(registerSchema), async (c) => {
    const payload = c.req.valid("json");
    const newUser = await register(payload);

    return c.json({ account: newUser }, 201);
  })
  .post("/login", ...validateJsonRequest(loginSchema), async (c) => {
    const payload = c.req.valid("json");
    const validUser = await login(payload);

    const { accessToken, refreshToken } = await createToken({
      ...validUser,
      userEmail: validUser.email,
      expiresIn: 60 * 60 * 24 * 30, // 30 days for refresh token
    });

    setCookie(c, "refreshToken", refreshToken, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: "Lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return c.json(
      {
        validLogin: {
          username: validUser.username,
          email: validUser.email,
          accessToken,
        },
      },
      200,
    );
  })
  .post("/refresh", async (c) => {
    const refreshToken = getCookie(c, "refreshToken");

    if (!refreshToken) {
      throw new InvalidTokenError();
    }

    const newAccessToken = await refreshAccessToken({ refreshToken });

    return c.json({ accessToken: newAccessToken }, 200);
  })
  .post("/logout", async (c) => {
    const refreshToken = getCookie(c, "refreshToken");

    if (!refreshToken) {
      throw new InvalidTokenError();
    }

    await logout({ refreshToken });

    setCookie(c, "refreshToken", "", {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: "Lax",
      maxAge: 0,
      path: "/",
    });

    c.status(204);
    return c.body(null);
  })
  .get("/me", async (c) => {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];

    if (!accessToken) {
      throw new InvalidTokenError();
    }

    const authInfo = await getAuthInfo({ accessToken });
    return c.json({ authInfo }, 200);
  });
