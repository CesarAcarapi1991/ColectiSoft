const express = require("express");
const cors = require("cors");
require("dotenv").config();

const trace = require("./middleware/trace.middleware");
const solicitudesRoutes = require("./routes/solicitudes.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(trace);

app.use("/solicitudes", solicitudesRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "solicitudes-service",
  });
});

app.use((req, res, next) => {
  console.log("📦 TRACE RECIBIDO:", req.headers["x-trace-id"]);
  next();
});

const PORT = 3005;

app.listen(PORT, () => {
  console.log(`Solicitudes Service corriendo en puerto ${PORT}`);
});