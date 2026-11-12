import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListStore } from '../../core/list-store';
import { ShowCard } from '../../shared/show-card/show-card';

/** Strona "Moja lista" - wyświetla pozycje z ListStore. */
@Component({
  selector: 'app-my-list-page',
  imports: [ShowCard, RouterLink],
  templateUrl: './my-list-page.html',
  styleUrl: './my-list-page.css',
})
export class MyListPage {
  protected readonly store = inject(ListStore);

  // TODO(2): filter = signal<'all' | 'toWatch' | 'watched'>('all')
  //          visibleItems = computed(() => ...)
}
