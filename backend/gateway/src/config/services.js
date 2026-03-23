module.exports = {
  auth: {
    route: "/api/auth",
    target: process.env.AUTH_SERVICE,
    auth: false
  },
  usuarios: {
    route: "/api/usuarios",
    target: process.env.USUARIOS_SERVICE,
    auth: true,
    roles: ["ADMIN"]
  },
  empresas: {
    route: "/api/empresa",
    target: process.env.ASEGURADORA_SERVICE_EMPRESAS,
    auth: true,
    roles: ["ADMIN"]
  },
  productos: {
    route: "/api/producto",
    target: process.env.ASEGURADORA_SERVICE_PRODUCTOS,
    auth: true,
    roles: ["ADMIN"]
  },
  cobertura: {
    route: "/api/cobertura",
    target: process.env.ASEGURADORA_SERVICE_COBERTURA,
    auth: true,
    roles: ["ADMIN"]
  },
  asegurado: {
    route: "/api/asegurados",
    target: process.env.ASEGURADOS_SERVICE_CLIENTE,
    auth: true,
    roles: ["ADMIN"]
  },
  beneficiario: {
    route: "/api/beneficiarios",
    target: process.env.ASEGURADOS_SERVICE_BENEFICIARIOS,
    auth: true,
    roles: ["ADMIN"]
  },
  beneficiario: {
    route: "/api/beneficiarios",
    target: process.env.ASEGURADOS_SERVICE_BENEFICIARIOS,
    auth: true,
    roles: ["ADMIN"]
  },
  solicitud: {
    route: "/api/solicitudes",
    target: process.env.SOLICITUDES_SERVICE,
    auth: true,
    roles: ["ADMIN"]
  },
  caja: {
    route: "/api/caja",
    target: process.env.CAJA_SERVICE,
    auth: true,
    roles: ["ADMIN"]
  }
};