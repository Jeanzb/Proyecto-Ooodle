import { useState, useEffect, useCallback } from "react";
import Grid from "./components/Grid";
import Keyboard from "./components/Keyboard";

function App() {
  // Historial de filas ya enviadas (Ej: ["12+3=15", "8-2+0=6"])
  const [guesses, setGuesses] = useState([]);
  // Lo que el usuario está escribiendo en la fila actual
  const [currentGuess, setCurrentGuess] = useState("");

  const LONGITUD_MAXIMA = 6;
  const MAX_INTENTOS = 6;

  // useCallback hace que la función no se recree a cada rato, necesario para el teclado físico
  const handleKeyPress = useCallback(
    (tecla) => {
      // Si ya completó todos los intentos, no dejamos escribir más
      if (guesses.length >= MAX_INTENTOS) return;

      if (tecla === "Borrar" || tecla === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (tecla === "Enter") {
        // Solo avanza de fila si escribió los 6 caracteres completos
        if (currentGuess.length === LONGITUD_MAXIMA) {
          setGuesses((prev) => [...prev, currentGuess]); // Guarda la fila completa
          setCurrentGuess(""); // Limpia la fila activa para empezar a escribir abajo
        } else {
          console.log("Te faltan caracteres para completar la ecuación");
        }
      } else {
        // Expresión regular: Solo permitimos números y operadores matemáticos
        const caracteresPermitidos = /^[0-9+\-*/=]$/;
        if (
          caracteresPermitidos.test(tecla) &&
          currentGuess.length < LONGITUD_MAXIMA
        ) {
          setCurrentGuess((prev) => prev + tecla);
        }
      }
    },
    [currentGuess, guesses.length],
  ); // Dependencias de la función

  // Efecto para habilitar el teclado físico de la computadora
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Si el usuario presiona "Enter" o "Backspace", le pasamos esa tecla a nuestra función
      if (event.key === "Enter" || event.key === "Backspace") {
        handleKeyPress(event.key);
      } else {
        // Para los números y símbolos
        handleKeyPress(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Limpieza del evento cuando se desmonta el componente
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-10">Ooodle</h1>

      {/* Le pasamos al Grid el historial completo y el intento actual */}
      <Grid
        guesses={guesses}
        currentGuess={currentGuess}
        maxLength={LONGITUD_MAXIMA}
        maxAttempts={MAX_INTENTOS}
      />

      <Keyboard onKeyPress={handleKeyPress} />
    </div>
  );
}

export default App;
