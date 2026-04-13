"use client";

import React, { useState, useCallback } from "react";
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
    <div className="min-h-screen flex flex-col bg-darker text-white">
      <Header />

      <main className="flex-1 container py-12">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Descubra o que assistir
            </h2>
            <p className="text-gray-300 text-lg">
              Cansado de ficar escolhendo entre mil opções? Deixe a gente
              sortear para você!
            </p>
          </div>

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
                  className="w-full mt-6 bg-gradient-to-r from-primary to-purple-400 hover:from-primary/80 hover:to-purple-400/80 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all disabled:opacity-50 shadow-lg hover:shadow-primary/50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">Carregando...</span>
                      <span className="animate-spin">⚡</span>
                    </span>
                  ) : (
                    "🎬 SORTEAR"
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
                <ContentCard
                  content={content}
                  onSortearAgain={fetchRandomContent}
                  isLoading={isLoading}
                />
              ) : (
                <div className="bg-dark rounded-lg border border-primary/20 p-12 text-center">
                  <p className="text-gray-400 text-lg mb-4">
                    Aplique seus filtros e clique em{" "}
                    <span className="text-primary font-semibold">"SORTEAR"</span>{" "}
                    para descobrir algo para assistir
                  </p>
                  <div className="text-4xl">🍿</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
