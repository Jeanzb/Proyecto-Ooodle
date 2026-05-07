"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const hono_1 = require("hono");
const cors_1 = require("hono/cors");
const serve_static_1 = require("@hono/node-server/serve-static");
const routes_1 = require("./routes");
dotenv_1.default.config({ quiet: true });
const app = new hono_1.Hono();
exports.app = app;
app.use((0, cors_1.cors)());
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
app.route("/", routes_1.AppRoutes.router);
const frontendDist = (0, node_path_1.join)(process.cwd(), "..", "frontend", "dist");
if ((0, node_fs_1.existsSync)(frontendDist)) {
    app.use("/assets/*", (0, serve_static_1.serveStatic)({
        root: frontendDist,
    }));
    app.get("/favicon.svg", (0, serve_static_1.serveStatic)({
        path: (0, node_path_1.join)(frontendDist, "favicon.svg"),
    }));
    app.get("*", (0, serve_static_1.serveStatic)({
        path: (0, node_path_1.join)(frontendDist, "index.html"),
    }));
}
