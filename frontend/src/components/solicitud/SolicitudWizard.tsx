import React, { useState, useEffect } from 'react';
import { getEmpresas } from '../../services/empresaService';
import { getProductosByEmpresa } from '../../services/productoService';
import { getCoberturasByProducto } from '../../services/coberturaService';
import { buscarAseguradoPorCI, createAsegurado } from '../../services/aseguradoService';
import { createBeneficiario } from '../../services/beneficiarioService';
import { createSolicitud } from '../../services/solicitudService';
import type { Producto } from '../../types/producto';
import type { Cobertura } from '../../types/cobertura';
import type { Empresa } from '../../types/empresa';
import type { AseguradoRequest } from '../../types/asegurado';
import Button from '../common/Button';
import Input from '../common/Input';
import toast from 'react-hot-toast';

interface WizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'empresa' | 'producto' | 'coberturas' | 'asegurado' | 'beneficiarios' | 'confirmacion';

const SolicitudWizard: React.FC<WizardProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<Step>('empresa');
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [coberturas, setCoberturas] = useState<Cobertura[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(false);
  const [idAsegurado, setIdAsegurado] = useState<number | null>(null);

  // Datos del asegurado
  const [asegurado, setAsegurado] = useState<AseguradoRequest>({
    tipo_documento: 'CARNET DE IDENTIDAD',
    nro_documento: '',
    complemento: '',
    nombres: '',
    primer_apellido: '',
    segundo_apellido: '',
    estado_civil: '',
    genero: '',
    fecha_nacimiento: '',
    ocupacion: '',
    direccion: '',
    correo: '',
    nro_celular: ''
  });
  const [buscarCI, setBuscarCI] = useState('');
  const [aseguradoExistente, setAseguradoExistente] = useState<any>(null);
  const [beneficiarios, setBeneficiarios] = useState<Array<{
    nombre_beneficiario: string;
    ci_beneficiario: string;
    parentesco: string;
    porcentaje: number;
  }>>([]);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const data = await getEmpresas();
        setEmpresas(data.filter(emp => emp.activo));
      } catch (error) {
        toast.error('Error cargando empresas');
      }
    };
    fetchEmpresas();
  }, []);

  const handleSelectEmpresa = async (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setLoading(true);
    try {
      const prods = await getProductosByEmpresa(empresa.id);
      setProductos(prods);
      setStep('producto');
    } catch (error) {
      toast.error('Error cargando productos');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProducto = async (producto: Producto) => {
    setSelectedProducto(producto);
    setLoading(true);
    try {
      const covs = await getCoberturasByProducto(producto.id);
      setCoberturas(covs);
      setStep('coberturas');
    } catch (error) {
      toast.error('Error cargando coberturas');
    } finally {
      setLoading(false);
    }
  };

  const handleContinuarCoberturas = () => {
    if (coberturas.length === 0) {
      toast.error('Este producto no tiene coberturas activas');
      return;
    }
    setStep('asegurado');
  };

  const handleBuscarAsegurado = async () => {
    if (!buscarCI) return;
    setLoading(true);
    try {
      const results = await buscarAseguradoPorCI(buscarCI);
      if (results && results.length > 0) {
        setAseguradoExistente(results[0]);
        setAsegurado({
          tipo_documento: results[0].tipo_documento,
          nro_documento: results[0].nro_documento,
          complemento: results[0].complemento || '',
          nombres: results[0].nombres,
          primer_apellido: results[0].primer_apellido,
          segundo_apellido: results[0].segundo_apellido,
          estado_civil: results[0].estado_civil || '',
          genero: results[0].genero || '',
          fecha_nacimiento: results[0].fecha_nacimiento.split('T')[0],
          ocupacion: results[0].ocupacion || '',
          direccion: results[0].direccion || '',
          correo: results[0].correo || '',
          nro_celular: results[0].nro_celular || '',
        });
        toast.success('Asegurado encontrado');
      } else {
        setAseguradoExistente(null);
        toast.error('No se encontró asegurado con ese CI');
      }
    } catch (error) {
      toast.error('Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarAsegurado = async () => {
    if (!asegurado.nombres || !asegurado.primer_apellido || !asegurado.nro_documento || !asegurado.fecha_nacimiento) {
      toast.error('Complete los campos obligatorios (nombres, apellido, documento, fecha nacimiento)');
      return;
    }
    setLoading(true);
    try {
      let id: number;
      if (aseguradoExistente) {
        id = aseguradoExistente.id;
      } else {
        const nuevo = await createAsegurado(asegurado);
        id = nuevo.id;
      }
      setIdAsegurado(id);
      // Inicializar beneficiarios según cantidad requerida
      const cantidad = selectedProducto?.nro_beneficiarios || 1;
      const porcentajeUnitario = 100 / cantidad;
      setBeneficiarios(Array(cantidad).fill(null).map(() => ({
        nombre_beneficiario: '',
        ci_beneficiario: '',
        parentesco: '',
        porcentaje: Math.round(porcentajeUnitario * 100) / 100 // ajuste para evitar decimales
      })));
      setStep('beneficiarios');
    } catch (error) {
      toast.error('Error al guardar asegurado');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarBeneficiarios = async () => {
    // Validaciones
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

    if (!idAsegurado) {
      toast.error('Error: asegurado no registrado');
      return;
    }

    setLoading(true);
    try {
      // Crear beneficiarios
      for (let i = 0; i < beneficiarios.length; i++) {
        const b = beneficiarios[i];
        await createBeneficiario({
          id_asegurado: idAsegurado,
          item: i + 1,
          nombre_beneficiario: b.nombre_beneficiario,
          ci_beneficiario: b.ci_beneficiario,
          parentesco: b.parentesco,
          porcentaje: b.porcentaje
        });
      }
      // Crear solicitud
      await createSolicitud({
        id_producto: selectedProducto!.id,
        id_asegurado: idAsegurado
      });
      setStep('confirmacion');
      toast.success('Solicitud creada exitosamente');
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al crear solicitud');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'empresa':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Selecciona una empresa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {empresas.map(emp => (
                <button
                  key={emp.id}
                  onClick={() => handleSelectEmpresa(emp)}
                  className="p-4 border rounded-lg hover:shadow-lg transition text-left"
                >
                  <p className="font-medium">{emp.codigo_empresa || 'Sin código'}</p>
                  <p className="text-sm text-gray-600">{emp.nombre_empresa || 'Nombre no disponible'}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 'producto':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Selecciona un producto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productos.map(prod => (
                <button
                  key={prod.id}
                  onClick={() => handleSelectProducto(prod)}
                  className="p-4 border rounded-lg hover:shadow-lg transition"
                >
                  <p className="font-medium">{prod.nombre_producto}</p>
                  <p className="text-sm text-gray-600">Prima: Bs.- {prod.prima}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 'coberturas':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Coberturas del producto</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {coberturas.map(cov => (
                <div key={cov.id} className="p-3 border rounded-lg">
                  <p className="font-medium">{cov.descripcion}</p>
                  <p className="text-sm">Suma asegurada: Bs.- {cov.suma_asegurada}</p>
                  <p className="text-sm">Carencia: {cov.carencia}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleContinuarCoberturas}>Continuar</Button>
            </div>
          </div>
        );
      case 'asegurado':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Datos del asegurado</h3>
            <div className="mb-4 flex gap-2">
              <Input
                placeholder="N° Documento (CI)"
                value={buscarCI}
                onChange={(e) => setBuscarCI(e.target.value)}
              />
              <Button onClick={handleBuscarAsegurado} variant="outline">Buscar</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tipo documento"
                value={asegurado.tipo_documento}
                onChange={(e) => setAsegurado({...asegurado, tipo_documento: e.target.value})}
              />
              <Input
                label="N° Documento *"
                value={asegurado.nro_documento}
                onChange={(e) => setAsegurado({...asegurado, nro_documento: e.target.value})}
              />
              <Input
                label="Complemento"
                value={asegurado.complemento}
                onChange={(e) => setAsegurado({...asegurado, complemento: e.target.value})}
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
              <Input
                label="Estado civil"
                value={asegurado.estado_civil}
                onChange={(e) => setAsegurado({...asegurado, estado_civil: e.target.value})}
              />
              <Input
                label="Género"
                value={asegurado.genero}
                onChange={(e) => setAsegurado({...asegurado, genero: e.target.value})}
              />
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
            <div className="mt-4 flex justify-end">
              <Button onClick={handleGuardarAsegurado}>Continuar</Button>
            </div>
          </div>
        );
      case 'beneficiarios':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Beneficiarios (máx: {selectedProducto?.nro_beneficiarios})</h3>
            {beneficiarios.map((b, idx) => (
              <div key={idx} className="border p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-2">Beneficiario {idx+1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre completo *"
                    value={b.nombre_beneficiario}
                    onChange={(e) => {
                      const newBenef = [...beneficiarios];
                      newBenef[idx].nombre_beneficiario = e.target.value;
                      setBeneficiarios(newBenef);
                    }}
                  />
                  <Input
                    label="CI *"
                    value={b.ci_beneficiario}
                    onChange={(e) => {
                      const newBenef = [...beneficiarios];
                      newBenef[idx].ci_beneficiario = e.target.value;
                      setBeneficiarios(newBenef);
                    }}
                  />
                  <Input
                    label="Parentesco *"
                    value={b.parentesco}
                    onChange={(e) => {
                      const newBenef = [...beneficiarios];
                      newBenef[idx].parentesco = e.target.value;
                      setBeneficiarios(newBenef);
                    }}
                  />
                  <Input
                    label="Porcentaje (%) *"
                    type="number"
                    value={b.porcentaje}
                    onChange={(e) => {
                      const newBenef = [...beneficiarios];
                      newBenef[idx].porcentaje = parseFloat(e.target.value);
                      setBeneficiarios(newBenef);
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="mt-4 flex justify-end">
              <Button onClick={handleGuardarBeneficiarios} disabled={loading}>
                {loading ? 'Guardando...' : 'Finalizar'}
              </Button>
            </div>
          </div>
        );
      case 'confirmacion':
        return (
          <div className="text-center py-8">
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <p className="text-lg">Solicitud creada exitosamente</p>
            <p className="text-sm text-gray-500">Redirigiendo...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      {renderStep()}
    </div>
  );
};

export default SolicitudWizard;