const express = require("express");
const { validateRequestMiddleware } = require("../middlewares/validateRequest.middleware");

function createEquationRoutes({ equationController, validationService }) {
  const router = express.Router();

  router.get("/config", equationController.getEquationConfig);
  router.post(
    "/validate",
    validateRequestMiddleware((req) =>
      validationService.validateEquationRequest(req.body),
    ),
    equationController.validateEquation,
  );

  return router;
}

module.exports = { createEquationRoutes };
