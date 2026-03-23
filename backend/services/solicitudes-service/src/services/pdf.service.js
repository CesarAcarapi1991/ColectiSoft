const PDFDocument = require("pdfkit");
const db = require("../config/db");

function formatearFecha(fecha) {
  if (!fecha) return '';
  const d = new Date(fecha);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0'); // getMonth() devuelve 0-11
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

exports.generateEmpresaPDF = async (id_solicitud) => {
  return new Promise(async (resolve, reject) => {

    const solicitud = await db.query(
      'select * from solicitud_seguro where id = $1',
      [id_solicitud]
    );

    const asegurado = await db.query(
      'select * from asegurados where id = $1',
      [solicitud.rows[0].id_asegurado]
    );

    const doc = new PDFDocument();

    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);

      // 🔥 convertir a Base64
      const base64 = pdfBuffer.toString("base64");

      resolve(base64);
    });

    doc.on("error", reject);

    // 🏢 Contenido PDF
    doc.fontSize(18).text("CERTIFICADO SEGURO COLECTIVO", { align: "center" });

    doc.moveDown();
    doc.fontSize(12).text(`NRO SOLICITUD SEGURO: ${solicitud.rows[0].nro_solicitud}`);
    doc.fontSize(12).text(`NRO CERTIFICADO: ${solicitud.rows[0].nro_serie}`);
    doc.fontSize(12).text(`FECHA VIGENCIA: ${formatearFecha(solicitud.rows[0].fecha_vigencia)}`);
    doc.fontSize(12).text(`FECHA VENCIMIENTO: ${formatearFecha(solicitud.rows[0].fecha_vencimiento)}`);
    doc.fontSize(12).text(`PRIMA: ${solicitud.rows[0].prima}`);
    doc.moveDown();

    doc.fontSize(12).text(`NOMBRE ASEGURADO: ${asegurado.rows[0].nombres} ${asegurado.rows[0].primer_apellido} ${asegurado.rows[0].segundo_apellido}`);
    doc.fontSize(12).text(`${asegurado.rows[0].tipo_documento}: ${asegurado.rows[0].nro_documento} ${asegurado.rows[0].complemento}`);
    doc.fontSize(12).text(`FECHA NACIMIENTO: ${formatearFecha(asegurado.rows[0].fecha_nacimiento)}`);
    doc.fontSize(12).text(`CORREO: ${asegurado.rows[0].correo}`);
    doc.fontSize(12).text(`CELULAR: ${asegurado.rows[0].nro_celular}`);
    doc.moveDown();

    const beneficiariosResult = await db.query(
      'select * from beneficiarios where id_asegurado = $1',
      [solicitud.rows[0].id_asegurado]
    );
    const beneficiarios = beneficiariosResult.rows; 
    doc.text("BENEFICIARIO(S):");
    beneficiarios.forEach((p) => {
      doc.text(`NOMBRE: ${p.nombre_beneficiario} - NRO. DOC.: ${p.ci_beneficiario} - PARENTESCO: ${p.nombre_beneficiario} - PORCENTAJE: ${p.nombre_beneficiario}`);
    });
    doc.moveDown();

    doc.end();
  });
};