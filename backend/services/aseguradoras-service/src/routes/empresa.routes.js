const express = require("express");
const router = express.Router();

const controller = require("../controllers/empresa.controller");
const auth = require("../middleware/auth.middleware");
const permiso = require("../middleware/permiso.middleware");

// 🔐 CRUD PROTEGIDO
router.post("/", auth, permiso("crear_empresa"), controller.crearEmpresa);
router.get("/", auth, permiso("ver_empresas"), controller.listarEmpresas);
router.put("/:id", auth, permiso("editar_empresa"), controller.actualizarEmpresa);
// router.delete("/:id", auth, permiso("eliminar_empresa"), controller.eliminarEmpresa);

module.exports = router;