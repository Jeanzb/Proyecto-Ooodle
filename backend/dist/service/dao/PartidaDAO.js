"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartidaDAO = void 0;
const Jugador_1 = require("../../modelo/Jugador");
const singleton_Supabase_1 = require("../singleton_Supabase");
const TABLA_PARTIDAS = "partidas";
const TABLA_USUARIOS = "usuarios";
class PartidaDAO {
    supabaseClient;
    partidasLocales;
    constructor() {
        const singleton = singleton_Supabase_1.SingletonSupabase.getInstance();
        this.supabaseClient = singleton.getClient();
        this.partidasLocales = new Map();
    }
    async create(entidad) {
        try {
            if (this.supabaseClient === null) {
                this.partidasLocales.set(entidad.getJugador().getIdJugador(), entidad);
                return true;
            }
            const usuarioId = await this.obtenerOcrearUsuarioId(entidad.getJugador().getNombre());
            const expresionJuego = entidad.getExpresionJuego();
            const ecuacionCompatible = expresionJuego.length === 7 ? expresionJuego : "A+B*C-D";
            const { error } = await this.supabaseClient.from(TABLA_PARTIDAS).insert({
                usuario_id: usuarioId,
                ecuacion_jugada: ecuacionCompatible,
                dificultad: entidad.getDificultad(),
                estado: this.mapearEstado(entidad.getEstado()),
                intentos_usados: entidad.getIntentosJugador(),
                puntaje: entidad.getPuntaje(),
                finished_at: new Date().toISOString(),
            });
            if (error)
                throw error;
            return true;
        }
        catch {
            return false;
        }
    }
    async obtener(id) {
        if (this.partidasLocales.has(id)) {
            return this.partidasLocales.get(id) ?? null;
        }
        return null;
    }
    // Ranking Jugador
    async obtenerRanking() {
        if (this.supabaseClient === null) {
            const jugadores = new Map();
            for (const partida of this.partidasLocales.values()) {
                const j = partida.getJugador();
                const existente = jugadores.get(j.getNombre());
                if (!existente || j.getPuntajeTotal() > existente.getPuntajeTotal()) {
                    jugadores.set(j.getNombre(), j);
                }
            }
            return Array.from(jugadores.values())
                .sort((a, b) => b.getPuntajeTotal() - a.getPuntajeTotal())
                .slice(0, 10);
        }
        const { data, error } = await this.supabaseClient
            .from(TABLA_PARTIDAS)
            .select("puntaje, intentos_usados, estado, created_at, finished_at, usuarios(nombre_jugador)")
            .order("puntaje", { ascending: false })
            .limit(10);
        if (error) {
            throw new Error(`No se pudo consultar el ranking: ${error.message}`);
        }
        return (data ?? []).map((r) => new Jugador_1.Jugador(0, this.obtenerNombreJugador(r), r.puntaje ?? 0));
    }
    // Obtener ranking de partidas
    async obtenerRankingPartidas() {
        if (this.supabaseClient === null) {
            return Array.from(this.partidasLocales.values()).map((p) => ({
                nombre_jugador: p.getJugador().getNombre(),
                puntaje: p.getPuntaje(),
                intentos_usados: p.getIntentosJugador(),
                estado: p.getEstado(),
                created_at: new Date().toISOString(),
                finished_at: new Date().toISOString(),
            }));
        }
        const { data, error } = await this.supabaseClient
            .from(TABLA_PARTIDAS)
            .select("puntaje, intentos_usados, estado, created_at, finished_at, usuarios(nombre_jugador)")
            .order("puntaje", { ascending: false })
            .limit(10);
        if (error) {
            throw new Error(`No se pudo consultar el ranking: ${error.message}`);
        }
        return (data ?? []).map((r) => ({
            nombre_jugador: this.obtenerNombreJugador(r),
            puntaje: r.puntaje ?? 0,
            intentos_usados: r.intentos_usados ?? 0,
            estado: r.estado ?? "abandonada",
            created_at: r.created_at ?? "",
            finished_at: r.finished_at ?? "",
        }));
    }
    obtenerNombreJugador(registro) {
        const usuario = Array.isArray(registro.usuarios)
            ? registro.usuarios[0]
            : registro.usuarios;
        return usuario?.nombre_jugador ?? "anonimo";
    }
    async obtenerOcrearUsuarioId(nombre) {
        if (this.supabaseClient === null) {
            return null;
        }
        const nombreNormalizado = nombre.trim();
        if (!nombreNormalizado) {
            return null;
        }
        const { data: existente, error: errorConsulta } = await this.supabaseClient
            .from(TABLA_USUARIOS)
            .select("id")
            .eq("nombre_jugador", nombreNormalizado)
            .maybeSingle();
        if (errorConsulta) {
            throw errorConsulta;
        }
        if (existente?.id) {
            return existente.id;
        }
        const { data: creado, error: errorCreacion } = await this.supabaseClient
            .from(TABLA_USUARIOS)
            .insert({ nombre_jugador: nombreNormalizado })
            .select("id")
            .single();
        if (errorCreacion) {
            throw errorCreacion;
        }
        return creado?.id ?? null;
    }
    mapearEstado(estado) {
        if (estado === "ganado")
            return "victoria";
        if (estado === "perdido")
            return "derrota";
        return "abandonada";
    }
}
exports.PartidaDAO = PartidaDAO;
