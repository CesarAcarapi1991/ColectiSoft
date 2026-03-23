import api from './api';
import type { EnviarCajaRequest, Solicitud, SolicitudDetalle, SolicitudInfo, SolicitudRequest, VigentarResponse } from '../types/solicitud';

export const getSolicitudes = async (): Promise<Solicitud[]> => {
  const response = await api.get('/solicitudes');
  return response.data;
};

export const createSolicitud = async (data: SolicitudRequest): Promise<Solicitud> => {
  const response = await api.post('/solicitudes', data);
  return response.data;
};

export const vigentarSolicitud = async (id: number): Promise<VigentarResponse> => {
  // const response = await api.put(`/solicitudes/vigentarSeguro/${id}`, data);
  const response = await api.put(`/solicitudes/vigentarSeguro/${id}`);
  return response.data;
};

export const getSolicitudDetalle = async (id: number): Promise<SolicitudDetalle> => {
  const response = await api.get(`/solicitudes/informacion/${id}`);
  return response.data;
};

// export const updateSolicitudEstado = async (id: number, data: SolicitudUpdateRequest): Promise<Solicitud> => {
//   const response = await api.put(`/solicitudes/${id}`, data);
//   return response.data;
// };

// export const enviarCajaEstado = async (id: number, data: SolicitudUpdateRequest): Promise<Solicitud> => {
//   const response = await api.put(`/solicitudes/enviarCaja/${id}`, data);
//   return response.data;
// };

export const enviarCajaEstado = async (id: number, data: EnviarCajaRequest): Promise<Solicitud> => {
  const response = await api.put(`/solicitudes/enviarCaja/${id}`, data);
  return response.data;
};


// Obtener información detallada de una solicitud
export const getSolicitudInfo = async (id: number): Promise<SolicitudInfo> => {
  const response = await api.get(`/solicitudes/informacion/${id}`);
  return response.data;
};

// Cambiar estado de una solicitud (enviar a caja, etc.)
export const updateSolicitudEstado = async (id: number, data: { id_producto: number; id_asegurado: number; id_estado: number; comentario?: string }): Promise<Solicitud> => {
  const response = await api.put(`/solicitudes/${id}`, data);
  return response.data;
};