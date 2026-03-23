import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getCoberturas, createCobertura, updateCobertura } from '../services/coberturaService';
import { getProductos } from '../services/productoService';
import type { Cobertura, CoberturaRequest } from '../types/cobertura';
import type { Producto } from '../types/producto';
import Modal from '../components/common/Modal';
import CoberturaForm from '../components/cobertura/CoberturaForm';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { Plus, Edit, CheckCircle, XCircle, Search, Shield, Filter } from 'lucide-react';

const CoberturasPage: React.FC = () => {
  const { user } = useAuth();
  const [coberturas, setCoberturas] = useState<Cobertura[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [filterProducto, setFilterProducto] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCobertura, setEditingCobertura] = useState<Cobertura | null>(null);

  // Permisos
  const canView = user?.permisos?.includes('ver_coberturas') || user?.roles?.includes('ADMIN');
  const canCreate = user?.permisos?.includes('crear_cobertura') || user?.roles?.includes('ADMIN');
  const canEdit = user?.permisos?.includes('editar_cobertura') || user?.roles?.includes('ADMIN');

  useEffect(() => {
    if (canView) {
      fetchData();
    }
  }, [canView]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coberturasData, productosData] = await Promise.all([getCoberturas(), getProductos()]);
      setCoberturas(coberturasData);
      setProductos(productosData.filter(p => p.activo));
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CoberturaRequest) => {
    try {
      await createCobertura(data);
      toast.success('Cobertura creada exitosamente');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al crear cobertura');
      throw error;
    }
  };

  const handleUpdate = async (id: number, data: CoberturaRequest) => {
    try {
      await updateCobertura(id, data);
      toast.success('Cobertura actualizada exitosamente');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al actualizar cobertura');
      throw error;
    }
  };

  const toggleActive = async (cobertura: Cobertura) => {
    if (!canEdit) {
      toast.error('No tienes permisos para editar coberturas');
      return;
    }
    const newActive = !cobertura.activo;
    try {
      await updateCobertura(cobertura.id, {
        id_producto: cobertura.id_producto,
        descripcion: cobertura.descripcion,
        suma_asegurada: cobertura.suma_asegurada,
        carencia: cobertura.carencia,
        activo: newActive,
      });
      toast.success(`Cobertura ${newActive ? 'activada' : 'desactivada'} exitosamente`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al cambiar estado');
    }
  };

  // Filtrado
  const filteredCoberturas = coberturas.filter(cob => {
    const matchesText =
      cob.descripcion.toLowerCase().includes(filterText.toLowerCase()) ||
      cob.suma_asegurada.toLowerCase().includes(filterText.toLowerCase());
    const matchesProducto = filterProducto === 'all' || cob.id_producto === filterProducto;
    return matchesText && matchesProducto;
  });

  // Paginación
  const totalPages = Math.ceil(filteredCoberturas.length / itemsPerPage);
  const paginatedCoberturas = filteredCoberturas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Estadísticas
  const total = coberturas.length;
  const active = coberturas.filter(c => c.activo).length;
  const inactive = total - active;

  const getProductoNombre = (id: number) => {
    const producto = productos.find(p => p.id === id);
    return producto ? producto.nombre_producto : `Producto ${id}`;
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No tienes permisos para ver coberturas</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Coberturas</h2>
        {canCreate && (
          <Button onClick={() => { setEditingCobertura(null); setModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva cobertura
          </Button>
        )}
      </div>

      {/* Tarjetas estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total coberturas</p>
              <p className="text-2xl font-bold text-gray-800">{total}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Activas</p>
              <p className="text-2xl font-bold text-green-600">{active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inactivas</p>
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
              placeholder="Buscar por descripción o suma asegurada..."
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
                value={filterProducto}
                onChange={(e) => {
                  setFilterProducto(e.target.value === 'all' ? 'all' : parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Todos los productos</option>
                {productos.map(prod => (
                  <option key={prod.id} value={prod.id}>
                    {prod.nombre_producto}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suma asegurada</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carencia</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedCoberturas.map((cobertura) => (
                    <tr key={cobertura.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{cobertura.descripcion}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{getProductoNombre(cobertura.id_producto)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{cobertura.suma_asegurada}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{cobertura.carencia}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          cobertura.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {cobertura.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {canEdit && (
                            <>
                              <button
                                onClick={() => toggleActive(cobertura)}
                                className="text-gray-600 hover:text-gray-900"
                                title={cobertura.activo ? 'Desactivar' : 'Activar'}
                              >
                                {cobertura.activo ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                              </button>
                              <button
                                onClick={() => { setEditingCobertura(cobertura); setModalOpen(true); }}
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
                  {paginatedCoberturas.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No se encontraron coberturas
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
                Mostrando {((currentPage-1)*itemsPerPage)+1} - {Math.min(currentPage*itemsPerPage, filteredCoberturas.length)} de {filteredCoberturas.length}
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCobertura ? 'Editar cobertura' : 'Nueva cobertura'}>
        <CoberturaForm
          cobertura={editingCobertura}
          onSubmit={async (data) => {
            if (editingCobertura) {
              await handleUpdate(editingCobertura.id, data);
            } else {
              await handleCreate(data);
            }
            setModalOpen(false);
            setEditingCobertura(null);
          }}
          onCancel={() => {
            setModalOpen(false);
            setEditingCobertura(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default CoberturasPage;