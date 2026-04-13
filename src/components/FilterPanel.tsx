"use client";

import React, { useState } from "react";

export interface FilterState {
  type: "movie" | "tv" | "both";
  genres: number[];
  platforms: string[];
  region: string;
  duration?: "short" | "medium" | "long";
}

const GENRES = [
  { id: 28, name: "Ação" },
  { id: 35, name: "Comédia" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Terror" },
  { id: 878, name: "Ficção Científica" },
  { id: 10749, name: "Romance" },
  { id: 53, name: "Suspense" },
  { id: 16, name: "Animação" },
  { id: 12, name: "Aventura" },
  { id: 80, name: "Criminal" },
];

const PLATFORMS = [
  "Netflix",
  "Prime Video",
  "Disney+",
  "Max",
  "Apple TV+",
  "Globoplay",
];

const DURATIONS = [
  { value: "short", label: "Curta (até 90 min)" },
  { value: "medium", label: "Média (91-120 min)" },
  { value: "long", label: "Longa (120+ min)" },
];

interface FilterProps {
  onFiltersChange: (filters: FilterState) => void;
  isLoading?: boolean;
}

export function FilterPanel({ onFiltersChange, isLoading }: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    type: "both",
    genres: [],
    platforms: [],
    region: "BR",
    duration: undefined,
  });

  const selectedCount =
    filters.genres.length +
    filters.platforms.length +
    (filters.duration ? 1 : 0) +
    (filters.type !== "both" ? 1 : 0);

  const handleTypeChange = (type: "movie" | "tv" | "both") => {
    const newFilters = { ...filters, type };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleGenreToggle = (genreId: number) => {
    const newGenres = filters.genres.includes(genreId)
      ? filters.genres.filter((g) => g !== genreId)
      : [...filters.genres, genreId];
    const newFilters = { ...filters, genres: newGenres };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter((p) => p !== platform)
      : [...filters.platforms, platform];
    const newFilters = { ...filters, platforms: newPlatforms };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDurationChange = (
    duration: "short" | "medium" | "long" | undefined
  ) => {
    const newFilters = { ...filters, duration };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters: FilterState = {
      type: "both",
      genres: [],
      platforms: [],
      region: "BR",
      duration: undefined,
    };

    setFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <div className="bg-dark rounded-xl border border-primary/20 p-6 space-y-6 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Filtros</h3>
          <p className="text-sm text-gray-400 mt-1">
            Refine seu sorteio em segundos
          </p>
        </div>

        <div className="text-right">
          <span className="inline-flex items-center rounded-full border border-primary/50 bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            {selectedCount} selecionado{selectedCount === 1 ? "" : "s"}
          </span>
          {selectedCount > 0 && (
            <button
              onClick={clearFilters}
              disabled={isLoading}
              className="mt-2 block w-full text-xs text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tipo de conteúdo */}
      <div className="border border-white/5 rounded-xl p-4 bg-black/10">
        <h3 className="text-base font-semibold mb-3 text-white">Tipo</h3>
        <div className="flex flex-wrap gap-2">
          {(["movie", "tv", "both"] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${filters.type === type
                ? "bg-primary/20 border-primary text-white"
                : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                } disabled:opacity-50`}
            >
              {type === "movie" ? "Filmes" : type === "tv" ? "Séries" : "Ambos"}
            </button>
          ))}
        </div>
      </div>

      {/* Gêneros */}
      <div className="border border-white/5 rounded-xl p-4 bg-black/10">
        <h3 className="text-base font-semibold mb-3 text-white">Gêneros</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreToggle(genre.id)}
              disabled={isLoading}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${filters.genres.includes(genre.id)
                ? "bg-primary/20 border-primary text-white"
                : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                } disabled:opacity-50`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Plataformas */}
      <div className="border border-white/5 rounded-xl p-4 bg-black/10">
        <h3 className="text-base font-semibold mb-3 text-white">Plataformas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PLATFORMS.map((platform) => (
            <button
              key={platform}
              onClick={() => handlePlatformToggle(platform)}
              disabled={isLoading}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors text-center ${filters.platforms.includes(platform)
                ? "bg-primary/20 border-primary text-white"
                : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                } disabled:opacity-50`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* Duração (apenas para filmes) */}
      {filters.type !== "tv" && (
        <div className="border border-white/5 rounded-xl p-4 bg-black/10">
          <h3 className="text-base font-semibold mb-3 text-white">Duração</h3>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((duration) => (
              <button
                key={duration.value}
                onClick={() =>
                  handleDurationChange(
                    filters.duration === duration.value
                      ? undefined
                      : (duration.value as "short" | "medium" | "long")
                  )
                }
                disabled={isLoading}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${filters.duration === duration.value
                  ? "bg-primary/20 border-primary text-white"
                  : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                  } disabled:opacity-50`}
              >
                {duration.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
