const service = require("../services/asegurados.service");
const registrarAuditoria = require("../utils/auditoria");

exports.crearAsegurado = async (req, res) => {
  try {
    const asegurado = await service.crearAsegurado(req.body, req.usuario);

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "asegurados-service",
     accion: "CREAR_ASEGURADO",
     tabla: "asegurados",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json(asegurado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarAsegurados = async (req, res) => {
  const asegurados = await service.listarAsegurados();

  await registrarAuditoria({
    id_usuario: req.usuario?.id || null,
    servicio: "asegurados-service",
    accion: "VER_ASEGURADOS",
    tabla: "asegurados",
    ip: req.ip,
    trace_id: req.traceId
  });

  res.json(asegurados);
};

exports.actualizarAsegurado = async (req, res) => {
  try {
    const asegurado = await service.actualizarAsegurado(
      req.params.id,
      req.body,
      req.usuario
    );

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "asegurados-service",
     accion: "EDITAR_ASEGURADO",
     tabla: "asegurados",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json(asegurado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
