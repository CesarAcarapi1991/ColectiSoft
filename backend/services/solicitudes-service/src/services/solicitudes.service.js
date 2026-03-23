const db = require("../config/db");

exports.crearSolicitud = async (data, usuarioLogueado) => {

  const serie = await db.query(
    "SELECT serie FROM cont_series where nombre_tabla = 'solicitud_seguro'"
  );
  const producto = await db.query(
    "SELECT * FROM productos WHERE id = $1",
    [data.id_producto]
  );
  const result = await db.query(
    `INSERT INTO solicitud_seguro 
     (nro_solicitud, nro_serie, id_producto, id_asegurado, prima, id_estado, usuario_creacion)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [
      serie.rows[0].serie,
      0,
      data.id_producto,
      data.id_asegurado,
      producto.rows[0].prima,
      1,
      usuarioLogueado.correo
    ]
  );
  const newSerie = serie.rows[0].serie + 1;
  await db.query(
    "UPDATE cont_series SET serie = $1 WHERE nombre_tabla = 'solicitud_seguro'",
    [newSerie]
  );
  return result.rows[0];
};

exports.listarSolicitudes = async () => {
  const result = await db.query(
    "SELECT * FROM solicitud_seguro ORDER by id desc"
  );
  return result.rows;
};

exports.actualizarSolicitud = async (id, data, usuarioLogueado) => {
  const result = await db.query(
    `UPDATE solicitud_seguro
     SET 
         id_producto=$1,
         id_estado=$2,
         fecha_modificacion=NOW(),
         usuario_modificacion=$3
     WHERE id=$4
     RETURNING *`,
    [
      data.id_producto,
      data.id_estado,
      usuarioLogueado.correo,
      id
    ]
  );
  return result.rows;
};


exports.vigentarSolicitud = async (id_solicitud, usuarioLogueado) => {

  const solicitud = await db.query(
    'SELECT * FROM solicitud_seguro WHERE id = $1',
    [id_solicitud]
  );
  const serie = await db.query(
    'SELECT * FROM productos WHERE id = $1',
    [solicitud.rows[0].id_producto]
  );

  await db.query(
    `UPDATE solicitud_seguro
     SET 
         nro_serie=$1,
         fecha_vigencia=NOW(),
         fecha_vencimiento = NOW() + INTERVAL '1 year',
         certificado_file=$2,
         id_estado=$3,
         fecha_modificacion=NOW(),
         usuario_modificacion=$4
     WHERE id=$5
     RETURNING *`,
    [
      (serie.rows[0].serie +1),
      '',
      4,
      usuarioLogueado.correo,
      id_solicitud
    ]
  );

  const result = await db.query(
    `UPDATE productos
     SET 
         serie=$1
     WHERE id=$2
     RETURNING *`,
    [
      (serie.rows[0].serie +1),
      solicitud.rows[0].id_producto
    ]
  );

  return result.rows;
};

exports.infoSolicitud = async (id) => {
  
  const dataset = {};

  const solicitud = await db.query(
    "SELECT * FROM solicitud_seguro WHERE id = $1",
    [id]
  );

  const producto = await db.query(
    "SELECT * FROM productos WHERE id = $1",
    [solicitud.rows[0].id_producto]
  );

  const empresa = await db.query(
    "SELECT * FROM empresa_aseguradora WHERE id = $1",
    [producto.rows[0].id_empresa]
  );

  const asegurado = await db.query(
    "SELECT * FROM asegurados WHERE id = $1",
    [solicitud.rows[0].id_asegurado]
  );

  const beneficiarios = await db.query(
    "SELECT * FROM beneficiarios WHERE id_asegurado = $1",
    [asegurado.rows[0].id]
  );

  const reg_beneficiario = [];

  beneficiarios.rows.forEach(item => {
    const beneficiario = {};
    beneficiario.nombre_beneficiario = item.nombre_beneficiario;
    beneficiario.ci_beneficiario = item.ci_beneficiario;
    beneficiario.parentesco = item.parentesco;
    beneficiario.porcentaje = item.porcentaje;
    reg_beneficiario.push(beneficiario);
  });  

  dataset.nro_solicitud = solicitud.rows[0].nro_solicitud;
  dataset.serie = solicitud.rows[0].nro_serie;
  dataset.id_producto = solicitud.rows[0].id_producto;
  dataset.producto = producto.rows[0].nombre_producto;
  dataset.prima = producto.rows[0].prima;
  dataset.id_empresa = producto.rows[0].id_empresa;
  dataset.codigo_empresa = empresa.rows[0].codigo_empresa;
  dataset.empresa = empresa.rows[0].nombre_empresa;
  dataset.id_asegurado = solicitud.rows[0].id_asegurado;
  dataset.nombre_asegurado = asegurado.rows[0].nombre_asegurado;
  dataset.apellido_asegurado = asegurado.rows[0].primer_apellido + " " + asegurado.rows[0].segundo_apellido;
  dataset.tipo_documento = asegurado.rows[0].tipo_documento;
  dataset.nro_documento = asegurado.rows[0].nro_documento;
  dataset.complemento = asegurado.rows[0].complemento;
  dataset.estado_civil = asegurado.rows[0].estado_civil;
  dataset.genero = asegurado.rows[0].genero;
  dataset.fecha_nacimiento = asegurado.rows[0].fecha_nacimiento;
  dataset.direccion = asegurado.rows[0].direccion;
  dataset.ocupacion = asegurado.rows[0].ocupacion;
  dataset.celular = asegurado.rows[0].nro_celular;
  dataset.email = asegurado.rows[0].correo;
  dataset.beneficiarios = reg_beneficiario;
  

  return dataset;
};


exports.enviarCajaSolicitud = async (id, data, usuarioLogueado) => {
  const solicitud = await db.query(
    "SELECT * FROM solicitud_seguro WHERE id = $1",
    [id]
  );
  
  const asegurado = await db.query(
    "SELECT * FROM asegurados WHERE id = $1",
    [solicitud.rows[0].id_asegurado]
  );
  
  await db.query(
    `INSERT INTO cobros 
     (id_solicitud, tipo_documento, nro_documento, complemento, correo, monto, metodo_pago, nro_recibo, estado, usuario_registro)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [
      solicitud.rows[0].id,
      asegurado.rows[0].tipo_documento,
      asegurado.rows[0].nro_documento,
      asegurado.rows[0].complemento,
      asegurado.rows[0].correo,
      solicitud.rows[0].prima,
      data.metodo_pago,
      0,
      1,
      usuarioLogueado.correo
    ]
  );

  const result = await db.query(
    `UPDATE solicitud_seguro
     SET 
         id_estado=$1,
         fecha_modificacion=NOW(),
         usuario_modificacion=$2
     WHERE id=$3 and id_estado = 1
     RETURNING *`,
    [
      2,
      usuarioLogueado.correo,
      id
    ]
  );
  return result.rows;
};


exports.actualizarArchivo = async (id_solicitud, file) => {
  const result = await db.query(
    `UPDATE solicitud_seguro
     SET
         certificado_file=$1
     WHERE id=$2
     RETURNING *`,
    [
      file,
      id_solicitud
    ]
  );
  return result.rows;
};