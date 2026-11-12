// Wspólne typy danych backendu.
// Frontend ma swoje odpowiedniki w frontend/src/app/core/models.ts - pilnuj, żeby się zgadzały.

/** Rodzaj pozycji. Na razie tylko seriale (TVmaze). Filmy dojdą w TODO(15). */
export type MediaType = 'series' | 'movie';

/** Skąd pochodzą dane. TODO(15): dodać 'tmdb'. */
export type Source = 'tvmaze';

/** Pojedynczy wynik wyszukiwania (zmapowany z odpowiedzi zewnętrznego API). */
export interface SearchResult {
  externalId: number;
  source: Source;
  type: MediaType;
  title: string;
  year: number | null;
  posterUrl: string | null;
  summary: string | null;
}

/** Pozycja na liście użytkownika. */
export interface ListItem {
  id: string;
  externalId: number;
  source: Source;
  type: MediaType;
  title: string;
  year: number | null;
  posterUrl: string | null;
  watched: boolean;
  addedAt: string; // data w formacie ISO, np. "2026-11-12T18:30:00.000Z"
  // TODO(1): rating: number | null;      ocena 1-5
  // TODO(8): notes: string;               notatki
  // TODO(10): watchedEpisodeIds: number[]; obejrzane odcinki
}

/** Dane potrzebne do dodania nowej pozycji (resztę uzupełnia serwer). */
export type NewListItem = Omit<ListItem, 'id' | 'watched' | 'addedAt'>;

/** Pola, które można zmienić przez PATCH. */
export interface ListItemChanges {
  watched?: boolean;
  // TODO(1): rating?: number | null;
  // TODO(8): notes?: string;
}
