"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlador_Juego = void 0;
const MotorPartida_1 = require("./MotorPartida");
class controlador_Juego {
    juego_Logica;
    constructor() {
        this.juego_Logica = new MotorPartida_1.juego_Logica();
    }
    iniciar_Juego = async (c) => {
        try {
            const body = await c.req.json();
            const nombre_Jugador = String(body?.nombre_Jugador ?? "");
            const dificultad = String(body?.dificultad ?? "normal");
            this.juego_Logica.iniciar_Juego(nombre_Jugador, dificultad);
            return c.json({
                mensaje: "Juego iniciado correctamente.",
                juego: this.juego_Logica.obtener_Estado_Publico(),
            }, 201);
        }
        catch (error) {
            return this.responder_Error(c, error, 400);
        }
    };
    mandar_Numeros = (c) => {
        try {
            return c.json(this.juego_Logica.obtener_Estado_Publico(), 200);
        }
        catch (error) {
            return this.responder_Error(c, error, 400);
        }
    };
    validar_Operacion = async (c) => {
        try {
            const body = await c.req.json();
            const operacion = String(body?.operacion ?? "");
            const respuesta = JSON.parse(await this.juego_Logica.validar_Operacion_Jugador(operacion));
            return c.json(respuesta, 200);
        }
        catch (error) {
            return this.responder_Error(c, error, 400);
        }
    };
    guardar_Score = async (c) => {
        try {
            await this.juego_Logica.guardar_Score();
            return c.json({
                mensaje: "Puntaje guardado correctamente.",
            }, 200);
        }
        catch (error) {
            return this.responder_Error(c, error, 400);
        }
    };
    get_ranking = async (c) => {
        try {
            const ranking = JSON.parse(await this.juego_Logica.get_ranking());
            return c.json(ranking, 200);
        }
        catch (error) {
            return this.responder_Error(c, error, 500);
        }
    };
    responder_Error(c, error, status) {
        const mensaje = error instanceof Error ? error.message : "Ocurrio un error inesperado.";
        return c.json({ error: mensaje }, status);
    }
}
exports.controlador_Juego = controlador_Juego;
