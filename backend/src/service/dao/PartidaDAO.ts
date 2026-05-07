import { DAO } from './DAO';
import type { SupabaseClient } from "@supabase/supabase-js";
import { Partida } from "../../modelo/Partida";
import { Jugador } from "../../modelo/Jugador";
import { SingletonSupabase } from "../singleton_Supabase";

const TABLA_PARTIDAS = "partidas";
const TABLA_USUARIOS = "usuarios";

type ranking_Partida_Row = {
  puntaje: number | null;
  intentos_usados: number | null;
  estado: string | null;
  created_at: string | null;
  finished_at: string | null;
  usuarios:
    | { nombre_jugador: string | null }
    | { nombre_jugador: string | null }[]
    | null;
};

export class PartidaDAO implements DAO<Partida> {
  private supabaseClient: SupabaseClient | null;
  private partidasLocales: Map<number, Partida>;

  constructor() {
    const singleton = SingletonSupabase.getInstance();
    this.supabaseClient = singleton.getClient();
    this.partidasLocales = new Map();
  }

  public async create(entidad: Partida): Promise<boolean> {
    try {
      if (this.supabaseClient === null) {
        this.partidasLocales.set(
          entidad.getJugador().getIdJugador(),
          entidad,
        );
        return true;
      }

      const usuarioId = await this.obtenerOcrearUsuarioId(
        entidad.getJugador().getNombre(),
      );

      const expresionJuego = entidad.getExpresionJuego();
      const ecuacionCompatible =
        expresionJuego.length === 7 ? expresionJuego : "A+B*C-D";

      const { error } = await this.supabaseClient.from(TABLA_PARTIDAS).insert({
        usuario_id: usuarioId,
        ecuacion_jugada: ecuacionCompatible,
        dificultad: entidad.getDificultad(),
        estado: this.mapearEstado(entidad.getEstado()),
        intentos_usados: entidad.getIntentosJugador(),
        puntaje: entidad.getPuntaje(),
        finished_at: new Date().toISOString(),
      });

      if (error) throw error;
      return true;
    } catch {
      return false;
    }
  }

  public async obtener(id: number): Promise<Partida | null> {
    if (this.partidasLocales.has(id)) {
      return this.partidasLocales.get(id) ?? null;
    }
    return null;
  }

  // Ranking Jugador
  public async obtenerRanking(): Promise<Jugador[]> {
    if (this.supabaseClient === null) {
      const jugadores = new Map<string, Jugador>();
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

    return ((data ?? []) as unknown as ranking_Partida_Row[]).map(
      (r) => new Jugador(0, this.obtenerNombreJugador(r), r.puntaje ?? 0),
    );
  }

  // Obtener ranking de partidas
  public async obtenerRankingPartidas(): Promise<
    {
      nombre_jugador: string;
      puntaje: number;
      intentos_usados: number;
      estado: string;
      created_at: string;
      finished_at: string;
    }[]
  > {
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

    return ((data ?? []) as unknown as ranking_Partida_Row[]).map((r) => ({
      nombre_jugador: this.obtenerNombreJugador(r),
      puntaje: r.puntaje ?? 0,
      intentos_usados: r.intentos_usados ?? 0,
      estado: r.estado ?? "abandonada",
      created_at: r.created_at ?? "",
      finished_at: r.finished_at ?? "",
    }));
  }

  private obtenerNombreJugador(registro: ranking_Partida_Row): string {
    const usuario = Array.isArray(registro.usuarios)
      ? registro.usuarios[0]
      : registro.usuarios;

    return usuario?.nombre_jugador ?? "anonimo";
  }

  private async obtenerOcrearUsuarioId(nombre: string): Promise<string | null> {
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
      return existente.id as string;
    }

    const { data: creado, error: errorCreacion } = await this.supabaseClient
      .from(TABLA_USUARIOS)
      .insert({ nombre_jugador: nombreNormalizado })
      .select("id")
      .single();

    if (errorCreacion) {
      throw errorCreacion;
    }

    return (creado?.id as string | undefined) ?? null;
  }

  private mapearEstado(estado: string): "victoria" | "derrota" | "abandonada" {
    if (estado === "ganado") return "victoria";
    if (estado === "perdido") return "derrota";
    return "abandonada";
  }
}
