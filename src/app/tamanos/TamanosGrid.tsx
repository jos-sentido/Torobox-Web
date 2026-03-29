'use client';

import { useState, useMemo } from 'react';
import Button from '@/components/Button';
import { SUCURSALES } from '@/data/sucursales';

const fmt = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

const TAMANO_INFO: Record<string, { title: string; caben: string; recomendado: string }> = {
  '1.75': {
    title: 'Mini Bodega Estándar',
    caben: 'Cajas pequeñas, archivo muerto, maletas, bicicletas, decoraciones de temporada.',
    recomendado: 'Ideal para liberar espacio de clósets en casa o pequeños excedentes de oficina.',
  },
  '3.5': {
    title: 'Bodega Chica',
    caben: 'Muebles de una recámara pequeña, electrodomésticos, cajas medianas.',
    recomendado: 'Equivalente a la capacidad de una van de carga. Perfecto para remodelaciones.',
  },
  '7': {
    title: 'Bodega Mediana',
    caben: 'Muebles de un departamento de 1-2 recámaras, sofás, colchones, comedor.',
    recomendado: 'Excelente para mudanzas de departamentos pequeños o inventario medio de negocio.',
  },
  '8': {
    title: 'Bodega Mediana Plus',
    caben: 'Similar a 7 m² con espacio extra para cajas adicionales o equipo.',
    recomendado: 'Para mudanzas medianas o inventario de negocio pequeño con margen extra.',
  },
  '9': {
    title: 'Bodega Semi-Amplia',
    caben: 'Muebles de un departamento de 2 recámaras, equipo de oficina.',
    recomendado: 'Ideal para mudanzas medianas o inventario de negocio en crecimiento.',
  },
  '10': {
    title: 'Bodega Amplia',
    caben: 'Contenido de una casa de 2-3 recámaras, archivo masivo, equipo de trabajo.',
    recomendado: 'Optimo para pequeños negocios de e-commerce y empresas de construcción.',
  },
  '11': {
    title: 'Bodega Amplia Plus',
    caben: 'Muebles de casa de 2-3 recámaras con espacio para inventario adicional.',
    recomendado: 'Para negocios que necesitan algo más que 10 m² sin llegar a 15 m².',
  },
  '15': {
    title: 'Bodega Grande',
    caben: 'Muebles de una casa de 3-4 recámaras, inventario de tienda, maquinaria.',
    recomendado: 'Ideal para comerciantes, exceso de mercancía y contratistas.',
  },
  '30': {
    title: 'Bodega Industrial / Comercial',
    caben: 'Inventario corporativo, vehículos pequeños, mudanzas masivas, material pesado.',
    recomendado: 'Nuestra solución más grande, diseñada para logística de empresas o gran volumen.',
  },
};

export default function TamanosGrid() {
  const [sucursalId, setSucursalId] = useState('');

  const sucursal = SUCURSALES.find(s => s.id === sucursalId);

  // Build the list of bodegas to show
  const bodegas = useMemo(() => {
    if (sucursal) {
      // Filter: only non-oficina bodegas for this sucursal
      return sucursal.bodegas
        .filter(b => b.id !== 'oficina')
        .map(b => {
          const precios = Object.values(b.precios).filter(Boolean) as number[];
          const min = Math.min(...precios);
          const max = Math.max(...precios);
          const info = TAMANO_INFO[b.id];
          const maxDesc = b.descuentos
            ? Math.max(...Object.values(b.descuentos).filter(Boolean) as number[])
            : 0;
          return { ...b, min, max, info, maxDesc, hasBothPisos: precios.length > 1 };
        });
    }
    // Default: show all unique sizes from TAMANO_INFO
    return Object.entries(TAMANO_INFO).map(([id, info]) => ({
      id,
      label: `${id} m²`,
      area: parseFloat(id),
      info,
      min: null as number | null,
      max: null as number | null,
      maxDesc: 0,
      hasBothPisos: false,
      precios: {} as Record<string, number>,
    }));
  }, [sucursal]);

  return (
    <>
      {/* Selector de sucursal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 flex flex-col sm:flex-row items-center gap-4">
          <label className="text-sm font-bold text-brand-black whitespace-nowrap">Filtrar por sucursal:</label>
          <select
            value={sucursalId}
            onChange={e => setSucursalId(e.target.value)}
            className="w-full sm:w-auto flex-1 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
          >
            <option value="">Todas las sucursales</option>
            {SUCURSALES.map(s => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
          {sucursal && (
            <span className="text-xs text-gray-500">
              {bodegas.length} tamaño{bodegas.length !== 1 ? 's' : ''} disponible{bodegas.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Grid de tamaños */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {bodegas.map(b => {
            const info = b.info || { title: `Bodega ${b.label}`, caben: '', recomendado: '' };
            const sizeLabel = b.area ? `${b.area} m²` : b.label;

            return (
              <div key={b.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
                <div className="bg-brand-red text-white p-6 text-center">
                  <div className="text-4xl font-bold font-heading">{sizeLabel}</div>
                  <div className="text-red-100 mt-1 uppercase text-sm tracking-wide">{info.title}</div>
                  {sucursal && b.min !== null && (
                    <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
                      <span className="bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-lg">
                        Desde {fmt(b.min)}/mes
                      </span>
                      {b.maxDesc > 0 && (
                        <span className="bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded">
                          Hasta {Math.round(b.maxDesc * 100)}% off
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  {info.caben && (
                    <div className="mb-6">
                      <h3 className="font-bold text-lg mb-2 text-brand-black flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        ¿Qué objetos caben?
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{info.caben}</p>
                    </div>
                  )}
                  {info.recomendado && (
                    <div className="mb-6 flex-grow">
                      <h3 className="font-bold text-lg mb-2 text-brand-black flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Recomendado para:
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{info.recomendado}</p>
                    </div>
                  )}

                  {/* Precios por planta cuando hay sucursal seleccionada */}
                  {sucursal && b.hasBothPisos && b.min !== null && b.max !== null && (
                    <div className="mb-4 grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg py-2">
                        <p className="font-bold text-brand-black">{fmt(b.max)}</p>
                        <p className="text-gray-500">Planta Baja</p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg py-2">
                        <p className="font-bold text-brand-black">{fmt(b.min)}</p>
                        <p className="text-gray-500">Planta Alta</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto">
                    <Button
                      href={sucursal ? `/contacto?tamano=${b.id}&sucursal=${sucursalId}` : `/contacto?tamano=${b.id}`}
                      fullWidth
                      variant="primary"
                    >
                      Solicitar Información
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
