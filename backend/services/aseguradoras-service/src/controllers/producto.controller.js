const service = require("../services/producto.service");
const registrarAuditoria = require("../utils/auditoria");

exports.crearProducto = async (req, res) => {
  try {
    const producto = await service.crearProducto(req.body, req.usuario);

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "aseguradoras-service",
     accion: "CREAR_PRODUCTO",
     tabla: "productos",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listarProductos = async (req, res) => {
  const productos = await service.listarProductos();

  await registrarAuditoria({
    id_usuario: req.usuario?.id || null,
    servicio: "aseguradoras-service",
    accion: "VER_PRODUCTOS",
    tabla: "productos",
    ip: req.ip,
    trace_id: req.traceId
  });

  res.json(productos);
};

exports.actualizarProducto = async (req, res) => {
  try {
    const producto = await service.actualizarProducto(
      req.params.id,
      req.body,
      req.usuario
    );

    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "aseguradoras-service",
     accion: "EDITAR_PRODUCTO",
     tabla: "productos",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
