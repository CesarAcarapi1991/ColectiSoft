const express = require("express");
const cors = require("cors");
require("dotenv").config();

const trace = require("./middleware/trace.middleware");
const cajaRoutes = require("./routes/caja.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(trace);

app.use("/caja", cajaRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "caja-service",
  });
});

app.use((req, res, next) => {
  console.log("📦 TRACE RECIBIDO:", req.headers["x-trace-id"]);
  next();
});

const PORT = 3006;

app.listen(PORT, () => {
  console.log(`Caja Service corriendo en puerto ${PORT}`);
});