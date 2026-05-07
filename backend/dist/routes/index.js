"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const hono_1 = require("hono");
const juego_routes_1 = require("./juego.routes");
const jugador_routes_1 = require("./jugador.routes");
class AppRoutes {
    static get router() {
        const router = new hono_1.Hono();
        const apiRouter = new hono_1.Hono();
        apiRouter.get("/health", (c) => c.json({
            status: "ok",
            timestamp: new Date().toISOString(),
        }));
        apiRouter.route("/juego", juego_routes_1.JuegoRoutes.router);
        apiRouter.route("/jugadores", jugador_routes_1.JugadorRoutes.router);
        router.route("/api", apiRouter);
        return router;
    }
}
exports.AppRoutes = AppRoutes;
