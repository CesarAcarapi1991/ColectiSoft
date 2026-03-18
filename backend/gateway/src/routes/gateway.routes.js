const { createProxyMiddleware } = require("http-proxy-middleware");

const createProxy = (target) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,

    pathRewrite: {
      "^/api": ""
    },

    logLevel: "debug",

    onProxyReq: (proxyReq, req) => {
      // 🔥 pasar trace al microservicio
      proxyReq.setHeader("x-trace-id", req.traceId);

      console.log(
        `🔁 [${req.traceId}] ${req.method} ${req.originalUrl} → ${target}`
      );
    },

    onProxyRes: (proxyRes, req) => {
      console.log(
        `📥 [${req.traceId}] respuesta desde ${target} → ${proxyRes.statusCode}`
      );
    },

    onError: (err, req, res) => {
      console.error(`❌ [${req.traceId}] Error:`, err.message);

      res.status(500).json({
        error: "Error en gateway",
        traceId: req.traceId
      });
    }
  });
};

module.exports = createProxy;