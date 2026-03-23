require("dotenv").config();

const express = require("express");
const services = require("./config/services");
const createProxy = require("./routes/gateway.routes");

const traceMiddleware = require("./middleware/trace.middleware");
const authMiddleware = require("./middleware/auth.middleware");
const roleMiddleware = require("./middleware/role.middleware");
const rateLimiter = require("./middleware/rateLimit.middleware");

const app = express();

// GLOBAL
app.use(traceMiddleware);
app.use(rateLimiter);

// CONFIGURACIÓN DINÁMICA PRO
Object.keys(services).forEach((key) => {
  const service = services[key];
console.log("SERVICE:", key, service); 
  const middlewares = [];

  // Si requiere auth
  if (service.auth) {
    middlewares.push(authMiddleware);
  }

  // Si tiene roles
  if (service.roles) {
    middlewares.push(roleMiddleware(service.roles));
  }

  // Proxy siempre al final
  middlewares.push(createProxy(service.target));

  console.log(`🔌 ${service.route} → ${service.target}`);

  app.use(service.route, ...middlewares);
});

// HEALTH
app.get("/health", (req, res) => {
  res.json({ status: "OK", gateway: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Gateway corriendo en puerto ${PORT}`);
});