const express = require("express");

function createHealthRoutes() {
  const router = express.Router();

  router.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Backend operativo",
      data: null,
    });
  });

  return router;
}

module.exports = { createHealthRoutes };
