"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JugadorRoutes = void 0;
const hono_1 = require("hono");
const controlador_Jugador_1 = require("../controlador/controlador_Jugador");
class JugadorRoutes {
    static get router() {
        const router = new hono_1.Hono();
        const controller = new controlador_Jugador_1.controlador_Jugador();
        router.post("/", controller.crearJugador);
        router.get("/", controller.listarJugadores);
        router.get("/:id", controller.obtenerJugador);
        router.post("/:id/puntaje", controller.sumarPuntaje);
        return router;
    }
}
exports.JugadorRoutes = JugadorRoutes;
