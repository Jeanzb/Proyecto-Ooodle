const crypto = require("crypto");

class GameService {
  constructor({
    gameRepository,
    equationRepository,
    equationService,
    validationService,
  }) {
    this.gameRepository = gameRepository;
    this.equationRepository = equationRepository;
    this.equationService = equationService;
    this.validationService = validationService;
    this.maxAttempts = 6;
  }

  async createGame() {
    const equation = this.equationService.generateEquation();
    const game = {
      id: crypto.randomUUID(),
      equationId: equation.id,
      status: "IN_PROGRESS",
      maxAttempts: this.maxAttempts,
      attemptCount: 0,
      guesses: [],
      startedAt: new Date().toISOString(),
      finishedAt: null,
    };

    this.equationRepository.save(equation);
    this.gameRepository.save(game);

    return this.buildPublicGame(game, equation);
  }

  async getGameById(gameId) {
    const game = this.gameRepository.findById(gameId);

    if (!game) {
      throw this.createError("Partida no encontrada.", 404);
    }

    const equation = this.equationRepository.findById(game.equationId);

    return this.buildPublicGame(game, equation);
  }

  async submitGuess({ gameId, expression }) {
    const game = this.gameRepository.findById(gameId);

    if (!game) {
      throw this.createError("Partida no encontrada.", 404);
    }

    if (game.status !== "IN_PROGRESS") {
      throw this.createError("La partida ya finalizo.", 409);
    }

    const guessValidation =
      this.validationService.validateEquationExpression(expression);

    if (!guessValidation.isValid) {
      throw this.createError(guessValidation.reason, 400);
    }

    const equation = this.equationRepository.findById(game.equationId);
    const guessFeedback = this.equationService.compareGuess(
      equation.expression,
      expression,
    );
    const isCorrect = expression === equation.expression;
    const guess = {
      id: crypto.randomUUID(),
      attemptNumber: game.attemptCount + 1,
      expression,
      isCorrect,
      feedback: guessFeedback,
      createdAt: new Date().toISOString(),
    };

    game.guesses.push(guess);
    game.attemptCount += 1;

    if (isCorrect) {
      game.status = "WON";
      game.finishedAt = new Date().toISOString();
    } else if (game.attemptCount >= game.maxAttempts) {
      game.status = "LOST";
      game.finishedAt = new Date().toISOString();
    }

    this.gameRepository.save(game);

    if (game.status !== "IN_PROGRESS") {
      await this.gameRepository.persistFinishedGame({
        game,
        equation,
      });
    }

    return this.buildPublicGame(game, equation);
  }

  async restartGame(gameId) {
    const currentGame = this.gameRepository.findById(gameId);

    if (!currentGame) {
      throw this.createError("Partida no encontrada.", 404);
    }

    return this.createGame();
  }

  buildPublicGame(game, equation) {
    const revealSolution = game.status !== "IN_PROGRESS";

    return {
      id: game.id,
      status: game.status,
      maxAttempts: game.maxAttempts,
      attemptCount: game.attemptCount,
      equationLength: equation.expression.length,
      pattern: equation.pattern,
      startedAt: game.startedAt,
      finishedAt: game.finishedAt,
      revealedEquation: revealSolution ? equation.expression : null,
      guesses: game.guesses.map((guess) => ({
        id: guess.id,
        attemptNumber: guess.attemptNumber,
        expression: guess.expression,
        isCorrect: guess.isCorrect,
        feedback: guess.feedback,
        createdAt: guess.createdAt,
      })),
    };
  }

  createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
  }
}

module.exports = { GameService };
