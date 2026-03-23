const db = require("../config/db");

exports.crearEmpresa = async (data, usuarioLogueado) => {

  const result = await db.query(
    `INSERT INTO empresa_aseguradora 
     (codigo_empresa, nombre_empresa, usuario_creacion)
     VALUES ($1,$2,$3) RETURNING *`,
    [
      data.codigo_empresa,
      data.nombre_empresa,
      usuarioLogueado.correo
    ]
  );

  return result.rows[0];
};

exports.listarEmpresas = async () => {
  const result = await db.query(
    "SELECT * FROM empresa_aseguradora order by id desc"
  );
  return result.rows;
};

exports.actualizarEmpresa = async (id, data, usuarioLogueado) => {

  const result = await db.query(
    `UPDATE empresa_aseguradora
     SET codigo_empresa=$1,
         nombre_empresa=$2,
         fecha_modificacion=NOW(),
         usuario_modificacion=$3,
         activo=$5
     WHERE id=$4
     RETURNING *`,
    [
      data.codigo_empresa,
      data.nombre_empresa,
      usuarioLogueado.correo,
      id,
      data.activo
    ]
  );

  return result.rows[0];
};

// exports.eliminarEmpresa = async (id) => {
//   await db.query("UPDATE empresa_aseguradora SET activo=false WHERE id=$1", [id]);
// };