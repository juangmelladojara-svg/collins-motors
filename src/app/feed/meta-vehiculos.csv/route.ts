import { filasDeInventario, carroceriaLegible, construirCSV, CABECERAS_CSV } from '@/lib/feeds/inventario';
import { CONTACTO } from '@/lib/contacto';
import { TRANSMISIONES, COMBUSTIBLES } from '@/lib/vehiculos/constantes';

export const dynamic = 'force-dynamic';

/**
 * Catálogo de vehículos para Meta Automotive Inventory Ads.
 *
 * Formato CSV en vez de XML a propósito: Meta acepta CSV, TSV, RSS y Atom, y
 * varios campos del catálogo de autos son compuestos (mileage.value con su
 * unidad, la dirección desglosada). En CSV son columnas planas con nombre
 * documentado; en XML habría que inventar la anidación.
 *
 * Los encabezados van en inglés porque Meta lo exige.
 *
 * Solo entran vehículos publicados y disponibles: filasDeInventario() se apoya
 * en el filtro que ya vive en las consultas del catálogo, así que marcar un
 * auto como vendido lo saca del feed en el siguiente refresco.
 */
const ENCABEZADOS = [
  'vehicle_id',
  'title',
  'description',
  'url',
  'image_url',
  'price',
  'state_of_vehicle',
  'availability',
  'make',
  'model',
  'year',
  'mileage.value',
  'mileage.unit',
  'transmission',
  'fuel_type',
  'body_style',
  'exterior_color',
  'vin',
  'dealer_name',
  'dealer_phone',
  'address.addr1',
  'address.city',
  'address.region',
  'address.country',
];

export async function GET() {
  const filas = await filasDeInventario();

  const cuerpo = filas.map(({ vehiculo: v, id, titulo, descripcion, url, imagen }) => [
    id,
    titulo,
    descripcion,
    url,
    imagen,
    // Meta espera el monto con la moneda en el mismo campo.
    `${v.precio} CLP`,
    // Collins Motors vende usados; no hay stock nuevo que distinguir.
    'used',
    // Único valor posible aquí: el feed ya excluye reservados y vendidos.
    'available',
    v.marca,
    v.modelo,
    v.anio,
    v.kilometraje,
    'KM',
    TRANSMISIONES[v.transmision] ?? v.transmision,
    COMBUSTIBLES[v.combustible] ?? v.combustible,
    carroceriaLegible(v),
    v.color ?? '',
    // Opcional: un vehículo sin VIN cargado entra igual, solo pierde precisión.
    v.vin ?? '',
    'Collins Motors',
    v.vendedor_telefono || CONTACTO.telefono,
    v.ubicacion || CONTACTO.direccion,
    'Temuco',
    'La Araucanía',
    'CL',
  ]);

  return new Response(construirCSV(ENCABEZADOS, cuerpo), { headers: CABECERAS_CSV });
}
