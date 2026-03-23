import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import type { Cobertura, CoberturaRequest } from '../../types/cobertura';
import type { Producto } from '../../types/producto';
import { getProductos } from '../../services/productoService';

interface CoberturaFormProps {
  cobertura?: Cobertura | null;
  onSubmit: (data: CoberturaRequest) => Promise<void>;
  onCancel: () => void;
}

const CoberturaForm: React.FC<CoberturaFormProps> = ({ cobertura, onSubmit, onCancel }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [formData, setFormData] = useState<CoberturaRequest>({
    id_producto: 0,
    descripcion: '',
    suma_asegurada: '',
    carencia: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CoberturaRequest, string>>>({});

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        // Filtrar solo productos activos
        setProductos(data.filter(p => p.activo));
      } catch (error) {
        console.error('Error cargando productos', error);
      } finally {
        setLoadingProductos(false);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    if (cobertura) {
      setFormData({
        id_producto: cobertura.id_producto,
        descripcion: cobertura.descripcion,
        suma_asegurada: cobertura.suma_asegurada,
        carencia: cobertura.carencia,
      });
    } else {
      setFormData({
        id_producto: 0,
        descripcion: '',
        suma_asegurada: '',
        carencia: '',
      });
    }
  }, [cobertura]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.id_producto) newErrors.id_producto = 'Debe seleccionar un producto';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'El tipo de cobertura es requerido';
    if (!formData.suma_asegurada.trim()) newErrors.suma_asegurada = 'La suma asegurada es requerida';
    if (!formData.carencia.trim()) newErrors.carencia = 'La carencia es requerida';
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Producto *</label>
        <select
          value={formData.id_producto}
          onChange={(e) => setFormData({ ...formData, id_producto: parseInt(e.target.value) })}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
            errors.id_producto ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loadingProductos}
        >
          <option value={0}>Seleccione un producto</option>
          {productos.map(prod => (
            <option key={prod.id} value={prod.id}>
              {prod.nombre_producto} - {prod.descripcion.substring(0, 50)}...
            </option>
          ))}
        </select>
        {errors.id_producto && <p className="mt-1 text-sm text-red-600">{errors.id_producto}</p>}
      </div>

      <Input
        label="Tipo Cobertura *"
        value={formData.descripcion}
        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
        error={errors.descripcion}
      />
      <Input
        label="Suma asegurada *"
        value={formData.suma_asegurada}
        onChange={(e) => setFormData({ ...formData, suma_asegurada: e.target.value })}
        error={errors.suma_asegurada}
        placeholder="Ej: 7,500"
      />
      <Input
        label="Carencia *"
        value={formData.carencia}
        onChange={(e) => setFormData({ ...formData, carencia: e.target.value })}
        error={errors.carencia}
        placeholder="Ej: 30 días para Muerte Natural"
      />
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : cobertura ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};

export default CoberturaForm;