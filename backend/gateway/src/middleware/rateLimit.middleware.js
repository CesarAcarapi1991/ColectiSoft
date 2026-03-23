const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10000, // máximo 100 requests
  message: {
    error: "Demasiadas peticiones, intenta más tarde"
  }
});

module.exports = limiter;