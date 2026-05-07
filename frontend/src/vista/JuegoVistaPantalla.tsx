import { useState, type FormEvent } from "react";

import { useJuego, useRanking } from "../hooks";
import { juego_Vista } from "./juego_Vista";

const OPERADORES = ["+", "\u00D7", "-"] as const;

function obtener_Clase_Celda(estado: string): string {
  return `tablero_Celda tablero_Celda--${estado}`;
}

function obtener_Clase_Tecla(estado: string): string {
  return `tecla_Numerica tecla_Numerica--${estado}`;
}

function Icono_Home() {
  return (
    <svg aria-hidden="true" className="icono" fill="none" viewBox="0 0 24 24">
      <path d="M4 10.5L12 4l8 6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M6.5 9.5V20h11V9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M10 20v-5h4v5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function Icono_Calculadora() {
  return (
    <svg aria-hidden="true" className="icono" fill="none" viewBox="0 0 24 24">
      <rect x="5" y="3" width="14" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
    </svg>
  );
}

function Icono_Trofeo() {
  return (
    <svg aria-hidden="true" className="icono" fill="none" viewBox="0 0 24 24">
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 6H5a3 3 0 0 0 3 3M16 6h3a3 3 0 0 1-3 3M12 12v4M9 20h6M10 16h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function Icono_Reiniciar() {
  return (
    <svg aria-hidden="true" className="icono" fill="none" viewBox="0 0 24 24">
      <path d="M4 12a8 8 0 1 0 2.35-5.65L4 8.7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M4 4v4.7h4.7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export function JuegoVistaPantalla() {
  const [vista] = useState(() => new juego_Vista());
  const { ranking_Diferido, isPending, cargar_Ranking } = useRanking(vista);
  const {
    pantalla_Actual,
    usuario,
    juego,
    nombre_Usuario,
    dificultad,
    mensaje,
    error,
    cargando,
    guardando,
    puntaje_Guardado,
    modal_Visible,
    filas_Tablero,
    numeros_Teclado,
    estados_Teclado,
    seleccion_Actual,
    ecuacion_Mostrada,
    partida_Finalizada,
    set_Nombre_Usuario,
    set_Dificultad,
    iniciar_Partida,
    reiniciar_Partida,
    volver_A_Inicio,
    agregar_Numero,
    eliminar_Numero,
    limpiar_Seleccion,
    revisar_Intento,
    guardar_Puntaje,
  } = useJuego(vista, cargar_Ranking);

  function on_Submit_Inicio(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void iniciar_Partida();
  }

  if (pantalla_Actual === "inicio") {
    return (
      <main className="shell shell--home">
        <header className="hero_Inicio">
          <span className="badge_Marca">Reto numerico diario</span>
          <h1>Ooodle</h1>
          <p>Encuentra los cuatro numeros que completan la ecuacion. Seis intentos. Una solucion.</p>
        </header>

        <div className="layout_Inicio">
          <section className="panel panel--bienvenida" aria-labelledby="start-title">
            <div className="panel_Cabecera">
              <span className="panel_Icono panel_Icono--teal">
                <Icono_Calculadora />
              </span>
              <div>
                <h2 id="start-title">Iniciar partida</h2>
                <p>Configura el jugador, elige la dificultad y entra al tablero.</p>
              </div>
            </div>

            <form className="formulario_Juego" onSubmit={on_Submit_Inicio}>
              <label className="campo">
                <span>Nombre del jugador</span>
                <input
                  value={nombre_Usuario}
                  onChange={(event) => set_Nombre_Usuario(event.target.value)}
                  placeholder="Ej. Ada"
                  maxLength={24}
                  autoComplete="off"
                />
                <small>Este nombre aparecera en el ranking cuando guardes el puntaje.</small>
              </label>

              <fieldset className="campo">
                <legend>Dificultad</legend>
                <div className="selector_Dificultad">
                  <button
                    type="button"
                    className={
                      dificultad === "normal"
                        ? "chip_Dificultad chip_Dificultad--activa"
                        : "chip_Dificultad"
                    }
                    onClick={() => set_Dificultad("normal")}
                  >
                    <strong>Normal</strong>
                    <span>Numeros 1-9</span>
                    <small>Menos opciones, partida clasica.</small>
                  </button>
                  <button
                    type="button"
                    className={
                      dificultad === "dificil"
                        ? "chip_Dificultad chip_Dificultad--activa"
                        : "chip_Dificultad"
                    }
                    onClick={() => set_Dificultad("dificil")}
                  >
                    <strong>Dificil</strong>
                    <span>Numeros 1-12</span>
                    <small>Mas opciones, logica mas exigente.</small>
                  </button>
                </div>
              </fieldset>

              <button className="boton_Principal" type="submit" disabled={cargando}>
                {cargando ? "Iniciando..." : "Iniciar juego"}
              </button>
            </form>

            {error ? <div className="alerta_Error">{error}</div> : null}

            <div className="como_Jugar">
              <span>Como jugar</span>
              <p>Debes descubrir cuatro numeros y su orden exacto para completar:</p>
              <strong>a + (b × c) - d = objetivo</strong>
              <p>Selecciona un numero para cada espacio. No puedes repetir numeros en el mismo intento.</p>
              <p>Al validar, verde significa posicion correcta, amarillo significa numero correcto en otra posicion y gris significa que no esta en la solucion.</p>
            </div>
          </section>

          <aside className="panel panel--ranking" aria-labelledby="ranking-title">
            <div className="panel_Cabecera panel_Cabecera--ranking">
              <span className="panel_Icono panel_Icono--coral">
                <Icono_Trofeo />
              </span>
              <div>
                <h2 id="ranking-title">Ranking</h2>
                <p>Mejores puntajes guardados.</p>
              </div>
              <button
                className="boton_Icono"
                type="button"
                onClick={() => void cargar_Ranking()}
                disabled={isPending}
              >
                Actualizar
              </button>
            </div>

            <p className="descripcion descripcion--compacta">{mensaje}</p>

            {ranking_Diferido.length === 0 ? (
              <div className="ranking_Vacio">
                <Icono_Trofeo />
                <strong>Aun no hay puntajes</strong>
                <p>Gana una partida y guarda tu resultado para aparecer aqui.</p>
              </div>
            ) : (
              <ol className="ranking_Lista">
                {ranking_Diferido.map((registro, indice) => (
                  <li className="ranking_Item" key={`${registro.nombre_jugador}-${indice}`}>
                    <span className={`ranking_Posicion ranking_Posicion--${indice + 1}`}>
                      {indice + 1}
                    </span>
                    <div>
                      <strong>{registro.nombre_jugador}</strong>
                      <span>
                        {registro.estado} · {registro.intentos_usados}/6 intentos
                      </span>
                    </div>
                    <strong className="ranking_Puntaje">{registro.puntaje}</strong>
                  </li>
                ))}
              </ol>
            )}
          </aside>
        </div>

        <footer className="pie_Inicio">
          Inspirado en Wordle · Creado para entrenar la mente
        </footer>
      </main>
    );
  }

  return (
    <main className="shell shell--game">
      <header className="encabezado_Juego">
        <button className="boton_Casa" type="button" onClick={volver_A_Inicio} aria-label="Volver al inicio">
          <Icono_Home />
          <span>Inicio</span>
        </button>

        <div className="marca_Juego">
          <h1 className="titulo_Juego">Ooodle</h1>
          <span>{usuario?.get_nombre_Usuario()} · {dificultad}</span>
        </div>

        <button
          className="boton_Reiniciar"
          type="button"
          onClick={() => void reiniciar_Partida()}
          disabled={cargando}
        >
          <Icono_Reiniciar />
          Reiniciar
        </button>
      </header>

      <section className="objetivo_Juego">
        <span>Objetivo</span>
        <p>
          Encuentra los cuatro numeros que hacen que <strong>{ecuacion_Mostrada}</strong>{" "}
          sea igual al resultado. Te quedan <strong>{juego?.get_intentos_Restantes() ?? 6}</strong>{" "}
          intentos.
        </p>
      </section>

      <section className="bloque_Principal">
        {error ? <div className="alerta_Error alerta_Error--centrada">{error}</div> : null}

        <div className="tablero_Grid" role="grid" aria-label="Tablero del juego">
          {filas_Tablero.map((fila, indice_Fila) => (
            <div className="fila_Tablero" key={fila.id} role="row">
              {fila.numeros.map((numero, indice) => (
                <div className="segmento_Fila" key={`${fila.id}-${indice}`}>
                  <div
                    className={obtener_Clase_Celda(fila.estados[indice])}
                    role="gridcell"
                    aria-label={
                      numero === null
                        ? `Posicion ${indice + 1}: vacia`
                        : `Posicion ${indice + 1}: ${numero}, ${fila.estados[indice]}`
                    }
                  >
                    {numero ?? ""}
                  </div>
                  {indice < fila.numeros.length - 1 ? (
                    <span className="operador_Tablero">{OPERADORES[indice]}</span>
                  ) : null}
                </div>
              ))}
              <span className="operador_Tablero">=</span>
              {indice_Fila === juego?.get_intentos_Jugador() && !partida_Finalizada ? (
                <button
                  type="button"
                  className={
                    seleccion_Actual.length === 4
                      ? "resultado_Tablero resultado_Tablero--activo"
                      : "resultado_Tablero"
                  }
                  onClick={() => void revisar_Intento()}
                  disabled={cargando || seleccion_Actual.length !== 4}
                  aria-label={`Validar intento. El resultado objetivo es ${fila.resultado}`}
                >
                  {fila.resultado}
                </button>
              ) : (
                <div className="resultado_Tablero">{fila.resultado}</div>
              )}
            </div>
          ))}
        </div>

        <section className="leyenda_Juego" aria-label="Leyenda de colores">
          <span><i className="swatch swatch--correct" />Posicion correcta</span>
          <span><i className="swatch swatch--present" />Otra posicion</span>
          <span><i className="swatch swatch--absent" />No esta</span>
          <span><i className="swatch swatch--selected" />Seleccionado</span>
        </section>

        <section className="teclado_Numerico" aria-label="Teclado numerico">
          <div className="teclado_Grid">
            {numeros_Teclado.map((numero) => {
              const estado = estados_Teclado.get(numero) ?? "empty";

              return (
                <button
                  key={numero}
                  className={obtener_Clase_Tecla(estado)}
                  type="button"
                  onClick={() => agregar_Numero(numero)}
                  disabled={
                    juego === null ||
                    partida_Finalizada ||
                    cargando
                  }
                  aria-label={`Numero ${numero}${estado !== "empty" ? `, ${estado}` : ""}`}
                >
                  {numero}
                </button>
              );
            })}
          </div>

          <div className="acciones_Teclado">
            <button
              className="boton_Principal boton_Principal--teclado"
              type="button"
              onClick={() => void revisar_Intento()}
              disabled={
                cargando ||
                juego === null ||
                partida_Finalizada ||
                seleccion_Actual.length !== 4
              }
            >
              Enviar ecuacion
            </button>
            <button
              className="boton_Secundario boton_Secundario--teclado"
              type="button"
              onClick={limpiar_Seleccion}
              disabled={seleccion_Actual.length === 0 || cargando || partida_Finalizada}
            >
              Limpiar
            </button>
            <button
              className="boton_Secundario boton_Secundario--teclado"
              type="button"
              onClick={eliminar_Numero}
              disabled={seleccion_Actual.length === 0 || cargando || partida_Finalizada}
            >
              Borrar
            </button>
          </div>
        </section>
      </section>

      {modal_Visible && juego !== null ? (
        <div className="modal_Fondo" role="presentation">
          <div className="modal_Final" role="dialog" aria-modal="true">
            <div
              className={
                juego.get_estatus_Juego() === "ganado"
                  ? "modal_Icono modal_Icono--victoria"
                  : "modal_Icono modal_Icono--derrota"
              }
            >
              {juego.get_estatus_Juego() === "ganado" ? "OK" : "X"}
            </div>
            <h2>{juego.get_estatus_Juego() === "ganado" ? "Lo resolviste" : "Sin intentos"}</h2>
            <p className="modal_Texto">{mensaje}</p>
            <p className="modal_Solucion">
              Solucion: <strong>{juego.get_solucion_Formateada()}</strong>
            </p>
            <div className="modal_Acciones">
              <button
                className="boton_Secundario"
                type="button"
                onClick={() => void guardar_Puntaje()}
                disabled={guardando || puntaje_Guardado}
              >
                {puntaje_Guardado ? "Puntaje guardado" : "Guardar puntaje"}
              </button>
              <button
                className="boton_Principal"
                type="button"
                onClick={() => void reiniciar_Partida()}
                disabled={cargando}
              >
                Jugar de nuevo
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
