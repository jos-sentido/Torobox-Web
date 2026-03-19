export type Piso = 'alta' | 'baja';

export interface Bodega {
  id: string;
  label: string;
  area?: number;
  precios: Partial<Record<Piso, number>>;
}

export interface Sucursal {
  id: string;
  nombre: string;
  bodegas: Bodega[];
}

export const SUCURSALES: Sucursal[] = [
  {
    id: 'vallarta',
    nombre: 'Av. Vallarta',
    bodegas: [
      { id: '1.75', label: '1.75 m²', area: 1.75, precios: { alta: 900, baja: 750 } },
      { id: '3.5',  label: '3.5 m²',  area: 3.5,  precios: { baja: 1700 } },
      { id: '7',    label: '7 m²',    area: 7,    precios: { alta: 3150, baja: 2940 } },
      { id: '10',   label: '10 m²',   area: 10,   precios: { alta: 4050, baja: 3780 } },
      { id: '15',   label: '15 m²',   area: 15,   precios: { alta: 6750, baja: 6300 } },
      { id: '30',   label: '30 m²',   area: 30,   precios: { alta: 13500 } },
      { id: 'oficina', label: 'Bodega con Oficina', precios: { baja: 20416 } },
    ],
  },
  {
    id: 'zona-real',
    nombre: 'Zona Real',
    bodegas: [
      { id: '3.5',  label: '3.5 m²',  area: 3.5,  precios: { alta: 1800, baja: 1700 } },
      { id: '7',    label: '7 m²',    area: 7,    precios: { alta: 3150, baja: 2940 } },
      { id: '8',    label: '8 m²',    area: 8,    precios: { alta: 3600, baja: 3360 } },
      { id: '9',    label: '9 m²',    area: 9,    precios: { alta: 4050, baja: 3780 } },
      { id: '11',   label: '11 m²',   area: 11,   precios: { alta: 4950, baja: 4620 } },
      { id: '15',   label: '15 m²',   area: 15,   precios: { alta: 6750, baja: 6300 } },
      { id: '30',   label: '30 m²',   area: 30,   precios: { baja: 13500 } },
    ],
  },
  {
    id: 'punto-sur',
    nombre: 'Punto Sur',
    bodegas: [
      { id: '3.5',  label: '3.5 m²',  area: 3.5,  precios: { alta: 1700, baja: 1505 } },
      { id: '7',    label: '7 m²',    area: 7,    precios: { alta: 3150, baja: 2940 } },
      { id: '10',   label: '10 m²',   area: 10,   precios: { alta: 4050, baja: 3780 } },
      { id: '15',   label: '15 m²',   area: 15,   precios: { alta: 6750, baja: 6300 } },
      { id: '30',   label: '30 m²',   area: 30,   precios: { alta: 13500 } },
    ],
  },
  {
    id: 'bucerias',
    nombre: 'Bucerías',
    bodegas: [
      { id: '3.5',  label: '3.5 m²',  area: 3.5,  precios: { alta: 1700, baja: 1505 } },
      { id: '7',    label: '7 m²',    area: 7,    precios: { alta: 3150, baja: 2940 } },
      { id: '10',   label: '10 m²',   area: 10,   precios: { alta: 4050, baja: 3780 } },
      { id: '15',   label: '15 m²',   area: 15,   precios: { alta: 6750, baja: 6300 } },
      { id: '30',   label: '30 m²',   area: 30,   precios: { alta: 13500 } },
      { id: 'oficina', label: 'Bodega con Oficina', precios: { baja: 15000 } },
    ],
  },
];

export const PLAZOS = [
  { id: 'mensual',   label: 'Mensual',   meses: 1,  descuento: 0,    badge: null },
  { id: '3-meses',  label: '3 Meses',   meses: 3,  descuento: 0.10, badge: '10% off' },
  { id: '12-meses', label: '12 Meses',  meses: 12, descuento: 0.15, badge: '15% off' },
] as const;
