export default function Cell({ value }) {
  // Verificamos si la celda tiene un valor o está vacía
  const isFilled = value && value !== " ";

  return (
    <div
      className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-2xl sm:text-3xl font-bold border-2 rounded transition-all duration-200
        ${
          isFilled
            ? "border-gray-300 bg-gray-800 text-white" // Estilo cuando el usuario escribió algo
            : "border-gray-600 bg-transparent" // Estilo de la celda vacía
        }`}
    >
      {value}
    </div>
  );
}
