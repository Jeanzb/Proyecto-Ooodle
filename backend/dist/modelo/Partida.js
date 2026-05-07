"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Partida = void 0;
class Partida {
    jugador;
    strategy;
    numerosObjetivo;
    intentosMaximos;
    puntaje;
    estado;
    intentosJugador;
    dificultad;
    constructor(jugador, strategy, dificultad = "normal") {
        this.jugador = jugador;
        this.strategy = strategy;
        this.dificultad = dificultad;
        this.numerosObjetivo = [];
        this.intentosMaximos = this.strategy.calcularIntentosMaximos();
        this.puntaje = 0;
        this.estado = "pendiente";
        this.intentosJugador = 0;
    }
    iniciarJuego() {
        this.intentosJugador = 0;
        this.puntaje = 0;
        this.estado = "en_curso";
        this.generarNumeros();
    }
    generarNumeros() {
        this.numerosObjetivo = this.strategy.generarNumeros();
    }
    validarOperacion(operacion) {
        if (this.esTerminado()) {
            return false;
        }
        const operacionNormalizada = operacion
            .replace(/\s+/g, "")
            .replace(/[xX]/g, "*");
        const coincidencias = operacionNormalizada.match(/^(\d+)\+(\d+)\*(\d+)-(\d+)$/);
        if (!coincidencias) {
            throw new Error("La operacion debe tener el formato numero+numero*numero-numero.");
        }
        const numeros = coincidencias.slice(1).map((v) => Number(v));
        const numsGenerados = this.numerosObjetivo;
        if (numeros.length !== numsGenerados.length) {
            throw new Error("La operacion debe contener 4 numeros.");
        }
        const sortedJugador = [...numeros].sort((a, b) => a - b);
        const sortedGenerados = [...numsGenerados].sort((a, b) => a - b);
        const numerosCorrectos = sortedJugador.every((n, i) => n === sortedGenerados[i]);
        const resultado = numeros[0] + numeros[1] * numeros[2] - numeros[3];
        const numeroObjetivo = numsGenerados[0] +
            numsGenerados[1] * numsGenerados[2] -
            numsGenerados[3];
        this.intentosJugador += 1;
        if (resultado === numeroObjetivo && numerosCorrectos) {
            this.estado = "ganado";
            this.calcularPuntaje();
            return true;
        }
        if (this.intentosJugador >= this.intentosMaximos) {
            this.estado = "perdido";
        }
        return false;
    }
    calcularPuntaje() {
        this.puntaje = this.strategy.calcularPuntaje(this.intentosJugador);
        return this.puntaje;
    }
    esTerminado() {
        return (this.estado === "ganado" ||
            this.estado === "perdido" ||
            this.intentosJugador >= this.intentosMaximos);
    }
    finalizarPartida() {
        if (!this.esTerminado()) {
            this.estado = "finalizado";
        }
    }
    getPuntaje() {
        return this.puntaje;
    }
    getJugador() {
        return this.jugador;
    }
    getNumerosObjetivo() {
        return [...this.numerosObjetivo];
    }
    getIntentosMaximos() {
        return this.intentosMaximos;
    }
    getIntentosJugador() {
        return this.intentosJugador;
    }
    getEstado() {
        return this.estado;
    }
    getDificultad() {
        return this.dificultad;
    }
    getNumeroObjetivo() {
        if (this.numerosObjetivo.length === 0)
            return 0;
        const [a, b, c, d] = this.numerosObjetivo;
        return a + b * c - d;
    }
    getExpresionJuego() {
        if (this.numerosObjetivo.length === 0)
            return "";
        const [a, b, c, d] = this.numerosObjetivo;
        return `${a}+${b}*${c}-${d}`;
    }
}
exports.Partida = Partida;
