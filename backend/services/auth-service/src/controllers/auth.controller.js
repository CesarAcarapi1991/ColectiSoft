const jwt = require("jsonwebtoken");
const service = require("../services/auth.service");
const registrarAuditoria = require("../utils/auditoria");

exports.login = async (req, res) => {
  try {
    const user = await service.login(req.body);

    const token = jwt.sign(
      user,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    await registrarAuditoria({
     id_usuario: req.usuario?.id || null,
     servicio: "usuarios-service",
     accion: "LOGIN",
     tabla: "usuarios",
     ip: req.ip,
     trace_id: req.traceId
    });

    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};