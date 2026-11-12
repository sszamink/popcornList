import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import type { SearchResult } from './models';

/**
 * Wyszukiwanie przez NASZ backend (a ten pyta TVmaze).
 * Frontend nigdy nie woła zewnętrznego API bezpośrednio - dzięki temu klucze API
 * (od TODO 15) zostają na serwerze.
 */
@Injectable({ providedIn: 'root' })
export class SearchApi {
  private readonly http = inject(HttpClient);

  search(query: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>('/api/search', { params: { q: query } });
  }

  // TODO(6): getDetails(id) -> GET /api/shows/:id
}
