"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const hono_1 = require("hono");
const juego_routes_1 = require("./juego.routes");
const jugador_routes_1 = require("./jugador.routes");
class AppRoutes {
    static get router() {
        const router = new hono_1.Hono();
        const apiV1Router = this.crear_Api_V1_Router();
        const apiLegacyRouter = this.crear_Api_V1_Router();
        router.route("/api/v1", apiV1Router);
        router.route("/api", apiLegacyRouter);
        return router;
    }
    static crear_Api_V1_Router() {
        const apiRouter = new hono_1.Hono();
        apiRouter.get("/health", (c) => c.json({
            status: "ok",
            apiVersion: "v1",
            timestamp: new Date().toISOString(),
        }));
        apiRouter.route("/juego", juego_routes_1.JuegoRoutes.router);
        apiRouter.route("/jugadores", jugador_routes_1.JugadorRoutes.router);
        return apiRouter;
    }
}
exports.AppRoutes = AppRoutes;
