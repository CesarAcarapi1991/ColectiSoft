const db = require("../config/db");

exports.crearProducto = async (data, usuarioLogueado) => {

  const result = await db.query(
    `INSERT INTO productos 
     (id_empresa, nombre_producto, prima, descripcion, nro_beneficiarios, edad_minima, edad_maxima, usuario_creacion)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      data.id_empresa,
      data.nombre_producto,
      data.prima,
      data.descripcion,
      data.nro_beneficiarios,
      data.edad_minima,
      data.edad_maxima,
      usuarioLogueado.correo
    ]
  );

  return result.rows[0];
};

exports.listarProductos = async () => {
  const result = await db.query(
    "SELECT * FROM productos"
  );
  return result.rows;
};

exports.actualizarProducto = async (id, data, usuarioLogueado) => {
  const result = await db.query(
    `UPDATE productos
     SET nombre_producto=$1,
         prima=$2,
         descripcion=$3,
         nro_beneficiarios=$4,
         edad_minima=$5,
         edad_maxima=$6,
         activo=$7,
         fecha_modificacion=NOW(),
         usuario_modificacion=$8
     WHERE id=$9
     RETURNING *`,
    [
      data.nombre_producto,
      data.prima,
      data.descripcion,
      data.nro_beneficiarios,
      data.edad_minima,
      data.edad_maxima,
      data.activo,
      usuarioLogueado.correo,
      id
    ]
  );
  return result.rows;
};

exports.actualizarEmpresa = async (id, data, usuarioLogueado) => {

  const result = await db.query(
    `UPDATE empresa_aseguradora
     SET codigo_empresa=$1,
         nombre_empresa=$2,
         prima=$3,
         descripcion=$4,
         nro_beneficiarios=$5,
         edad_minima=$6,
         edad_maxima=$7,
         activo=$8,
         fecha_modificacion=NOW(),
         usuario_modificacion=$9,
     WHERE id=$10
     RETURNING *`,
    [
      data.codigo_empresa,
      data.nombre_empresa,
      data.prima,
      data.descripcion,
      data.nro_beneficiarios,
      data.edad_minima,
      data.edad_maxima,
      data.activo,
      usuarioLogueado.correo,
      id
    ]
  );

  return result.rows[0];
};

// exports.eliminarProducto = async (id) => {
//   await db.query("UPDATE productos SET activo=false WHERE id=$1", [id]);
// };