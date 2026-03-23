const service = require("../services/usuarios.service");
const registrarAuditoria = require("../utils/auditoria");

exports.crearUsuario = async (req, res) => {
  try {
    const usuario = await service.crearUsuario(req.body, req.usuario);
    // rol por defecto (USER = 2)
    await service.asignarRol(usuario.id, 2);

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "usuarios-service",
     accion: "CREAR_USUARIO",
     tabla: "usuarios",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarUsuarios = async (req, res) => {
  const usuarios = await service.listarUsuarios();

  await registrarAuditoria({
    id_usuario: req.usuario?.id || null,
    servicio: "usuarios-service",
    accion: "VER_USUARIOS",
    tabla: "usuarios",
    ip: req.ip,
    trace_id: req.traceId
  });

  res.json(usuarios);
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const usuario = await service.actualizarUsuario(
      req.params.id,
      req.body,
      req.usuario
    );

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "usuarios-service",
     accion: "EDITAR_USUARIO",
     tabla: "usuarios",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    await service.eliminarUsuario(req.params.id);

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "usuarios-service",
     accion: "ELIMINAR_USUARIO",
     tabla: "usuarios",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json({ mensaje: "Usuario eliminado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};