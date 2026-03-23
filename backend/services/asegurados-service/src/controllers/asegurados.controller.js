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

exports.buscarAsegurado = async (req, res) => {
  try {

    let { tipo_documento, nro_documento, complemento } = req.query;

    if (!tipo_documento || !nro_documento) {
      return res.status(400).json({
        error: "tipo_documento y nro_documento son requeridos"
      });
    }

    // 🔥 normalización
    tipo_documento = tipo_documento.trim().toUpperCase();
    nro_documento = nro_documento.trim();
    complemento = complemento?.trim();

    const asegurado = await service.buscarPorDocumento(
      tipo_documento,
      nro_documento,
      complemento
    );

    if (!asegurado) {
      return res.status(404).json({
        error: "Asegurado no encontrado"
      });
    }

    res.json(asegurado);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};