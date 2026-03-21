const express = require("express");
const router = express.Router();

const controllerProductos = require("../controllers/producto.controller");
const auth = require("../middleware/auth.middleware");
const permiso = require("../middleware/permiso.middleware");

// 🔐 CRUD PROTEGIDO
router.post("/", auth, permiso("crear_producto"), controllerProductos.crearProducto);
router.get("/", auth, permiso("ver_productos"), controllerProductos.listarProductos);
router.put("/:id", auth, permiso("editar_producto"), controllerProductos.actualizarProducto);

module.exports = router;