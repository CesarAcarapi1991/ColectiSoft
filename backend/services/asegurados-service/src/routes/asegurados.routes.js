const express = require("express");
const router = express.Router();

const controller = require("../controllers/asegurados.controller");
const auth = require("../middleware/auth.middleware");
const permiso = require("../middleware/permiso.middleware");

// 🔐 CRUD PROTEGIDO
router.post("/", auth, permiso("crear_asegurado"), controller.crearAsegurado);
router.get("/", auth, permiso("ver_asegurados"), controller.listarAsegurados);
router.put("/:id", auth, permiso("editar_asegurado"), controller.actualizarAsegurado);
// router.delete("/:id", auth, permiso("eliminar_asegurado"), controller.eliminarAsegurado);

module.exports = router;