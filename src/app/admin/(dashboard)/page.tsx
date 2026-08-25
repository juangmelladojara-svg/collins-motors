'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Vehiculo } from '@/lib/vehiculos/tipos';
import { LogOut, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
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

    if (error) {
      console.error(error);
      return;
    }

    setVehiculos(data || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const handleTogglePublish = async (id: string, publicado: boolean) => {
    const { error } = await supabase.from('vehiculos').update({ publicado: !publicado }).eq('id', id);

    if (!error) {
      fetchVehiculos();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este vehículo?')) return;

    const { error } = await supabase.from('vehiculos').delete().eq('id', id);

    if (!error) {
      fetchVehiculos();
    }
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
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          v.estado === 'disponible'
                            ? 'bg-green-100 text-green-800'
                            : v.estado === 'reservado'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {v.estado}
                      </span>
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
