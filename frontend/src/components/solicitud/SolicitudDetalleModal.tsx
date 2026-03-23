import React from 'react';
import Modal from '../common/Modal';
import type { SolicitudDetalle } from '../../types/solicitud';
import { format } from 'date-fns';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  detalle: SolicitudDetalle | null;
  loading: boolean;
}

const SolicitudDetalleModal: React.FC<Props> = ({ isOpen, onClose, detalle, loading }) => {
  if (!detalle && !loading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle de la solicitud">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Información general */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Información general</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-gray-500">N° Solicitud:</p>
              <p className="font-medium">{detalle?.nro_solicitud}</p>
              <p className="text-gray-500">Serie:</p>
              <p>{detalle?.serie || 0}</p>
              <p className="text-gray-500">Producto:</p>
              <p>{detalle?.producto}</p>
              <p className="text-gray-500">Prima:</p>
              <p>Bs.- {detalle?.prima}</p>
              <p className="text-gray-500">Empresa:</p>
              <p>{detalle?.empresa} ({detalle?.codigo_empresa})</p>
            </div>
          </div>

          {/* Datos del asegurado */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Datos del asegurado</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-gray-500">Nombre completo:</p>
              <p>{detalle?.apellido_asegurado}</p>
              <p className="text-gray-500">Tipo documento:</p>
              <p>{detalle?.tipo_documento} {detalle?.complemento}</p>
              <p className="text-gray-500">Numero documento:</p>
              <p>{detalle?.nro_documento}</p>
              <p className="text-gray-500">Estado civil:</p>
              <p>{detalle?.estado_civil}</p>
              <p className="text-gray-500">Género:</p>
              <p>{detalle?.genero}</p>
              <p className="text-gray-500">Fecha nacimiento:</p>
              <p>{detalle?.fecha_nacimiento ? format(new Date(detalle.fecha_nacimiento), 'dd/MM/yyyy') : '-'}</p>
              <p className="text-gray-500">Ocupación:</p>
              <p>{detalle?.ocupacion || '-'}</p>
              <p className="text-gray-500">Dirección:</p>
              <p>{detalle?.direccion || '-'}</p>
              <p className="text-gray-500">Celular:</p>
              <p>{detalle?.celular || '-'}</p>
              <p className="text-gray-500">Email:</p>
              <p>{detalle?.email || '-'}</p>
            </div>
          </div>

          {/* Beneficiarios */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Beneficiarios</h3>
            { detalle?.beneficiarios?.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Nombre</th>
                      <th className="text-left py-2">CI</th>
                      <th className="text-left py-2">Parentesco</th>
                      <th className="text-left py-2">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalle.beneficiarios.map((b, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2">{b.nombre_beneficiario}</td>
                        <td className="py-2">{b.ci_beneficiario}</td>
                        <td className="py-2">{b.parentesco}</td>
                        <td className="py-2">{b.porcentaje}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No hay beneficiarios registrados</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SolicitudDetalleModal;