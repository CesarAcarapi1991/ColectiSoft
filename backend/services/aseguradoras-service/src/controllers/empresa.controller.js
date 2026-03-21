const service = require("../services/empresa.service");
const registrarAuditoria = require("../utils/auditoria");

exports.crearEmpresa = async (req, res) => {
  try {
    const empresa = await service.crearEmpresa(req.body, req.usuario);

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "empresas-service",
     accion: "CREAR_EMPRESA",
     tabla: "empresas",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json(empresa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarEmpresas = async (req, res) => {
  const empresas = await service.listarEmpresas();

  await registrarAuditoria({
    id_usuario: req.usuario?.id || null,
    servicio: "empresas-service",
    accion: "VER_EMPRESAS",
    tabla: "empresas",
    ip: req.ip,
    trace_id: req.traceId
  });

  res.json(empresas);
};

exports.actualizarEmpresa = async (req, res) => {
  try {
    const empresa = await service.actualizarEmpresa(
      req.params.id,
      req.body,
      req.usuario
    );

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "empresas-service",
     accion: "EDITAR_EMPRESA",
     tabla: "empresas",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json(empresa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// exports.eliminarEmpresa = async (req, res) => {
//   try {
//     await service.eliminarEmpresa(req.params.id);

//     await registrarAuditoria({
//      id_usuario: req.usuario?.id || null,
//      servicio: "empresas-service",
//      accion: "ELIMINAR_EMPRESA",
//      tabla: "empresas",
//      ip: req.ip,
//      trace_id: req.traceId
//     });

//     res.json({ mensaje: "Empresa eliminada" });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };