import React, { useState } from 'react';
import { buscarPendienteCaja, buscarTransaccion, cobrarSolicitud } from '../services/cajaService';
import { getSolicitudInfo } from '../services/solicitudService';
import type { SolicitudInfo } from '../types/solicitud';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

type Tab = 'cobrar' | 'consultar';

const TIPO_DOCUMENTO_OPTS = [
  { value: 'CARNET DE IDENTIDAD', label: 'Carnet de Identidad' },
  { value: 'PERSONA EXTRANJERA', label: 'Persona Extranjera' },
];

const CajaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('cobrar');

  // Estado para búsqueda por documento (cobrar)
  const [searchTipo, setSearchTipo] = useState(TIPO_DOCUMENTO_OPTS[0].value);
  const [searchNro, setSearchNro] = useState('');
  const [searchComplemento, setSearchComplemento] = useState('');
  const [loadingBusqueda, setLoadingBusqueda] = useState(false);
  const [pendiente, setPendiente] = useState<any>(null);
  const [infoSolicitud, setInfoSolicitud] = useState<SolicitudInfo | null>(null);
  const [montoRecibido, setMontoRecibido] = useState('');
  const [cambio, setCambio] = useState(0);
  const [cobrando, setCobrando] = useState(false);

  // Estado para búsqueda por transacción (consultar)
  const [searchRecibo, setSearchRecibo] = useState('');
  const [transaccion, setTransaccion] = useState<any>(null);
  const [infoTransaccion, setInfoTransaccion] = useState<SolicitudInfo | null>(null);
  const [loadingTransaccion, setLoadingTransaccion] = useState(false);

  // Búsqueda por documento (cobrar)
  const handleBuscarPorDocumento = async () => {
    if (!searchNro.trim()) {
      toast.error('Ingrese un número de documento');
      return;
    }
    setLoadingBusqueda(true);
    try {
      const pend = await buscarPendienteCaja(searchTipo, searchNro, searchComplemento);
      if (pend) {
        setPendiente(pend);
        // Si la transacción ya está cobrada, mostrar mensaje y deshabilitar cobro
        if (pend.estado !== 1) {
          toast.success('Esta transacción ya fue cobrada. Solo puede consultar sus detalles.');
          // Aún así obtenemos la información de la solicitud para mostrar
          const info = await getSolicitudInfo(pend.id_solicitud);
          setInfoSolicitud(info);
        } else {
          const info = await getSolicitudInfo(pend.id_solicitud);
          setInfoSolicitud(info);
          setMontoRecibido('');
          setCambio(0);
          toast.success('Registro encontrado. Complete el cobro.');
        }
      } else {
        setPendiente(null);
        setInfoSolicitud(null);
        toast.success('No se encontró ningún pendiente de pago');
      }
    } catch (error) {
      toast.error('Error en la búsqueda');
    } finally {
      setLoadingBusqueda(false);
    }
  };

  // Búsqueda por número de recibo (consultar)
  const handleBuscarPorRecibo = async () => {
    if (!searchRecibo.trim()) {
      toast.error('Ingrese un número de recibo');
      return;
    }
    setLoadingTransaccion(true);
    try {
      const trans = await buscarTransaccion(searchRecibo);
      setTransaccion(trans);
      const info = await getSolicitudInfo(trans.id_solicitud);
      setInfoTransaccion(info);
      toast.success('Transacción encontrada');
    } catch (error: any) {
      if (error.response?.status === 404) {
        setTransaccion(null);
        setInfoTransaccion(null);
        toast.error('No se encontró transacción con ese número');
      } else {
        toast.error('Error en la búsqueda');
      }
    } finally {
      setLoadingTransaccion(false);
    }
  };

  // Cálculo de cambio
  const handleMontoChange = (value: string) => {
    setMontoRecibido(value);
    const montoPendiente = pendiente ? parseFloat(pendiente.monto) : 0;
    const recibido = parseFloat(value);
    if (!isNaN(recibido)) {
      const cambioCalc = recibido - montoPendiente;
      setCambio(cambioCalc > 0 ? cambioCalc : 0);
    } else {
      setCambio(0);
    }
  };

  // Cobrar
  const handleCobrar = async () => {
    if (!pendiente) return;
    const recibido = parseFloat(montoRecibido);
    if (isNaN(recibido) || recibido <= 0) {
      toast.error('Ingrese un monto válido');
      return;
    }
    if (recibido < parseFloat(pendiente.monto)) {
      toast.error('El monto recibido es menor al monto a pagar');
      return;
    }
    setCobrando(true);
    try {
      const resultado = await cobrarSolicitud(pendiente.id_solicitud, recibido);
      toast.success(`Cobro registrado. Recibo N° ${resultado.nro_recibo}`);
      // Reiniciar búsqueda
      setPendiente(null);
      setInfoSolicitud(null);
      setSearchNro('');
      setSearchComplemento('');
      setMontoRecibido('');
      setCambio(0);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al registrar cobro');
    } finally {
      setCobrando(false);
    }
  };

  // Renderizado de detalles de solicitud (reutilizable)
  const renderDetallesSolicitud = (info: SolicitudInfo, esTransaccion?: boolean) => (
    <div className="bg-white rounded-xl shadow-card p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Información de la solicitud</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">N° Solicitud</p>
          <p className="font-medium">{info.nro_solicitud}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Producto</p>
          <p className="font-medium">{info.producto}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Empresa</p>
          <p className="font-medium">{info.empresa} ({info.codigo_empresa})</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Asegurado</p>
          <p className="font-medium">{info.apellido_asegurado}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Monto a pagar</p>
          <p className="font-medium text-lg text-green-600">${info.prima}</p>
        </div>
      </div>
    </div>
  );

  // Renderizado de detalles de transacción (para consulta)
  const renderDetallesTransaccion = (trans: any) => (
    <div className="bg-white rounded-xl shadow-card p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Detalles de la transacción</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">N° Recibo</p>
          <p className="font-medium">{trans.nro_recibo}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Monto pagado</p>
          <p className="font-medium text-green-600">${trans.monto_recibido}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Vuelto</p>
          <p className="font-medium">${trans.cambio}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Fecha cobro</p>
          <p className="font-medium">{new Date(trans.fecha_cobro).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Cajero</p>
          <p className="font-medium">{trans.usuario_caja}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Estado</p>
          <p className="font-medium">{trans.estado === 2 ? 'Cobrado' : 'Pendiente'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Módulo de Caja</h2>

      {/* Pestañas */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('cobrar')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'cobrar'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Cobrar
        </button>
        <button
          onClick={() => setActiveTab('consultar')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'consultar'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Consultar transacción
        </button>
      </div>

      {/* Contenido de Cobrar */}
      {activeTab === 'cobrar' && (
        <>
          {/* Búsqueda por documento */}
          <div className="bg-white rounded-xl shadow-card p-6 mb-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo documento</label>
                <select
                  value={searchTipo}
                  onChange={(e) => setSearchTipo(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
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
                  placeholder="Ej: 1234567"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Complemento (opcional)</label>
                <input
                  type="text"
                  value={searchComplemento}
                  onChange={(e) => setSearchComplemento(e.target.value)}
                  placeholder="Ej: 10"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <Button onClick={handleBuscarPorDocumento} disabled={loadingBusqueda}>
                  {loadingBusqueda ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>
            </div>
          </div>

          {/* Resultado de cobro */}
          {infoSolicitud && pendiente && (
            <>
              {renderDetallesSolicitud(infoSolicitud, false)}
              {pendiente.estado === 1 ? (
                // Pendiente - mostrar formulario de cobro
                <div className="bg-white rounded-xl shadow-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Registrar cobro</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monto recibido</label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">$</span>
                        <input
                          type="number"
                          value={montoRecibido}
                          onChange={(e) => handleMontoChange(e.target.value)}
                          placeholder="0.00"
                          className="flex-1 px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vuelto</label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">$</span>
                        <input
                          type="text"
                          value={cambio.toFixed(2)}
                          readOnly
                          className="flex-1 px-3 py-2 border rounded-md bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleCobrar} disabled={cobrando}>
                      {cobrando ? 'Procesando...' : 'Cobrar'}
                    </Button>
                  </div>
                </div>
              ) : (
                // Ya cobrada
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">Esta transacción ya fue cobrada el {pendiente.fecha_cobro ? new Date(pendiente.fecha_cobro).toLocaleString() : 'fecha desconocida'}.</p>
                  <p className="text-sm text-yellow-700 mt-1">Recibo N° {pendiente.nro_recibo}</p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Contenido de Consultar */}
      {activeTab === 'consultar' && (
        <>
          {/* Búsqueda por número de recibo */}
          <div className="bg-white rounded-xl shadow-card p-6 mb-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de recibo</label>
                <input
                  type="text"
                  value={searchRecibo}
                  onChange={(e) => setSearchRecibo(e.target.value)}
                  placeholder="Ej: 112"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <Button onClick={handleBuscarPorRecibo} disabled={loadingTransaccion}>
                  {loadingTransaccion ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>
            </div>
          </div>

          {/* Resultado de consulta */}
          {transaccion && infoTransaccion && (
            <>
              {renderDetallesTransaccion(transaccion)}
              {renderDetallesSolicitud(infoTransaccion, true)}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CajaPage;