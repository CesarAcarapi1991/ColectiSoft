const express = require("express");
const cors = require("cors");
require("dotenv").config();

const trace = require("./middleware/trace.middleware");
const empresaRoutes = require("./routes/empresa.routes");
const productoRoutes = require("./routes/producto.routes");
const coberturaRoutes = require("./routes/cobertura.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(trace);

app.use("/empresa", empresaRoutes);
app.use("/producto", productoRoutes);
app.use("/cobertura", coberturaRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "aseguradoras"
  });
});

app.use((req, res, next) => {
  console.log("📦 TRACE RECIBIDO:", req.headers["x-trace-id"]);
  next();
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Aseguradoras Service corriendo en puerto ${PORT}`);
});