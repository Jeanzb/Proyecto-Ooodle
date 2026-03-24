class GameRepository {
  constructor({ supabase }) {
    this.supabase = supabase;
    this.games = new Map();
  }

  save(game) {
    this.games.set(game.id, game);
    return game;
  }

  findById(gameId) {
    return this.games.get(gameId) ?? null;
  }

  async persistFinishedGame({ game, equation }) {
    if (!this.supabase) {
      return game;
    }

    const payload = {
      id: game.id,
      target_equation_id: equation.id,
      status: game.status,
      max_attempts: game.maxAttempts,
      attempt_count: game.attemptCount,
      started_at: game.startedAt,
      finished_at: game.finishedAt,
      result: equation.result,
    };

    const { error } = await this.supabase.from("game_sessions").upsert(payload);

    if (error) {
      throw error;
    }

    return game;
  }
}

module.exports = { GameRepository };
