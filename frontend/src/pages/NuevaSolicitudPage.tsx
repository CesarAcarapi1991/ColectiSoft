import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getProductos } from '../services/productoService';
import { getCoberturas } from '../services/coberturaService';
import { getEmpresas } from '../services/empresaService';
import { buscarAsegurado, createAsegurado } from '../services/aseguradoService';
import { createBeneficiario } from '../services/beneficiarioService';
import { createSolicitud } from '../services/solicitudService';
import type { Producto } from '../types/producto';
import type { Cobertura } from '../types/cobertura';
import type { Empresa } from '../types/empresa';
import type { AseguradoRequest } from '../types/asegurado';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

type Step = 'productos' | 'cliente' | 'beneficiarios';

// Opciones para selects
const TIPO_DOCUMENTO_OPTS = [
  { value: 'CARNET DE IDENTIDAD', label: 'Carnet de Identidad' },
  { value: 'PERSONA EXTRANJERA', label: 'Persona Extranjera' },
];

const ESTADO_CIVIL_OPTS = [
  { value: 'SOLTERO(A)', label: 'Soltero(a)' },
  { value: 'CASADO(A)', label: 'Casado(a)' },
  { value: 'DIVORCIADO(A)', label: 'Divorciado(a)' },
  { value: 'VIUDO(A)', label: 'Viudo(a)' },
];

const GENERO_OPTS = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMENINO', label: 'Femenino' },
];

const PARENTESCO_OPTS = [
  { value: 'HIJO(A)', label: 'Hijo(a)' },
  { value: 'CONYUGUE', label: 'Cónyuge' },
  { value: 'PADRE', label: 'Padre' },
  { value: 'MADRE', label: 'Madre' },
  { value: 'HERMANO(A)', label: 'Hermano(a)' },
  { value: 'OTRO', label: 'Otro' },
];

const NuevaSolicitudPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Datos de productos
  const [productos, setProductos] = useState<Producto[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [coberturasMap, setCoberturasMap] = useState<Map<number, Cobertura[]>>(new Map());
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filterEmpresa, setFilterEmpresa] = useState<number | 'all'>('all');
  const [filterText, setFilterText] = useState('');
  const [filterPrimaMin, setFilterPrimaMin] = useState('');
  const [filterPrimaMax, setFilterPrimaMax] = useState('');

  // Producto seleccionado
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

  // Datos del asegurado
  const [searchTipo, setSearchTipo] = useState(TIPO_DOCUMENTO_OPTS[0].value);
  const [searchNro, setSearchNro] = useState('');
  const [searchComplemento, setSearchComplemento] = useState('');
  const [buscarActivo, setBuscarActivo] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [aseguradoEncontrado, setAseguradoEncontrado] = useState<any>(null);
  const [asegurado, setAsegurado] = useState<AseguradoRequest>({
    tipo_documento: TIPO_DOCUMENTO_OPTS[0].value,
    nro_documento: '',
    complemento: '',
    nombres: '',
    primer_apellido: '',
    segundo_apellido: '',
    estado_civil: ESTADO_CIVIL_OPTS[0].value,
    genero: GENERO_OPTS[0].value,
    fecha_nacimiento: '',
    ocupacion: '',
    direccion: '',
    correo: '',
    nro_celular: ''
  });

  // Beneficiarios
  const [beneficiarios, setBeneficiarios] = useState<Array<{
    nombre_beneficiario: string;
    ci_beneficiario: string;
    parentesco: string;
    porcentaje: number;
  }>>([]);

  // Estado del paso
  const [step, setStep] = useState<Step>('productos');
  const [submitting, setSubmitting] = useState(false);
  const [busquedaLoading, setBusquedaLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prod, emp, cov] = await Promise.all([
          getProductos(),
          getEmpresas(),
          getCoberturas()
        ]);
        setProductos(prod.filter(p => p.activo));
        setEmpresas(emp.filter(e => e.activo));
        const map = new Map<number, Cobertura[]>();
        cov.forEach(c => {
          if (c.activo) {
            const list = map.get(c.id_producto) || [];
            list.push(c);
            map.set(c.id_producto, list);
          }
        });
        setCoberturasMap(map);
      } catch (error) {
        toast.error('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Búsqueda de asegurado con endpoint optimizado
// const handleBuscar = async () => {
//   if (!searchNro.trim()) {
//     toast.error('Ingrese un número de documento');
//     return;
//   }
//   setBusquedaLoading(true);
//   try {
//     const result = await buscarAsegurado(searchTipo, searchNro, searchComplemento);
//     if (result && result.id) {
//       setAseguradoEncontrado(result);
//       setAsegurado({
//         tipo_documento: result.tipo_documento,
//         nro_documento: result.nro_documento,
//         complemento: result.complemento || '',
//         nombres: result.nombres,
//         primer_apellido: result.primer_apellido,
//         segundo_apellido: result.segundo_apellido,
//         estado_civil: result.estado_civil || ESTADO_CIVIL_OPTS[0].value,
//         genero: result.genero || GENERO_OPTS[0].value,
//         fecha_nacimiento: result.fecha_nacimiento.split('T')[0],
//         ocupacion: result.ocupacion || '',
//         direccion: result.direccion || '',
//         correo: result.correo || '',
//         nro_celular: result.nro_celular || ''
//       });
//       toast.success('Asegurado encontrado');
//     } else {
//       setAseguradoEncontrado(null);
//       setAsegurado({
//         tipo_documento: searchTipo,
//         nro_documento: searchNro,
//         complemento: searchComplemento,
//         nombres: '',
//         primer_apellido: '',
//         segundo_apellido: '',
//         estado_civil: ESTADO_CIVIL_OPTS[0].value,
//         genero: GENERO_OPTS[0].value,
//         fecha_nacimiento: '',
//         ocupacion: '',
//         direccion: '',
//         correo: '',
//         nro_celular: ''
//       });
//       toast.error('No se encontró asegurado. Complete los datos para registrar uno nuevo.');
//     }
//   } catch (error) {
//     console.error('Error en búsqueda:', error);
//     toast.error('Error en la búsqueda');
//   } finally {
//     setBusquedaLoading(false);
//   }
// };
// Función handleBuscar modificada
const handleBuscar = async () => {
  if (!searchNro.trim()) {
    toast.error('Ingrese un número de documento');
    return;
  }
  setBusquedaLoading(true);
  try {
    const result = await buscarAsegurado(searchTipo, searchNro, searchComplemento);
    if (result && result.id) {
      setAseguradoEncontrado(result);
      setAsegurado({
        tipo_documento: result.tipo_documento,
        nro_documento: result.nro_documento,
        complemento: result.complemento || '',
        nombres: result.nombres,
        primer_apellido: result.primer_apellido,
        segundo_apellido: result.segundo_apellido,
        estado_civil: result.estado_civil || ESTADO_CIVIL_OPTS[0].value,
        genero: result.genero || GENERO_OPTS[0].value,
        fecha_nacimiento: result.fecha_nacimiento.split('T')[0],
        ocupacion: result.ocupacion || '',
        direccion: result.direccion || '',
        correo: result.correo || '',
        nro_celular: result.nro_celular || ''
      });
      toast.success('Asegurado encontrado');
    } else {
      setAseguradoEncontrado(null);
      setAsegurado({
        tipo_documento: searchTipo,
        nro_documento: searchNro,
        complemento: searchComplemento,
        nombres: '',
        primer_apellido: '',
        segundo_apellido: '',
        estado_civil: ESTADO_CIVIL_OPTS[0].value,
        genero: GENERO_OPTS[0].value,
        fecha_nacimiento: '',
        ocupacion: '',
        direccion: '',
        correo: '',
        nro_celular: ''
      });
      toast.error('No se encontró asegurado. Complete los datos para registrar uno nuevo.');
    }
    setBusquedaRealizada(true); // Mostrar formulario después de la búsqueda
  } catch (error) {
    console.error('Error en búsqueda:', error);
    toast.error('Error en la búsqueda');
  } finally {
    setBusquedaLoading(false);
  }
};

  // Guardar asegurado (crea nuevo)
  const handleGuardarAsegurado = async () => {
    if (!asegurado.nombres || !asegurado.primer_apellido || !asegurado.nro_documento || !asegurado.fecha_nacimiento) {
      toast.error('Complete los campos obligatorios (nombres, apellido, documento, fecha nacimiento)');
      return;
    }
    setLoading(true);
    try {
      const nuevoAsegurado = await createAsegurado(asegurado);
      const idAsegurado = nuevoAsegurado.id;
      sessionStorage.setItem('idAsegurado', idAsegurado.toString());
      sessionStorage.setItem('idProducto', selectedProducto!.id.toString());

      // Inicializar beneficiarios según cantidad requerida (mínimo 1)
      const cantidad = selectedProducto?.nro_beneficiarios || 1;
      const porcentajeUnitario = 100 / cantidad;
      setBeneficiarios(Array(cantidad).fill(null).map(() => ({
        nombre_beneficiario: '',
        ci_beneficiario: '',
        parentesco: PARENTESCO_OPTS[0].value,
        porcentaje: Math.round(porcentajeUnitario * 100) / 100
      })));
      setStep('beneficiarios');
    } catch (error) {
      toast.error('Error al guardar asegurado');
    } finally {
      setLoading(false);
    }
  };

  // Resetear búsqueda (limpia y permite ingresar manualmente)
//   const handleResetBusqueda = () => {
//     setAseguradoEncontrado(null);
//     setSearchNro('');
//     setSearchComplemento('');
//     setAsegurado({
//       tipo_documento: searchTipo,
//       nro_documento: '',
//       complemento: '',
//       nombres: '',
//       primer_apellido: '',
//       segundo_apellido: '',
//       estado_civil: ESTADO_CIVIL_OPTS[0].value,
//       genero: GENERO_OPTS[0].value,
//       fecha_nacimiento: '',
//       ocupacion: '',
//       direccion: '',
//       correo: '',
//       nro_celular: ''
//     });
//   };
const handleResetBusqueda = () => {
  setAseguradoEncontrado(null);
  setSearchNro('');
  setSearchComplemento('');
  setBusquedaRealizada(false);
  setAsegurado({
    tipo_documento: searchTipo,
    nro_documento: '',
    complemento: '',
    nombres: '',
    primer_apellido: '',
    segundo_apellido: '',
    estado_civil: ESTADO_CIVIL_OPTS[0].value,
    genero: GENERO_OPTS[0].value,
    fecha_nacimiento: '',
    ocupacion: '',
    direccion: '',
    correo: '',
    nro_celular: ''
  });
};

  // Beneficiarios: agregar/quitar
  const addBeneficiario = () => {
    if (beneficiarios.length >= (selectedProducto?.nro_beneficiarios || 1)) {
      toast.error(`Máximo ${selectedProducto?.nro_beneficiarios} beneficiarios`);
      return;
    }
    setBeneficiarios([...beneficiarios, {
      nombre_beneficiario: '',
      ci_beneficiario: '',
      parentesco: PARENTESCO_OPTS[0].value,
      porcentaje: 0
    }]);
  };

  const removeBeneficiario = (index: number) => {
    if (beneficiarios.length <= 1) {
      toast.error('Debe haber al menos un beneficiario');
      return;
    }
    const newBenef = beneficiarios.filter((_, i) => i !== index);
    const total = newBenef.length;
    const newPorcentaje = 100 / total;
    newBenef.forEach(b => b.porcentaje = Math.round(newPorcentaje * 100) / 100);
    setBeneficiarios(newBenef);
  };

  const updateBeneficiario = (index: number, field: string, value: any) => {
    const newBenef = [...beneficiarios];
    newBenef[index] = { ...newBenef[index], [field]: value };
    setBeneficiarios(newBenef);
  };

  // Crear solicitud final
  const handleCrearSolicitud = async () => {
    // Validar beneficiarios
    for (let i = 0; i < beneficiarios.length; i++) {
      const b = beneficiarios[i];
      if (!b.nombre_beneficiario || !b.ci_beneficiario || !b.parentesco) {
        toast.error(`Complete todos los datos del beneficiario ${i+1}`);
        return;
      }
      if (b.porcentaje <= 0) {
        toast.error(`El porcentaje del beneficiario ${i+1} debe ser mayor a 0`);
        return;
      }
    }
    const totalPorcentaje = beneficiarios.reduce((sum, b) => sum + b.porcentaje, 0);
    if (Math.abs(totalPorcentaje - 100) > 0.01) {
      toast.error('La suma de porcentajes debe ser 100%');
      return;
    }

    const idAsegurado = sessionStorage.getItem('idAsegurado');
    const idProducto = sessionStorage.getItem('idProducto');
    if (!idAsegurado || !idProducto) {
      toast.error('Error: datos de sesión perdidos');
      return;
    }

    setSubmitting(true);
    try {
      // Crear beneficiarios
      for (let i = 0; i < beneficiarios.length; i++) {
        const b = beneficiarios[i];
        await createBeneficiario({
          id_asegurado: parseInt(idAsegurado),
          item: i + 1,
          nombre_beneficiario: b.nombre_beneficiario,
          ci_beneficiario: b.ci_beneficiario,
          parentesco: b.parentesco,
          porcentaje: b.porcentaje
        });
      }
      // Crear solicitud
      await createSolicitud({
        id_producto: parseInt(idProducto),
        id_asegurado: parseInt(idAsegurado)
      });
      toast.success('Solicitud creada exitosamente');
      sessionStorage.removeItem('idAsegurado');
      sessionStorage.removeItem('idProducto');
      navigate('/solicitudes');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al crear solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper para obtener nombre de empresa
  const getEmpresaNombre = (id: number) => {
    const e = empresas.find(e => e.id === id);
    return e ? (e.codigo_empresa ? `${e.codigo_empresa} - ${e.nombre_empresa}` : e.nombre_empresa || `Empresa ${id}`) : `Empresa ${id}`;
  };

  const handleSelectProducto = (producto: Producto) => {
    setSelectedProducto(producto);
    setStep('cliente');
  };

  const filteredProductos = productos.filter(p => {
    const matchEmpresa = filterEmpresa === 'all' || p.id_empresa === filterEmpresa;
    const matchText = p.nombre_producto.toLowerCase().includes(filterText.toLowerCase());
    const matchPrimaMin = filterPrimaMin === '' || parseFloat(p.prima) >= parseFloat(filterPrimaMin);
    const matchPrimaMax = filterPrimaMax === '' || parseFloat(p.prima) <= parseFloat(filterPrimaMax);
    return matchEmpresa && matchText && matchPrimaMin && matchPrimaMax;
  });

  const renderProductosStep = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Seleccionar producto</h2>
      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
            <select
              value={filterEmpresa}
              onChange={(e) => setFilterEmpresa(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500"
            >
              <option value="all">Todas</option>
              {empresas.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.codigo_empresa ? `${emp.codigo_empresa} - ${emp.nombre_empresa}` : emp.nombre_empresa || `Empresa ${emp.id}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre producto</label>
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Buscar..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prima mínima</label>
            <input
              type="number"
              value={filterPrimaMin}
              onChange={(e) => setFilterPrimaMin(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prima máxima</label>
            <input
              type="number"
              value={filterPrimaMax}
              onChange={(e) => setFilterPrimaMax(e.target.value)}
              placeholder="999999"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProductos.map(prod => {
            const coberturas = coberturasMap.get(prod.id) || [];
            return (
              <div key={prod.id} className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{prod.nombre_producto}</h3>
                    <span className="text-sm font-medium text-primary-600">Bs.- {prod.prima}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{getEmpresaNombre(prod.id_empresa)}</p>
                  <p className="text-sm text-gray-600 mb-4">{prod.descripcion}</p>
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 font-medium">Coberturas:</p>
                    <ul className="list-disc list-inside text-xs text-gray-600">
                      {coberturas.slice(0, 2).map(c => (
                        <li key={c.id}>{c.descripcion}</li>
                      ))}
                      {coberturas.length > 2 && <li>+{coberturas.length-2} más</li>}
                    </ul>
                  </div>
                  <Button onClick={() => handleSelectProducto(prod)} className="w-full">
                    Seleccionar
                  </Button>
                </div>
              </div>
            );
          })}
          {filteredProductos.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No se encontraron productos
            </div>
          )}
        </div>
      )}
    </div>
  );

//   const renderClienteStep = () => (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Datos del asegurado</h2>
//         <Button variant="outline" onClick={() => setStep('productos')}>Volver</Button>
//       </div>

//       <div className="bg-white rounded-xl shadow-card p-6 mb-6">
//         {/* Búsqueda */}
//         <div className="mb-6 border-b pb-4">
//           <div className="flex flex-wrap gap-4 items-end">
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Tipo documento</label>
//               <select
//                 value={searchTipo}
//                 onChange={(e) => setSearchTipo(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-md"
//               >
//                 {TIPO_DOCUMENTO_OPTS.map(opt => (
//                   <option key={opt.value} value={opt.value}>{opt.label}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">N° documento</label>
//               <input
//                 type="text"
//                 value={searchNro}
//                 onChange={(e) => setSearchNro(e.target.value)}
//                 placeholder="Ej: 1234567"
//                 className="w-full px-3 py-2 border rounded-md"
//               />
//             </div>
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Complemento (opcional)</label>
//               <input
//                 type="text"
//                 value={searchComplemento}
//                 onChange={(e) => setSearchComplemento(e.target.value)}
//                 placeholder="Ej: 10"
//                 className="w-full px-3 py-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <Button onClick={handleBuscar} disabled={busquedaLoading}>
//                 {busquedaLoading ? 'Buscando...' : 'Buscar'}
//               </Button>
//             </div>
//             <div>
//               <Button variant="outline" onClick={handleResetBusqueda}>Limpiar búsqueda</Button>
//             </div>
//           </div>
//           {aseguradoEncontrado && (
//             <p className="text-green-600 text-sm mt-2">✓ Asegurado encontrado. Puede modificar los datos si es necesario.</p>
//           )}
//         </div>

//         {/* Formulario asegurado */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Tipo documento *</label>
//             <select
//               value={asegurado.tipo_documento}
//               onChange={(e) => setAsegurado({...asegurado, tipo_documento: e.target.value})}
//               className="w-full px-3 py-2 border rounded-md"
//             >
//               {TIPO_DOCUMENTO_OPTS.map(opt => (
//                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//               ))}
//             </select>
//           </div>
//           <Input
//             label="N° Documento *"
//             value={asegurado.nro_documento}
//             onChange={(e) => setAsegurado({...asegurado, nro_documento: e.target.value})}
//           />
//           <Input
//             label="Complemento"
//             value={asegurado.complemento}
//             onChange={(e) => setAsegurado({...asegurado, complemento: e.target.value})}
//           />
//           <Input
//             label="Nombres *"
//             value={asegurado.nombres}
//             onChange={(e) => setAsegurado({...asegurado, nombres: e.target.value})}
//           />
//           <Input
//             label="Primer apellido *"
//             value={asegurado.primer_apellido}
//             onChange={(e) => setAsegurado({...asegurado, primer_apellido: e.target.value})}
//           />
//           <Input
//             label="Segundo apellido"
//             value={asegurado.segundo_apellido}
//             onChange={(e) => setAsegurado({...asegurado, segundo_apellido: e.target.value})}
//           />
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Estado civil</label>
//             <select
//               value={asegurado.estado_civil}
//               onChange={(e) => setAsegurado({...asegurado, estado_civil: e.target.value})}
//               className="w-full px-3 py-2 border rounded-md"
//             >
//               {ESTADO_CIVIL_OPTS.map(opt => (
//                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
//             <select
//               value={asegurado.genero}
//               onChange={(e) => setAsegurado({...asegurado, genero: e.target.value})}
//               className="w-full px-3 py-2 border rounded-md"
//             >
//               {GENERO_OPTS.map(opt => (
//                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//               ))}
//             </select>
//           </div>
//           <Input
//             label="Fecha nacimiento *"
//             type="date"
//             value={asegurado.fecha_nacimiento}
//             onChange={(e) => setAsegurado({...asegurado, fecha_nacimiento: e.target.value})}
//           />
//           <Input
//             label="Ocupación"
//             value={asegurado.ocupacion}
//             onChange={(e) => setAsegurado({...asegurado, ocupacion: e.target.value})}
//           />
//           <Input
//             label="Dirección"
//             value={asegurado.direccion}
//             onChange={(e) => setAsegurado({...asegurado, direccion: e.target.value})}
//           />
//           <Input
//             label="Correo"
//             type="email"
//             value={asegurado.correo}
//             onChange={(e) => setAsegurado({...asegurado, correo: e.target.value})}
//           />
//           <Input
//             label="Celular"
//             value={asegurado.nro_celular}
//             onChange={(e) => setAsegurado({...asegurado, nro_celular: e.target.value})}
//           />
//         </div>

//         <div className="mt-6 flex justify-end">
//           <Button onClick={handleGuardarAsegurado}>Continuar</Button>
//         </div>
//       </div>
//     </div>
//   );

const renderClienteStep = () => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Datos del asegurado</h2>
      <Button variant="outline" onClick={() => setStep('productos')}>Volver</Button>
    </div>

    <div className="bg-white rounded-xl shadow-card p-6 mb-6">
      {/* Sección de búsqueda siempre visible */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo documento</label>
            <select
              value={searchTipo}
              onChange={(e) => setSearchTipo(e.target.value)}
              disabled={busquedaRealizada}
              className={`w-full px-3 py-2 border rounded-md ${busquedaRealizada ? 'bg-gray-100' : ''}`}
            >
              {TIPO_DOCUMENTO_OPTS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">N° documento</label>
            <input
              type="text"
              value={searchNro}
              onChange={(e) => setSearchNro(e.target.value)}
              disabled={busquedaRealizada}
              placeholder="Ej: 1234567"
              className={`w-full px-3 py-2 border rounded-md ${busquedaRealizada ? 'bg-gray-100' : ''}`}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Complemento (opcional)</label>
            <input
              type="text"
              value={searchComplemento}
              onChange={(e) => setSearchComplemento(e.target.value)}
              disabled={busquedaRealizada}
              placeholder="Ej: 10"
              className={`w-full px-3 py-2 border rounded-md ${busquedaRealizada ? 'bg-gray-100' : ''}`}
            />
          </div>
          <div>
            <Button onClick={handleBuscar} disabled={busquedaLoading || busquedaRealizada}>
              {busquedaLoading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
          <div>
            <Button variant="outline" onClick={handleResetBusqueda}>
              Limpiar búsqueda
            </Button>
          </div>
        </div>
        {aseguradoEncontrado && busquedaRealizada && (
          <p className="text-blue-600 text-sm mt-2">
            🔒 Los campos de identificación están bloqueados. Si necesita modificarlos, limpie la búsqueda.
          </p>
        )}
        {!aseguradoEncontrado && busquedaRealizada && (
          <p className="text-gray-500 text-sm mt-2">
            ℹ️ Complete los datos del nuevo asegurado.
          </p>
        )}
      </div>

      {/* Formulario completo - solo visible después de la búsqueda */}
      {busquedaRealizada && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo documento *</label>
              <select
                value={asegurado.tipo_documento}
                onChange={(e) => setAsegurado({...asegurado, tipo_documento: e.target.value})}
                disabled={true}
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              >
                {TIPO_DOCUMENTO_OPTS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <Input
              label="N° Documento *"
              value={asegurado.nro_documento}
              onChange={(e) => setAsegurado({...asegurado, nro_documento: e.target.value})}
              disabled={true}
              className="bg-gray-100"
            />
            <Input
              label="Complemento"
              value={asegurado.complemento}
              onChange={(e) => setAsegurado({...asegurado, complemento: e.target.value})}
              disabled={true}
              className="bg-gray-100"
            />
            <Input
              label="Nombres *"
              value={asegurado.nombres}
              onChange={(e) => setAsegurado({...asegurado, nombres: e.target.value})}
            />
            <Input
              label="Primer apellido *"
              value={asegurado.primer_apellido}
              onChange={(e) => setAsegurado({...asegurado, primer_apellido: e.target.value})}
            />
            <Input
              label="Segundo apellido"
              value={asegurado.segundo_apellido}
              onChange={(e) => setAsegurado({...asegurado, segundo_apellido: e.target.value})}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado civil</label>
              <select
                value={asegurado.estado_civil}
                onChange={(e) => setAsegurado({...asegurado, estado_civil: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                {ESTADO_CIVIL_OPTS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
              <select
                value={asegurado.genero}
                onChange={(e) => setAsegurado({...asegurado, genero: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                {GENERO_OPTS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <Input
              label="Fecha nacimiento *"
              type="date"
              value={asegurado.fecha_nacimiento}
              onChange={(e) => setAsegurado({...asegurado, fecha_nacimiento: e.target.value})}
            />
            <Input
              label="Ocupación"
              value={asegurado.ocupacion}
              onChange={(e) => setAsegurado({...asegurado, ocupacion: e.target.value})}
            />
            <Input
              label="Dirección"
              value={asegurado.direccion}
              onChange={(e) => setAsegurado({...asegurado, direccion: e.target.value})}
            />
            <Input
              label="Correo"
              type="email"
              value={asegurado.correo}
              onChange={(e) => setAsegurado({...asegurado, correo: e.target.value})}
            />
            <Input
              label="Celular"
              value={asegurado.nro_celular}
              onChange={(e) => setAsegurado({...asegurado, nro_celular: e.target.value})}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleGuardarAsegurado}>Continuar</Button>
          </div>
        </>
      )}
    </div>
  </div>
);

  const renderBeneficiariosStep = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Beneficiarios (máx: {selectedProducto?.nro_beneficiarios})</h2>
        <Button variant="outline" onClick={() => setStep('cliente')}>Volver</Button>
      </div>

      <div className="space-y-4">
        {beneficiarios.map((b, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-card p-5">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Beneficiario {idx+1}</h3>
              <button
                onClick={() => removeBeneficiario(idx)}
                className="text-red-500 hover:text-red-700"
                title="Eliminar"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre completo *"
                value={b.nombre_beneficiario}
                onChange={(e) => updateBeneficiario(idx, 'nombre_beneficiario', e.target.value)}
              />
              <Input
                label="CI *"
                value={b.ci_beneficiario}
                onChange={(e) => updateBeneficiario(idx, 'ci_beneficiario', e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parentesco *</label>
                <select
                  value={b.parentesco}
                  onChange={(e) => updateBeneficiario(idx, 'parentesco', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {PARENTESCO_OPTS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Porcentaje (%) *"
                type="number"
                value={b.porcentaje}
                onChange={(e) => updateBeneficiario(idx, 'porcentaje', parseFloat(e.target.value))}
              />
            </div>
          </div>
        ))}

        {beneficiarios.length < (selectedProducto?.nro_beneficiarios || 1) && (
          <Button onClick={addBeneficiario} variant="outline" className="w-full">
            + Agregar beneficiario
          </Button>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={handleCrearSolicitud} disabled={submitting}>
            {submitting ? 'Creando...' : 'Crear solicitud'}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {step === 'productos' && renderProductosStep()}
      {step === 'cliente' && renderClienteStep()}
      {step === 'beneficiarios' && renderBeneficiariosStep()}
    </div>
  );
};

export default NuevaSolicitudPage;