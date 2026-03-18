module.exports = {
  usuarios: {
    route: "/api/usuarios",
    target: process.env.USUARIOS_SERVICE
  },
  ventas: {
    route: "/api/ventas",
    target: process.env.VENTAS_SERVICE
  },
  auth: {
    route: "/api/auth",
    target: process.env.AUTH_SERVICE
  }
};