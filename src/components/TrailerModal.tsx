"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerUrl: string | null;
  trailerName?: string;
}

export function TrailerModal({
  isOpen,
  onClose,
  trailerUrl,
  trailerName,
}: TrailerModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen || !trailerUrl) {
    return null;
  }

  const modalContent = (
    <div
      className="trailer-modal-backdrop fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Trailer do conteúdo"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-violet-300/30 bg-gradient-to-b from-slate-900/95 to-slate-950/95 shadow-[0_25px_50px_rgba(0,0,0,0.8)] outline-none animate-scale-in"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-violet-300/20 bg-gradient-to-r from-violet-500/5 to-purple-500/5 px-4 py-4 sm:px-6 sm:py-5 backdrop-blur-sm">
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold text-white tracking-tight">Trailer</p>
            <p className="text-xs text-gray-400 font-medium">Assista ao vídeo em alta qualidade</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="group inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-all duration-200 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            aria-label="Fechar trailer (Esc)"
          >
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Video Container */}
        <div className="aspect-video w-full bg-black/50">
          <iframe
            src={trailerUrl}
            title={trailerName || "Trailer"}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Footer hint */}
        <div className="border-t border-white/5 bg-gradient-to-r from-black/40 to-black/20 px-4 py-2 sm:px-6 text-center">
          <p className="text-xs text-gray-500 font-medium">Pressione ESC para fechar</p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
