export default function Keyboard({ onKeyPress }) {
  // Arreglo con todas las teclas que necesitamos
  const teclas = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "+",
    "-",
    "*",
    "/",
    "=",
    "Enter",
    "Borrar",
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-lg mt-8">
      {teclas.map((tecla) => (
        <button
          key={tecla}
          onClick={() => onKeyPress(tecla)}
          className={`font-bold py-3 px-4 rounded flex items-center justify-center transition-colors
            ${
              tecla === "Enter" || tecla === "Borrar"
                ? "bg-blue-600 hover:bg-blue-500 w-24" // Botones especiales más anchos
                : "bg-gray-600 hover:bg-gray-500 w-12 h-14 text-xl" // Botones normales
            }`}
        >
          {tecla}
        </button>
      ))}
    </div>
  );
}
