import type { Routes } from '@angular/router';
import { MyListPage } from './features/my-list/my-list-page';

/**
 * Mapa adresów URL -> strony.
 * `component`     - strona ładowana od razu (strona główna).
 * `loadComponent` - LAZY LOADING: kod strony pobiera się dopiero przy pierwszym wejściu.
 */
export const routes: Routes = [
  { path: '', component: MyListPage, title: 'Moja lista · PopcornList' },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search-page').then((m) => m.SearchPage),
    title: 'Szukaj · PopcornList',
  },
  // TODO(6):  { path: 'show/:id', loadComponent: ... }   - szczegóły serialu
  // TODO(13): { path: 'tonight', loadComponent: ... }    - "Co dziś obejrzeć?"
  { path: '**', redirectTo: '' },
];
