module.exports = {
  usuarios: {
    route: "/api/usuarios",
    target: process.env.USUARIOS_SERVICE,
    auth: false
  },
  ventas: {
    route: "/api/ventas",
    target: process.env.VENTAS_SERVICE,
    auth: true,
    roles: ["admin", "vendedor"]
  },
  auth: {
    route: "/api/auth",
    target: process.env.AUTH_SERVICE,
    auth: false
  }
};