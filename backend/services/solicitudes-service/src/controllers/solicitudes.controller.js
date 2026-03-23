const service = require("../services/solicitudes.service");
const registrarAuditoria = require("../utils/auditoria");
const pdfService = require("../services/pdf.service");


exports.crearSolicitud = async (req, res) => {
  try {
    const solicitud = await service.crearSolicitud(req.body, req.usuario);

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "solicitudes-service",
     accion: "CREAR_SOLICITUD",
     tabla: "solicitud_seguro",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json(solicitud);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.actualizarSolicitud = async (req, res) => {
  try {
    const solicitud = await service.actualizarSolicitud(
      req.params.id,
      req.body,
      req.usuario
    );

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "solicitudes-service",
     accion: "EDITAR_SOLICITUD",
     tabla: "solicitud_seguro",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json(solicitud);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.vigentarSolicitud = async (req, res) => {
  try {
    const id_solicitud = req.params.id;
    
    await service.vigentarSolicitud( id_solicitud, req.usuario );

    const pdfBase64 = await pdfService.generateEmpresaPDF(
      id_solicitud
    );

    await service.actualizarArchivo(id_solicitud, pdfBase64);

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "solicitudes-service",
     accion: "VIGENTAR_SOLICITUD",
     tabla: "solicitud_seguro",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json({
      file: pdfBase64
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarSolicitudes = async (req, res) => {
  const solicitudes = await service.listarSolicitudes();

  await registrarAuditoria({
    id_usuario: req.usuario?.id || null,
    servicio: "solicitudes-service",
    accion: "VER_SOLICITUDES",
    tabla: "solicitud_seguro",
    ip: req.ip,
    trace_id: req.traceId
  });

  res.json(solicitudes);
};

exports.infoSolicitud = async (req, res) => {
  try {
    const solicitud = await service.infoSolicitud( req.params.id, req.body);

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "solicitudes-service",
     accion: "INFO_SOLICITUD",
     tabla: "solicitud_seguro",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json(solicitud);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.enviarCajaSolicitud = async (req, res) => {
  try {
    const solicitud = await service.enviarCajaSolicitud(req.params.id, req.body, req.usuario);

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "solicitudes-service",
     accion: "ENVIAR_CAJA_SOLICITUD",
     tabla: "cobros",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json(solicitud);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};