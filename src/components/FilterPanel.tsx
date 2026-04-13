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

  const selectedGenreNames = GENRES.filter((genre) =>
    filters.genres.includes(genre.id)
  )
    .map((genre) => genre.name)
    .join(", ");

  const selectedPlatforms = filters.platforms.join(", ");

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
    <div className="rounded-2xl border border-violet-300/20 bg-gradient-to-b from-violet-500/10 to-black/45 backdrop-blur-md p-4 space-y-4 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Filtros</h3>
          <p className="text-xs text-gray-400 mt-1">
            Refine seu sorteio em segundos
          </p>
        </div>

        <div className="text-right">
          <span className="inline-flex items-center rounded-full border border-violet-300/40 bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-200">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-300">
            Tipo
          </span>
          <select
            value={filters.type}
            onChange={(e) =>
              handleTypeChange(e.target.value as "movie" | "tv" | "both")
            }
            disabled={isLoading}
            className="w-full rounded-xl border border-violet-300/20 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-400/30 disabled:opacity-50"
          >
            <option value="both">Filmes e Séries</option>
            <option value="movie">Apenas Filmes</option>
            <option value="tv">Apenas Séries</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-300">
            Duração
          </span>
          <select
            value={filters.duration || ""}
            onChange={(e) =>
              handleDurationChange(
                e.target.value === ""
                  ? undefined
                  : (e.target.value as "short" | "medium" | "long")
              )
            }
            disabled={isLoading || filters.type === "tv"}
            className="w-full rounded-xl border border-violet-300/20 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-400/30 disabled:opacity-50"
          >
            <option value="">Qualquer duração</option>
            {DURATIONS.map((duration) => (
              <option key={duration.value} value={duration.value}>
                {duration.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <details className="rounded-xl border border-violet-300/20 bg-black/35 group overflow-hidden">
        <summary className="cursor-pointer list-none px-3 py-2 text-sm text-white flex items-center justify-between bg-gradient-to-r from-violet-500/10 to-transparent">
          <span className="font-medium">Gêneros</span>
          <span className="text-xs text-gray-400 max-w-[70%] truncate text-right">
            {filters.genres.length > 0 ? selectedGenreNames : "Todos"}
          </span>
        </summary>
        <div className="filters-scroll px-3 pb-3 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto border-t border-violet-300/10">
          {GENRES.map((genre) => (
            <label
              key={genre.id}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-200 hover:bg-violet-500/10"
            >
              <input
                type="checkbox"
                checked={filters.genres.includes(genre.id)}
                onChange={() => handleGenreToggle(genre.id)}
                disabled={isLoading}
                className="h-4 w-4 accent-violet-400"
              />
              <span>{genre.name}</span>
            </label>
          ))}
        </div>
      </details>

      <details className="rounded-xl border border-violet-300/20 bg-black/35 group overflow-hidden">
        <summary className="cursor-pointer list-none px-3 py-2 text-sm text-white flex items-center justify-between bg-gradient-to-r from-violet-500/10 to-transparent">
          <span className="font-medium">Plataformas</span>
          <span className="text-xs text-gray-400 max-w-[70%] truncate text-right">
            {filters.platforms.length > 0 ? selectedPlatforms : "Todas"}
          </span>
        </summary>
        <div className="filters-scroll px-3 pb-3 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto border-t border-violet-300/10">
          {PLATFORMS.map((platform) => (
            <label
              key={platform}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-200 hover:bg-violet-500/10"
            >
              <input
                type="checkbox"
                checked={filters.platforms.includes(platform)}
                onChange={() => handlePlatformToggle(platform)}
                disabled={isLoading}
                className="h-4 w-4 accent-violet-400"
              />
              <span>{platform}</span>
            </label>
          ))}
        </div>
      </details>
    </div>
  );
}
