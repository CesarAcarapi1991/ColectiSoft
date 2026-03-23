export interface Asegurado {
  id: number;
  tipo_documento: string;
  nro_documento: string;
  complemento: string;
  nombres: string;
  primer_apellido: string;
  segundo_apellido: string;
  estado_civil: string;
  genero: string;
  fecha_nacimiento: string;
  ocupacion: string;
  direccion: string;
  correo: string;
  nro_celular: string;
  activo: boolean;
  fecha_creacion: string;
  usuario_creacion: string;
  fecha_modificacion: string | null;
  usuario_modificacion: string | null;
}

export interface AseguradoRequest {
  tipo_documento: string;
  nro_documento: string;
  complemento: string;
  nombres: string;
  primer_apellido: string;
  segundo_apellido: string;
  estado_civil: string;
  genero: string;
  fecha_nacimiento: string;
  ocupacion: string;
  direccion: string;
  correo: string;
  nro_celular: string;
}