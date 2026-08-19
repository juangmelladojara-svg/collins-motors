import { Metadata } from 'next';
import { VEHICULOS_MOCK } from '@/lib/vehiculos/datos-mock';

export const metadata: Metadata = {
  title: 'Dashboard | Collins Motors Admin',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  // TODO: En Fase 3, cargar datos reales de Supabase
  const vehiculos = VEHICULOS_MOCK;

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <a
            href="/admin/vehiculos/nuevo"
            className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-hover transition"
          >
            + Nuevo Vehículo
          </a>
        </div>

        {/* Estadísticas - placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-semibold text-muted-foreground">Total Vehículos</h3>
            <p className="text-3xl font-bold mt-2">{vehiculos.length}</p>
          </div>
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-semibold text-muted-foreground">Destacados</h3>
            <p className="text-3xl font-bold mt-2">
              {vehiculos.filter((v) => v.destacado).length}
            </p>
          </div>
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-semibold text-muted-foreground">Vendidos</h3>
            <p className="text-3xl font-bold mt-2">
              {vehiculos.filter((v) => v.estado === 'vendido').length}
            </p>
          </div>
        </div>

        {/* Tabla de vehículos - placeholder */}
        <div className="bg-white dark:bg-muted rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Vehículo</th>
                <th className="px-6 py-3 text-left font-semibold">Estado</th>
                <th className="px-6 py-3 text-left font-semibold">Precio</th>
                <th className="px-6 py-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map((vehiculo) => (
                <tr key={vehiculo.id} className="border-t border-border hover:bg-muted">
                  <td className="px-6 py-4">
                    {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        vehiculo.estado === 'disponible'
                          ? 'bg-green-100 text-green-800'
                          : vehiculo.estado === 'vendido'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {vehiculo.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">${vehiculo.precio.toLocaleString()}</td>
                  <td className="px-6 py-4 space-x-2">
                    <a
                      href={`/admin/vehiculos/${vehiculo.id}/editar`}
                      className="text-primary hover:underline text-sm"
                    >
                      Editar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
