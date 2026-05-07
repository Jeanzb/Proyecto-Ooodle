"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jugador = void 0;
class Jugador {
    idJugador;
    nombreJugador;
    puntajeJugador;
    constructor(idJugador = 0, nombreJugador = "", puntajeJugador = 0) {
        this.idJugador = idJugador;
        this.nombreJugador = nombreJugador.trim();
        this.puntajeJugador = puntajeJugador;
    }
    getNombre() {
        return this.nombreJugador;
    }
    getPuntajeTotal() {
        return this.puntajeJugador;
    }
    sumarPuntaje(puntos) {
        if (!Number.isInteger(puntos) || puntos < 0) {
            throw new Error("Los puntos deben ser un entero positivo.");
        }
        this.puntajeJugador += puntos;
    }
    reiniciarPuntaje() {
        this.puntajeJugador = 0;
    }
    getIdJugador() {
        return this.idJugador;
    }
    setNombreJugador(nombre) {
        const normalizado = nombre.trim();
        if (!normalizado) {
            throw new Error("El nombre del jugador no puede estar vacio.");
        }
        this.nombreJugador = normalizado;
    }
}
exports.Jugador = Jugador;
