import api from './api';
import type { Beneficiario, BeneficiarioRequest } from '../types/beneficiario';

export const getBeneficiarios = async (): Promise<Beneficiario[]> => {
  const response = await api.get('/beneficiarios');
  return response.data;
};

export const createBeneficiario = async (data: BeneficiarioRequest): Promise<Beneficiario> => {
  const response = await api.post('/beneficiarios', data);
  return response.data;
};

export const updateBeneficiario = async (id: number, data: BeneficiarioRequest): Promise<Beneficiario> => {
  const response = await api.put(`/beneficiarios/${id}`, data);
  return response.data;
};