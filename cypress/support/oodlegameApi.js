export const jugador = "Tester Cypress";
export const solucion = [2, 3, 4, 1];
export const objetivo = solucion[0] + solucion[1] * solucion[2] - solucion[3];
export const rankingInicial = [
  {
    nombre_jugador: jugador,
    puntaje: 350,
    intentos_usados: 2,
    estado: "acumulado",
    partidas_jugadas: 1,
    mejor_partida: 350,
  },
];

export function estadoJuego(overrides = {}) {
  const dificultad = overrides.dificultad || "normal";
  const estatus = overrides.estatus_Juego || "en_curso";
  const finalizada = estatus === "ganado" || estatus === "perdido";

  return {
    id_Jugador: 101,
    nombre_Jugador: overrides.nombre_Jugador || jugador,
    dificultad,
    ecuacion_Generada: "a+(b\u00D7c)-d",
    numero_Objetivo: objetivo,
    intentos_Jugador: 0,
    intentos_Maximos: 6,
    intentos_Restantes: 6,
    puntaje_Actual: 0,
    puntaje_Jugador: 0,
    estatus_Juego: estatus,
    rango_Minimo: 1,
    rango_Maximo: dificultad === "dificil" ? 12 : 9,
    total_Numeros: 4,
    solucion: finalizada ? solucion : undefined,
    ...overrides,
  };
}

export function prepararApiJuego(options = {}) {
  const estadoApi = {
    operacionesValidadas: [],
    partidasIniciadas: [],
    scoreGuardado: 0,
    rankingConsultado: 0,
  };

  const rankingRespuesta = options.ranking ?? rankingInicial;

  cy.wrap(estadoApi).as("estadoApi");

  cy.intercept("GET", "/api/juego/estado", (req) => {
    if (options.estadoInicial) {
      req.reply({ statusCode: 200, body: options.estadoInicial });
      return;
    }

    req.reply({
      statusCode: 400,
      body: { error: "Primero debes iniciar el juego." },
    });
  }).as("obtenerEstado");

  cy.intercept("GET", "/api/juego/ranking", (req) => {
    estadoApi.rankingConsultado += 1;

    if (options.rankingError) {
      req.reply({
        statusCode: 500,
        body: { error: "No se pudo consultar el ranking." },
      });
      return;
    }

    req.reply({ statusCode: 200, body: rankingRespuesta });
  }).as("obtenerRanking");

  cy.intercept("POST", "/api/juego/iniciar", (req) => {
    const nombre = String(req.body.nombre_Jugador || "").trim();
    const dificultad = req.body.dificultad === "dificil" ? "dificil" : "normal";

    if (options.iniciarError) {
      req.reply({
        statusCode: 500,
        body: { error: "No se pudo iniciar la partida." },
      });
      return;
    }

    if (!nombre) {
      req.reply({
        statusCode: 400,
        body: { error: "Debes enviar un nombre de jugador valido." },
      });
      return;
    }

    estadoApi.partidasIniciadas.push({ nombre_Jugador: nombre, dificultad });
    req.reply({
      statusCode: 201,
      body: {
        mensaje: "Juego iniciado correctamente.",
        juego: estadoJuego({ nombre_Jugador: nombre, dificultad }),
      },
    });
  }).as("iniciarJuego");

  cy.intercept("POST", "/api/juego/validar", (req) => {
    const operacion = String(req.body.operacion || "");
    const numeroIntento = estadoApi.operacionesValidadas.length + 1;
    const esCorrecta = operacion === "2+3*4-1";
    const esDerrota = Boolean(options.forzarDerrota) && numeroIntento >= 6;

    estadoApi.operacionesValidadas.push(operacion);

    if (options.validarError) {
      req.reply({
        statusCode: 400,
        body: { error: "La operacion debe tener el formato numero+numero*numero-numero." },
      });
      return;
    }

    req.reply({
      statusCode: 200,
      body: {
        ...estadoJuego({
          intentos_Jugador: esCorrecta || esDerrota ? numeroIntento : 1,
          intentos_Restantes: Math.max(6 - numeroIntento, 0),
          puntaje_Actual: esCorrecta ? 350 : 0,
          puntaje_Jugador: esCorrecta ? 350 : 0,
          estatus_Juego: esCorrecta ? "ganado" : esDerrota ? "perdido" : "en_curso",
          solucion: esCorrecta || esDerrota ? solucion : undefined,
        }),
        operacion_Validada: operacion,
        resultado_Operacion: esCorrecta ? objetivo : 11,
        es_Correcta: esCorrecta,
        retroalimentacion: esCorrecta
          ? ["verde", "verde", "verde", "verde"]
          : ["amarillo", "amarillo", "amarillo", "amarillo"],
      },
    });
  }).as("validarRespuesta");

  cy.intercept("POST", "/api/juego/guardar-score", (req) => {
    estadoApi.scoreGuardado += 1;
    req.reply({
      statusCode: 200,
      body: { mensaje: "Puntaje guardado correctamente." },
    });
  }).as("guardarScore");
}
