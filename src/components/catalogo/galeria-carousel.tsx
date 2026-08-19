'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface GaleriaCarouselProps {
  marca: string;
  modelo: string;
  fotos?: number;
  imageUrls?: string[];
}

export function GaleriaCarousel({ marca, modelo, fotos = 8, imageUrls = [] }: GaleriaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);

  // Usar URLs reales si están disponibles, sino usar placeholders
  const images = imageUrls.length > 0 ? imageUrls : Array.from({ length: fotos }, (_, i) => i + 1);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Imagen principal */}
      <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl aspect-video overflow-hidden group cursor-pointer">
        {typeof images[currentIndex] === 'string' && images[currentIndex].startsWith('data:') ? (
          <img
            src={images[currentIndex] as string}
            alt={`${marca} ${modelo} - Foto ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Foto {currentIndex + 1} — {marca} {modelo}
          </div>
        )}

        {/* Badge de cantidad de fotos */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
          {currentIndex + 1} / {fotos}
        </div>

        {/* Botón zoom */}
        <button
          onClick={() => setShowZoom(true)}
          className="absolute bottom-3 right-3 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition opacity-0 group-hover:opacity-100"
          aria-label="Zoom"
        >
          <ZoomIn size={20} />
        </button>

        {/* Flechas de navegación */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-zinc-900/80 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition opacity-0 group-hover:opacity-100"
          aria-label="Anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-zinc-900/80 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition opacity-0 group-hover:opacity-100"
          aria-label="Siguiente"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Miniaturas */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`flex-shrink-0 h-16 w-16 rounded-lg transition-all border-2 overflow-hidden ${
              index === currentIndex
                ? 'border-primary'
                : 'border-border hover:border-primary/50'
            }`}
          >
            {typeof image === 'string' && image.startsWith('data:') ? (
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-slate-100 dark:bg-zinc-800">
                {index + 1}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox/Zoom Modal */}
      {showZoom && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowZoom(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-white text-center">
              Foto {currentIndex + 1} — {marca} {modelo}
            </div>

            {/* Flechas en modal */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-lg transition text-white"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-lg transition text-white"
            >
              <ChevronRight size={28} />
            </button>

            {/* Cerrar */}
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
