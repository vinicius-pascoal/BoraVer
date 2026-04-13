export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  genres: Genre[];
  runtime: number;
  release_date: string;
  media_type: "movie";
}

export interface TV {
  id: number;
  name: string;
  poster_path: string | null;
  overview: string;
  genres: Genre[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  first_air_date: string;
  media_type: "tv";
}

export interface Genre {
  id: number;
  name: string;
}

export interface Content extends Movie, TV { }

export interface FilterOptions {
  type: "movie" | "tv" | "both";
  genres: number[];
  platforms: string[];
  region: string;
  duration?: "short" | "medium" | "long";
}

export interface StreamingPlatform {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

export interface ContentWithPlatforms extends Movie | TV {
  streaming_platforms ?: StreamingPlatform[];
}
