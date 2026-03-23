// import api from './api';
// import type { BusquedaCaja, SolicitudInformacion, CobroRequest } from '../types/caja';

// export const buscarPorDocumento = async (tipoDocumento: string, nroDocumento: string, complemento?: string): Promise<BusquedaCaja> => {
//   const params: any = { tipo_documento: tipoDocumento, nro_documento: nroDocumento };
//   if (complemento) params.complemento = complemento;
//   const response = await api.get('/caja/buscar', { params });
//   return response.data;
// };

// export const obtenerInformacionSolicitud = async (idSolicitud: number): Promise<SolicitudInformacion> => {
//   const response = await api.get(`/solicitudes/informacion/${idSolicitud}`);
//   return response.data;
// };

// export const cobrar = async (id: number, data: CobroRequest): Promise<BusquedaCaja> => {
//   const response = await api.put(`/caja/cobrar/${id}`, data);
//   return response.data;
// };

import api from './api';
import type { CajaPendiente, CajaCobroResponse } from '../types/caja';

// Buscar pendiente por documento
export const buscarPendienteCaja = async (tipoDocumento: string, nroDocumento: string, complemento?: string): Promise<CajaPendiente | null> => {
  const params: any = { tipo_documento: tipoDocumento, nro_documento: nroDocumento };
  if (complemento) params.complemento = complemento;
  try {
    const response = await api.get('/caja/buscar', { params });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};

// Registrar cobro
export const cobrarSolicitud = async (id: number, montoRecibido: number): Promise<CajaCobroResponse> => {
  const response = await api.put(`/caja/cobrar/${id}`, { monto_recibido: montoRecibido });
  console.log(response);
  return response.data[0];
};

// Buscar transacción por número de recibo
export const buscarTransaccion = async (nroRecibo: string): Promise<CajaPendiente> => {
  const response = await api.get(`/caja/buscarTransaccion/${nroRecibo}`);
  return response.data;
};