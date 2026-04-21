"use client";

import Link from "next/link";
import React from "react";

interface FooterProps {
  onOpenAbout?: () => void;
}

export function Footer({ onOpenAbout }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark border-t border-primary/20 mt-8">
      <div className="max-w-8xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-gray-400">
              © {currentYear} BoraVer. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Dados fornecidos por{" "}
              <Link
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                The Movie Database (TMDB)
              </Link>
            </p>
          </div>

          <div className="flex gap-6">
            <Link
              href="https://github.com/vinicius-pascoal/BoraVer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              GitHub
            </Link>
            <button
              type="button"
              onClick={onOpenAbout}
              className="text-gray-400 hover:text-primary transition-colors"
            >
              Sobre
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
