"use client";

import Image from "next/image";
import React from "react";

export function Header() {
  return (
    <header className="bg-dark border-b border-primary/20 sticky top-0 z-50">
      <div className="container py-4 flex items-center justify-between">
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
      </div>
    </header>
  );
}
