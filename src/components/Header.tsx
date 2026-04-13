"use client";

import Image from "next/image";
import React from "react";

export function Header() {
  return (
    <header className="bg-dark border-b border-primary/20 sticky top-0 z-50">
      <div className="container py-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="BoraVer"
            width={180}
            height={48}
            className="h-10 w-auto sm:h-12"
            priority
          />
        </div>

        <div className="mt-3 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Descubra o que assistir
          </h1>
          <p className="text-sm sm:text-base text-gray-300 mt-1">
            Cansado de ficar escolhendo entre mil opções? Deixe a gente sortear
            para você!
          </p>
        </div>
      </div>
    </header>
  );
}
