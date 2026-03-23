export interface Empresa {
  id: number;
  codigo_empresa: string;
  nombre_empresa: string;
  activo: boolean;
  fecha_creacion: string;
  usuario_creacion: string;
  fecha_modificacion: string | null;
  usuario_modificacion: string | null;
}

export interface EmpresaRequest {
  codigo_empresa: string;
  nombre_empresa: string;
  activo?: boolean; // opcional para actualizaciones
}