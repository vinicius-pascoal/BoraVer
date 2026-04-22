"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { TrailerModal } from "./TrailerModal";

interface ContentCardProps {
  content: any;
}

export function ContentCard({ content }: ContentCardProps) {
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

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

  const tmdbImageBaseUrl =
    process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL ||
    "https://image.tmdb.org/t/p/w500";
  const rawPosterPath =
    typeof content.poster_path === "string" ? content.poster_path.trim() : "";
  const posterPath = rawPosterPath
    ? `${tmdbImageBaseUrl.replace(/\/$/, "")}/${rawPosterPath.replace(/^\//, "")}`
    : "/no-poster.svg";

  const genres = content.genres?.map((g: any) => g.name).join(", ") || "N/A";
  const genresList = content.genres || [];
  const trailer = content.trailer;
  const watchLink =
    typeof content.watch_link === "string" ? content.watch_link : null;
  const trailerUrl = trailer?.key
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`
    : null;

  const buildProviderUrl = (providerName: string) => {
    const encodedTitle = encodeURIComponent(title || "");
    const providerKey = providerName.toLowerCase();

    const providerSearchMap: Record<string, string> = {
      netflix: `https://www.netflix.com/search?q=${encodedTitle}`,
      "prime video": `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodedTitle}`,
      "disney+": `https://www.disneyplus.com/search/${encodedTitle}`,
      max: `https://play.max.com/search?q=${encodedTitle}`,
      "apple tv+": `https://tv.apple.com/search?term=${encodedTitle}`,
      globoplay: `https://globoplay.globo.com/busca/?q=${encodedTitle}`,
      crunchyroll: `https://www.crunchyroll.com/search?q=${encodedTitle}`,
      hulu: `https://www.hulu.com/search?q=${encodedTitle}`,
    };

    return providerSearchMap[providerKey] || watchLink || "#";
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 p-4 sm:p-5 md:p-6">
        {/* Pôster */}
        <div className="md:col-span-1 flex justify-center items-start self-start result-reveal-item result-delay-1">
          <div className="poster-hover-shell relative inline-block w-fit h-fit max-w-full rounded-2xl">
            <div className="poster-hover-card relative rounded-2xl overflow-hidden shadow-lg ring-1 ring-violet-200/20">
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
        </div>

        {/* Informações */}
        <div className="md:col-span-2">
          <div className="result-reveal-item result-delay-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-bold text-white break-words">
                {title || "Título não disponível"}
              </h2>
              <span className="px-3 py-1 bg-violet-500/15 border border-violet-300/40 text-violet-200 rounded-full text-sm font-medium whitespace-nowrap">
                {isMovie ? "Filme" : "Série"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 sm:mb-5 result-reveal-item result-delay-2">
              <span className="rounded-full bg-black/40 px-3 py-1 text-xs sm:text-sm text-gray-200 border border-violet-300/20">
                {year || "Ano não informado"}
              </span>
              <span className="rounded-full bg-black/40 px-3 py-1 text-xs sm:text-sm text-gray-200 border border-violet-300/20">
                {duration}
              </span>
              {typeof content.vote_average === "number" && (
                <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs sm:text-sm text-amber-200 border border-amber-300/30">
                  Nota {content.vote_average.toFixed(1)}
                </span>
              )}
              {collectionName && (
                <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs sm:text-sm text-violet-100 border border-violet-300/35 max-w-full truncate">
                  Saga: {collectionName}
                </span>
              )}
            </div>

            {trailerUrl && (
              <div className="mb-4 sm:mb-5 result-reveal-item result-delay-2">
                <button
                  type="button"
                  onClick={() => setIsTrailerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-red-300/30 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-100 transition-colors hover:bg-red-500/25 hover:text-white"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500/25 text-[11px] leading-none">
                    ▶
                  </span>
                  Assistir trailer
                </button>
              </div>
            )}

            <div className="mb-4 sm:mb-5 result-reveal-item result-delay-2">
              <h4 className="text-sm font-semibold text-gray-300 mb-2 sm:mb-3">
                Gêneros
              </h4>
              {genresList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {genresList.map((genre: any) => (
                    <span
                      key={genre.id}
                      className="rounded-full border border-violet-300/30 bg-violet-500/15 px-3 py-1 text-xs sm:text-sm text-violet-200"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-200">{genres}</p>
              )}
            </div>

            <div className="synopsis-scroll mb-5 sm:mb-6 rounded-xl border border-violet-300/15 bg-black/25 p-3 sm:p-4 result-reveal-item result-delay-3 max-h-none overflow-visible md:max-h-48 md:overflow-y-auto pr-2">
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
              <div className="mb-4 sm:mb-5 result-reveal-item result-delay-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">
                  Disponível em:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {content.providers.map((provider: any) => (
                    <a
                      key={provider.provider_id}
                      href={buildProviderUrl(provider.provider_name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Abrir ${provider.provider_name} em uma nova aba`}
                      className="flex items-center gap-2 bg-black/35 px-3 py-2 rounded-lg border border-violet-300/20 transition-colors hover:bg-black/55 hover:border-violet-200/40"
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
                      <span className="text-xs sm:text-sm font-medium">
                        {provider.provider_name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerUrl={trailerUrl}
        trailerName={trailer?.name}
      />
    </div>
  );
}
