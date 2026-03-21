const service = require("../services/beneficiarios.service");
const registrarAuditoria = require("../utils/auditoria");

exports.crearBeneficiario = async (req, res) => {
  try {
    const beneficiario = await service.crearBeneficiario(req.body, req.usuario);

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "asegurados-service",
     accion: "CREAR_BENEFICIARIO",
     tabla: "beneficiarios",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json(beneficiario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarBeneficiarios = async (req, res) => {
  const beneficiarios = await service.listarBeneficiarios();

  await registrarAuditoria({
    id_usuario: req.usuario?.id || null,
    servicio: "asegurados-service",
    accion: "VER_BENEFICIARIOS",
    tabla: "beneficiarios",
    ip: req.ip,
    trace_id: req.traceId
  });

  res.json(beneficiarios);
};

exports.actualizarBeneficiario = async (req, res) => {
  try {
    const beneficiario = await service.actualizarBeneficiario(
      req.params.id,
      req.body,
      req.usuario
    );

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "asegurados-service",
     accion: "EDITAR_BENEFICIARIO",
     tabla: "beneficiarios",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json(beneficiario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};