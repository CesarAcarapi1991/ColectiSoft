// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../hooks/useAuth';
// import { getSolicitudes, vigentarSolicitud } from '../services/solicitudService';
// import { getProductos } from '../services/productoService';
// import { getAsegurados } from '../services/aseguradoService';
// import type { Solicitud } from '../types/solicitud';
// import type { Producto } from '../types/producto';
// import type { Asegurado } from '../types/asegurado';
// import Modal from '../components/common/Modal';
// import SolicitudWizard from '../components/solicitud/SolicitudWizard';
// import Button from '../components/common/Button';
// import toast from 'react-hot-toast';
// import { Plus, Edit, CheckCircle, XCircle, Search, FileText, Eye } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const SolicitudesPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
//   const [productos, setProductos] = useState<Producto[]>([]);
//   const [asegurados, setAsegurados] = useState<Asegurado[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filterText, setFilterText] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [showWizard, setShowWizard] = useState(false);
//   const [pdfModal, setPdfModal] = useState<{ open: boolean; pdfData: string | null }>({ open: false, pdfData: null });

//   const canView = user?.permisos?.includes('ver_solicitudes') || user?.roles?.includes('ADMIN');
//   const canCreate = user?.permisos?.includes('crear_solicitud') || user?.roles?.includes('ADMIN');
//   const canEdit = user?.permisos?.includes('editar_solicitud') || user?.roles?.includes('ADMIN');

//   useEffect(() => {
//     if (canView) {
//       fetchData();
//     }
//   }, [canView]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [sols, prods, ases] = await Promise.all([
//         getSolicitudes(),
//         getProductos(),
//         getAsegurados()
//       ]);
//       setSolicitudes(sols);
//       setProductos(prods);
//       setAsegurados(ases);
//     } catch (error) {
//       toast.error('Error al cargar datos');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVigentar = async (solicitud: Solicitud) => {
//     try {
//       const response = await vigentarSolicitud(solicitud.id, {
//         id_producto: solicitud.id_producto,
//         id_asegurado: solicitud.id_asegurado
//       });
//       // Mostrar PDF en modal
//       setPdfModal({ open: true, pdfData: response.file });
//       toast.success('Seguro vigentado correctamente');
//       fetchData();
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || 'Error al vigentar seguro');
//     }
//   };

//   const getProductoNombre = (id: number) => {
//     const prod = productos.find(p => p.id === id);
//     return prod?.nombre_producto || `Producto ${id}`;
//   };

//   const getAseguradoNombre = (id: number) => {
//     const ase = asegurados.find(a => a.id === id);
//     return ase ? `${ase.nombres} ${ase.primer_apellido}` : `Asegurado ${id}`;
//   };

//   // Filtrado local
//   const filtered = solicitudes.filter(s =>
//     s.nro_solicitud.includes(filterText) ||
//     getProductoNombre(s.id_producto).toLowerCase().includes(filterText.toLowerCase()) ||
//     getAseguradoNombre(s.id_asegurado).toLowerCase().includes(filterText.toLowerCase())
//   );

//   const totalPages = Math.ceil(filtered.length / itemsPerPage);
//   const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   if (!canView) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <p className="text-gray-500">No tienes permisos para ver solicitudes</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Solicitudes de Seguro</h2>
//         {canCreate && (
//         //   <Button onClick={() => setShowWizard(true)}>
//         //     <Plus className="w-4 h-4 mr-2" />
//         //     Nueva solicitud
//         //   </Button>
//         <Button onClick={() => navigate('/solicitudes/nueva')}>
//             <Plus className="w-4 h-4 mr-2" />
//             Nueva solicitud
//         </Button>
//         )}
//       </div>

//       {/* Filtro */}
//       <div className="bg-white rounded-xl shadow-card p-4 mb-6">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Buscar por N° solicitud, producto o asegurado..."
//             value={filterText}
//             onChange={(e) => {
//               setFilterText(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//           />
//         </div>
//       </div>

