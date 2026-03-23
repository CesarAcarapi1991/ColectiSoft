const roleMiddleware = (roles) => {
  return (req, res, next) => {
    const user = req.user;
    console.log("Roles requeridos:", roles);
    console.log("Roles del usuario:", user ? user.roles : "No autenticado");
    if (!user || !user.roles) {
      return res.status(403).json({ error: "No autenticado" });
    }
    const tieneRol = user.roles.some(role => roles.includes(role));
    console.log(tieneRol ? "Usuario tiene el rol requerido" : "Usuario NO tiene el rol requerido");
    if (!tieneRol) {
      return res.status(403).json({
        error: "Acceso denegado"
      });
    }
    next();
  };
};

module.exports = roleMiddleware;