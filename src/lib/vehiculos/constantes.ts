import type { Carroceria, Transmision, Combustible } from './tipos';

export const CARROCERIAS: Record<Carroceria, string> = {
  sedan: 'Sedán',
  suv: 'SUV',
  pickup: 'Pickup',
  hatchback: 'Hatchback',
  camioneta: 'Camioneta',
  furgon: 'Furgón',
  coupe: 'Coupé',
  station_wagon: 'Station Wagon',
};

export const CARROCERIA_VALORES = Object.keys(CARROCERIAS) as Carroceria[];

export const TRANSMISIONES: Record<Transmision, string> = {
  manual: 'Manual',
  automatica: 'Automática',
};

export const TRANSMISION_VALORES = Object.keys(TRANSMISIONES) as Transmision[];

export const COMBUSTIBLES: Record<Combustible, string> = {
  bencina: 'Bencina',
  diesel: 'Diésel',
  electrico: 'Eléctrico',
  hibrido: 'Híbrido',
};

export const COMBUSTIBLE_VALORES = Object.keys(COMBUSTIBLES) as Combustible[];

export const RANGO_AÑOS = {
  min: 1980,
  max: new Date().getFullYear(),
};

export const RANGO_PRECIOS = {
  min: 0,
  max: 100_000_000, // 100 millones CLP
};
