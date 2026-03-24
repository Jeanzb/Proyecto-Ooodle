import Row from "./Row";

export default function Grid({ guesses, currentGuess, maxLength, maxAttempts }) {
  const emptyRows =
    maxAttempts - guesses.length - (guesses.length < maxAttempts ? 1 : 0);

  return (
    <div className="flex flex-col items-center">
      {guesses.map((guess) => (
        <Row
          key={guess.id}
          feedback={guess.feedback}
          guess={guess.expression}
          length={maxLength}
        />
      ))}

      {guesses.length < maxAttempts && (
        <Row guess={currentGuess} length={maxLength} />
      )}

      {Array.from({ length: Math.max(0, emptyRows) }).map((_, index) => (
        <Row key={`empty-${index}`} guess="" length={maxLength} />
      ))}
    </div>
  );
}
