"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryPartida = void 0;
const Partida_1 = require("../../modelo/Partida");
const dificultad_Normal_1 = require("../../modelo/strategy/dificultad_Normal");
const dificultad_Dificil_1 = require("../../modelo/strategy/dificultad_Dificil");
class FactoryPartida {
    static crearPartida(dificultad, jugador) {
        const estrategia = FactoryPartida.crearEstrategia(dificultad);
        const partida = new Partida_1.Partida(jugador, estrategia, dificultad);
        partida.iniciarJuego();
        return partida;
    }
    static crearEstrategia(dificultad) {
        if (dificultad === "dificil") {
            return new dificultad_Dificil_1.DificultadDificil();
        }
        return new dificultad_Normal_1.DificultadNormal();
    }
}
exports.FactoryPartida = FactoryPartida;
