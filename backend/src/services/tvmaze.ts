import { HttpError } from '../errors.ts';
import type { SearchResult } from '../types.ts';

/**
 * Klient API TVmaze (https://www.tvmaze.com/api).
 * - darmowe, bez rejestracji i bez klucza,
 * - tylko SERIALE (filmy dojdą w TODO(15) z TMDB),
 * - limit: ok. 20 zapytań na 10 sekund,
 * - licencja danych CC BY-SA: trzeba podać źródło (robimy to w stopce aplikacji).
 */
const BASE_URL = 'https://api.tvmaze.com';

// Kształt odpowiedzi TVmaze - opisujemy tylko pola, których używamy.
interface TvmazeShow {
  id: number;
  name: string;
  premiered: string | null; // "2008-01-20"
  image: { medium: string; original: string } | null;
  summary: string | null; // HTML, np. "<p>Opis...</p>"
}

interface TvmazeSearchHit {
  score: number;
  show: TvmazeShow;
}

export async function searchShows(query: string): Promise<SearchResult[]> {
  // TODO(9): dodać timeout, np. fetch(url, { signal: AbortSignal.timeout(5000) })
  const response = await fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new HttpError(502, `Serwis TVmaze odpowiedział błędem (${response.status})`);
  }

  const hits = (await response.json()) as TvmazeSearchHit[];
  return hits.map((hit) => toSearchResult(hit.show));
}

// TODO(6): getShowDetails(id) -> GET {BASE_URL}/shows/{id}
// TODO(10): getEpisodes(id)    -> GET {BASE_URL}/shows/{id}/episodes
// TODO(13): getTodaySchedule() -> GET {BASE_URL}/schedule?country=PL

function toSearchResult(show: TvmazeShow): SearchResult {
  return {
    externalId: show.id,
    source: 'tvmaze',
    type: 'series',
    title: show.name,
    year: show.premiered ? Number(show.premiered.slice(0, 4)) : null,
    posterUrl: show.image?.medium ?? null,
    summary: stripHtml(show.summary),
  };
}

function stripHtml(html: string | null): string | null {
  return html ? html.replace(/<[^>]*>/g, '').trim() : null;
}
