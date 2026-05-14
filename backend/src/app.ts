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

app.get("/", (c) => {
  return c.json({
    mensaje: "Backend de Ooodle activo.",
    apiVersion: "v1",
    endpoints: [
      "GET /api/v1/health",
      "POST /api/v1/juego/iniciar",
      "GET /api/v1/juego/estado",
      "POST /api/v1/juego/validar",
      "POST /api/v1/juego/guardar-score",
      "GET /api/v1/juego/ranking",
      "POST /api/v1/jugadores",
      "GET /api/v1/jugadores",
      "GET /api/v1/jugadores/:id",
      "POST /api/v1/jugadores/:id/puntaje",
    ],
    legacyEndpoints: "Las rutas /api/... siguen disponibles como alias temporal de /api/v1/...",
  });
});

export { app };
