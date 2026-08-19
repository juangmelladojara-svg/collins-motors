'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-2xl text-primary">
          Collins Motors
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-primary transition-colors font-medium text-sm"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/56912345678?text=Hola%2C%20me%20interesa%20conocer%20los%20veh%C3%ADculos%20disponibles"
            className="hidden sm:inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition text-sm font-semibold"
          >
            WhatsApp
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-t border-border py-4">
          <div className="container mx-auto px-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-foreground hover:text-primary font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/56912345678?text=Hola%2C%20me%20interesa%20conocer%20los%20veh%C3%ADculos%20disponibles"
              className="block w-full px-4 py-2 bg-primary text-white rounded-lg text-center font-semibold mt-4"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
