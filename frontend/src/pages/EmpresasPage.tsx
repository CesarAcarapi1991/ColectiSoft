import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getEmpresas, createEmpresa, updateEmpresa } from '../services/empresaService';
import type { Empresa, EmpresaRequest } from '../types/empresa';
import Modal from '../components/common/Modal';
import EmpresaForm from '../components/empresa/EmpresaForm';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { Plus, Edit, CheckCircle, XCircle, Search, Building2 } from 'lucide-react';

const EmpresasPage: React.FC = () => {
  const { user } = useAuth();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);

  // Permisos
  const canView = user?.permisos?.includes('ver_empresas') || user?.roles?.includes('ADMIN');
  const canCreate = user?.permisos?.includes('crear_empresa') || user?.roles?.includes('ADMIN');
  const canEdit = user?.permisos?.includes('editar_empresa') || user?.roles?.includes('ADMIN');

  useEffect(() => {
    if (canView) {
      fetchEmpresas();
    }
  }, [canView]);

  const fetchEmpresas = async () => {
    setLoading(true);
    try {
      const data = await getEmpresas();
      setEmpresas(data);
    } catch (error) {
      toast.error('Error al cargar empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: EmpresaRequest) => {
    try {
      await createEmpresa(data);
      toast.success('Empresa creada exitosamente');
      fetchEmpresas();
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Error al crear empresa';
      toast.error(errorMsg);
      throw error;
    }
  };

  const handleUpdate = async (id: number, data: EmpresaRequest) => {
    try {
      await updateEmpresa(id, data);
      toast.success('Empresa actualizada exitosamente');
      fetchEmpresas();
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Error al actualizar empresa';
      toast.error(errorMsg);
      throw error;
    }
  };

  const toggleActive = async (empresa: Empresa) => {
    if (!canEdit) {
      toast.error('No tienes permisos para editar empresas');
      return;
    }
    const newActive = !empresa.activo;
    try {
      await updateEmpresa(empresa.id, {
        codigo_empresa: empresa.codigo_empresa,
        nombre_empresa: empresa.nombre_empresa,
        activo: newActive,
      });
      toast.success(`Empresa ${newActive ? 'activada' : 'desactivada'} exitosamente`);
      fetchEmpresas();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al cambiar estado');
    }
  };

  // Filtrado local
  const filteredEmpresas = empresas.filter(emp =>
    emp.nombre_empresa?.toLowerCase().includes(filterText.toLowerCase()) ||
    emp.codigo_empresa?.toLowerCase().includes(filterText.toLowerCase())
  );

  // Paginación local
  const totalPages = Math.ceil(filteredEmpresas.length / itemsPerPage);
  const paginatedEmpresas = filteredEmpresas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Estadísticas
  const total = empresas.length;
  const active = empresas.filter(e => e.activo).length;
  const inactive = total - active;

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No tienes permisos para ver empresas</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Empresas Aseguradoras</h2>
        {canCreate && (
          <Button onClick={() => { setEditingEmpresa(null); setModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva empresa
          </Button>
        )}
      </div>

      {/* Tarjetas estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total empresas</p>
              <p className="text-2xl font-bold text-gray-800">{total}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-500 opacity-50" />
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

      {/* Filtro */}
      <div className="bg-white rounded-xl shadow-card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por código o nombre..."
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha creación</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado por</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedEmpresas.map((empresa) => (
                    <tr key={empresa.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{empresa.codigo_empresa || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{empresa.nombre_empresa || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          empresa.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {empresa.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(empresa.fecha_creacion).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{empresa.usuario_creacion}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {canEdit && (
                            <>
                              <button
                                onClick={() => toggleActive(empresa)}
                                className="text-gray-600 hover:text-gray-900"
                                title={empresa.activo ? 'Desactivar' : 'Activar'}
                              >
                                {empresa.activo ? <XCircle className="w-5 h-5 text-red-500 opacity-50" /> : <CheckCircle className="w-5 h-5 text-green-300" />}
                              </button>
                              <button
                                onClick={() => { setEditingEmpresa(empresa); setModalOpen(true); }}
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
                  {paginatedEmpresas.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No se encontraron empresas
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
                Mostrando {((currentPage-1)*itemsPerPage)+1} - {Math.min(currentPage*itemsPerPage, filteredEmpresas.length)} de {filteredEmpresas.length}
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingEmpresa ? 'Editar empresa' : 'Nueva empresa'}>
        <EmpresaForm
          empresa={editingEmpresa}
          onSubmit={async (data) => {
            if (editingEmpresa) {
              await handleUpdate(editingEmpresa.id, data);
            } else {
              await handleCreate(data);
            }
            setModalOpen(false);
            setEditingEmpresa(null);
          }}
          onCancel={() => {
            setModalOpen(false);
            setEditingEmpresa(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default EmpresasPage;