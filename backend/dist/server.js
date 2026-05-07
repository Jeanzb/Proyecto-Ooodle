"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const app_1 = require("./app");
const puerto = Number(process.env.PORT ?? 3000);
(0, node_server_1.serve)({
    fetch: app_1.app.fetch,
    port: puerto,
});
console.log(`Backend escuchando en http://localhost:${puerto}`);
