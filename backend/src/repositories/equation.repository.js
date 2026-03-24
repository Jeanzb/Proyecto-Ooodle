class EquationRepository {
  constructor() {
    this.equations = new Map();
  }

  save(equation) {
    this.equations.set(equation.id, equation);
    return equation;
  }

  findById(equationId) {
    return this.equations.get(equationId) ?? null;
  }
}

module.exports = { EquationRepository };
