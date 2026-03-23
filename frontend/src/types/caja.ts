// export interface BusquedaCaja {
//   id: number;
//   id_solicitud: number;
//   tipo_documento: string;
//   nro_documento: string;
//   complemento: string | null;
//   correo: string;
//   monto: string;
//   metodo_pago: string;
//   nro_recibo: string;
//   monto_recibido: string | null;
//   cambio: string | null;
//   estado: number; // 1 = pendiente, 2 = cobrado
//   fecha_registro: string;
//   usuario_registro: string;
//   fecha_cobro: string | null;
//   usuario_caja: string | null;
// }

// export interface SolicitudInformacion {
//   nro_solicitud: string;
//   serie: number;
//   id_producto: number;
//   producto: string;
//   prima: string;
//   id_empresa: number;
//   codigo_empresa: string;
//   empresa: string;
//   id_asegurado: number;
//   apellido_asegurado: string;
//   tipo_documento: string;
//   estado_civil: string;
//   genero: string;
//   fecha_nacimiento: string;
//   direccion: string;
//   ocupacion: string;
//   celular: string;
//   email: string;
//   beneficiarios: Array<{
//     nombre_beneficiario: string;
//     ci_beneficiario: string;
//     parentesco: string;
//     porcentaje: string;
//   }>;
// }

// export interface CobroRequest {
//   monto_recibido: string;
// }

export interface CajaPendiente {
  id: number;
  id_solicitud: number;
  tipo_documento: string;
  nro_documento: string;
  complemento: string | null;
  correo: string;
  monto: string;
  metodo_pago: string;
  nro_recibo: string;
  monto_recibido: string | null;
  cambio: string | null;
  estado: number; // 1 = pendiente, 2 = cobrado
  fecha_registro: string;
  usuario_registro: string;
  fecha_cobro: string | null;
  usuario_caja: string | null;
}

export interface CajaCobroRequest {
  monto_recibido: number;
}

export interface CajaCobroResponse {
  id: number;
  id_solicitud: number;
  tipo_documento: string;
  nro_documento: string;
  complemento: string | null;
  correo: string;
  monto: string;
  metodo_pago: string;
  nro_recibo: string;
  monto_recibido: string;
  cambio: string;
  estado: string;
  fecha_registro: string;
  usuario_registro: string;
  fecha_cobro: string;
  usuario_caja: string;
}


export interface CajaPendiente {
  id: number;
  id_solicitud: number;
  tipo_documento: string;
  nro_documento: string;
  complemento: string | null;
  correo: string;
  monto: string;
  metodo_pago: string;
  nro_recibo: string;
  monto_recibido: string | null;
  cambio: string | null;
  estado: number; // 1 = pendiente, 2 = cobrado
  fecha_registro: string;
  usuario_registro: string;
  fecha_cobro: string | null;
  usuario_caja: string | null;
}