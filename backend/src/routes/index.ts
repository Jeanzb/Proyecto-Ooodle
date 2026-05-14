import { Hono } from "hono";

import { JuegoRoutes } from "./juego.routes";
import { JugadorRoutes } from "./jugador.routes";

export class AppRoutes {
  public static get router() {
    const router = new Hono();
    const apiV1Router = this.crear_Api_V1_Router();
    const apiLegacyRouter = this.crear_Api_V1_Router();

    router.route("/api/v1", apiV1Router);
    router.route("/api", apiLegacyRouter);

    return router;
  }

  private static crear_Api_V1_Router() {
    const apiRouter = new Hono();

    apiRouter.get("/health", (c) =>
      c.json({
        status: "ok",
        apiVersion: "v1",
        timestamp: new Date().toISOString(),
      }),
    );

    apiRouter.route("/juego", JuegoRoutes.router);
    apiRouter.route("/jugadores", JugadorRoutes.router);

    return apiRouter;
  }
}
