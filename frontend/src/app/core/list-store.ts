import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import type { ListItem, SearchResult } from './models';

/**
 * "Magazyn" stanu listy - jedno źródło prawdy dla całej aplikacji.
 *
 * - Stan trzymamy w PRYWATNYCH signals (_items...), a na zewnątrz wystawiamy wersje tylko do odczytu.
 *   Komponenty czytają `store.items()`, ale zmieniają dane wyłącznie przez metody (add, remove...).
 * - Każda metoda: wysyła zapytanie do backendu -> po sukcesie aktualizuje signal -> widok odświeża się sam.
 *
 * Porównanie z Javą: to jak @Service z prywatnym polem i publicznymi metodami - klasyczna enkapsulacja.
 */
@Injectable({ providedIn: 'root' })
export class ListStore {
  private readonly http = inject(HttpClient);

  private readonly _items = signal<ListItem[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  /** Liczba pozycji - computed przelicza się sam, gdy zmieni się _items. */
  readonly count = computed(() => this._items().length);

  // TODO(3): watchedCount, toWatchCount, watchedPercent (computed)

  /** Czy wynik wyszukiwania jest już na liście? (do przycisku "✓ Na liście") */
  isOnList(result: SearchResult): boolean {
    return this._items().some(
      (item) => item.source === result.source && item.externalId === result.externalId,
    );
  }

  load(): void {
    this._loading.set(true);
    this.http.get<ListItem[]>('/api/list').subscribe({
      next: (items) => {
        this._items.set(items);
        this._loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this._loading.set(false);
        this.handleError(error);
      },
    });
  }

  add(result: SearchResult): void {
    const body = {
      externalId: result.externalId,
      source: result.source,
      type: result.type,
      title: result.title,
      year: result.year,
      posterUrl: result.posterUrl,
    };
    this.http.post<ListItem>('/api/list', body).subscribe({
      // nowa tablica (a nie push!) - signal musi dostać NOWĄ wartość, żeby zauważyć zmianę
      next: (created) => this._items.update((items) => [created, ...items]),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  toggleWatched(item: ListItem): void {
    this.http.patch<ListItem>(`/api/list/${item.id}`, { watched: !item.watched }).subscribe({
      next: (updated) => this.replace(updated),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  remove(item: ListItem): void {
    this.http.delete<void>(`/api/list/${item.id}`).subscribe({
      next: () => this._items.update((items) => items.filter((i) => i.id !== item.id)),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  // TODO(1): rate(item: ListItem, rating: number | null)
  // TODO(8): updateNotes(item: ListItem, notes: string)

  clearError(): void {
    this._error.set(null);
  }

  private replace(updated: ListItem): void {
    this._items.update((items) => items.map((i) => (i.id === updated.id ? updated : i)));
  }

  // TODO(5): zamiast ustawiać _error, pokaż powiadomienie przez MessageService (p-toast)
  // TODO(9): przenieś obsługę błędów do HTTP interceptora
  private handleError(error: HttpErrorResponse): void {
    const message: unknown = error.error?.message;
    this._error.set(
      typeof message === 'string' ? message : 'Nie udało się połączyć z serwerem. Czy backend działa?',
    );
  }
}
