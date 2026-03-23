import api from './api';
import type { Producto, ProductoRequest } from '../types/producto';

export const getProductos = async (): Promise<Producto[]> => {
  const response = await api.get('/producto');
  return response.data;
};

export const createProducto = async (data: ProductoRequest): Promise<Producto> => {
  const response = await api.post('/producto', data);
  return response.data;
};

export const updateProducto = async (id: number, data: ProductoRequest): Promise<Producto> => {
  const response = await api.put(`/producto/${id}`, data);
  return response.data;
};






// Agregar al archivo existente
export const getProductosByEmpresa = async (idEmpresa: number): Promise<Producto[]> => {
  const productos = await getProductos();
  return productos.filter(p => p.id_empresa === idEmpresa && p.activo);
};