"use client";

import Link from "next/link";
import React, { useEffect } from "react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-xl rounded-2xl border border-violet-200/20 bg-[#0d0a14]/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="about-modal-title" className="text-2xl font-bold text-white">
              Sobre o BoraVer
            </h2>
            <p className="mt-1 text-sm text-violet-100/85">
              Descubra filmes e series sem perder tempo escolhendo.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-violet-200/30 bg-white/10 text-gray-100 transition-colors hover:bg-white/20"
          >
            X
          </button>
        </div>

        <div className="mt-5 space-y-4 rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-gray-100">
          <p>
            O BoraVer nasceu para resolver um problema simples: abrir os streamings,
            passar varios minutos escolhendo e, no fim, nao assistir nada.
          </p>
          <p>
            Com poucos filtros, voce recebe uma sugestao rapida com poster, sinopse,
            genero, duracao e plataformas disponiveis, tudo em uma unica tela.
          </p>
          <p className="font-medium text-violet-100">
            Desenvolvido por:{" "}
            <Link
              href="https://github.com/vinicius-pascoal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-200 underline underline-offset-2 hover:text-violet-100"
            >
              Vinicius Pascoal
            </Link>
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-violet-300/45 bg-gradient-to-r from-violet-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-violet-400 hover:to-purple-400"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
