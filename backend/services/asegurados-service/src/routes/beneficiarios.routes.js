const express = require("express");
const router = express.Router();

const controller = require("../controllers/beneficiarios.controller");
const auth = require("../middleware/auth.middleware");
const permiso = require("../middleware/permiso.middleware");

// 🔐 CRUD PROTEGIDO
router.post("/", auth, permiso("crear_beneficiario"), controller.crearBeneficiario);
router.get("/", auth, permiso("ver_beneficiarios"), controller.listarBeneficiarios);
router.put("/:id", auth, permiso("editar_beneficiario"), controller.actualizarBeneficiario);
// router.delete("/:id", auth, permiso("eliminar_beneficiario"), controller.eliminarBeneficiario);

module.exports = router;