// Typy danych frontendu.
// MUSZĄ zgadzać się z backend/src/types.ts - to "kontrakt" między frontendem a API.

/** Rodzaj pozycji. Na razie tylko seriale (TVmaze). Filmy dojdą w TODO(15). */
export type MediaType = 'series' | 'movie';

/** Skąd pochodzą dane. TODO(15): dodać 'tmdb'. */
export type Source = 'tvmaze';

/** Wynik wyszukiwania (GET /api/search). */
export interface SearchResult {
  externalId: number;
  source: Source;
  type: MediaType;
  title: string;
  year: number | null;
  posterUrl: string | null;
  summary: string | null;
}

/** Pozycja na liście użytkownika (GET /api/list). */
export interface ListItem {
  id: string;
  externalId: number;
  source: Source;
  type: MediaType;
  title: string;
  year: number | null;
  posterUrl: string | null;
  watched: boolean;
  addedAt: string;
  // TODO(1): rating: number | null;
  // TODO(8): notes: string;
  // TODO(10): watchedEpisodeIds: number[];
}

/** Format błędu zwracanego przez backend. */
export interface ApiError {
  message: string;
}
