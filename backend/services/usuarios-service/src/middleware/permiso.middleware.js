module.exports = (permiso) => {
  return (req, res, next) => {
    if (!req.usuario?.permisos) {
      return res.status(403).json({ error: "Sin permisos" });
    }
    if (!req.usuario.permisos.includes(permiso)) {
      return res.status(403).json({
        error: `Permiso requerido: ${permiso}`
      });
    }
    next();
  };
};