const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const trace = require("./middleware/trace.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(trace);

app.use("/auth", authRoutes);

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

const PORT = 3002;

app.listen(PORT, () => {
  console.log("Auth Service corriendo en puerto 3002");
});