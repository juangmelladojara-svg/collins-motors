import { listarVehiculos, obtenerImagenesPrincipales } from '@/lib/vehiculos/queries';
import { SITE_URL } from '@/lib/site';
import { CONTACTO } from '@/lib/contacto';
import { CARROCERIAS, TRANSMISIONES, COMBUSTIBLES } from '@/lib/vehiculos/constantes';
import type { Vehiculo } from '@/lib/vehiculos/tipos';

export interface FilaInventario {
  vehiculo: Vehiculo;
  /** Identificador estable. El slug no cambia una vez publicado el vehículo. */
  id: string;
  titulo: string;
  descripcion: string;
  url: string;
  /** Siempre presente: sin foto el vehículo no llega a formar una fila. */
  imagen: string;
}

/**
 * Fila normalizada por vehículo, base de todos los feeds de anuncios.
 *
 * Se apoya en listarVehiculos(), que ya filtra `publicado = true` y
 * `estado = 'disponible'`. Esa es la garantía de que un auto marcado como
 * vendido desaparece de los feeds en el siguiente refresco, sin que nadie
 * tenga que acordarse de sacarlo de ninguna plataforma.
 */
export async function filasDeInventario(): Promise<FilaInventario[]> {
  const vehiculos = await listarVehiculos();

  // Una sola consulta para las fotos de todo el inventario, no una por auto.
  const fotos = await obtenerImagenesPrincipales(vehiculos.map((v) => v.id));

  return vehiculos.flatMap((vehiculo) => {
    const imagen = fotos[vehiculo.id]?.url;

    // Meta y Google rechazan cualquier fila sin imagen, y las filas rechazadas
    // penalizan la salud del feed completo. Es preferible que un auto sin fotos
    // no se anuncie a que ensucie el catálogo entero.
    if (!imagen) return [];

    const titulo = [vehiculo.marca, vehiculo.modelo, vehiculo.anio, vehiculo.version]
      .filter(Boolean)
      .join(' ');

    return [
      {
        vehiculo,
        id: vehiculo.slug,
        titulo,
        descripcion: descripcionDeAnuncio(vehiculo),
        url: `${SITE_URL}/vehiculo/${vehiculo.slug}`,
        imagen,
      },
    ];
  });
}

/**
 * Las plataformas muestran este texto bajo la foto. La descripción cargada por
 * el vendedor manda; si está vacía se arma una con los datos de la ficha, para
 * no publicar un anuncio sin texto.
 */
function descripcionDeAnuncio(v: Vehiculo): string {
  const propia = v.descripcion?.trim();
  if (propia) return propia;

  const partes = [
    `${v.marca} ${v.modelo} ${v.anio}`,
    `${v.kilometraje.toLocaleString('es-CL')} km`,
    TRANSMISIONES[v.transmision] ?? v.transmision,
    COMBUSTIBLES[v.combustible] ?? v.combustible,
  ];

  return `${partes.join(' · ')}. Disponible en Collins Motors, ${v.ubicacion || CONTACTO.ciudad}.`;
}

/** Etiqueta legible de carrocería, para el campo body_style de Meta. */
export function carroceriaLegible(v: Vehiculo): string {
  return CARROCERIAS[v.carroceria] ?? v.carroceria;
}

/** Escapa un valor para CSV: comillas dobles, comas y saltos de línea. */
export function celdaCSV(valor: string | number | undefined | null): string {
  if (valor === undefined || valor === null) return '';
  const texto = String(valor);
  if (/[",\r\n]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
}

/** Arma un CSV completo a partir de encabezados y filas. */
export function construirCSV(encabezados: string[], filas: (string | number | undefined)[][]): string {
  const lineas = [encabezados.map(celdaCSV).join(',')];
  for (const fila of filas) {
    lineas.push(fila.map(celdaCSV).join(','));
  }
  // BOM para que Excel abra bien los acentos si alguien revisa el feed a mano.
  return `﻿${lineas.join('\r\n')}\r\n`;
}

/**
 * Cabeceras comunes de los feeds. Se sirven con caché de CDN corta: las
 * plataformas los descargan una o dos veces al día, y media hora de desfase
 * es preferible a golpear la base en cada descarga.
 */
export const CABECERAS_CSV = {
  'Content-Type': 'text/csv; charset=utf-8',
  'Cache-Control': 'public, max-age=0, s-maxage=1800, stale-while-revalidate=3600',
};
