import Cell from "./Cell";

export default function Row({ guess, length = 6 }) {
  // Tomamos lo que escribió el usuario (guess) y rellenamos los espacios faltantes con espacios en blanco (" ")
  // Si escribió "12", padEnd lo convierte en "12    " para que siempre haya 6 celdas.
  // split("") lo convierte en un arreglo: ['1', '2', ' ', ' ', ' ', ' ']
  const letters = guess.padEnd(length, " ").split("");

  return (
    <div className="flex gap-2 mb-2 justify-center">
      {letters.map((char, index) => (
        <Cell key={index} value={char !== " " ? char : ""} />
      ))}
    </div>
  );
}
