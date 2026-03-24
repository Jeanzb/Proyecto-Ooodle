import { useCallback, useState } from "react";
import { GameApiService } from "../services/GameApiService";

const gameApiService = new GameApiService();

export function useGame() {
  const [session, setSession] = useState(null);
  const [currentGuess, setCurrentGuess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createSession = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const nextSession = await gameApiService.createSession();
      setSession(nextSession);
      setCurrentGuess("");
    } catch (serviceError) {
      setError(serviceError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const appendSymbol = useCallback(
    (symbol) => {
      if (!session || session.status !== "IN_PROGRESS") {
        return;
      }

      if (!/^[0-9+\-*]$/.test(symbol)) {
        return;
      }

      if (currentGuess.length >= session.equationLength) {
        return;
      }

      setCurrentGuess((previousGuess) => previousGuess + symbol);
      setError("");
    },
    [currentGuess.length, session],
  );

  const removeSymbol = useCallback(() => {
    setCurrentGuess((previousGuess) => previousGuess.slice(0, -1));
    setError("");
  }, []);

  const submitGuess = useCallback(async () => {
    if (!session || session.status !== "IN_PROGRESS") {
      return;
    }

    if (currentGuess.length !== session.equationLength) {
      setError(`La ecuacion debe tener ${session.equationLength} caracteres.`);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const nextSession = await gameApiService.submitGuess(session.id, currentGuess);
      setSession(nextSession);
      setCurrentGuess("");
    } catch (serviceError) {
      setError(serviceError.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentGuess, session]);

  const restartSession = useCallback(async () => {
    if (!session) {
      await createSession();
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const nextSession = await gameApiService.restartSession(session.id);
      setSession(nextSession);
      setCurrentGuess("");
    } catch (serviceError) {
      setError(serviceError.message);
    } finally {
      setIsLoading(false);
    }
  }, [createSession, session]);

  return {
    session,
    currentGuess,
    error,
    isLoading,
    createSession,
    appendSymbol,
    removeSymbol,
    submitGuess,
    restartSession,
  };
}
