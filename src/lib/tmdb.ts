const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const GENRE_MAP: Record<string, number> = {
  acao: 28,
  comedia: 35,
  drama: 18,
  terror: 27,
  "ficção científica": 878,
  romance: 10749,
  suspense: 53,
  animacao: 16,
  aventura: 12,
  criminal: 80,
  documentario: 99,
  familia: 10751,
  fantasia: 14,
  musica: 10402,
  sitcom: 37,
  "ficção científica / fantasia": 14,
  "tv filme": 10770,
  "western": 37,
};

const PLATFORM_MAP: Record<string, number> = {
  netflix: 8,
  "prime video": 119,
  "disney+": 337,
  max: 445,
  "apple tv+": 350,
  globoplay: 74,
  crunchyroll: 105,
  hulu: 15,
};

export async function getRandomContent(filters: {
  type: "movie" | "tv" | "both";
  genres?: number[];
  platforms?: Array<number | string>;
  region?: string;
  duration?: "short" | "medium" | "long";
  animeOnly?: boolean;
}) {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key is not configured");
  }

  const region = filters.region || "BR";
  const type = filters.type;

  try {
    let results: any[] = [];

    if (type === "movie" || type === "both") {
      const movies = await discoverContent("movie", filters, region);
      results.push(...movies);
    }

    if (type === "tv" || type === "both") {
      const tvShows = await discoverContent("tv", filters, region);
      results.push(...tvShows);
    }

    if (results.length === 0) {
      return null;
    }

    const randomContent = results[Math.floor(Math.random() * results.length)];

    // Buscar informações de plataformas disponíveis
    const withPlatforms = await getAvailablePlatforms(
      randomContent.id,
      randomContent.media_type,
      region
    );

    return withPlatforms;
  } catch (error) {
    console.error("Error fetching random content:", error);
    throw error;
  }
}

async function discoverContent(
  mediaType: "movie" | "tv",
  filters: any,
  region: string
) {
  const platformIds: number[] = Array.isArray(filters.platforms)
    ? filters.platforms
      .map((platform: number | string) => {
        if (typeof platform === "number") {
          return platform;
        }

        return getPlatformId(String(platform));
      })
      .filter((id: number | undefined): id is number => id !== undefined)
    : [];

  for (let attempt = 0; attempt < 3; attempt++) {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY!,
      language: "pt-BR",
      region: region,
      sort_by: "popularity.desc",
      page: String(Math.floor(Math.random() * 50) + 1),
      "vote_average.gte": "5.0",
      "vote_count.gte": "100",
      include_adult: "false",
    });

    if (filters.animeOnly) {
      const selectedGenres = Array.isArray(filters.genres)
        ? filters.genres.filter((genreId: number) => genreId !== 16)
        : [];

      // Force animation and Japanese original language for anime-focused results.
      params.append(
        "with_genres",
        selectedGenres.length > 0 ? [16, ...selectedGenres].join(",") : "16"
      );
      params.append("with_original_language", "ja");
    } else if (filters.genres && filters.genres.length > 0) {
      // Use OR between selected genres to avoid over-restrictive searches.
      params.append("with_genres", filters.genres.join("|"));
    }

    if (platformIds.length > 0) {
      // Keep filtering in the selected market and providers.
      params.append("watch_region", region);
      params.append("with_watch_providers", platformIds.join("|"));
      params.append("with_watch_monetization_types", "flatrate");
    }

    if (filters.duration && mediaType === "movie") {
      // Filtrar por duração de filme
      if (filters.duration === "short") {
        params.append("with_runtime.lte", "90");
      } else if (filters.duration === "medium") {
        params.append("with_runtime.gte", "91");
        params.append("with_runtime.lte", "120");
      } else if (filters.duration === "long") {
        params.append("with_runtime.gte", "121");
      }
    }

    const response = await fetch(
      `${TMDB_BASE_URL}/discover/${mediaType}?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${mediaType} data`);
    }

    const data = await response.json();
    const results = (data.results || []).map((item: any) => ({
      ...item,
      media_type: mediaType,
    }));

    if (results.length > 0) {
      return results;
    }
  }

  return [];
}

async function getAvailablePlatforms(
  contentId: number,
  mediaType: "movie" | "tv",
  region: string
) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/${contentId}?api_key=${TMDB_API_KEY}&language=pt-BR`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${mediaType} details`);
    }

    const details = await response.json();

    // Buscar informações de "watch providers"
    const watchResponse = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/${contentId}/watch/providers?api_key=${TMDB_API_KEY}`,
      {
        cache: "no-store",
      }
    );

    const watchData = watchResponse.ok ? await watchResponse.json() : {};
    const regionData = watchData.results?.[region] || {};

    return {
      ...details,
      media_type: mediaType,
      providers: regionData.flatrate || [],
    };
  } catch (error) {
    console.error("Error fetching platforms:", error);
    return {
      id: contentId,
      media_type: mediaType,
      providers: [],
    };
  }
}

export function getGenreId(genreName: string): number | undefined {
  return GENRE_MAP[genreName.toLowerCase()];
}

export function getPlatformId(platformName: string): number | undefined {
  return PLATFORM_MAP[platformName.toLowerCase()];
}

export function getGenreIdsByNames(names: string[]): number[] {
  return names
    .map((name) => getGenreId(name))
    .filter((id): id is number => id !== undefined);
}

export function getPlatformIdsByNames(names: string[]): number[] {
  return names
    .map((name) => getPlatformId(name))
    .filter((id): id is number => id !== undefined);
}
