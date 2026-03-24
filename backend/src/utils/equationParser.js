function extractEquationTerms(expression) {
  const [a, , b, , c, , d] = expression.split("");

  return {
    a: Number(a),
    b: Number(b),
    c: Number(c),
    d: Number(d),
  };
}

function evaluateEquation(expression) {
  const { a, b, c, d } = extractEquationTerms(expression);
  return a + b * c - d;
}

module.exports = {
  extractEquationTerms,
  evaluateEquation,
};
