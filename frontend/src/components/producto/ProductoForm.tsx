import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import type { Producto, ProductoRequest } from '../../types/producto';
import type { Empresa } from '../../types/empresa';
import { getEmpresas } from '../../services/empresaService';

interface ProductoFormProps {
  producto?: Producto | null;
  onSubmit: (data: ProductoRequest) => Promise<void>;
  onCancel: () => void;
}

const ProductoForm: React.FC<ProductoFormProps> = ({ producto, onSubmit, onCancel }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
  const [formData, setFormData] = useState<ProductoRequest>({
    id_empresa: 0,
    nombre_producto: '',
    prima: '',
    descripcion: '',
    nro_beneficiarios: 0,
    edad_minima: 18,
    edad_maxima: 70,
    serie: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductoRequest, string>>>({});

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const data = await getEmpresas();
        // Filtrar solo empresas activas
        setEmpresas(data.filter(emp => emp.activo));
      } catch (error) {
        console.error('Error cargando empresas', error);
      } finally {
        setLoadingEmpresas(false);
      }
    };
    fetchEmpresas();
  }, []);

  useEffect(() => {
    if (producto) {
      setFormData({
        id_empresa: producto.id_empresa,
        nombre_producto: producto.nombre_producto,
        prima: producto.prima,
        descripcion: producto.descripcion,
        nro_beneficiarios: producto.nro_beneficiarios,
        edad_minima: producto.edad_minima,
        edad_maxima: producto.edad_maxima,
        serie: producto.serie,
      });
    } else {
      setFormData({
        id_empresa: 0,
        nombre_producto: '',
        prima: '',
        descripcion: '',
        nro_beneficiarios: 0,
        edad_minima: 18,
        edad_maxima: 70,
        serie: 0,
      });
    }
  }, [producto]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.id_empresa) newErrors.id_empresa = 'Debe seleccionar una empresa';
    if (!formData.nombre_producto.trim()) newErrors.nombre_producto = 'El nombre es requerido';
    if (!formData.prima.trim()) newErrors.prima = 'La prima es requerida';
    else if (isNaN(parseFloat(formData.prima))) newErrors.prima = 'La prima debe ser un número';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (!formData.nro_beneficiarios || formData.nro_beneficiarios < 1) newErrors.nro_beneficiarios = 'Debe ser al menos 1';
    if (!formData.edad_minima || formData.edad_minima < 0) newErrors.edad_minima = 'Edad mínima inválida';
    if (!formData.edad_maxima || formData.edad_maxima < formData.edad_minima) newErrors.edad_maxima = 'Edad máxima debe ser mayor a mínima';
    if (!formData.serie) newErrors.serie = 'La serie es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(formData);
      onCancel();
    } catch (error) {
      // toast manejado en página
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Empresa *</label>
        <select
          value={formData.id_empresa}
          onChange={(e) => setFormData({ ...formData, id_empresa: parseInt(e.target.value) })}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
            errors.id_empresa ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loadingEmpresas}
        >
          <option value={0}>Seleccione una empresa</option>
          {empresas.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.codigo_empresa ? `${emp.codigo_empresa} - ${emp.nombre_empresa}` : emp.nombre_empresa || `Empresa ${emp.id}`}
            </option>
          ))}
        </select>
        {errors.id_empresa && <p className="mt-1 text-sm text-red-600">{errors.id_empresa}</p>}
      </div>

      <Input
        label="Nombre del producto *"
        value={formData.nombre_producto}
        onChange={(e) => setFormData({ ...formData, nombre_producto: e.target.value })}
        error={errors.nombre_producto}
      />
      <Input
        label="Prima *"
        value={formData.prima}
        onChange={(e) => setFormData({ ...formData, prima: e.target.value })}
        error={errors.prima}
        placeholder="Ej: 250.00"
      />
      <Input
        label="Descripción *"
        value={formData.descripcion}
        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
        error={errors.descripcion}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="N° Beneficiarios *"
          type="number"
          value={formData.nro_beneficiarios}
          onChange={(e) => setFormData({ ...formData, nro_beneficiarios: parseInt(e.target.value) || 0 })}
          error={errors.nro_beneficiarios}
        />
        <Input
          label="Edad mínima *"
          type="number"
          value={formData.edad_minima}
          onChange={(e) => setFormData({ ...formData, edad_minima: parseInt(e.target.value) || 0 })}
          error={errors.edad_minima}
        />
        <Input
          label="Edad máxima *"
          type="number"
          value={formData.edad_maxima}
          onChange={(e) => setFormData({ ...formData, edad_maxima: parseInt(e.target.value) || 0 })}
          error={errors.edad_maxima}
        />
      </div>
      <Input
        label="Serie *"
        type="number"
        value={formData.serie}
        onChange={(e) => setFormData({ ...formData, serie: parseInt(e.target.value) || 0 })}
        error={errors.serie}
      />
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : producto ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};

export default ProductoForm;