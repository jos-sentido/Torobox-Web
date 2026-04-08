export type Piso = 'alta' | 'baja';

export interface Bodega {
  id: string;
  label: string;
  area?: number;
  precios: Partial<Record<Piso, number>>;
  descuentos?: Partial<Record<string, number>>;
}

export interface Sucursal {
  id: string;
  nombre: string;
  bodegas: Bodega[];
}

const DESC_STD = { '3-6-meses': 0.10, '7-meses': 0.15, 'anualidad': 0.20 };
const DESC_ZR  = { '3-6-meses': 0.10, 'anualidad': 0.15 };
const DESC_BUC = { '3-6-meses': 0.11, '7-meses': 0.15, 'anualidad': 0.20 };
const DESC_BUC_SM = { '3-6-meses': 0.11 };

export const SUCURSALES: Sucursal[] = [
  {
    id: 'vallarta',
    nombre: 'Av. Vallarta',
    bodegas: [
      { id: '1.75', label: '1.75 m²', area: 1.75, precios: { baja: 900, alta: 750 } },
      { id: '3.5',  label: '3.5 m²',  area: 3.5,  precios: { baja: 1800, alta: 1700 } },
      { id: '7',    label: '7 m²',    area: 7,    precios: { baja: 3150, alta: 2940 }, descuentos: DESC_STD },
      { id: '10',   label: '10 m²',   area: 10,   precios: { baja: 4500, alta: 4200 }, descuentos: DESC_STD },
      { id: '15',   label: '15 m²',   area: 15,   precios: { baja: 6750, alta: 6300 }, descuentos: DESC_STD },
      { id: '30',   label: '30 m²',   area: 30,   precios: { baja: 13500 }, descuentos: DESC_STD },
      { id: 'oficina', label: 'Bodega con Oficina (30 m²)', area: 30, precios: { baja: 18000 } },
    ],
  },
  {
    id: 'zona-real',
    nombre: 'Zona Real',
    bodegas: [
      { id: '3.5',  label: '3.5 m²',  area: 3.5,  precios: { baja: 1800, alta: 1700 } },
      { id: '7',    label: '7 m²',    area: 7,    precios: { baja: 3150, alta: 2940 }, descuentos: DESC_ZR },
      { id: '8',    label: '8 m²',    area: 8,    precios: { baja: 3600, alta: 3360 }, descuentos: DESC_ZR },
      { id: '9',    label: '9 m²',    area: 9,    precios: { baja: 4050, alta: 3780 }, descuentos: DESC_ZR },
      { id: '11',   label: '11 m²',   area: 11,   precios: { baja: 4950, alta: 4620 }, descuentos: DESC_ZR },
      { id: '15',   label: '15 m²',   area: 15,   precios: { baja: 6750, alta: 6300 }, descuentos: DESC_ZR },
      { id: '30',   label: '30 m²',   area: 30,   precios: { baja: 13500 }, descuentos: DESC_ZR },
    ],
  },
  {
    id: 'punto-sur',
    nombre: 'Punto Sur',
    bodegas: [
      { id: '3.5',  label: '3.5 m²',  area: 3.5,  precios: { baja: 1700, alta: 1505 } },
      { id: '7',    label: '7 m²',    area: 7,    precios: { baja: 3150, alta: 2940 }, descuentos: DESC_STD },
      { id: '10',   label: '10 m²',   area: 10,   precios: { baja: 4500, alta: 4200 }, descuentos: DESC_STD },
      { id: '15',   label: '15 m²',   area: 15,   precios: { baja: 6750, alta: 6300 }, descuentos: DESC_STD },
      { id: '30',   label: '30 m²',   area: 30,   precios: { baja: 13500 }, descuentos: DESC_STD },
    ],
  },
  {
    id: 'bucerias',
    nombre: 'Bucerías',
    bodegas: [
      { id: '3.5',  label: '3.5 m²',  area: 3.5,  precios: { baja: 1700, alta: 1505 }, descuentos: DESC_BUC_SM },
      { id: '7',    label: '7 m²',    area: 7,    precios: { baja: 3150, alta: 2940 }, descuentos: DESC_BUC },
      { id: '10',   label: '10 m²',   area: 10,   precios: { baja: 4500, alta: 4200 }, descuentos: DESC_BUC },
      { id: '15',   label: '15 m²',   area: 15,   precios: { baja: 6750, alta: 6300 }, descuentos: DESC_BUC },
      { id: '30',   label: '30 m²',   area: 30,   precios: { baja: 13500 }, descuentos: DESC_BUC },
      { id: 'oficina', label: 'Bodega con Oficina (30 m²)', area: 30, precios: { baja: 15000 } },
    ],
  },
];

export const PLAZOS = [
  { id: 'mensual',     label: 'Mensual',      meses: 1,  badge: null },
  { id: '3-6-meses',   label: '3 – 6 Meses',  meses: 3,  badge: 'Hasta 11% off' },
  { id: '7-meses',     label: '7+ Meses',      meses: 7,  badge: '15% off' },
  { id: 'anualidad',   label: 'Anualidad',     meses: 12, badge: '20% off' },
] as const;
