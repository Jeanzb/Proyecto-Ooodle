const express = require("express");
const { validateRequestMiddleware } = require("../middlewares/validateRequest.middleware");

function createGameRoutes({ gameController, validationService }) {
  const router = express.Router();

  router.post(
    "/new",
    validateRequestMiddleware((req) =>
      validationService.validateCreateGameRequest(req.body),
    ),
    gameController.createGame,
  );

  router.get(
    "/:gameId",
    validateRequestMiddleware((req) =>
      validationService.validateGameIdRequest(req.params),
    ),
    gameController.getGameById,
  );

  router.post(
    "/guess",
    validateRequestMiddleware((req) =>
      validationService.validateGuessRequest(req.body),
    ),
    gameController.submitGuess,
  );

  router.post(
    "/:gameId/restart",
    validateRequestMiddleware((req) =>
      validationService.validateGameIdRequest(req.params),
    ),
    gameController.restartGame,
  );

  return router;
}

module.exports = { createGameRoutes };
