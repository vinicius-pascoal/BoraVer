"use client";

import Image from "next/image";
import React from "react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-primary/30 bg-gradient-to-r from-darker/95 via-dark/90 to-darker/95 shadow-lg shadow-primary/10">
      <div className="w-full max-w-8xl mx-auto px-4">
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex-shrink-0 group cursor-pointer transition-transform duration-300 hover:scale-105">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image
                src="/logo.png"
                alt="BoraVer"
                width={180}
                height={48}
                className="h-11 w-auto sm:h-13 relative"
                priority
              />
            </div>
          </div>

          {/* Title and Description */}
          <div className="flex-1 text-center sm:text-right">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight font-heading">
                Descubra o que assistir
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 font-body leading-relaxed max-w-md ml-auto">
                Cansado de ficar escolhendo entre mil opções? Deixe a gente sortear para você!
              </p>
            </div>
          </div>
        </div>

        {/* Gradient line accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>
    </header>
  );
}
