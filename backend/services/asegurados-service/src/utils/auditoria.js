const db = require("../config/db");

async function registrarAuditoria(data) {

  try {

    await db.query(
      `INSERT INTO auditoria
      (id_usuario, servicio, accion, tabla_afectada, id_registro, valor_antes, valor_despues, ip, trace_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        data.id_usuario || null,
        data.servicio,
        data.accion,
        data.tabla,
        data.id_registro || null,
        data.valor_antes || null,
        data.valor_despues || null,
        data.ip,
        data.trace_id || null
      ]
    );

  } catch (error) {

    console.error("Error auditoria:", error.message);

  }

}

module.exports = registrarAuditoria;