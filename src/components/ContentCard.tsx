"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ContentCardProps {
  content: any;
}

export function ContentCard({ content }: ContentCardProps) {
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);

  useEffect(() => {
    setIsSynopsisExpanded(false);
  }, [content?.id]);

  if (!content) return null;

  const synopsis = content.overview || "Sem sinopse disponível";
  const synopsisLimit = 220;
  const isLongSynopsis = synopsis.length > synopsisLimit;
  const visibleSynopsis = isSynopsisExpanded
    ? synopsis
    : `${synopsis.slice(0, synopsisLimit).trim()}...`;

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

  const collectionName = isMovie
    ? content.belongs_to_collection?.name || null
    : null;

  return (
    <div className="result-reveal-card rounded-2xl border border-violet-300/20 bg-gradient-to-b from-violet-500/10 to-black/45 backdrop-blur-md overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Pôster */}
        <div className="md:col-span-1 flex justify-center items-start self-start result-reveal-item result-delay-1">
          <div className="relative inline-block w-fit h-fit max-w-full rounded-2xl overflow-hidden shadow-lg ring-1 ring-violet-200/20">
            <Image
              src={posterPath}
              alt={title}
              width={300}
              height={450}
              className="w-[300px] max-w-full h-auto object-cover"
              priority
            />
          </div>
        </div>

        {/* Informações */}
        <div className="md:col-span-2">
          <div className="result-reveal-item result-delay-1">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl font-bold text-white break-words">
                {title || "Título não disponível"}
              </h2>
              <span className="px-3 py-1 bg-violet-500/15 border border-violet-300/40 text-violet-200 rounded-full text-sm font-medium whitespace-nowrap">
                {isMovie ? "Filme" : "Série"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-5 result-reveal-item result-delay-2">
              <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-gray-200 border border-violet-300/20">
                {year || "Ano não informado"}
              </span>
              <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-gray-200 border border-violet-300/20">
                {duration}
              </span>
              {typeof content.vote_average === "number" && (
                <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs text-amber-200 border border-amber-300/30">
                  Nota {content.vote_average.toFixed(1)}
                </span>
              )}
              {collectionName && (
                <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-100 border border-violet-300/35 max-w-full truncate">
                  Saga: {collectionName}
                </span>
              )}
            </div>

            <div className="mb-4 result-reveal-item result-delay-2">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">
                Gêneros
              </h4>
              {genresList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {genresList.map((genre: any) => (
                    <span
                      key={genre.id}
                      className="rounded-full border border-violet-300/30 bg-violet-500/15 px-3 py-1 text-xs text-violet-200"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-200">{genres}</p>
              )}
            </div>

            <div className="synopsis-scroll mb-6 rounded-xl border border-violet-300/15 bg-black/25 p-4 result-reveal-item result-delay-3 max-h-none overflow-visible md:max-h-48 md:overflow-y-auto pr-2">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">
                Sinopse
              </h4>
              <p className="text-gray-300 leading-relaxed md:hidden">{synopsis}</p>
              <p className="hidden text-gray-300 leading-relaxed md:block">
                {isLongSynopsis ? visibleSynopsis : synopsis}
                {isLongSynopsis && (
                  <button
                    type="button"
                    onClick={() => setIsSynopsisExpanded((prev) => !prev)}
                    className="ml-2 text-violet-300 hover:text-violet-200 font-semibold underline underline-offset-2"
                  >
                    {isSynopsisExpanded ? "Ver menos" : "Ver mais"}
                  </button>
                )}
              </p>
            </div>

            {/* Plataformas */}
            {content.providers && content.providers.length > 0 && (
              <div className="mb-6 result-reveal-item result-delay-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">
                  Disponível em:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {content.providers.map((provider: any) => (
                    <div
                      key={provider.provider_id}
                      className="flex items-center gap-2 bg-black/35 px-3 py-2 rounded-lg border border-violet-300/20"
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

        </div>
      </div>
    </div>
  );
}
