'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Vehiculo } from '@/lib/vehiculos/tipos';
import { LogOut, Plus, Edit2, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/admin/login');
        return;
      }

      setUser(user);
      fetchVehiculos();
    };

    checkAuth();
  }, []);

  const fetchVehiculos = async () => {
    const { data, error } = await supabase.from('vehiculos').select('*').order('created_at', { ascending: false });

    // Pase lo que pase hay que soltar el loading, o el dashboard se queda
    // colgado en "Cargando..." sin explicar nada.
    setLoading(false);

    if (error) {
      setError(`No se pudo cargar el inventario: ${error.message}`);
      return;
    }

    setError('');
    setVehiculos(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const handleTogglePublish = async (id: string, publicado: boolean) => {
    const { error } = await supabase.from('vehiculos').update({ publicado: !publicado }).eq('id', id);

    if (error) {
      setError(`No se pudo cambiar la publicación: ${error.message}`);
      return;
    }

    setError('');
    fetchVehiculos();
  };

  // Los vehículos destacados son los que aparecen en la portada. No había
  // ninguna forma de marcarlos: el alta los creaba siempre en false.
  const handleToggleDestacado = async (id: string, destacado: boolean) => {
    const { error } = await supabase.from('vehiculos').update({ destacado: !destacado }).eq('id', id);

    if (error) {
      setError(`No se pudo cambiar el destacado: ${error.message}`);
      return;
    }

    setError('');
    fetchVehiculos();
  };

  // Vender un auto no debe borrar su ficha: el link que circula por WhatsApp
  // tiene que seguir abriendo y mostrar el cartel "Vendido". El catálogo ya
  // filtra por estado, así que basta con poder cambiarlo.
  const handleEstado = async (id: string, estado: string) => {
    const { error } = await supabase.from('vehiculos').update({ estado }).eq('id', id);

    if (error) {
      setError(`No se pudo cambiar el estado: ${error.message}`);
      return;
    }

    setError('');
    fetchVehiculos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este vehículo?')) return;

    // Borrar el vehículo hace CASCADE sobre vehiculo_imagenes, pero no toca los
    // archivos: hay que sacarlos del bucket antes o quedan huérfanos para siempre.
    const { data: imagenes } = await supabase
      .from('vehiculo_imagenes')
      .select('storage_path')
      .eq('vehiculo_id', id);

    if (imagenes && imagenes.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('vehiculos')
        .remove(imagenes.map(({ storage_path }) => storage_path));

      if (storageError) {
        setError(`No se pudieron eliminar las fotos: ${storageError.message}`);
        return;
      }
    }

    const { error } = await supabase.from('vehiculos').delete().eq('id', id);

    if (error) {
      setError(`No se pudo eliminar el vehículo: ${error.message}`);
      return;
    }

    setError('');
    fetchVehiculos();
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Collins Motors Admin</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <LogOut size={20} />
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg whitespace-pre-line">
            {error}
          </div>
        )}

        <div className="mb-8 flex gap-4">
          <Link
            href="/admin/vehiculos/nuevo"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
          >
            <Plus size={20} />
            Nuevo vehículo
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vehículo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Precio</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Publicado</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Portada</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehiculos.map((v) => (
                  <tr key={v.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900">
                          {v.marca} {v.modelo} {v.anio}
                        </p>
                        <p className="text-sm text-gray-600">{v.version}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">${v.precio.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={v.estado}
                        onChange={(e) => handleEstado(v.id, e.target.value)}
                        aria-label={`Estado de ${v.marca} ${v.modelo}`}
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none ${
                          v.estado === 'disponible'
                            ? 'bg-green-100 text-green-800'
                            : v.estado === 'reservado'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="disponible">Disponible</option>
                        <option value="reservado">Reservado</option>
                        <option value="vendido">Vendido</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(v.id, v.publicado)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-bold ${
                          v.publicado
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {v.publicado ? <Eye size={16} /> : <EyeOff size={16} />}
                        {v.publicado ? 'Publicado' : 'Borrador'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleDestacado(v.id, v.destacado)}
                        title={v.destacado ? 'Quitar de la portada' : 'Mostrar en la portada'}
                        aria-pressed={v.destacado}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-bold ${
                          v.destacado
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Star size={16} fill={v.destacado ? 'currentColor' : 'none'} />
                        {v.destacado ? 'En portada' : 'No'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/vehiculos/${v.id}/editar`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {vehiculos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No hay vehículos registrados aún</p>
              <Link
                href="/admin/vehiculos/nuevo"
                className="text-blue-600 hover:text-blue-700 font-bold"
              >
                Crear el primer vehículo →
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
