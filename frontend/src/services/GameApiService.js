const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export class GameApiService {
  async createSession() {
    return this.request("/api/game-sessions", {
      method: "POST",
    });
  }

  async submitGuess(sessionId, expression) {
    return this.request(`/api/game-sessions/${sessionId}/guesses`, {
      method: "POST",
      body: JSON.stringify({ expression }),
    });
  }

  async restartSession(sessionId) {
    return this.request(`/api/game-sessions/${sessionId}/restart`, {
      method: "POST",
    });
  }

  async request(path, options) {
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message ?? "No fue posible completar la solicitud.");
    }

    return payload;
  }
}
