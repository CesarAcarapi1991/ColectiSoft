require("dotenv").config();

const express = require("express");
const services = require("./config/services");
const createProxy = require("./routes/gateway.routes");
const traceMiddleware = require("./middleware/trace.middleware");

const app = express();

// 🔥 TRACE GLOBAL
app.use(traceMiddleware);

// 🔥 Routing dinámico
Object.keys(services).forEach((key) => {
  const { route, target } = services[key];
  console.log(`🔌 ${route} → ${target}`);
  app.use(route, createProxy(target));
});

// 🔥 Ruta health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "API Gateway"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Gateway corriendo en puerto ${PORT}`);
});