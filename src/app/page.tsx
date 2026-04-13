"use client";

import React, { useState, useCallback } from "react";
import { AboutModal } from "../components/AboutModal";
import { Header } from "../components/Header";
import { FilterPanel, FilterState } from "../components/FilterPanel";
import { ContentCard } from "../components/ContentCard";
import { Footer } from "../components/Footer";

export default function Home() {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: "both",
    genres: [],
    platforms: [],
    region: "BR",
  });
  const [error, setError] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const fetchRandomContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        type: filters.type,
        genres: JSON.stringify(filters.genres),
        platforms: JSON.stringify(filters.platforms),
        region: filters.region,
      });

      if (filters.duration) {
        params.append("duration", filters.duration);
      }

      const response = await fetch(`/api/random-content?${params.toString()}`);

      if (!response.ok) {
        throw new Error(
          "Não encontramos nada com esses filtros. Tente novamente!"
        );
      }

      const data = await response.json();
      setContent(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar conteúdo"
      );
      setContent(null);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Header />

      <main className="flex-1 container py-12">
        <div className="space-y-8">
          {/* Filtros e Conteúdo */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar de Filtros */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <FilterPanel
                  onFiltersChange={handleFilterChange}
                  isLoading={isLoading}
                />

                <button
                  onClick={fetchRandomContent}
                  disabled={isLoading}
                  className="group w-full mt-6 rounded-xl border border-violet-300/35 bg-gradient-to-r from-violet-500/85 to-purple-500/85 hover:from-violet-400 hover:to-purple-400 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3.5 px-5 text-base transition-all disabled:opacity-50 shadow-[0_10px_28px_rgba(139,92,246,0.35)] hover:shadow-[0_14px_34px_rgba(139,92,246,0.45)]"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">Buscando sugestão...</span>
                      <span className="animate-spin">◌</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/20 ring-1 ring-white/20 transition-transform group-hover:rotate-12">
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-white"
                        >
                          <path
                            d="M8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3Z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          />
                          <circle cx="8" cy="8" r="1.25" fill="currentColor" />
                          <circle cx="12" cy="12" r="1.25" fill="currentColor" />
                          <circle cx="16" cy="16" r="1.25" fill="currentColor" />
                        </svg>
                      </span>
                      <span>SORTEAR AGORA</span>
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Resultado */}
            <div className="lg:col-span-2">
              {error && (
                <div className="bg-red-900/20 border border-red-500 text-red-200 px-6 py-4 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {content ? (
                <ContentCard key={`${content.media_type}-${content.id}`} content={content} />
              ) : (
                <div className="bg-dark rounded-lg border border-primary/20 p-12 text-center">
                  <p className="text-gray-400 text-lg mb-4">
                    Aplique seus filtros e clique em{" "}
                    <span className="text-primary font-semibold">SORTEAR</span>{" "}
                    para descobrir algo para assistir
                  </p>
                  <div className="text-4xl">🍿</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer onOpenAbout={() => setIsAboutOpen(true)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
