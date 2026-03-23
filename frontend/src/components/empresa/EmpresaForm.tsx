import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import type { Empresa, EmpresaRequest } from '../../types/empresa';

interface EmpresaFormProps {
  empresa?: Empresa | null;
  onSubmit: (data: EmpresaRequest) => Promise<void>;
  onCancel: () => void;
}

const EmpresaForm: React.FC<EmpresaFormProps> = ({ empresa, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<EmpresaRequest>({
    codigo_empresa: '',
    nombre_empresa: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ codigo_empresa?: string; nombre_empresa?: string }>({});

  useEffect(() => {
    if (empresa) {
      setFormData({
        codigo_empresa: empresa.codigo_empresa,
        nombre_empresa: empresa.nombre_empresa,
      });
    } else {
      setFormData({ codigo_empresa: '', nombre_empresa: '' });
    }
  }, [empresa]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.codigo_empresa.trim()) newErrors.codigo_empresa = 'El código es requerido';
    if (!formData.nombre_empresa.trim()) newErrors.nombre_empresa = 'El nombre es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(formData);
      onCancel(); // cerrar modal tras éxito
    } catch (error) {
      // El toast ya se muestra en la página
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Código de empresa"
        value={formData.codigo_empresa}
        onChange={(e) => setFormData({ ...formData, codigo_empresa: e.target.value })}
        error={errors.codigo_empresa}
        placeholder="Ej: EMP-001"
      />
      <Input
        label="Nombre de empresa"
        value={formData.nombre_empresa}
        onChange={(e) => setFormData({ ...formData, nombre_empresa: e.target.value })}
        error={errors.nombre_empresa}
        placeholder="Nombre de la empresa"
      />
      <div className="flex justify-end space-x-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : empresa ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};

export default EmpresaForm;