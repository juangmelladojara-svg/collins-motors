'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, GripVertical } from 'lucide-react';
import Link from 'next/link';
import { formatearMiles, soloDigitos } from '@/lib/formato';

const CARROCERIAS = ['sedan', 'suv', 'hatchback', 'camioneta', 'furgon'];
const TRANSMISIONES = ['manual', 'automatica'];
const COMBUSTIBLES = ['bencina', 'diesel', 'hibrido', 'electrico'];

export default function NuevoVehiculoPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<File[]>([]);

  const [form, setForm] = useState({
    marca: '',
    modelo: '',
    version: '',
    anio: new Date().getFullYear(),
    precio: 0,
    precio_anterior: 0,
    kilometraje: 0,
    carroceria: 'sedan',
    transmision: 'automatica',
    combustible: 'bencina',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.includes('precio') || name.includes('kilometraje') || name.includes('puertas') || name.includes('anio')
        ? parseInt(value) || 0
        : value,
    }));
  };

  // Campos con separador de miles: guardamos el número, mostramos el formato.
  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const digitos = soloDigitos(value);
    setForm((prev) => ({ ...prev, [name]: digitos ? parseInt(digitos, 10) : 0 }));
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
    setLoading(true);

    try {
      // Generar slug
      const slug = `${form.marca.toLowerCase()}-${form.modelo.toLowerCase()}-${form.anio}-${Math.random().toString(36).substr(2, 6)}`;

      // Crear vehículo
      const { data: vehiculo, error: vehiculoError } = await supabase
        .from('vehiculos')
        .insert({
          slug,
          ...form,
          publicado: false,
          estado: 'disponible',
          destacado: false,
        })
        .select()
        .single();

      if (vehiculoError) {
        setError(vehiculoError.message);
        return;
      }

      // Subir imágenes si existen
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i];
          const storagePath = `${vehiculo.id}/foto-${i + 1}-${Date.now()}.jpg`;

          const { error: uploadError } = await supabase.storage.from('vehiculos').upload(storagePath, file);

          if (!uploadError) {
            await supabase.from('vehiculo_imagenes').insert({
              vehiculo_id: vehiculo.id,
              storage_path: storagePath,
              orden: i,
              es_principal: i === 0,
            });
          }
        }
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('Error al crear vehículo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/admin" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Volver al dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Crear nuevo vehículo</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Información básica */}
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

          {/* Precio y kilometraje */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Precio y kilometraje</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio (CLP) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="precio"
                    placeholder="15.000.000"
                    value={formatearMiles(form.precio)}
                    onChange={handleNumeroChange}
                    required
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio anterior (opcional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="precio_anterior"
                    placeholder="16.500.000"
                    value={formatearMiles(form.precio_anterior)}
                    onChange={handleNumeroChange}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kilometraje *</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    name="kilometraje"
                    placeholder="45.000"
                    value={formatearMiles(form.kilometraje)}
                    onChange={handleNumeroChange}
                    required
                    className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Especificaciones técnicas */}
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

          {/* Descripción */}
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

          {/* Información del vendedor */}
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

          {/* Ubicación */}
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

          {/* Características */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Características</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Ej: Aire acondicionado"
                value={caracteristicaInput}
                onChange={(e) => setCaracteristicaInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCaracteristica()}
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
            {form.caracteristicas.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.caracteristicas.map((car, idx) => (
                  <div key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
                    {car}
                    <button
                      type="button"
                      onClick={() => removeCaracteristica(idx)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Opciones de financiamiento */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Opciones de financiamiento</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Ej: 20% para financiamiento"
                value={financiamientoInput}
                onChange={(e) => setFinanciamientoInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addFinanciamiento()}
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
            {form.opciones_financiamiento.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.opciones_financiamiento.map((fin, idx) => (
                  <div key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2">
                    {fin}
                    <button
                      type="button"
                      onClick={() => removeFinanciamiento(idx)}
                      className="text-green-600 hover:text-green-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Imágenes */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Imágenes</h2>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleImageDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition"
            >
              <Upload className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="text-gray-600 mb-2">Arrastra imágenes aquí o haz clic para seleccionar</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="text-blue-600 hover:text-blue-700 cursor-pointer">
                Seleccionar imágenes
              </label>
            </div>

            {images.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">{images.length} imagen(es) seleccionada(s)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${idx}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              {loading ? 'Creando...' : 'Crear vehículo'}
            </button>
            <Link
              href="/admin"
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-3 px-4 rounded-lg text-center transition"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
