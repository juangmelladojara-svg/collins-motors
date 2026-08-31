'use client';

import { track } from '@vercel/analytics';
import type { ReactNode } from 'react';

interface BotonWhatsAppProps {
  href: string;
  vehiculo: string;
  precio: number;
  origen: 'ficha' | 'ficha-mobile' | 'catalogo';
  className?: string;
  'aria-label'?: string;
  children: ReactNode;
}

/**
 * Envoltura del CTA de WhatsApp que además registra el clic.
 *
 * Es el único punto donde el sitio puede medir intención de compra: después de
 * esto la conversación se va al teléfono del vendedor y no vuelve. Saber qué
 * vehículo la generó es lo que permite decidir qué destacar y qué rebajar.
 */
export function BotonWhatsApp({
  href,
  vehiculo,
  precio,
  origen,
  className,
  children,
  ...props
}: BotonWhatsAppProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={props['aria-label']}
      onClick={(e) => {
        e.stopPropagation();
        track('consulta_whatsapp', { vehiculo, precio, origen });
      }}
    >
      {children}
    </a>
  );
}
