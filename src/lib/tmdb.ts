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
  crunchyroll: 283,
  crunchroll: 283,
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
    const withDetails = await getAvailableDetails(
      randomContent.id,
      randomContent.media_type,
      region
    );

    return withDetails;
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

  const baseParams = new URLSearchParams({
    api_key: TMDB_API_KEY!,
    language: "pt-BR",
    region: region,
    sort_by: "popularity.desc",
    "vote_average.gte": "5.0",
    "vote_count.gte": "100",
    include_adult: "false",
  });

  if (filters.animeOnly) {
    const selectedGenres = Array.isArray(filters.genres)
      ? filters.genres.filter((genreId: number) => genreId !== 16)
      : [];

    // Force animation and Japanese original language for anime-focused results.
    baseParams.append(
      "with_genres",
      selectedGenres.length > 0 ? [16, ...selectedGenres].join(",") : "16"
    );
    baseParams.append("with_original_language", "ja");
  } else if (filters.genres && filters.genres.length > 0) {
    // Require all selected genres (AND behavior).
    baseParams.append("with_genres", filters.genres.join(","));
  }

  if (platformIds.length > 0) {
    // Keep filtering in the selected market and providers.
    baseParams.append("watch_region", region);
    baseParams.append("with_watch_providers", platformIds.join("|"));
    baseParams.append("with_watch_monetization_types", "flatrate");
  }

  if (filters.duration && mediaType === "movie") {
    // Filtrar por duração de filme
    if (filters.duration === "short") {
      baseParams.append("with_runtime.lte", "90");
    } else if (filters.duration === "medium") {
      baseParams.append("with_runtime.gte", "91");
      baseParams.append("with_runtime.lte", "120");
    } else if (filters.duration === "long") {
      baseParams.append("with_runtime.gte", "121");
    }
  }

  const fetchDiscoverPage = async (page: number) => {
    const params = new URLSearchParams(baseParams);
    params.set("page", String(page));

    const response = await fetch(
      `${TMDB_BASE_URL}/discover/${mediaType}?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${mediaType} data`);
    }

    return response.json();
  };

  // First page gives us total_pages, preventing random requests to invalid pages.
  const firstPageData = await fetchDiscoverPage(1);
  const totalPages = Math.max(
    1,
    Math.min(Number(firstPageData?.total_pages || 1), 500)
  );

  const pagesToTry = new Set<number>([1]);
  const maxAttempts = Math.min(5, totalPages);

  while (pagesToTry.size < maxAttempts) {
    pagesToTry.add(Math.floor(Math.random() * totalPages) + 1);
  }

  for (const page of pagesToTry) {
    const data = page === 1 ? firstPageData : await fetchDiscoverPage(page);
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

async function getAvailableDetails(
  contentId: number,
  mediaType: "movie" | "tv",
  region: string
) {
  try {
    const [detailsResponse, watchResponse, videosResponse] = await Promise.all([
      fetch(
        `${TMDB_BASE_URL}/${mediaType}/${contentId}?api_key=${TMDB_API_KEY}&language=pt-BR`,
        {
          cache: "no-store",
        }
      ),
      fetch(
        `${TMDB_BASE_URL}/${mediaType}/${contentId}/watch/providers?api_key=${TMDB_API_KEY}`,
        {
          cache: "no-store",
        }
      ),
      fetch(
        `${TMDB_BASE_URL}/${mediaType}/${contentId}/videos?api_key=${TMDB_API_KEY}&language=pt-BR`,
        {
          cache: "no-store",
        }
      ),
    ]);

    if (!detailsResponse.ok) {
      throw new Error(`Failed to fetch ${mediaType} details`);
    }

    const details = await detailsResponse.json();
    const watchData = watchResponse.ok ? await watchResponse.json() : {};
    const videosData = videosResponse.ok ? await videosResponse.json() : {};
    const regionData = watchData.results?.[region] || {};
    const trailer = pickTrailer(videosData.results || []);

    return {
      ...details,
      media_type: mediaType,
      providers: regionData.flatrate || [],
      trailer,
    };
  } catch (error) {
    console.error("Error fetching platforms:", error);
    return {
      id: contentId,
      media_type: mediaType,
      providers: [],
      trailer: null,
    };
  }
}

function pickTrailer(videos: Array<any>) {
  const youtubeTrailers = videos.filter(
    (video) => video?.site === "YouTube" && video?.key
  );

  const officialTrailer = youtubeTrailers.find(
    (video) => video?.official && video?.type === "Trailer"
  );

  const fallbackTrailer = youtubeTrailers.find(
    (video) => video?.type === "Trailer"
  );

  const selected = officialTrailer || fallbackTrailer || youtubeTrailers[0];

  if (!selected) {
    return null;
  }

  return {
    key: selected.key,
    name: selected.name || "Trailer",
    site: selected.site,
    type: selected.type,
    official: Boolean(selected.official),
  };
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
