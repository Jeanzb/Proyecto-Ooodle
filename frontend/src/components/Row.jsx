import Cell from "./Cell";

export default function Row({ guess, length, feedback = [] }) {
  const symbols = guess.padEnd(length, " ").split("");

  return (
    <div className="mb-2 flex justify-center gap-2">
      {symbols.map((symbol, index) => (
        <Cell
          key={`${symbol}-${index}`}
          status={feedback[index]?.status}
          value={symbol === " " ? "" : symbol}
        />
      ))}
    </div>
  );
}
