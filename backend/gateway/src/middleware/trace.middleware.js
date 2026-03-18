const { v4: uuidv4 } = require("uuid");

const traceMiddleware = (req, res, next) => {
  const traceId = uuidv4();

  // 🔥 agregar traceId al request
  req.traceId = traceId;

  // 🔥 enviarlo en headers (viaja entre microservicios)
  req.headers["x-trace-id"] = traceId;

  console.log(`🧭 TRACE ID: ${traceId}`);
  console.log(`➡️ ${req.method} ${req.originalUrl}`);

  // cuando responde
  res.on("finish", () => {
    console.log(`✅ ${req.method} ${req.originalUrl} → ${res.statusCode}`);
  });

  next();
};

module.exports = traceMiddleware;