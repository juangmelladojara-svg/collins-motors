import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | Collins Motors Admin',
  description: 'Portal de administración de Collins Motors',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
      <div className="bg-white dark:bg-muted rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Collins Motors Admin</h1>

        {/* Formulario de login - placeholder */}
        <form className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-hover transition"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Contacta al administrador si olvidaste tu contraseña.
        </p>
      </div>
    </main>
  );
}
