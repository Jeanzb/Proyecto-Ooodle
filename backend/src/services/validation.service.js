class ValidationService {
  constructor({ gameValidator, equationValidator }) {
    this.gameValidator = gameValidator;
    this.equationValidator = equationValidator;
  }

  validateCreateGameRequest(payload) {
    return this.gameValidator.validateCreateGamePayload(payload);
  }

  validateGameIdRequest(payload) {
    return this.gameValidator.validateGameIdPayload(payload);
  }

  validateGuessRequest(payload) {
    return this.gameValidator.validateGuessPayload(payload);
  }

  validateEquationRequest(payload) {
    return this.equationValidator.validateEquationPayload(payload);
  }

  validateEquationExpression(expression) {
    return this.equationValidator.validateExpression(expression);
  }
}

module.exports = { ValidationService };
