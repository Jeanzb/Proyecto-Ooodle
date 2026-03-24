const { buildSuccessResponse } = require("../utils/responseBuilder");

class EquationController {
  constructor({ equationService, validationService }) {
    this.equationService = equationService;
    this.validationService = validationService;
    this.getEquationConfig = this.getEquationConfig.bind(this);
    this.validateEquation = this.validateEquation.bind(this);
  }

  getEquationConfig(req, res, next) {
    try {
      const equationConfig = this.equationService.getEquationConfig();
      res.json(
        buildSuccessResponse(
          "Configuracion de ecuacion cargada correctamente.",
          equationConfig,
        ),
      );
    } catch (error) {
      next(error);
    }
  }

  validateEquation(req, res, next) {
    try {
      const validation = this.validationService.validateEquationExpression(
        req.validated.expression,
      );
      res.json(
        buildSuccessResponse("Ecuacion validada correctamente.", validation),
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { EquationController };
