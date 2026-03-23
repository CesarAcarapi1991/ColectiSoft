const db = require("../config/db");

exports.realizarCobros = async (id, data, usuarioLogueado) => {
  
  const cobro = await db.query(
    'SELECT * FROM cobros WHERE id_solicitud = $1',
    [id]
  );

  const recibo = await db.query(
    'SELECT * FROM cont_series WHERE nombre_tabla = $1',
    ['nro_recibo']
  );

  await db.query(
    'UPDATE cont_series SET serie = $1 WHERE nombre_tabla = $2',
    [(recibo.rows[0].serie + 1), 'nro_recibo']
  );

  await db.query(
    'UPDATE solicitud_seguro SET id_estado = $1 WHERE id = $2',
    [ 3, id ]
  );

  const result = await db.query(
    `UPDATE cobros
     SET 
         nro_recibo=$1,
         monto_recibido=$2,
         cambio=$3,
         estado=$4,
         fecha_cobro=NOW(),
         usuario_caja=$5
     WHERE id_solicitud=$6
     RETURNING *`,
    [
      (recibo.rows[0].serie + 1),
      data.monto_recibido,
      (data.monto_recibido - cobro.rows[0].monto),
      2,
      usuarioLogueado.correo,
      id
    ]
  );
  return result.rows;
};

exports.buscarPorDocumento = async (tipo, nro, complemento) => {

  let query = `
    SELECT *
    FROM cobros
    WHERE estado = 1 AND tipo_documento = $1
    AND nro_documento = $2
  `;

  const params = [tipo, nro];

  // 🔥 SOLO filtra complemento si viene
  if (complemento && complemento.trim() !== "") {
    query += " AND complemento = $3";
    params.push(complemento.trim());
  }

  query += " order by id desc LIMIT 1";

  const result = await db.query(query, params);

  return result.rows[0];
};



exports.buscarTransaccion = async (id) => {

  const result = await db.query(
    'SELECT * FROM cobros WHERE nro_recibo = $1',
    [id]
  );
  
  return result.rows[0];
};