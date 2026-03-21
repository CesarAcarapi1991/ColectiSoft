const db = require("../config/db");

exports.crearBeneficiario = async (data, usuarioLogueado) => {

  const result = await db.query(
    `INSERT INTO beneficiarios 
     (id_asegurado, item, nombre_beneficiario, ci_beneficiario, parentesco, porcentaje, usuario_creacion)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [
      data.id_asegurado,
      data.item,
      data.nombre_beneficiario,
      data.ci_beneficiario,
      data.parentesco,
      data.porcentaje,
      usuarioLogueado.correo
    ]
  );

  return result.rows[0];
};

exports.listarBeneficiarios = async () => {
  const result = await db.query(
    "SELECT * FROM beneficiarios"
  );
  return result.rows;
};

exports.actualizarBeneficiario = async (id, data, usuarioLogueado) => {

  const result = await db.query(
    `UPDATE beneficiarios
     SET id_asegurado=$1,
         item=$2,
         nombre_beneficiario=$3,
         ci_beneficiario=$4,
         parentesco=$5,
         porcentaje=$6,
         fecha_modificacion=NOW(),
         usuario_modificacion=$7
     WHERE id=$8
     RETURNING *`,
    [
      data.id_asegurado,
      data.item,
      data.nombre_beneficiario,
      data.ci_beneficiario,
      data.parentesco,
      data.porcentaje,
      usuarioLogueado.correo,
      id
    ]
  );

  return result.rows[0];
};