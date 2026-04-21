"use client";

import Link from "next/link";
import React from "react";

interface FooterProps {
  onOpenAbout?: () => void;
}

export function Footer({ onOpenAbout }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="sticky bottom-0 z-40 backdrop-blur-md border-t border-primary/30 bg-gradient-to-r from-darker/95 via-dark/90 to-darker/95 shadow-lg shadow-primary/10">
      {/* Gradient line accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-8xl mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright and Attribution */}
          <div className="space-y-1 text-center md:text-left">
            <p className="text-gray-300 font-body">
              © {currentYear} <span className="font-bold text-white">BoraVer</span>. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-xs font-body">
              Dados fornecidos por{" "}
              <Link
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-purple-300 transition-colors font-semibold underline underline-offset-2"
              >
                The Movie Database (TMDB)
              </Link>
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            <Link
              href="https://github.com/vinicius-pascoal/BoraVer"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative text-gray-400 hover:text-primary transition-colors font-medium text-sm"
            >
              GitHub
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-400 group-hover:w-full transition-all duration-300" />
            </Link>
            <button
              type="button"
              onClick={onOpenAbout}
              className="group relative text-gray-400 hover:text-primary transition-colors font-medium text-sm"
            >
              Sobre
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-400 group-hover:w-full transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
