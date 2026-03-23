const express = require("express");
const cors = require("cors");
require("dotenv").config();

const trace = require("./middleware/trace.middleware");
const usuariosRoutes = require("./routes/usuarios.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(trace);

app.use("/usuarios", usuariosRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "usuarios"
  });
});

app.use((req, res, next) => {
  console.log("📦 TRACE RECIBIDO:", req.headers["x-trace-id"]);
  next();
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Usuarios Service corriendo en puerto ${PORT}`);
});