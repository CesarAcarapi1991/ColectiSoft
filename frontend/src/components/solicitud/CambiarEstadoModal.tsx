import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comentario: string, estado: number) => void;
  loading: boolean;
  solicitudId: number;
}

const ESTADOS = [
  { value: 1, label: 'Pendiente' },
  { value: 2, label: 'Enviado a Caja' },
  { value: 3, label: 'Solicitud Pagada' },
  { value: 4, label: 'Vigente' },
  { value: 5, label: 'Vencido' },
  { value: 6, label: 'Rechazado' },
];

const TIPO_COBRO = [
  { value: 1, label: 'Cobro en Caja' },
];

export const CambiarEstadoModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, loading }) => {
  const [comentario, setComentario] = useState('');
  const [estado, setEstado] = useState(1);

  const handleSubmit = () => {
    onSubmit(comentario, estado);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cambiar estado de solicitud">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
          >
            {ESTADOS.map(est => (
              <option key={est.value} value={est.value}>{est.label}</option>
            ))}
          </select>
        </div>
        <Input
          label="Comentario (opcional)"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Ej: Enviar a caja para pago"
        />
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};


export const EnviarCajaModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, loading }) => {
  const [estado, setEstado] = useState(1);

  const handleSubmit = () => {
    onSubmit('Enviado a Caja', estado);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enviar a Caja">
      <div className="space-y-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Cobro: </label>
          <select
            value={estado}
            onChange={(e) => setEstado(parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md mb-5"
          >
            {TIPO_COBRO.map(est => (
              <option key={est.value} value={est.value}>{est.label}</option>
            ))}
          </select>
        </div>
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-8">¿Esta seguro de enviar informacion para Cobro en Caja?</label>
        </div> */}
        {/* <Input
          label="Comentario (opcional)"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Ej: Enviar a caja para pago"
          className='hidden'
        /> */}
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar a Caja'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};


export const VigentarModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, loading }) => {
  
  const handleSubmit = () => {
    onSubmit('Vigentar Seguro', 4);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Activar Vigencia de Seguro">
      <div className="space-y-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Sr. Usuario,</label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-9">¿Desea colocar en Vigencia el Seguro?</label>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Activando...' : 'Activar Vigencia'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// export default CambiarEstadoModal;