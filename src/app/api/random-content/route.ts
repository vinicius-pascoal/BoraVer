import { getRandomContent } from "../../../lib/tmdb";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const type = (searchParams.get("type") || "both") as
      | "movie"
      | "tv"
      | "both";
    const genresStr = searchParams.get("genres");
    const platformsStr = searchParams.get("platforms");
    const region = searchParams.get("region") || "BR";
    const animeOnly = searchParams.get("animeOnly") === "true";
    const duration = searchParams.get("duration") as
      | "short"
      | "medium"
      | "long"
      | undefined;

    const genres = genresStr ? JSON.parse(genresStr) : [];
    const platforms = platformsStr ? JSON.parse(platformsStr) : [];

    const filters = {
      type,
      genres,
      platforms,
      region,
      duration,
      animeOnly,
    };

    const content = await getRandomContent(filters);

    if (!content) {
      return NextResponse.json({
        content: null,
        error: "Não encontramos nada com esses filtros. Tente novamente!",
      });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error in /api/random-content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}
