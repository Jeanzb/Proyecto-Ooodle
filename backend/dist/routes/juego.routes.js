"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JuegoRoutes = void 0;
const hono_1 = require("hono");
const controlador_Juego_1 = require("../controlador/controlador_Juego");
class JuegoRoutes {
    static get router() {
        const router = new hono_1.Hono();
        const controller = new controlador_Juego_1.controlador_Juego();
        router.post("/iniciar", controller.iniciar_Juego);
        router.get("/estado", controller.mandar_Numeros);
        router.post("/validar", controller.validar_Operacion);
        router.post("/guardar-score", controller.guardar_Score);
        router.get("/ranking", controller.get_ranking);
        return router;
    }
}
exports.JuegoRoutes = JuegoRoutes;
