const service = require("../services/cobertura.service");
const registrarAuditoria = require("../utils/auditoria");

exports.crearCobertura = async (req, res) => {
  try {
    const cobertura = await service.crearCobertura(req.body, req.usuario);

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "aseguradoras-service",
     accion: "CREAR_COBERTURA",
     tabla: "cobertura",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json(cobertura);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarCoberturas = async (req, res) => {
  const coberturas = await service.listarCoberturas();

  await registrarAuditoria({
    id_usuario: req.usuario?.id || null,
    servicio: "aseguradoras-service",
    accion: "VER_COBERTURAS",
    tabla: "cobertura",
    ip: req.ip,
    trace_id: req.traceId
  });

  res.json(coberturas);
};

exports.actualizarCobertura = async (req, res) => {
  try {
    const cobertura = await service.actualizarCobertura(
      req.params.id,
      req.body,
      req.usuario
    );

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "aseguradoras-service",
     accion: "EDITAR_COBERTURA",
     tabla: "cobertura",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json(cobertura);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
