export interface Solicitud {
  id: number;
  nro_solicitud: string;
  nro_serie: number;
  id_producto: number;
  id_asegurado: number;
  fecha_vigencia: string | null;
  fecha_vencimiento: string | null;
  certificado_file: string | null;
  prima: string;
  id_estado: number;
  activo: boolean;
  fecha_creacion: string;
  usuario_creacion: string;
  fecha_modificacion: string | null;
  usuario_modificacion: string | null;
}

export interface SolicitudRequest {
  id_producto: number;
  id_asegurado: number;
}

export interface VigentarResponse {
  file: string; // base64 del PDF
}

export interface SolicitudDetalle {
  nro_solicitud: string;
  serie: number;
  id_producto: number;
  producto: string;
  prima: string;
  id_empresa: number;
  codigo_empresa: string;
  empresa: string;
  id_asegurado: number;
  apellido_asegurado: string;
  tipo_documento: string;
  nro_documento: string;
  complemento:string;
  estado_civil: string;
  genero: string;
  fecha_nacimiento: string;
  direccion: string;
  ocupacion: string;
  celular: string;
  email: string;
  beneficiarios: Array<{
    nombre_beneficiario: string;
    ci_beneficiario: string;
    parentesco: string;
    porcentaje: string;
  }>;
}

export interface SolicitudUpdateRequest {
  id_producto: number;
  id_asegurado: number;
  id_estado: number;
  comentario: string;
}

export interface EnviarCajaRequest {
  metodo_pago: string;
}

export interface SolicitudInfo {
  nro_solicitud: string;
  serie: number;
  id_producto: number;
  producto: string;
  prima: string;
  id_empresa: number;
  codigo_empresa: string;
  empresa: string;
  id_asegurado: number;
  apellido_asegurado: string;
  tipo_documento: string;
  estado_civil: string;
  genero: string;
  fecha_nacimiento: string;
  direccion: string;
  ocupacion: string;
  celular: string;
  email: string;
  benefiarios: Array<{
    nombre_beneficiario: string;
    ci_beneficiario: string;
    parentesco: string;
    porcentaje: string;
  }>;
}