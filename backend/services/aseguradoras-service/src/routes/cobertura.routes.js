const express = require("express");
const router = express.Router();

const controller = require("../controllers/cobertura.controller");
const auth = require("../middleware/auth.middleware");
const permiso = require("../middleware/permiso.middleware");

// 🔐 CRUD PROTEGIDO
router.post("/", auth, permiso("crear_cobertura"), controller.crearCobertura);
router.get("/", auth, permiso("ver_coberturas"), controller.listarCoberturas);
router.put("/:id", auth, permiso("editar_cobertura"), controller.actualizarCobertura);
// router.delete("/:id", auth, permiso("eliminar_cobertura"), controller.eliminarCobertura);

module.exports = router;