import api from './api';
import type { Empresa, EmpresaRequest } from '../types/empresa';

export const getEmpresas = async (): Promise<Empresa[]> => {
  const response = await api.get('/empresa');
  return response.data;
};

export const createEmpresa = async (data: EmpresaRequest): Promise<Empresa> => {
  const response = await api.post('/empresa', data);
  return response.data;
};

export const updateEmpresa = async (id: number, data: EmpresaRequest): Promise<Empresa> => {
  const response = await api.put(`/empresa/${id}`, data);
  return response.data;
};