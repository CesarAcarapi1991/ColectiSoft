export interface Producto {
  id: number;
  id_empresa: number;
  nombre_producto: string;
  prima: string;
  descripcion: string;
  nro_beneficiarios: number;
  edad_minima: number;
  edad_maxima: number;
  serie: number;
  activo: boolean;
  fecha_creacion: string;
  usuario_creacion: string;
  fecha_modificacion: string | null;
  usuario_modificacion: string | null;
}

export interface ProductoRequest {
  id_empresa: number;
  nombre_producto: string;
  prima: string;
  descripcion: string;
  nro_beneficiarios: number;
  edad_minima: number;
  edad_maxima: number;
  serie: number;
  activo?: boolean;
}