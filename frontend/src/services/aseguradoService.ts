import api from './api';
import type { Asegurado, AseguradoRequest } from '../types/asegurado';

export const getAsegurados = async (): Promise<Asegurado[]> => {
  const response = await api.get('/asegurados');
  return response.data;
};

export const buscarAseguradoPorCI = async (ci: string): Promise<Asegurado[]> => {
  // Asume que el backend permite filtrar por nro_documento
  const response = await api.get('/asegurados', { params: { nro_documento: ci } });
  return response.data;
};

export const createAsegurado = async (data: AseguradoRequest): Promise<Asegurado> => {
  const response = await api.post('/asegurados', data);
  return response.data;
};

export const updateAsegurado = async (id: number, data: AseguradoRequest): Promise<Asegurado> => {
  const response = await api.put(`/asegurados/${id}`, data);
  return response.data;
};

// export const buscarAsegurado = async (tipoDocumento: string, nroDocumento: string, complemento?: string): Promise<Asegurado[]> => {
//   const params: any = { tipo_documento: tipoDocumento, nro_documento: nroDocumento };
//   if (complemento) params.complemento = complemento;
//   const response = await api.get('/asegurados/buscar', { params });
//   return response.data;
// };
// export const buscarAsegurado = async (tipoDocumento: string, nroDocumento: string, complemento?: string): Promise<Asegurado[]> => {
//   const params: any = { tipo_documento: tipoDocumento, nro_documento: nroDocumento };
//   if (complemento) params.complemento = complemento;
//   const response = await api.get('/asegurados/buscar', { params });
//   return response.data;
// };

export const buscarAsegurado = async (
  tipoDocumento: string,
  nroDocumento: string,
  complemento?: string
): Promise<Asegurado | null> => {
  const params: any = { tipo_documento: tipoDocumento, nro_documento: nroDocumento };
  if (complemento) params.complemento = complemento;
  try {
    const response = await api.get('/asegurados/buscar', { params });
    return response.data; // es un objeto, no un array
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; // no encontrado
    }
    throw error; // otros errores se propagan
  }
};