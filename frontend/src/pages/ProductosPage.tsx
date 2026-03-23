import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getProductos, createProducto, updateProducto } from '../services/productoService';
import { getEmpresas } from '../services/empresaService';
import type { Producto, ProductoRequest } from '../types/producto';
import type { Empresa } from '../types/empresa';
import Modal from '../components/common/Modal';
import ProductoForm from '../components/producto/ProductoForm';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { Plus, Edit, CheckCircle, XCircle, Search, Package, Filter } from 'lucide-react';

const ProductosPage: React.FC = () => {
  const { user } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [filterEmpresa, setFilterEmpresa] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);

  // Permisos
  const canView = user?.permisos?.includes('ver_productos') || user?.roles?.includes('ADMIN');
  const canCreate = user?.permisos?.includes('crear_producto') || user?.roles?.includes('ADMIN');
  const canEdit = user?.permisos?.includes('editar_producto') || user?.roles?.includes('ADMIN');

  useEffect(() => {
    if (canView) {
      fetchData();
    }
  }, [canView]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productosData, empresasData] = await Promise.all([getProductos(), getEmpresas()]);
      setProductos(productosData);
      setEmpresas(empresasData.filter(emp => emp.activo));
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: ProductoRequest) => {
    try {
      await createProducto(data);
      toast.success('Producto creado exitosamente');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al crear producto');
      throw error;
    }
  };

  const handleUpdate = async (id: number, data: ProductoRequest) => {
    try {
      await updateProducto(id, data);
      toast.success('Producto actualizado exitosamente');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al actualizar producto');
      throw error;
    }
  };

  const toggleActive = async (producto: Producto) => {
    if (!canEdit) {
      toast.error('No tienes permisos para editar productos');
      return;
    }
    const newActive = !producto.activo;
    try {
      await updateProducto(producto.id, {
        id_empresa: producto.id_empresa,
        nombre_producto: producto.nombre_producto,
        prima: producto.prima,
        descripcion: producto.descripcion,
        nro_beneficiarios: producto.nro_beneficiarios,
        edad_minima: producto.edad_minima,
        edad_maxima: producto.edad_maxima,
        serie: producto.serie,
        activo: newActive,
      });
      toast.success(`Producto ${newActive ? 'activado' : 'desactivado'} exitosamente`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al cambiar estado');
    }
  };

  // Filtrado
  const filteredProductos = productos.filter(prod => {
    const matchesText =
      prod.nombre_producto.toLowerCase().includes(filterText.toLowerCase()) ||
      prod.descripcion.toLowerCase().includes(filterText.toLowerCase());
    const matchesEmpresa = filterEmpresa === 'all' || prod.id_empresa === filterEmpresa;
    return matchesText && matchesEmpresa;
  });

  // Paginación
  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);
  const paginatedProductos = filteredProductos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Estadísticas
  const total = productos.length;
  const active = productos.filter(p => p.activo).length;
  const inactive = total - active;

  const getEmpresaNombre = (id: number) => {
    const empresa = empresas.find(e => e.id === id);
    return empresa ? (empresa.codigo_empresa ? `${empresa.codigo_empresa} - ${empresa.nombre_empresa}` : empresa.nombre_empresa || `Empresa ${id}`) : `Empresa ${id}`;
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No tienes permisos para ver productos</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Productos</h2>
        {canCreate && (
          <Button onClick={() => { setEditingProducto(null); setModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo producto
          </Button>
        )}
      </div>

      {/* Tarjetas estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total productos</p>
              <p className="text-2xl font-bold text-gray-800">{total}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Activos</p>
              <p className="text-2xl font-bold text-green-600">{active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inactivos</p>
              <p className="text-2xl font-bold text-red-600">{inactive}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="md:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterEmpresa}
                onChange={(e) => {
                  setFilterEmpresa(e.target.value === 'all' ? 'all' : parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Todas las empresas</option>
                {empresas.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.codigo_empresa ? `${emp.codigo_empresa} - ${emp.nombre_empresa}` : emp.nombre_empresa || `Empresa ${emp.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prima</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficiarios</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edades</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serie</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProductos.map((producto) => (
                    <tr key={producto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{producto.nombre_producto}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getEmpresaNombre(producto.id_empresa)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Bs.- {producto.prima}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{producto.nro_beneficiarios}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{producto.edad_minima} - {producto.edad_maxima}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{producto.serie}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          producto.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {producto.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {canEdit && (
                            <>
                              <button
                                onClick={() => toggleActive(producto)}
                                className="text-gray-600 hover:text-gray-900"
                                title={producto.activo ? 'Desactivar' : 'Activar'}
                              >
                                {producto.activo ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                              </button>
                              <button
                                onClick={() => { setEditingProducto(producto); setModalOpen(true); }}
                                className="text-blue-600 hover:text-blue-900"
                                title="Editar"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedProductos.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                        No se encontraron productos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Mostrando {((currentPage-1)*itemsPerPage)+1} - {Math.min(currentPage*itemsPerPage, filteredProductos.length)} de {filteredProductos.length}
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p-1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal para crear/editar */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProducto ? 'Editar producto' : 'Nuevo producto'}>
        <ProductoForm
          producto={editingProducto}
          onSubmit={async (data) => {
            if (editingProducto) {
              await handleUpdate(editingProducto.id, data);
            } else {
              await handleCreate(data);
            }
            setModalOpen(false);
            setEditingProducto(null);
          }}
          onCancel={() => {
            setModalOpen(false);
            setEditingProducto(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ProductosPage;