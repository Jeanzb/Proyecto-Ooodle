function validateRequestMiddleware(validationHandler) {
  return (req, res, next) => {
    const validationResult = validationHandler(req);

    if (!validationResult.isValid) {
      res.status(400).json({
        success: false,
        message: validationResult.errors.join(" "),
        data: null,
      });
      return;
    }

    req.validated = validationResult.value;
    next();
  };
}

module.exports = { validateRequestMiddleware };
