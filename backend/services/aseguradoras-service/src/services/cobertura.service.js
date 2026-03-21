const db = require("../config/db");

exports.crearCobertura = async (data, usuarioLogueado) => {

  const result = await db.query(
    `INSERT INTO cobertura 
     (id_producto, descripcion, suma_asegurada, carencia, usuario_creacion)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [
      data.id_producto,
      data.descripcion,
      data.suma_asegurada,
      data.carencia,
      usuarioLogueado.correo
    ]
  );

  return result.rows[0];
};

exports.listarCoberturas = async () => {
  const result = await db.query(
    "SELECT * FROM cobertura"
  );
  return result.rows;
};

exports.actualizarCobertura = async (id, data, usuarioLogueado) => {
  const result = await db.query(
    `UPDATE cobertura
     SET 
         id_producto=$1,
         descripcion=$2,
         suma_asegurada=$3,
         carencia=$4,
         activo=$5,
         fecha_modificacion=NOW(),
         usuario_modificacion=$6
     WHERE id=$7
     RETURNING *`,
    [
      data.id_producto,
      data.descripcion,
      data.suma_asegurada,
      data.carencia,
      data.activo,
      usuarioLogueado.correo,
      id
    ]
  );
  return result.rows;
};