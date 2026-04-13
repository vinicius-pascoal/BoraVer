"use client";

import React from "react";

export function Header() {
  return (
    <header className="bg-dark border-b border-primary/20 sticky top-0 z-50">
      <div className="container py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center font-bold text-lg">
            BV
          </div>
          <h1 className="text-2xl font-bold text-white">BoraVer</h1>
        </div>
        <p className="text-sm text-gray-400 hidden sm:block">
          Descubra o que assistir 🎬
        </p>
      </div>
    </header>
  );
}
