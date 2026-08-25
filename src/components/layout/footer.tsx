import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 dark:bg-black text-white border-t border-zinc-800">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Collins Motors</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tu automotora de confianza en Temuco. Vehículos usados de calidad con financiamiento disponible.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-white transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-white transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-slate-400">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <span>(45) 2123 4567</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <a href="mailto:info@collinsmotors.cl" className="hover:text-white transition-colors">
                  info@collinsmotors.cl
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Temuco, La Araucanía, Chile</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800 py-8">
          {/* CTA */}
          <div className="text-center mb-8">
            <a
              href="https://wa.me/56961511074?text=Hola%2C%20me%20interesa%20conocer%20los%20veh%C3%ADculos%20disponibles"
              className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors"
            >
              Contactar por WhatsApp
            </a>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-slate-500">
            © {year} Collins Motors. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
