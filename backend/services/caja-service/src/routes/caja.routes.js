const express = require("express");
const router = express.Router();

const controller = require("../controllers/caja.controller");
const auth = require("../middleware/auth.middleware");
const permiso = require("../middleware/permiso.middleware");

// 🔐 CRUD PROTEGIDO
// router.post("/", auth, permiso("crear_asegurado"), controller.crearAsegurado);
router.get("/buscar", auth, permiso("ver_cobro"), controller.buscarCobro);
router.get("/buscarTransaccion/:id", auth, permiso("ver_transaccion"), controller.buscarTransaccion);
router.put("/cobrar/:id", auth, permiso("realizar_cobros"), controller.realizarCobros);
// router.delete("/:id", auth, permiso("eliminar_asegurado"), controller.eliminarAsegurado);


module.exports = router;