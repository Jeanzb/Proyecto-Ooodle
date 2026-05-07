"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.juego_Logica = void 0;
const PartidaDAO_1 = require("./dao/PartidaDAO");
const JugadorDAO_1 = require("./dao/JugadorDAO");
const FactoryPartida_1 = require("./factory/FactoryPartida");
const Jugador_1 = require("../modelo/Jugador");
const singleton_Supabase_1 = require("./singleton_Supabase");
class juego_Logica {
    partida;
    jugador;
    partidaDAO;
    jugadorDAO;
    score_Guardado;
    dificultad_Actual;
    puntaje_Aplicado;
    constructor() {
        this.partida = null;
        this.jugador = null;
        singleton_Supabase_1.SingletonSupabase.getInstance();
        this.partidaDAO = new PartidaDAO_1.PartidaDAO();
        this.jugadorDAO = new JugadorDAO_1.JugadorDAO();
        this.score_Guardado = false;
        this.dificultad_Actual = "normal";
        this.puntaje_Aplicado = false;
    }
    iniciar_Juego(nombre_Jugador, dificultad = "normal") {
        const nombre_Normalizado = nombre_Jugador.trim();
        const dificultad_Normalizada = this.normalizar_Dificultad(dificultad);
        if (!nombre_Normalizado) {
            throw new Error("Debes enviar un nombre de jugador valido.");
        }
        this.jugador = new Jugador_1.Jugador(Date.now(), nombre_Normalizado, 0);
        this.dificultad_Actual = dificultad_Normalizada;
        this.partida = FactoryPartida_1.FactoryPartida.crearPartida(dificultad_Normalizada, this.jugador);
        this.score_Guardado = false;
        this.puntaje_Aplicado = false;
    }
    generar_Round() {
        this.obtener_Jugador_Activo();
        this.partida = FactoryPartida_1.FactoryPartida.crearPartida(this.dificultad_Actual, this.jugador);
        this.score_Guardado = false;
        this.puntaje_Aplicado = false;
    }
    validar_Operacion_Jugador(operacion) {
        const partida_Actual = this.obtener_Partida_Activa();
        const operacion_Normalizada = this.normalizar_Operacion(operacion);
        const numeros_Jugador = this.extraer_Numeros_Operacion(operacion_Normalizada);
        const numeros_Secretos = partida_Actual.getNumerosObjetivo();
        const resultado_Operacion = this.calcular_Resultado_Operacion(operacion_Normalizada);
        const es_Correcta = partida_Actual.validarOperacion(operacion_Normalizada);
        if (es_Correcta) {
            this.actualizar_Score();
        }
        const respuesta = {
            ...this.obtener_Estado_Publico(),
            operacion_Validada: operacion_Normalizada,
            resultado_Operacion,
            es_Correcta,
            retroalimentacion: this.construir_Retroalimentacion(numeros_Jugador, numeros_Secretos),
        };
        if (partida_Actual.esTerminado()) {
            respuesta.solucion = numeros_Secretos;
        }
        return JSON.stringify(respuesta);
    }
    actualizar_Score() {
        const partida_Actual = this.obtener_Partida_Activa();
        const jugador_Actual = this.obtener_Jugador_Activo();
        if (this.puntaje_Aplicado) {
            return;
        }
        const puntaje_Actual = partida_Actual.getEstado() === "ganado"
            ? partida_Actual.getPuntaje()
            : 0;
        jugador_Actual.sumarPuntaje(puntaje_Actual);
        this.puntaje_Aplicado = true;
    }
    async guardar_Score() {
        const partida_Actual = this.obtener_Partida_Activa();
        const jugador_Actual = this.obtener_Jugador_Activo();
        if (!partida_Actual.esTerminado()) {
            throw new Error("El juego debe terminar antes de guardar el puntaje.");
        }
        if (this.score_Guardado) {
            return;
        }
        const jugador_Creado = await this.jugadorDAO.create(jugador_Actual);
        const partida_Creada = await this.partidaDAO.create(partida_Actual);
        if (!jugador_Creado || !partida_Creada) {
            throw new Error("No se pudo guardar el puntaje en la base de datos.");
        }
        this.score_Guardado = true;
    }
    async get_ranking() {
        const ranking = await this.partidaDAO.obtenerRankingPartidas();
        return JSON.stringify(ranking);
    }
    obtener_Estado_Publico() {
        const partida_Actual = this.obtener_Partida_Activa();
        const jugador_Actual = this.obtener_Jugador_Activo();
        const estado_Publico = {
            id_Jugador: jugador_Actual.getIdJugador(),
            nombre_Jugador: jugador_Actual.getNombre(),
            dificultad: this.dificultad_Actual,
            ecuacion_Generada: "a+(b\u00D7c)-d",
            numero_Objetivo: partida_Actual.getNumeroObjetivo(),
            intentos_Jugador: partida_Actual.getIntentosJugador(),
            intentos_Maximos: partida_Actual.getIntentosMaximos(),
            intentos_Restantes: Math.max(partida_Actual.getIntentosMaximos() -
                partida_Actual.getIntentosJugador(), 0),
            puntaje_Actual: partida_Actual.getPuntaje(),
            puntaje_Jugador: jugador_Actual.getPuntajeTotal(),
            estatus_Juego: partida_Actual.getEstado(),
            rango_Minimo: 1,
            rango_Maximo: this.dificultad_Actual === "dificil" ? 12 : 9,
            total_Numeros: partida_Actual.getNumerosObjetivo().length,
        };
        if (partida_Actual.esTerminado()) {
            estado_Publico.solucion = partida_Actual.getNumerosObjetivo();
        }
        return estado_Publico;
    }
    obtener_Partida_Activa() {
        if (this.partida === null) {
            throw new Error("Primero debes iniciar el juego.");
        }
        return this.partida;
    }
    obtener_Jugador_Activo() {
        if (this.jugador === null) {
            throw new Error("Primero debes iniciar el juego con un jugador.");
        }
        return this.jugador;
    }
    normalizar_Dificultad(dificultad) {
        return dificultad.toLowerCase() === "dificil" ? "dificil" : "normal";
    }
    normalizar_Operacion(operacion) {
        return operacion.replace(/\s+/g, "").replace(/[xX]/g, "*");
    }
    extraer_Numeros_Operacion(operacion) {
        const coincidencias = operacion.match(/^(\d+)\+(\d+)\*(\d+)-(\d+)$/);
        if (!coincidencias) {
            throw new Error("La operacion debe tener el formato numero+numero*numero-numero.");
        }
        return coincidencias.slice(1).map((v) => Number(v));
    }
    calcular_Resultado_Operacion(operacion) {
        const nums = this.extraer_Numeros_Operacion(operacion);
        return nums[0] + nums[1] * nums[2] - nums[3];
    }
    construir_Retroalimentacion(numeros_Jugador, numeros_Secretos) {
        const retroalimentacion = Array.from({ length: numeros_Jugador.length }, () => "gris");
        const posiciones_Usadas = Array.from({ length: numeros_Secretos.length }, () => false);
        for (let i = 0; i < numeros_Jugador.length; i++) {
            if (numeros_Jugador[i] === numeros_Secretos[i]) {
                retroalimentacion[i] = "verde";
                posiciones_Usadas[i] = true;
            }
        }
        for (let i = 0; i < numeros_Jugador.length; i++) {
            if (retroalimentacion[i] === "verde")
                continue;
            for (let j = 0; j < numeros_Secretos.length; j++) {
                if (posiciones_Usadas[j])
                    continue;
                if (numeros_Jugador[i] === numeros_Secretos[j]) {
                    retroalimentacion[i] = "amarillo";
                    posiciones_Usadas[j] = true;
                    break;
                }
            }
        }
        return retroalimentacion;
    }
}
exports.juego_Logica = juego_Logica;
