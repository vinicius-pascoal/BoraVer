"use client";

import Image from "next/image";
import React from "react";

interface ContentCardProps {
  content: any;
  onSortearAgain: () => void;
  isLoading?: boolean;
}

export function ContentCard({
  content,
  onSortearAgain,
  isLoading,
}: ContentCardProps) {
  if (!content) return null;

  const isMovie = content.media_type === "movie";
  const title = isMovie ? content.title : content.name;
  const year = isMovie
    ? content.release_date?.split("-")[0]
    : content.first_air_date?.split("-")[0];

  const posterPath = content.poster_path
    ? `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}${content.poster_path}`
    : "/no-poster.svg";

  const genres = content.genres?.map((g: any) => g.name).join(", ") || "N/A";
  const genresList = content.genres || [];

  const duration = isMovie
    ? content.runtime
      ? `${content.runtime} min`
      : "Não informado"
    : `${content.number_of_seasons || 0} temporadas • ${content.number_of_episodes || 0} episódios`;

  return (
    <div className="bg-dark rounded-xl border border-primary/20 overflow-hidden shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Pôster */}
        <div className="md:col-span-1 flex justify-center">
          <div className="relative w-full max-w-xs rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10">
            <Image
              src={posterPath}
              alt={title}
              width={300}
              height={450}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>

        {/* Informações */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl font-bold text-white break-words">
                {title || "Título não disponível"}
              </h2>
              <span className="px-3 py-1 bg-primary/20 border border-primary text-primary rounded-full text-sm font-medium whitespace-nowrap">
                {isMovie ? "Filme" : "Série"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-200 border border-gray-700">
                {year || "Ano não informado"}
              </span>
              <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-200 border border-gray-700">
                {duration}
              </span>
              {typeof content.vote_average === "number" && (
                <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs text-amber-200 border border-amber-300/30">
                  Nota {content.vote_average.toFixed(1)}
                </span>
              )}
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">
                Gêneros
              </h4>
              {genresList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {genresList.map((genre: any) => (
                    <span
                      key={genre.id}
                      className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-200">{genres}</p>
              )}
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">
                Sinopse
              </h4>
              <p className="text-gray-300 leading-relaxed">
                {content.overview || "Sem sinopse disponível"}
              </p>
            </div>

            {/* Plataformas */}
            {content.providers && content.providers.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">
                  Disponível em:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {content.providers.map((provider: any) => (
                    <div
                      key={provider.provider_id}
                      className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700"
                    >
                      {provider.logo_path && (
                        <Image
                          src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                          alt={provider.provider_name}
                          width={20}
                          height={20}
                          className="rounded"
                        />
                      )}
                      <span className="text-sm font-medium">
                        {provider.provider_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onSortearAgain}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-purple-400 hover:from-primary/80 hover:to-purple-400/80 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
          >
            {isLoading ? "Carregando..." : "Sortear Novamente"}
          </button>
        </div>
      </div>
    </div>
  );
}