//       {/* Tabla */}
//       {loading ? (
//         <div className="flex justify-center py-12">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
//         </div>
//       ) : (
//         <>
//           <div className="bg-white rounded-xl shadow-card overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Solicitud</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asegurado</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prima</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha creación</th>
//                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {paginated.map(sol => (
//                     <tr key={sol.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sol.nro_solicitud}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getProductoNombre(sol.id_producto)}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getAseguradoNombre(sol.id_asegurado)}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${sol.prima}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           sol.id_estado === 1 ? 'bg-yellow-100 text-yellow-800' :
//                           sol.id_estado === 2 ? 'bg-green-100 text-green-800' :
//                           'bg-red-100 text-red-800'
//                         }`}>
//                           {sol.id_estado === 1 ? 'Pendiente' : sol.id_estado === 2 ? 'Vigente' : 'Rechazada'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {new Date(sol.fecha_creacion).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <div className="flex justify-end space-x-2">
//                           {canEdit && sol.id_estado === 1 && (
//                             <>
//                               <button
//                                 onClick={() => handleVigentar(sol)}
//                                 className="text-green-600 hover:text-green-900"
//                                 title="Vigentar"
//                               >
//                                 <CheckCircle className="w-5 h-5" />
//                               </button>
//                               <button
//                                 className="text-red-600 hover:text-red-900"
//                                 title="Rechazar"
//                               >
//                                 <XCircle className="w-5 h-5" />
//                               </button>
//                               <button
//                                 className="text-blue-600 hover:text-blue-900"
//                                 title="Editar"
//                               >
//                                 <Edit className="w-5 h-5" />
//                               </button>
//                             </>
//                           )}
//                           {sol.certificado_file && (
//                             <button
//                               onClick={() => setPdfModal({ open: true, pdfData: sol.certificado_file })}
//                               className="text-gray-600 hover:text-gray-900"
//                               title="Ver certificado"
//                             >
//                               <FileText className="w-5 h-5" />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                   {paginated.length === 0 && (
//                     <tr>
//                       <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
//                         No se encontraron solicitudes
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {totalPages > 1 && (
//             <div className="flex justify-between items-center mt-4">
//               <div className="text-sm text-gray-500">
//                 Mostrando {(currentPage-1)*itemsPerPage+1} - {Math.min(currentPage*itemsPerPage, filtered.length)} de {filtered.length}
//               </div>
//               <div className="flex space-x-1">
//                 <button
//                   onClick={() => setCurrentPage(p => Math.max(1, p-1))}
//                   disabled={currentPage === 1}
//                   className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50"
//                 >
//                   Anterior
//                 </button>
//                 <button
//                   onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50"
//                 >
//                   Siguiente
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       {/* Modal del wizard */}
//       <Modal isOpen={showWizard} onClose={() => setShowWizard(false)} title="Crear solicitud de seguro">
//         <SolicitudWizard onClose={() => setShowWizard(false)} onSuccess={fetchData} />
//       </Modal>

//       {/* Modal para visualizar PDF */}
//       <Modal isOpen={pdfModal.open} onClose={() => setPdfModal({ open: false, pdfData: null })} title="Certificado de seguro">
//         {pdfModal.pdfData && (
//           <iframe
//             src={`data:application/pdf;base64,${pdfModal.pdfData}`}
//             className="w-full h-96"
//             title="Certificado"
//           />
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default SolicitudesPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getSolicitudes, vigentarSolicitud, getSolicitudDetalle, updateSolicitudEstado, enviarCajaEstado } from '../services/solicitudService';
import { getProductos } from '../services/productoService';
import { getAsegurados } from '../services/aseguradoService';
import type { Solicitud, SolicitudDetalle } from '../types/solicitud';
import type { Producto } from '../types/producto';
import type { Asegurado } from '../types/asegurado';
import Modal from '../components/common/Modal';
import SolicitudWizard from '../components/solicitud/SolicitudWizard';
import SolicitudDetalleModal from '../components/solicitud/SolicitudDetalleModal';
import { CambiarEstadoModal, EnviarCajaModal, VigentarModal } from '../components/solicitud/CambiarEstadoModal';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { Plus, Edit, CheckCircle, XCircle, Search, FileText, Eye, Send } from 'lucide-react';

const SolicitudesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [asegurados, setAsegurados] = useState<Asegurado[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showWizard, setShowWizard] = useState(false);
  const [pdfModal, setPdfModal] = useState<{ open: boolean; pdfData: string | null }>({ open: false, pdfData: null });
  const [detalleModal, setDetalleModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [detalle, setDetalle] = useState<SolicitudDetalle | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [estadoModal, setEstadoModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [enviarCajaModal, setEnviarCajaModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [vigentarModal, setVigentarModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  const canView = user?.permisos?.includes('ver_solicitudes') || user?.roles?.includes('ADMIN');
  const canCreate = user?.permisos?.includes('crear_solicitud') || user?.roles?.includes('ADMIN');
  const canEdit = user?.permisos?.includes('editar_solicitud') || user?.roles?.includes('ADMIN');

  useEffect(() => {
    if (canView) {
      fetchData();
    }
  }, [canView]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sols, prods, ases] = await Promise.all([
        getSolicitudes(),
        getProductos(),
        getAsegurados()
      ]);
      setSolicitudes(sols);
      setProductos(prods);
      setAsegurados(ases);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = async (id: number) => {
    setDetalleModal({ open: true, id });
    setCargandoDetalle(true);
    try {
      const data = await getSolicitudDetalle(id);
      setDetalle(data);
    } catch (error) {
      toast.error('Error al cargar detalle');
    } finally {
      setCargandoDetalle(false);
    }
  };

  const handleCambiarEstado = async (id: number) => {
    setEstadoModal({ open: true, id });
  };

  const handleEnviarCaja = async (id: number) => {
    setEnviarCajaModal({ open: true, id });
  };

  const handleVigentar = async (id: number) => {
    // try {
    //   const response = await vigentarSolicitud(solicitud.id, {
    //     id_producto: solicitud.id_producto,
    //     id_asegurado: solicitud.id_asegurado
    //   });
    //   setPdfModal({ open: true, pdfData: response.file });
    //   toast.success('Seguro vigentado correctamente');
    //   fetchData();
    // } catch (error: any) {
    //   toast.error(error.response?.data?.error || 'Error al vigentar seguro');
    // }
    setVigentarModal({open: true, id});
  };

  const onSubmitVigentar = async (comentario: string, estado: number) => {
    console.log(comentario);
    console.log(estado);
    if (!vigentarModal.id) return;
    setCambiandoEstado(true);
    try {
      // Obtener la solicitud actual para obtener producto y asegurado
      const solicitud = solicitudes.find(s => s.id === vigentarModal.id);
      if (!solicitud) throw new Error('Solicitud no encontrada');
      console.log("asdasd" + vigentarModal.id);
      console.log("asdasd" + solicitud.id);
      const response = await vigentarSolicitud(vigentarModal.id);
      console.log(response);
      toast.success('Enviado a Caja actualizado correctamente');
      fetchData();
      setVigentarModal({ open: false, id: null });

      setPdfModal({ open: true, pdfData: response.file });
      toast.success('Seguro vigentado correctamente');
      // fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al enviar a caja');
    } finally {
      setCambiandoEstado(false);
    }
  };

  const onSubmitCambioEstado = async (comentario: string, estado: number) => {
    if (!estadoModal.id) return;
    setCambiandoEstado(true);
    try {
      // Obtener la solicitud actual para obtener producto y asegurado
      const solicitud = solicitudes.find(s => s.id === estadoModal.id);
      if (!solicitud) throw new Error('Solicitud no encontrada');
      await updateSolicitudEstado(estadoModal.id, {
        id_producto: solicitud.id_producto,
        id_asegurado: solicitud.id_asegurado,
        id_estado: estado,
        comentario
      });
      toast.success('Estado actualizado correctamente');
      fetchData();
      setEstadoModal({ open: false, id: null });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al actualizar estado');
    } finally {
      setCambiandoEstado(false);
    }
  };

  const onSubmitEnviarCaja = async (comentario: string, estado: number) => {
    if (!enviarCajaModal.id) return;
    setCambiandoEstado(true);
    try {
      // Obtener la solicitud actual para obtener producto y asegurado
      const solicitud = solicitudes.find(s => s.id === enviarCajaModal.id);
      if (!solicitud) throw new Error('Solicitud no encontrada');
      const metodo = estado === 1 ? "CAJA" : "";
      await enviarCajaEstado(enviarCajaModal.id, { metodo_pago: metodo });
      toast.success('Enviado a Caja actualizado correctamente');
      fetchData();
      setEnviarCajaModal({ open: false, id: null });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al enviar a caja');
    } finally {
      setCambiandoEstado(false);
    }
  };

  const getProductoNombre = (id: number) => {
    const prod = productos.find(p => p.id === id);
    return prod?.nombre_producto || `Producto ${id}`;
  };

  const getAseguradoNombre = (id: number) => {
    const ase = asegurados.find(a => a.id === id);
    return ase ? `${ase.nombres} ${ase.primer_apellido}` : `Asegurado ${id}`;
  };

  const filtered = solicitudes.filter(s =>
    s.nro_solicitud.includes(filterText) ||
    getProductoNombre(s.id_producto).toLowerCase().includes(filterText.toLowerCase()) ||
    getAseguradoNombre(s.id_asegurado).toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No tienes permisos para ver solicitudes</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Solicitudes de Seguro</h2>
        {canCreate && (
          <Button onClick={() => navigate('/solicitudes/nueva')}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva solicitud
          </Button>
        )}
      </div>

      {/* Filtro */}
      <div className="bg-white rounded-xl shadow-card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por N° solicitud, producto o asegurado..."
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Solicitud</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asegurado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prima</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha creación</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginated.map(sol => {
                    const estadoLabel = sol.id_estado === 1 ? 'Pendiente' : 
                                        sol.id_estado === 2 ? 'Enviado a Caja' : 
                                        sol.id_estado === 3 ? 'Solicitud Pagada' : 
                                        sol.id_estado === 4 ? 'Vigente' : 
                                        sol.id_estado === 5 ? 'Vencido' :
                                        sol.id_estado === 6 ? 'Rechazado' : 
                                        'Sin Estado';
                    const estadoColor = sol.id_estado === 1 ? 'bg-yellow-100 text-yellow-800' :
                                        sol.id_estado === 2 ? 'bg-green-100 text-green-800' :
                                        sol.id_estado === 3 ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800';
                    return (
                      <tr key={sol.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sol.nro_solicitud}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getProductoNombre(sol.id_producto)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getAseguradoNombre(sol.id_asegurado)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Bs.- {sol.prima}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estadoColor}`}>
                            {estadoLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(sol.fecha_creacion).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">

                            <button
                              onClick={() => handleVerDetalle(sol.id)}
                              className="text-gray-600 hover:text-gray-900"
                              title="Ver detalle"
                            >
                              <Eye className="w-5 h-5" />
                            </button>

                            {/* Pendiente */}
                            {sol.id_estado === 1 && (
                              <>
                                <button
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Editar"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleEnviarCaja(sol.id)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Enviar a caja"
                                >
                                  <Send className="w-5 h-5" />
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-900"
                                  title="Rechazar"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}

                            {/* Enviado a caja */}
                            {sol.id_estado === 2 && (
                              <>
                                {/* <button
                                  onClick={() => handleVigentar(sol)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Vigentar"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button> */}
                              </>
                            )}

                            {/* Solicitud pagada */}
                            {sol.id_estado === 3 && (
                              <>
                                <button
                                  onClick={() => handleVigentar(sol.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Vigentar"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}

                            {/* Vigente */}
                            {sol.id_estado === 4 && (
                              <>
                                {/* <button
                                  onClick={() => handleVigentar(sol.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Vigentar"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                  <label>ca</label>
                                </button> */}
                              <button
                                onClick={() => setPdfModal({ open: true, pdfData: sol.certificado_file })}
                                className="text-gray-600 hover:text-gray-900"
                                title="Ver certificado"
                              >
                                <FileText className="w-5 h-5" />
                              </button>
                              </>
                            )}

                            {/* Vencido */}
                            {sol.id_estado === 5 && (
                              <>
                                <button
                                  onClick={() => handleVigentar(sol.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Vigentar"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                  <label>ca</label>
                                </button>
                              </>
                            )}

                            {/* Rechazado */}
                            {sol.id_estado === 6 && (
                              <>
                                <button
                                  onClick={() => handleVigentar(sol.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Vigentar"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                  <label>ca</label>
                                </button>
                              </>
                            )}



                            {/* {canEdit && sol.id_estado === 99 && (
                              <>
                                <button
                                  onClick={() => handleVigentar(sol)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Vigentar"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleEnviarCaja(sol.id)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Enviar a caja"
                                >
                                  <Send className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleCambiarEstado(sol.id)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Enviar a caja"
                                >
                                  <Send className="w-5 h-5" />
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-900"
                                  title="Rechazar"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                                <button
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Editar"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                              </>
                            )} */}
                            {/* {sol.certificado_file && (
                              <button
                                onClick={() => setPdfModal({ open: true, pdfData: sol.certificado_file })}
                                className="text-gray-600 hover:text-gray-900"
                                title="Ver certificado"
                              >
                                <FileText className="w-5 h-5" />
                              </button>
                            )} */}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No se encontraron solicitudes
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Mostrando {(currentPage-1)*itemsPerPage+1} - {Math.min(currentPage*itemsPerPage, filtered.length)} de {filtered.length}
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

      {/* Modales */}
      <Modal isOpen={showWizard} onClose={() => setShowWizard(false)} title="Crear solicitud de seguro">
        <SolicitudWizard onClose={() => setShowWizard(false)} onSuccess={fetchData} />
      </Modal>

      <Modal isOpen={pdfModal.open} onClose={() => setPdfModal({ open: false, pdfData: null })} title="Certificado de seguro">
        {pdfModal.pdfData && (
          <iframe
            src={`data:application/pdf;base64,${pdfModal.pdfData}`}
            className="w-full h-96"
            title="Certificado"
          />
        )}
      </Modal>

      <SolicitudDetalleModal
        isOpen={detalleModal.open}
        onClose={() => {
          setDetalleModal({ open: false, id: null });
          setDetalle(null);
        }}
        detalle={detalle}
        loading={cargandoDetalle}
      />

      <CambiarEstadoModal
        isOpen={estadoModal.open}
        onClose={() => setEstadoModal({ open: false, id: null })}
        onSubmit={onSubmitCambioEstado}
        loading={cambiandoEstado}
        solicitudId={estadoModal.id || 0}
      />

      <VigentarModal
        isOpen={vigentarModal.open}
        onClose={() => setVigentarModal({ open: false, id: null })}
        onSubmit={onSubmitVigentar}
        loading={cambiandoEstado}
        solicitudId={vigentarModal.id || 0}
      />

      <EnviarCajaModal
        isOpen={enviarCajaModal.open}
        onClose={() => setEnviarCajaModal({ open: false, id: null })}
        onSubmit={onSubmitEnviarCaja}
        loading={cambiandoEstado}
        solicitudId={enviarCajaModal.id || 0}
      />
    </div>
  );
};

export default SolicitudesPage;