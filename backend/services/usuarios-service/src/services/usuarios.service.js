const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.crearUsuario = async (data, usuarioLogueado) => {

  const hash = await bcrypt.hash(data.password, 10);

  const result = await db.query(
    `INSERT INTO usuarios (
      correo,
      password_hash,
      nombre,
      usuario_creacion
    ) VALUES ($1,$2,$3,$4)
    RETURNING *`,
    [
      data.correo,
      hash,
      data.nombre,
      usuarioLogueado.correo
    ]
  );

  return result.rows[0];
};

exports.asignarRol = async (usuarioId, rolId) => {
  await db.query(
    "INSERT INTO usuario_rol (id_usuario, id_rol) VALUES ($1,$2)",
    [usuarioId, rolId]
  );
};

exports.listarUsuarios = async () => {
  const result = await db.query(
    "SELECT id, correo, nombre, activo FROM usuarios"
  );
  return result.rows;
};

exports.actualizarUsuario = async (id, data, usuarioLogueado) => {

  const result = await db.query(
    `UPDATE usuarios
     SET nombre=$1,
         correo=$2,
         fecha_modificacion=NOW(),
         usuario_modificacion=$3
     WHERE id=$4
     RETURNING *`,
    [
      data.nombre,
      data.correo,
      usuarioLogueado.correo,
      id
    ]
  );

  return result.rows[0];
};

exports.eliminarUsuario = async (id) => {
  await db.query("DELETE FROM usuarios WHERE id=$1", [id]);
};