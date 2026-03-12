import Row from "./Row";

export default function Grid({
  guesses,
  currentGuess,
  maxLength,
  maxAttempts,
}) {
  // Calculamos cuántas filas vacías nos quedan por dibujar
  // Total (6) menos las que ya se jugaron, menos 1 (que es donde estamos escribiendo)
  const filasVacias =
    maxAttempts - guesses.length - (guesses.length < maxAttempts ? 1 : 0);
  const emptyRows = Array.from({ length: Math.max(0, filasVacias) });

  return (
    <div className="flex flex-col items-center mt-6">
      {/* 1. Dibujamos las filas que ya fueron completadas y enviadas */}
      {guesses.map((guess, index) => (
        <Row key={`guess-${index}`} guess={guess} length={maxLength} />
      ))}

      {/* 2. Dibujamos la fila activa (donde el usuario está escribiendo ahora mismo) */}
      {guesses.length < maxAttempts && (
        <Row guess={currentGuess} length={maxLength} />
      )}

      {/* 3. Dibujamos las filas restantes vacías hacia abajo */}
      {emptyRows.map((_, index) => (
        <Row key={`empty-${index}`} guess="" length={maxLength} />
      ))}
    </div>
  );
}
