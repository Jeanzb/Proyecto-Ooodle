"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JugadorDAO = void 0;
const Jugador_1 = require("../../modelo/Jugador");
const singleton_Supabase_1 = require("../singleton_Supabase");
const TABLA_USUARIOS = "usuarios";
class JugadorDAO {
    supabaseClient;
    jugadoresPorId;
    idJugadorPorNombre;
    constructor() {
        const singleton = singleton_Supabase_1.SingletonSupabase.getInstance();
        this.supabaseClient = singleton.getClient();
        this.jugadoresPorId = new Map();
        this.idJugadorPorNombre = new Map();
    }
    async create(entidad) {
        try {
            const nombre = entidad.getNombre();
            const nombreNormalizado = nombre.trim().toLowerCase();
            if (this.supabaseClient === null) {
                this.jugadoresPorId.set(entidad.getIdJugador(), entidad);
                this.idJugadorPorNombre.set(nombreNormalizado, entidad.getIdJugador());
                return true;
            }
            const { error } = await this.supabaseClient
                .from(TABLA_USUARIOS)
                .upsert({ nombre_jugador: nombre }, { onConflict: "nombre_jugador", ignoreDuplicates: true });
            if (error)
                throw error;
            this.jugadoresPorId.set(entidad.getIdJugador(), entidad);
            this.idJugadorPorNombre.set(nombreNormalizado, entidad.getIdJugador());
            return true;
        }
        catch {
            return false;
        }
    }
    async obtener(id) {
        if (this.jugadoresPorId.has(id)) {
            return this.jugadoresPorId.get(id) ?? null;
        }
        return null;
    }
    async obtenerPorNombre(nombre) {
        const normalizado = nombre.trim().toLowerCase();
        if (!normalizado)
            return null;
        if (this.idJugadorPorNombre.has(normalizado)) {
            const id = this.idJugadorPorNombre.get(normalizado);
            return this.jugadoresPorId.get(id) ?? null;
        }
        if (this.supabaseClient === null) {
            return null;
        }
        const { data, error } = await this.supabaseClient
            .from(TABLA_USUARIOS)
            .select("nombre_jugador")
            .ilike("nombre_jugador", normalizado)
            .maybeSingle();
        if (error || !data)
            return null;
        const jugador = new Jugador_1.Jugador(Date.now(), data.nombre_jugador, 0);
        this.jugadoresPorId.set(jugador.getIdJugador(), jugador);
        this.idJugadorPorNombre.set(normalizado, jugador.getIdJugador());
        return jugador;
    }
    async listarJugador() {
        if (this.supabaseClient === null) {
            return Array.from(this.jugadoresPorId.values());
        }
        const { data, error } = await this.supabaseClient
            .from(TABLA_USUARIOS)
            .select("nombre_jugador");
        if (error) {
            throw new Error(`No se pudieron listar jugadores: ${error.message}`);
        }
        return (data ?? []).map((r) => new Jugador_1.Jugador(0, r.nombre_jugador, 0));
    }
    async actualizarPuntaje(id, puntos) {
        const jugador = await this.obtener(id);
        if (!jugador)
            return false;
        jugador.sumarPuntaje(puntos);
        return true;
    }
}
exports.JugadorDAO = JugadorDAO;
