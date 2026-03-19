import { ItemType, Branch } from './types';

export const BRANCHES: Branch[] = [
  {
    id: 'vallarta',
    name: 'Sucursal Av. Vallarta',
    units: [
      { id: 'v-1.75', name: 'Bodega 1.75 m²', width: 1.45, length: 1.2, height: 1.3 },
      { id: 'v-3.5', name: 'Bodega 3.5 m²', width: 2.44, length: 1.45, height: 2.78 },
      { id: 'v-7', name: 'Bodega 7 m²', width: 2.44, length: 2.86, height: 2.78 },
      { id: 'v-10', name: 'Bodega 10 m²', width: 2.44, length: 4, height: 2.78 },
      { id: 'v-15', name: 'Bodega 15 m²', width: 2.44, length: 6, height: 2.78 },
      { id: 'v-30', name: 'Bodega 30 m²', width: 2.44, length: 12, height: 2.78 },
      { id: 'v-oficina', name: 'Bodega con Oficina', width: 2.44, length: 8.6, height: 2.78 },
    ],
  },
  {
    id: 'zona-real',
    name: 'Sucursal Zona Real',
    units: [
      { id: 'zr-3.5', name: 'Bodega 3.5 m²', width: 2.44, length: 1.5, height: 2.78 },
      { id: 'zr-7', name: 'Bodega 7 m²', width: 2.44, length: 2.86, height: 2.78 },
      { id: 'zr-8', name: 'Bodega 8 m²', width: 2.44, length: 3.3, height: 2.78 },
      { id: 'zr-9', name: 'Bodega 9 m²', width: 2.44, length: 3.8, height: 2.78 },
      { id: 'zr-11', name: 'Bodega 11 m²', width: 2.44, length: 4.6, height: 2.78 },
      { id: 'zr-15', name: 'Bodega 15 m²', width: 2.44, length: 6, height: 2.78 },
      { id: 'zr-30', name: 'Bodega 30 m²', width: 2.44, length: 12, height: 2.78 },
    ],
  },
  {
    id: 'punto-sur',
    name: 'Sucursal Punto Sur',
    units: [
      { id: 'ps-3.5', name: 'Bodega 3.5 m²', width: 1.5, length: 2.44, height: 2.78 },
      { id: 'ps-7', name: 'Bodega 7 m²', width: 2.44, length: 2.86, height: 2.78 },
      { id: 'ps-10', name: 'Bodega 10 m²', width: 2.44, length: 4, height: 2.78 },
      { id: 'ps-15', name: 'Bodega 15 m²', width: 2.44, length: 6, height: 2.78 },
      { id: 'ps-30', name: 'Bodega 30 m²', width: 2.44, length: 12, height: 2.78 },
    ],
  },
  {
    id: 'bucerias',
    name: 'Sucursal Bucerías',
    units: [
      { id: 'b-3.5', name: 'Bodega 3.5 m²', width: 2.44, length: 1.5, height: 2.78 },
      { id: 'b-7', name: 'Bodega 7 m²', width: 2.44, length: 2.86, height: 2.78 },
      { id: 'b-10', name: 'Bodega 10 m²', width: 2.44, length: 4, height: 2.78 },
      { id: 'b-15', name: 'Bodega 15 m²', width: 2.44, length: 6, height: 2.78 },
      { id: 'b-30', name: 'Bodega 30 m²', width: 2.44, length: 12, height: 2.78 },
      { id: 'b-oficina', name: 'Bodega con Oficina', width: 2.44, length: 8.6, height: 2.78 },
    ],
  },
];

export const ITEM_TYPES: ItemType[] = [
  { id: 'box', name: 'Caja Estándar', width: 0.5, length: 0.5, height: 0.5, color: '#fbbf24', iconName: 'Package' },
  { id: 'sofa', name: 'Sillón 3 Plazas', width: 2.2, length: 0.9, height: 0.9, color: '#f87171', iconName: 'Sofa' },
  { id: 'chair', name: 'Silla', width: 0.5, length: 0.5, height: 1.0, color: '#60a5fa', iconName: 'Armchair' },
  { id: 'table', name: 'Mesa de Comedor', width: 1.6, length: 0.9, height: 0.8, color: '#34d399', iconName: 'Table' },
  { id: 'cabinet', name: 'Archivero', width: 0.5, length: 0.6, height: 1.3, color: '#a78bfa', iconName: 'Archive' },
  { id: 'bike', name: 'Bicicleta', width: 1.8, length: 0.6, height: 1.0, color: '#9ca3af', iconName: 'Bike' },
  { id: 'fridge', name: 'Refrigerador', width: 0.8, length: 0.8, height: 1.8, color: '#e2e8f0', iconName: 'Refrigerator' },
  { id: 'bed', name: 'Cama Matrimonial', width: 1.4, length: 1.9, height: 0.6, color: '#f472b6', iconName: 'Bed' },
];

export const PIXELS_PER_METER = 80;
