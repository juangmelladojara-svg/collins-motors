import { filasDeInventario, carroceriaLegible, construirCSV, CABECERAS_CSV } from '@/lib/feeds/inventario';
import { formatCLP } from '@/lib/utils/formato';
import { TRANSMISIONES, COMBUSTIBLES } from '@/lib/vehiculos/constantes';

export const dynamic = 'force-dynamic';

/**
 * Feed de datos de negocio para remarketing dinámico de Google Ads,
 * tipo de negocio "Custom".
 *
 * No es un feed de Vehicle Ads: ese producto no opera en Chile. Google indica
 * que en países sin Shopping hay que usar business data feeds con el tipo
 * "Custom", que es exactamente esto y sí funciona acá.
 *
 * Sirve para volver a mostrarle a alguien el auto que ya miró. Las columnas
 * obligatorias son ID, Item title, Final URL e Image URL; el resto enriquece
 * el anuncio.
 *
 * El ID debe coincidir con el que el sitio le pasa a la etiqueta de Google al
 * ver una ficha; acá se usa el slug del vehículo en ambos lados.
 */
const ENCABEZADOS = [
  'ID',
  'Item title',
  'Item subtitle',
  'Item description',
  'Item category',
  'Price',
  'Final URL',
  'Image URL',
  'Contextual keywords',
];

export async function GET() {
  const filas = await filasDeInventario();

  const cuerpo = filas.map(({ vehiculo: v, id, titulo, descripcion, url, imagen }) => [
    id,
    titulo,
    `${v.kilometraje.toLocaleString('es-CL')} km · ${TRANSMISIONES[v.transmision] ?? v.transmision}`,
    descripcion,
    carroceriaLegible(v),
    // Google muestra este texto tal cual, así que va ya formateado.
    formatCLP(v.precio),
    url,
    imagen,
    // Términos con los que Google puede asociar el aviso.
    [v.marca, v.modelo, carroceriaLegible(v), COMBUSTIBLES[v.combustible] ?? v.combustible, 'Temuco']
      .filter(Boolean)
      .join(';'),
  ]);

  return new Response(construirCSV(ENCABEZADOS, cuerpo), { headers: CABECERAS_CSV });
}
