const crypto = require("crypto");
const {
  evaluateEquation,
  extractEquationTerms,
} = require("../utils/equationParser");
const { compareEquation } = require("../utils/equationComparer");

class EquationService {
  constructor({ equationRepository, equationValidator }) {
    this.equationRepository = equationRepository;
    this.equationValidator = equationValidator;
    this.pattern = "A+B*C-D";
    this.expressionLength = 7;
  }

  generateEquation() {
    const a = this.generateDigit();
    const b = this.generateDigit();
    const c = this.generateDigit();
    const d = this.generateDigit();
    const expression = `${a}+${b}*${c}-${d}`;
    const result = evaluateEquation(expression);

    return {
      id: crypto.randomUUID(),
      expression,
      result,
      pattern: this.pattern,
      terms: extractEquationTerms(expression),
      createdAt: new Date().toISOString(),
    };
  }

  getEquationConfig() {
    return {
      pattern: this.pattern,
      expressionLength: this.expressionLength,
      maxAttempts: 6,
      operators: ["+", "*", "-"],
      precedence: ["*", "+", "-"],
    };
  }

  validateExpression(expression) {
    return this.equationValidator.validateExpression(expression);
  }

  compareGuess(targetExpression, guessExpression) {
    return compareEquation(targetExpression, guessExpression);
  }

  generateDigit() {
    return Math.floor(Math.random() * 10);
  }
}

module.exports = { EquationService };
