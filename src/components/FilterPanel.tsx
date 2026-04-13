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

  return (
    <div className="bg-dark rounded-lg border border-primary/20 p-6 space-y-6">
      {/* Tipo de conteúdo */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white">Tipo</h3>
        <div className="flex flex-wrap gap-2">
          {(["movie", "tv", "both"] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filters.type === type
                  ? "bg-primary text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                } disabled:opacity-50`}
            >
              {type === "movie" ? "Filmes" : type === "tv" ? "Séries" : "Ambos"}
            </button>
          ))}
        </div>
      </div>

      {/* Gêneros */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white">Gêneros</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {GENRES.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreToggle(genre.id)}
              disabled={isLoading}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filters.genres.includes(genre.id)
                  ? "bg-primary text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                } disabled:opacity-50`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Plataformas */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-white">Plataformas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PLATFORMS.map((platform) => (
            <button
              key={platform}
              onClick={() => handlePlatformToggle(platform)}
              disabled={isLoading}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center ${filters.platforms.includes(platform)
                  ? "bg-primary text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                } disabled:opacity-50`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* Duração (apenas para filmes) */}
      {filters.type !== "tv" && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Duração</h3>
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
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filters.duration === duration.value
                    ? "bg-primary text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
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
