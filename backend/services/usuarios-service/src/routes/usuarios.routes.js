const express = require("express");
const router = express.Router();

const controller = require("../controllers/usuarios.controller");
const auth = require("../middleware/auth.middleware");
const permiso = require("../middleware/permiso.middleware");

// 🔐 CRUD PROTEGIDO
router.post("/", auth, permiso("crear_usuario"), controller.crearUsuario);
router.get("/", auth, permiso("ver_usuarios"), controller.listarUsuarios);
router.put("/:id", auth, permiso("editar_usuario"), controller.actualizarUsuario);
router.delete("/:id", auth, permiso("eliminar_usuario"), controller.eliminarUsuario);

module.exports = router;