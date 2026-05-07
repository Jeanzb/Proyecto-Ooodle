import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";

import { AppRoutes } from "./routes";

dotenv.config({ quiet: true });

const app = new Hono();

app.use(cors());

app.get("/", (c) => {
  return c.json({
    mensaje: "Backend de Ooodle activo.",
    endpoints: [
      "GET /api/health",
      "POST /api/juego/iniciar",
      "GET /api/juego/estado",
      "POST /api/juego/validar",
      "POST /api/juego/guardar-score",
      "GET /api/juego/ranking",
      "POST /api/jugadores",
      "GET /api/jugadores",
      "GET /api/jugadores/:id",
      "POST /api/jugadores/:id/puntaje",
    ],
  });
});

app.route("/", AppRoutes.router);

const frontendDist = join(process.cwd(), "..", "frontend", "dist");

if (existsSync(frontendDist)) {
  app.use(
    "/assets/*",
    serveStatic({
      root: frontendDist,
    }),
  );

  app.get(
    "/favicon.svg",
    serveStatic({
      path: join(frontendDist, "favicon.svg"),
    }),
  );

  app.get(
    "*",
    serveStatic({
      path: join(frontendDist, "index.html"),
    }),
  );
}

export { app };
