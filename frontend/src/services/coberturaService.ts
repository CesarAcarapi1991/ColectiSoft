import api from './api';
import type { Cobertura, CoberturaRequest } from '../types/cobertura';

export const getCoberturas = async (): Promise<Cobertura[]> => {
  const response = await api.get('/cobertura');
  return response.data;
};

export const createCobertura = async (data: CoberturaRequest): Promise<Cobertura> => {
  const response = await api.post('/cobertura', data);
  return response.data;
};

export const updateCobertura = async (id: number, data: CoberturaRequest): Promise<Cobertura> => {
  const response = await api.put(`/cobertura/${id}`, data);
  return response.data;
};





// Agregar al archivo existente
export const getCoberturasByProducto = async (idProducto: number): Promise<Cobertura[]> => {
  const coberturas = await getCoberturas();
  return coberturas.filter(c => c.id_producto === idProducto && c.activo);
};