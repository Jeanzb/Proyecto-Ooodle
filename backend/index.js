const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // Permite que el frontend hable con este backend
app.use(express.json()); // Permite leer datos en formato JSON

// Ruta de prueba
app.get("/api/status", (req, res) => {
  res.json({ mensaje: "¡El servidor backend está funcionando!" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
