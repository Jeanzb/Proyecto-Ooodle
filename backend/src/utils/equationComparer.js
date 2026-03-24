function compareEquation(targetExpression, guessExpression) {
  const targetSymbols = targetExpression.split("");
  const guessSymbols = guessExpression.split("");
  const remainingSymbols = new Map();
  const feedback = new Array(guessSymbols.length);

  targetSymbols.forEach((symbol, index) => {
    if (guessSymbols[index] === symbol) {
      feedback[index] = {
        position: index,
        symbol,
        status: "CORRECT",
      };
      return;
    }

    remainingSymbols.set(symbol, (remainingSymbols.get(symbol) ?? 0) + 1);
  });

  guessSymbols.forEach((symbol, index) => {
    if (feedback[index]) {
      return;
    }

    const available = remainingSymbols.get(symbol) ?? 0;

    if (available > 0) {
      feedback[index] = {
        position: index,
        symbol,
        status: "PRESENT",
      };
      remainingSymbols.set(symbol, available - 1);
      return;
    }

    feedback[index] = {
      position: index,
      symbol,
      status: "ABSENT",
    };
  });

  return feedback;
}

module.exports = { compareEquation };
