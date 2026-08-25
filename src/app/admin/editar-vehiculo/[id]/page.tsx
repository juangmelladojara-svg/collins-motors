'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { X } from 'lucide-react';
import Link from 'next/link';
import type { Vehiculo, VehiculoImagen } from '@/lib/vehiculos/tipos';

const CARROCERIAS = ['sedan', 'suv', 'hatchback', 'camioneta', 'furgon'];
const TRANSMISIONES = ['manual', 'automatica'];
const COMBUSTIBLES = ['bencina', 'diesel', 'hibrido', 'electrico'];

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function EditarVehiculoPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const vehiculoId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<VehiculoImagen[]>([]);

  const [form, setForm] = useState({
    marca: '',
    modelo: '',
    version: '',
    anio: new Date().getFullYear(),
    precio: 0,
    precio_anterior: 0,
    kilometraje: 0,
    carroceria: 'sedan' as const,
    transmision: 'automatica' as const,
    combustible: 'bencina' as const,
    color: '',
    puertas: 4,
    descripcion: '',
    caracteristicas: [] as string[],
    vendedor_nombre: '',
    vendedor_telefono: '',
    ubicacion: '',
    opciones_financiamiento: [] as string[],
  });

  const [caracteristicaInput, setCaracteristicaInput] = useState('');
  const [financiamientoInput, setFinanciamientoInput] = useState('');

  useEffect(() => {
    const loadVehiculo = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('vehiculos')
          .select('*')
          .eq('id', vehiculoId)
          .single();

        if (fetchError) {
          setError('Vehículo no encontrado');
          return;
        }

        setForm({
          marca: data.marca,
          modelo: data.modelo,
          version: data.version || '',
          anio: data.anio,
          precio: data.precio,
          precio_anterior: data.precio_anterior || 0,
          kilometraje: data.kilometraje,
          carroceria: data.carroceria,
          transmision: data.transmision,
          combustible: data.combustible,
          color: data.color || '',
          puertas: data.puertas || 4,
          descripcion: data.descripcion || '',
          caracteristicas: data.caracteristicas || [],
          vendedor_nombre: data.vendedor_nombre || '',
          vendedor_telefono: data.vendedor_telefono || '',
          ubicacion: data.ubicacion || '',
          opciones_financiamiento: data.opciones_financiamiento || [],
        });

        const { data: imagenes, error: imageError } = await supabase
          .from('vehiculo_imagenes')
          .select('*')
          .eq('vehiculo_id', vehiculoId)
          .order('orden', { ascending: true });

        if (!imageError && imagenes) {
          setExistingImages(imagenes);
        }
      } catch (err) {
        setError('Error al cargar vehículo');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadVehiculo();
  }, [vehiculoId, supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.includes('precio') || name.includes('kilometraje') || name.includes('puertas') || name.includes('anio')
        ? parseInt(value) || 0
        : value,
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || []);
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId: string) => {
    try {
      await supabase.from('vehiculo_imagenes').delete().eq('id', imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      setError('Error al eliminar imagen');
      console.error(err);
    }
  };

  const addCaracteristica = () => {
    if (caracteristicaInput.trim()) {
      setForm((prev) => ({
        ...prev,
        caracteristicas: [...prev.caracteristicas, caracteristicaInput.trim()],
      }));
      setCaracteristicaInput('');
    }
  };

  const removeCaracteristica = (index: number) => {
    setForm((prev) => ({
      ...prev,
      caracteristicas: prev.caracteristicas.filter((_, i) => i !== index),
    }));
  };

  const addFinanciamiento = () => {
    if (financiamientoInput.trim()) {
      setForm((prev) => ({
        ...prev,
        opciones_financiamiento: [...prev.opciones_financiamiento, financiamientoInput.trim()],
      }));
      setFinanciamientoInput('');
    }
  };

  const removeFinanciamiento = (index: number) => {
    setForm((prev) => ({
      ...prev,
      opciones_financiamiento: prev.opciones_financiamiento.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('vehiculos')
        .update(form)
        .eq('id', vehiculoId);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      if (newImages.length > 0) {
        const maxOrden = existingImages.length > 0 ? Math.max(...existingImages.map((img) => img.orden)) : -1;
        for (let i = 0; i < newImages.length; i++) {
          const file = newImages[i];
          const storagePath = `${vehiculoId}/foto-${maxOrden + i + 2}-${Date.now()}.jpg`;

          const { error: uploadError } = await supabase.storage.from('vehiculos').upload(storagePath, file);

          if (!uploadError) {
            await supabase.from('vehiculo_imagenes').insert({
              vehiculo_id: vehiculoId,
              storage_path: storagePath,
              orden: maxOrden + i + 1,
              es_principal: false,
            });
          }
        }
      }

      setSuccess('Vehículo actualizado correctamente');
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1500);
    } catch (err) {
      setError('Error al actualizar vehículo');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Cargando vehículo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/admin" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Volver al dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Editar vehículo: {form.marca} {form.modelo}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="marca"
                placeholder="Marca (ej: Toyota)"
                value={form.marca}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                name="modelo"
                placeholder="Modelo (ej: Corolla)"
                value={form.modelo}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                name="version"
                placeholder="Versión (ej: XLE)"
                value={form.version}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                name="anio"
                placeholder="Año"
                value={form.anio}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Precio y kilometraje</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio (CLP) *</label>
                <input
                  type="number"
                  name="precio"
                  placeholder="Ej: 15000000"
                  value={form.precio}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio anterior (opcional)</label>
                <input
                  type="number"
                  name="precio_anterior"
                  placeholder="Ej: 16500000"
                  value={form.precio_anterior}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kilometraje *</label>
                <input
                  type="number"
                  name="kilometraje"
                  placeholder="Ej: 45000"
                  value={form.kilometraje}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Especificaciones técnicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Carrocería</label>
                <select
                  name="carroceria"
                  value={form.carroceria}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {CARROCERIAS.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transmisión</label>
                <select
                  name="transmision"
                  value={form.transmision}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {TRANSMISIONES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Combustible</label>
                <select
                  name="combustible"
                  value={form.combustible}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {COMBUSTIBLES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="text"
                  name="color"
                  placeholder="Ej: Gris"
                  value={form.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Puertas</label>
                <input
                  type="number"
                  name="puertas"
                  placeholder="Ej: 4"
                  value={form.puertas}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción</h2>
            <textarea
              name="descripcion"
              placeholder="Descripción del vehículo"
              value={form.descripcion}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información del vendedor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del vendedor</label>
                <input
                  type="text"
                  name="vendedor_nombre"
                  placeholder="Ej: Juan Pérez"
                  value={form.vendedor_nombre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input
                  type="text"
                  name="vendedor_telefono"
                  placeholder="Ej: +56 9 1234 5678"
                  value={form.vendedor_telefono}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ubicación</h2>
            <input
              type="text"
              name="ubicacion"
              placeholder="Ej: Bernardo O'Higgins 252, Temuco"
              value={form.ubicacion}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Características</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Ej: Aire acondicionado"
                value={caracteristicaInput}
                onChange={(e) => setCaracteristicaInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCaracteristica())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={addCaracteristica}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.caracteristicas.map((carac, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {carac}
                  <button
                    type="button"
                    onClick={() => removeCaracteristica(idx)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Opciones de financiamiento</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Ej: 20% para financiamiento"
                value={financiamientoInput}
                onChange={(e) => setFinanciamientoInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFinanciamiento())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={addFinanciamiento}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.opciones_financiamiento.map((opcion, idx) => (
                <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {opcion}
                  <button
                    type="button"
                    onClick={() => removeFinanciamiento(idx)}
                    className="text-green-600 hover:text-green-900"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {existingImages.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Imágenes actuales ({existingImages.length})</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((img, idx) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/vehiculos/${img.storage_path}`}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.id)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Agregar imágenes</h2>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer"
            />
            {newImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {newImages.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Nueva foto ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <Link
              href="/admin"
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded-lg transition text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
