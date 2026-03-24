class GameValidator {
  validateCreateGamePayload(payload) {
    return {
      isValid: true,
      value: payload ?? {},
      errors: [],
    };
  }

  validateGameIdPayload(payload) {
    const gameId = typeof payload?.gameId === "string" ? payload.gameId.trim() : "";

    if (!gameId) {
      return {
        isValid: false,
        value: null,
        errors: ["El identificador de la partida es obligatorio."],
      };
    }

    return {
      isValid: true,
      value: { gameId },
      errors: [],
    };
  }

  validateGuessPayload(payload) {
    const gameId = typeof payload?.gameId === "string" ? payload.gameId.trim() : "";
    const expression =
      typeof payload?.expression === "string" ? payload.expression.trim() : "";
    const errors = [];

    if (!gameId) {
      errors.push("El identificador de la partida es obligatorio.");
    }

    if (!expression) {
      errors.push("La expresion es obligatoria.");
    }

    return {
      isValid: errors.length === 0,
      value: errors.length === 0 ? { gameId, expression } : null,
      errors,
    };
  }
}

module.exports = { GameValidator };
