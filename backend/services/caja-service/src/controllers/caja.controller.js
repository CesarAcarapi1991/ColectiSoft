const service = require("../services/caja.service");
const registrarAuditoria = require("../utils/auditoria");

exports.realizarCobros = async (req, res) => {
  try {
    const asegurado = await service.realizarCobros(
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

exports.buscarCobro = async (req, res) => {
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

    const cobro = await service.buscarPorDocumento(
      tipo_documento,
      nro_documento,
      complemento
    );

    if (!cobro) {
      return res.status(404).json({
        error: "Cobro no encontrado"
      });
    }

    res.json(cobro);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.buscarTransaccion = async (req, res) => {
  try {

    const cobro = await service.buscarTransaccion(
      req.params.id
    );

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "caja-service",
     accion: "BUSCAR_TRANSACCION",
     tabla: "cobros",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json(cobro);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};