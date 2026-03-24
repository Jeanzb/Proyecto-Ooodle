const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const { env } = require("./config/env");
const { createDb } = require("./config/db");
const { createGameRoutes } = require("./routes/game.routes");
const { createEquationRoutes } = require("./routes/equation.routes");
const { createHealthRoutes } = require("./routes/health.routes");
const { GameController } = require("./controllers/game.controller");
const { EquationController } = require("./controllers/equation.controller");
const { GameService } = require("./services/game.service");
const { EquationService } = require("./services/equation.service");
const { ValidationService } = require("./services/validation.service");
const { GameRepository } = require("./repositories/game.repository");
const { EquationRepository } = require("./repositories/equation.repository");
const { GameValidator } = require("./validators/game.validator");
const { EquationValidator } = require("./validators/equation.validator");
const { errorMiddleware } = require("./middlewares/error.middleware");

function createApp() {
  const app = express();
  const supabase = createDb({
    createClient,
    supabaseUrl: env.supabaseUrl,
    supabaseServiceRoleKey: env.supabaseServiceRoleKey,
  });
  const gameRepository = new GameRepository({ supabase });
  const equationRepository = new EquationRepository();
  const gameValidator = new GameValidator();
  const equationValidator = new EquationValidator();
  const validationService = new ValidationService({
    gameValidator,
    equationValidator,
  });
  const equationService = new EquationService({
    equationRepository,
    equationValidator,
  });
  const gameService = new GameService({
    gameRepository,
    equationRepository,
    equationService,
    validationService,
  });
  const gameController = new GameController({ gameService });
  const equationController = new EquationController({
    equationService,
    validationService,
  });

  app.use(cors());
  app.use(express.json());

  app.use("/api/health", createHealthRoutes());
  app.use(
    "/api/game",
    createGameRoutes({
      gameController,
      validationService,
    }),
  );
  app.use(
    "/api/equation",
    createEquationRoutes({
      equationController,
      validationService,
    }),
  );

  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };
