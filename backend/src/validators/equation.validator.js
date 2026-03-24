class EquationValidator {
  constructor() {
    this.pattern = /^[0-9][+][0-9][*][0-9][-][0-9]$/;
    this.allowedLength = 7;
  }

  validateEquationPayload(payload) {
    const expression =
      typeof payload?.expression === "string" ? payload.expression.trim() : "";

    if (!expression) {
      return {
        isValid: false,
        value: null,
        errors: ["La expresion es obligatoria."],
      };
    }

    return {
      isValid: true,
      value: { expression },
      errors: [],
    };
  }

  validateExpression(expression) {
    if (typeof expression !== "string") {
      return { isValid: false, reason: "La ecuacion debe ser texto." };
    }

    if (expression.length !== this.allowedLength) {
      return {
        isValid: false,
        reason: "La ecuacion debe tener exactamente 7 caracteres.",
      };
    }

    if (!this.pattern.test(expression)) {
      return {
        isValid: false,
        reason: "La ecuacion debe seguir el formato A+B*C-D.",
      };
    }

    return {
      isValid: true,
      reason: null,
    };
  }
}

module.exports = { EquationValidator };
