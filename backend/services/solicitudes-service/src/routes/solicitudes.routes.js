const express = require("express");
const router = express.Router();

const controller = require("../controllers/solicitudes.controller");
const auth = require("../middleware/auth.middleware");
const permiso = require("../middleware/permiso.middleware");

// 🔐 CRUD PROTEGIDO
router.post("/", auth, permiso("crear_solicitud"), controller.crearSolicitud);
router.get("/informacion/:id", auth, permiso("info_solicitud"), controller.infoSolicitud);
router.get("/", auth, permiso("ver_solicitudes"), controller.listarSolicitudes);
router.put("/vigentarSeguro/:id", auth, permiso("vigentar_solicitud"), controller.vigentarSolicitud);
router.put("/enviarCaja/:id", auth, permiso("enviar_caja_solicitud"), controller.enviarCajaSolicitud);
router.put("/:id", auth, permiso("editar_solicitud"), controller.actualizarSolicitud);
// router.delete("/:id", auth, permiso("eliminar_solicitud"), controller.eliminarSolicitud);

module.exports = router;