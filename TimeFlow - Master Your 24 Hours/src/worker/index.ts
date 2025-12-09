import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  getOAuthRedirectUrl,
  exchangeCodeForSessionToken,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";

const app = new Hono<{ Bindings: Env }>();

// ===== Authentication Routes =====

app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// ===== Activity Routes =====

const createActivitySchema = z.object({
  activity_name: z.string().min(1),
  minutes: z.number().int().positive(),
  activity_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.string().optional(),
});

const updateActivitySchema = z.object({
  activity_name: z.string().min(1).optional(),
  minutes: z.number().int().positive().optional(),
  category: z.string().optional(),
});

app.post(
  "/api/activities",
  authMiddleware,
  zValidator("json", createActivitySchema),
  async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { activity_name, minutes, activity_date, category } = c.req.valid("json");

    // Check if adding this would exceed 1440 minutes for the day
    const result = await c.env.DB.prepare(
      "SELECT COALESCE(SUM(minutes), 0) as total_minutes FROM activities WHERE user_id = ? AND activity_date = ?"
    )
      .bind(user.id, activity_date)
      .first<{ total_minutes: number }>();

    const total_minutes = result?.total_minutes || 0;

    if (total_minutes + minutes > 1440) {
      return c.json(
        {
          error: "Cannot exceed 1440 minutes (24 hours) per day",
          current_total: total_minutes,
          attempted_total: total_minutes + minutes,
        },
        400
      );
    }

    const insertResult = await c.env.DB.prepare(
      "INSERT INTO activities (user_id, activity_name, minutes, activity_date, category) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(user.id, activity_name, minutes, activity_date, category || null)
      .run();

    const activity = await c.env.DB.prepare(
      "SELECT * FROM activities WHERE id = ?"
    )
      .bind(insertResult.meta.last_row_id)
      .first();

    return c.json(activity, 201);
  }
);

app.get("/api/activities", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const date = c.req.query("date");

  if (!date) {
    return c.json({ error: "Date parameter is required" }, 400);
  }

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE user_id = ? AND activity_date = ? ORDER BY created_at ASC"
  )
    .bind(user.id, date)
    .all();

  return c.json(results);
});

app.put(
  "/api/activities/:id",
  authMiddleware,
  zValidator("json", updateActivitySchema),
  async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param("id");
    const updates = c.req.valid("json");

    // Verify the activity belongs to the user
    const activity = await c.env.DB.prepare(
      "SELECT * FROM activities WHERE id = ? AND user_id = ?"
    )
      .bind(id, user.id)
      .first<any>();

    if (!activity) {
      return c.json({ error: "Activity not found" }, 404);
    }

    // If minutes are being updated, check total for the day
    if (updates.minutes !== undefined) {
      const result = await c.env.DB.prepare(
        "SELECT COALESCE(SUM(minutes), 0) as total_minutes FROM activities WHERE user_id = ? AND activity_date = ? AND id != ?"
      )
        .bind(user.id, activity.activity_date, id)
        .first<{ total_minutes: number }>();

      const other_minutes = result?.total_minutes || 0;

      if (other_minutes + updates.minutes > 1440) {
        return c.json(
          {
            error: "Cannot exceed 1440 minutes (24 hours) per day",
            current_total: other_minutes,
            attempted_total: other_minutes + updates.minutes,
          },
          400
        );
      }
    }

    const setParts: string[] = [];
    const values: any[] = [];

    if (updates.activity_name !== undefined) {
      setParts.push("activity_name = ?");
      values.push(updates.activity_name);
    }
    if (updates.minutes !== undefined) {
      setParts.push("minutes = ?");
      values.push(updates.minutes);
    }
    if (updates.category !== undefined) {
      setParts.push("category = ?");
      values.push(updates.category || null);
    }

    setParts.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id, user.id);

    await c.env.DB.prepare(
      `UPDATE activities SET ${setParts.join(", ")} WHERE id = ? AND user_id = ?`
    )
      .bind(...values)
      .run();

    const updatedActivity = await c.env.DB.prepare(
      "SELECT * FROM activities WHERE id = ?"
    )
      .bind(id)
      .first();

    return c.json(updatedActivity, 200);
  }
);

app.delete("/api/activities/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const id = c.req.param("id");

  // Verify the activity belongs to the user
  const activity = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE id = ? AND user_id = ?"
  )
    .bind(id, user.id)
    .first();

  if (!activity) {
    return c.json({ error: "Activity not found" }, 404);
  }

  await c.env.DB.prepare("DELETE FROM activities WHERE id = ?")
    .bind(id)
    .run();

  return c.json({ success: true }, 200);
});

app.get("/api/activities/summary", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const date = c.req.query("date");

  if (!date) {
    return c.json({ error: "Date parameter is required" }, 400);
  }

  const { results: activities } = await c.env.DB.prepare(
    "SELECT * FROM activities WHERE user_id = ? AND activity_date = ? ORDER BY minutes DESC"
  )
    .bind(user.id, date)
    .all();

  const result = await c.env.DB.prepare(
    "SELECT COALESCE(SUM(minutes), 0) as total_minutes FROM activities WHERE user_id = ? AND activity_date = ?"
  )
    .bind(user.id, date)
    .first<{ total_minutes: number }>();

  const total_minutes = result?.total_minutes || 0;

  return c.json({
    activities,
    total_minutes,
    is_complete: total_minutes === 1440,
  });
});

export default app;
