import { Component, inject, signal } from '@angular/core';
import type { HttpErrorResponse } from '@angular/common/http';
import { ListStore } from '../../core/list-store';
import type { SearchResult } from '../../core/models';
import { SearchApi } from '../../core/search-api';
import { ShowCard } from '../../shared/show-card/show-card';

/**
 * Strona "Szukaj".
 * Stan strony (tekst, wyniki, ładowanie, błąd) trzymamy w signals tego komponentu,
 * bo nie jest potrzebny nigdzie indziej. Lista użytkownika jest w ListStore.
 */
@Component({
  selector: 'app-search-page',
  imports: [ShowCard],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css',
})
export class SearchPage {
  private readonly api = inject(SearchApi);
  protected readonly store = inject(ListStore);

  protected readonly query = signal('');
  protected readonly results = signal<SearchResult[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly searched = signal(false);

  protected onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  // TODO(7): zamień ręczne wyszukiwanie na "na żywo" (toObservable + debounceTime + switchMap + toSignal)
  protected search(event?: Event): void {
    event?.preventDefault(); // formularz nie przeładowuje strony
    const query = this.query().trim();
    if (query.length < 2) {
      this.error.set('Wpisz co najmniej 2 znaki');
      return;
    }

    this.error.set(null);
    this.loading.set(true);
    this.api.search(query).subscribe({
      next: (results) => {
        this.results.set(results);
        this.searched.set(true);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        const message: unknown = error.error?.message;
        this.error.set(typeof message === 'string' ? message : 'Nie udało się wyszukać. Czy backend działa?');
        this.loading.set(false);
      },
    });
  }
}
