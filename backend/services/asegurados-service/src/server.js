const express = require("express");
const cors = require("cors");
require("dotenv").config();

const trace = require("./middleware/trace.middleware");
const aseguradosRoutes = require("./routes/asegurados.routes");
const beneficiariosRoutes = require("./routes/beneficiarios.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(trace);

app.use("/asegurados", aseguradosRoutes);
app.use("/beneficiarios", beneficiariosRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "asegurados-service",
  });
});

app.use((req, res, next) => {
  console.log("📦 TRACE RECIBIDO:", req.headers["x-trace-id"]);
  next();
});

const PORT = 3004;

app.listen(PORT, () => {
  console.log(`Asegurados Service corriendo en puerto ${PORT}`);
});