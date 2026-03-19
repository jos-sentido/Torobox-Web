'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const photos = [
  '/images/sucursales/zona-real/img1.jpg',
  '/images/sucursales/av-vallarta/hero2.jpg',
  '/images/sucursales/punto-sur/TOROLOPEZ.jpg',
  '/images/sucursales/bucerias/hero.jpg',
  '/images/sucursales/punto-sur/img1.jpg',
  '/images/sucursales/zona-real/img2.jpg',
  '/images/sucursales/zona-real/img3.jpg',
];

export default function GaleriaHome() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);
  const prev = useCallback(() => setLightboxIndex(i => i !== null ? (i - 1 + photos.length) % photos.length : 0), []);
  const next = useCallback(() => setLightboxIndex(i => i !== null ? (i + 1) % photos.length : 0), []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, prev, next]);

  return (
    <>
      {/* Photo grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {/* Row 1: wide featured + 2 */}
        <button
          onClick={() => open(0)}
          className="col-span-2 relative h-64 md:h-80 rounded-2xl overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
        >
          <Image src={photos[0]} alt="Instalaciones Torobox" fill className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full p-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </button>
        {[1, 2].map(i => (
          <button
            key={i}
            onClick={() => open(i)}
            className="relative h-64 md:h-80 rounded-2xl overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
          >
            <Image src={photos[i]} alt="Bodega Torobox" fill className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" sizes="(max-width: 768px) 50vw, 25vw" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full p-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
        {/* Row 2: 4 equal */}
        {photos.slice(3).map((src, i) => (
          <button
            key={i}
            onClick={() => open(i + 3)}
            className="relative h-48 md:h-56 rounded-2xl overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
          >
            <Image src={src} alt="Bodega Torobox" fill className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" sizes="(max-width: 768px) 50vw, 25vw" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full p-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* CTA link */}
      <div className="text-center">
        <Link href="/sucursales" className="inline-flex items-center gap-2 text-brand-red font-semibold hover:text-brand-red-hover transition-colors">
          Ver todas las sucursales
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/25 rounded-full p-2.5 transition-colors z-10"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium tabular-nums pointer-events-none">
            {lightboxIndex + 1} / {photos.length}
          </div>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 md:left-6 text-white bg-white/10 hover:bg-white/25 rounded-full p-3 transition-colors z-10"
            aria-label="Anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-16 md:mx-24"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[lightboxIndex]}
              alt="Instalaciones Torobox"
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 md:right-6 text-white bg-white/10 hover:bg-white/25 rounded-full p-3 transition-colors z-10"
            aria-label="Siguiente"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4">
            {photos.map((src, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                className={`relative w-12 h-9 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                  i === lightboxIndex ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="48px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
