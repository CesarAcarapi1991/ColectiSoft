const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.login = async ({ correo, password }) => {

  const result = await db.query(
    `SELECT 
      u.id,
      u.correo,
      u.password_hash,
      r.nombre AS rol,
      p.nombre AS permiso
    FROM usuarios u
    LEFT JOIN usuario_rol ur ON ur.id_usuario = u.id
    LEFT JOIN roles r ON r.id = ur.id_rol
    LEFT JOIN rol_permiso rp ON rp.id_rol = r.id
    LEFT JOIN permisos p ON p.id = rp.id_permiso
    WHERE u.correo = $1`,
    [correo]
  );

  if (result.rows.length === 0) {
    throw new Error("Usuario no encontrado");
  }

  const usuario = result.rows[0];

  const match = await bcrypt.compare(password, usuario.password_hash);

  if (!match) {
    throw new Error("Credenciales inválidas");
  }

  const roles = [...new Set(result.rows.map(r => r.rol).filter(Boolean))];
  const permisos = [...new Set(result.rows.map(r => r.permiso).filter(Boolean))];

  return {
    id: usuario.id,
    correo: usuario.correo,
    roles,
    permisos
  };
};