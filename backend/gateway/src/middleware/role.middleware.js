const roleMiddleware = (roles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        error: "Acceso denegado"
      });
    }
    
    next();
  };
};

module.exports = roleMiddleware;