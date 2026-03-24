import { useEffect } from "react";
import Grid from "./components/Grid";
import Keyboard from "./components/Keyboard";
import { useGame } from "./hooks/useGame";

function App() {
  const {
    session,
    currentGuess,
    error,
    isLoading,
    createSession,
    appendSymbol,
    removeSymbol,
    submitGuess,
    restartSession,
  } = useGame();

  useEffect(() => {
    createSession();
  }, [createSession]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!session) {
        return;
      }

      if (event.key === "Enter") {
        submitGuess();
        return;
      }

      if (event.key === "Backspace") {
        removeSymbol();
        return;
      }

      if (/^[0-9+\-*]$/.test(event.key)) {
        appendSymbol(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [appendSymbol, removeSymbol, session, submitGuess]);

  const isGameBlocked = !session || session.status !== "IN_PROGRESS";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center px-6 py-10">
        <header className="w-full border-b border-slate-800 pb-6 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
            Ooodle
          </p>
          <h1 className="mt-3 text-4xl font-semibold">Nucleo del juego</h1>
          <p className="mt-3 text-sm text-slate-400">
            Estructura fija: {session?.pattern ?? "A+B*C-D"}
          </p>
        </header>

        <section className="mt-8 flex w-full flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-slate-700 px-4 py-2">
              Intentos: {session?.attemptCount ?? 0}/{session?.maxAttempts ?? 6}
            </span>
            <span className="rounded-full border border-slate-700 px-4 py-2">
              Estado: {session?.status ?? "LOADING"}
            </span>
            {session?.revealedEquation && (
              <span className="rounded-full border border-emerald-700 px-4 py-2 text-emerald-300">
                Solucion: {session.revealedEquation}
              </span>
            )}
          </div>

          <Grid
            guesses={session?.guesses ?? []}
            currentGuess={currentGuess}
            maxLength={session?.equationLength ?? 7}
            maxAttempts={session?.maxAttempts ?? 6}
          />

          <div className="min-h-6 text-center text-sm text-rose-300">
            {isLoading ? "Cargando partida..." : error}
          </div>

          <Keyboard
            disabled={isGameBlocked}
            onBackspace={removeSymbol}
            onEnter={submitGuess}
            onSymbol={appendSymbol}
          />

          <button
            className="rounded-md border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
            onClick={restartSession}
            type="button"
          >
            Reiniciar partida
          </button>
        </section>
      </div>
    </main>
  );
}

export default App;
