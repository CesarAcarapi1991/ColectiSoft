const db = require("../config/db");

exports.crearAsegurado = async (data, usuarioLogueado) => {

  const result = await db.query(
    `INSERT INTO asegurados 
     (tipo_documento, nro_documento, complemento, nombres, primer_apellido, segundo_apellido, estado_civil,
     genero, fecha_nacimiento, ocupacion, direccion, correo, nro_celular, usuario_creacion)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
    [
      data.tipo_documento,
      data.nro_documento,
      data.complemento,
      data.nombres,
      data.primer_apellido,
      data.segundo_apellido,
      data.estado_civil,
      data.genero,
      data.fecha_nacimiento,
      data.ocupacion,
      data.direccion,
      data.correo,
      data.nro_celular,
      usuarioLogueado.correo
    ]
  );

  return result.rows[0];
};

exports.listarAsegurados = async () => {
  const result = await db.query(
    "SELECT * FROM asegurados"
  );
  return result.rows;
};

exports.actualizarAsegurado = async (id, data, usuarioLogueado) => {
  const result = await db.query(
    `UPDATE asegurados
     SET 
         tipo_documento=$1,
         nro_documento=$2,
         complemento=$3,
         nombres=$4,
         primer_apellido=$5,
         segundo_apellido=$6,
         estado_civil=$7,
         genero=$8,
         fecha_nacimiento=$9,
         ocupacion=$10,
         direccion=$11,
         correo=$12,
         nro_celular=$13,
         fecha_modificacion=NOW(),
         usuario_modificacion=$14
     WHERE id=$15
     RETURNING *`,
    [
      data.tipo_documento,
      data.nro_documento,
      data.complemento,
      data.nombres,
      data.primer_apellido,
      data.segundo_apellido,
      data.estado_civil,
      data.genero,
      data.fecha_nacimiento,
      data.ocupacion,
      data.direccion,
      data.correo,
      data.nro_celular,
      usuarioLogueado.correo,
      id
    ]
  );
  return result.rows;
};