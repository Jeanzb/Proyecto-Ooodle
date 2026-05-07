import { DAO } from "./DAO";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Jugador } from "../../modelo/Jugador";
import { SingletonSupabase } from "../singleton_Supabase";

const TABLA_USUARIOS = "usuarios";

export class JugadorDAO implements DAO<Jugador> {
  private supabaseClient: SupabaseClient | null;
  private jugadoresPorId: Map<number, Jugador>;
  private idJugadorPorNombre: Map<string, number>;

  constructor() {
    const singleton = SingletonSupabase.getInstance();
    this.supabaseClient = singleton.getClient();
    this.jugadoresPorId = new Map();
    this.idJugadorPorNombre = new Map();
  }

  public async create(entidad: Jugador): Promise<boolean> {
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
        .upsert(
          { nombre_jugador: nombre },
          { onConflict: "nombre_jugador", ignoreDuplicates: true },
        );

      if (error) throw error;

      this.jugadoresPorId.set(entidad.getIdJugador(), entidad);
      this.idJugadorPorNombre.set(nombreNormalizado, entidad.getIdJugador());
      return true;
    } catch {
      return false;
    }
  }

  public async obtener(id: number): Promise<Jugador | null> {
    if (this.jugadoresPorId.has(id)) {
      return this.jugadoresPorId.get(id) ?? null;
    }
    return null;
  }

  public async obtenerPorNombre(nombre: string): Promise<Jugador | null> {
    const normalizado = nombre.trim().toLowerCase();
    if (!normalizado) return null;

    if (this.idJugadorPorNombre.has(normalizado)) {
      const id = this.idJugadorPorNombre.get(normalizado)!;
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

    if (error || !data) return null;

    const jugador = new Jugador(Date.now(), data.nombre_jugador, 0);
    this.jugadoresPorId.set(jugador.getIdJugador(), jugador);
    this.idJugadorPorNombre.set(normalizado, jugador.getIdJugador());
    return jugador;
  }

  public async listar(): Promise<Jugador[]> {
    if (this.supabaseClient === null) {
      return Array.from(this.jugadoresPorId.values());
    }

    const { data, error } = await this.supabaseClient
      .from(TABLA_USUARIOS)
      .select("nombre_jugador");

    if (error) {
      throw new Error(`No se pudieron listar jugadores: ${error.message}`);
    }

    return (data ?? []).map((r: any) => new Jugador(0, r.nombre_jugador, 0));
  }

  public async actualizarPuntaje(id: number, puntos: number): Promise<boolean> {
    const jugador = await this.obtener(id);
    if (!jugador) return false;
    jugador.sumarPuntaje(puntos);
    return true;
  }
}
