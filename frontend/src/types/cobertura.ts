export interface Cobertura {
  id: number;
  id_producto: number;
  descripcion: string;
  suma_asegurada: string;
  carencia: string;
  activo: boolean;
  fecha_creacion: string;
  usuario_creacion: string;
  fecha_modificacion: string | null;
  usuario_modificacion: string | null;
}

export interface CoberturaRequest {
  id_producto: number;
  descripcion: string;
  suma_asegurada: string;
  carencia: string;
  activo?: boolean;
}