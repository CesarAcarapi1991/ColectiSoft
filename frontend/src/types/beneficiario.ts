export interface Beneficiario {
  id: number;
  id_asegurado: number;
  item: number;
  nombre_beneficiario: string;
  ci_beneficiario: string;
  parentesco: string;
  porcentaje: string;
  activo: boolean;
  fecha_creacion: string;
  usuario_creacion: string;
  fecha_modificacion: string | null;
  usuario_modificacion: string | null;
}

export interface BeneficiarioRequest {
  id_asegurado: number;
  item: number;
  nombre_beneficiario: string;
  ci_beneficiario: string;
  parentesco: string;
  porcentaje: number;
}