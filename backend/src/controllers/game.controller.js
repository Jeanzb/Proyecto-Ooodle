const { buildSuccessResponse } = require("../utils/responseBuilder");

class GameController {
  constructor({ gameService }) {
    this.gameService = gameService;
    this.createGame = this.createGame.bind(this);
    this.getGameById = this.getGameById.bind(this);
    this.submitGuess = this.submitGuess.bind(this);
    this.restartGame = this.restartGame.bind(this);
  }

  async createGame(req, res, next) {
    try {
      const game = await this.gameService.createGame();
      res
        .status(201)
        .json(buildSuccessResponse("Partida creada correctamente.", game));
    } catch (error) {
      next(error);
    }
  }

  async getGameById(req, res, next) {
    try {
      const game = await this.gameService.getGameById(req.validated.gameId);
      res.json(buildSuccessResponse("Partida cargada correctamente.", game));
    } catch (error) {
      next(error);
    }
  }

  async submitGuess(req, res, next) {
    try {
      const game = await this.gameService.submitGuess(req.validated);
      res.json(buildSuccessResponse("Intento procesado correctamente.", game));
    } catch (error) {
      next(error);
    }
  }

  async restartGame(req, res, next) {
    try {
      const game = await this.gameService.restartGame(req.validated.gameId);
      res.json(buildSuccessResponse("Partida reiniciada correctamente.", game));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { GameController };
