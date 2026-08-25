'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ImageOff, X } from 'lucide-react';

interface GaleriaCarouselProps {
  marca: string;
  modelo: string;
  fotos?: number;
  imageUrls?: string[];
}

export function GaleriaCarousel({ marca, modelo, imageUrls = [] }: GaleriaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);

  const images = imageUrls;
  const total = images.length;
  // Si las fotos cambian, el índice guardado puede quedar fuera de rango.
  const index = Math.min(currentIndex, Math.max(total - 1, 0));
  const actual = images[index];

  const handlePrev = () => setCurrentIndex(index === 0 ? total - 1 : index - 1);
  const handleNext = () => setCurrentIndex(index === total - 1 ? 0 : index + 1);

  if (total === 0) {
    return (
      <div className="bg-muted rounded-2xl aspect-video flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <ImageOff size={32} />
        <p className="text-sm font-medium">
          {marca} {modelo} — sin fotos por ahora
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Imagen principal */}
      <div className="relative bg-muted rounded-2xl aspect-video overflow-hidden group">
        <img
          src={actual}
          alt={`${marca} ${modelo} — foto ${index + 1} de ${total}`}
          className="w-full h-full object-cover"
          // La primera es la imagen grande del primer viewport; las demás
          // solo se cargan cuando el usuario navega hasta ellas.
          loading={index === 0 ? 'eager' : 'lazy'}
        />

        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
          {index + 1} / {total}
        </div>

        <button
          onClick={() => setShowZoom(true)}
          className="absolute bottom-3 right-3 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition md:opacity-0 md:group-hover:opacity-100"
          aria-label="Ampliar foto"
        >
          <ZoomIn size={20} />
        </button>

        {total > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-background/85 rounded-lg hover:bg-background transition md:opacity-0 md:group-hover:opacity-100"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-background/85 rounded-lg hover:bg-background transition md:opacity-0 md:group-hover:opacity-100"
              aria-label="Foto siguiente"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, i) => (
            <button
              key={image}
              onClick={() => setCurrentIndex(i)}
              className={`flex-shrink-0 h-16 w-16 rounded-lg transition-all border-2 overflow-hidden ${
                i === index ? 'border-primary' : 'border-border hover:border-primary/50'
              }`}
              aria-label={`Ver foto ${i + 1}`}
            >
              <img
                src={image}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom a pantalla completa */}
      {showZoom && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowZoom(false)}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={actual}
              alt={`${marca} ${modelo} — foto ${index + 1} de ${total}`}
              className="w-full max-h-[85vh] object-contain rounded-lg"
            />

            {total > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-lg transition text-white"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-lg transition text-white"
                  aria-label="Foto siguiente"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-lg transition text-white"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
