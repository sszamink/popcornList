import { Component, input, output } from '@angular/core';
import { SlicePipe } from '@angular/common';

/**
 * Dane potrzebne karcie. Pasują tu zarówno SearchResult (wyszukiwanie),
 * jak i ListItem (lista) - TypeScript sprawdza KSZTAŁT obiektu, a nie nazwę klasy.
 */
export interface ShowCardData {
  title: string;
  year: number | null;
  posterUrl: string | null;
  summary?: string | null;
  watched?: boolean;
}

/**
 * Komponent PREZENTACYJNY: dostaje dane przez input(), zgłasza akcje przez output().
 * Nie wie nic o HTTP ani o ListStore - dlatego działa i na liście, i w wynikach wyszukiwania.
 */
@Component({
  selector: 'app-show-card',
  imports: [SlicePipe],
  templateUrl: './show-card.html',
  styleUrl: './show-card.css',
})
export class ShowCard {
  readonly item = input.required<ShowCardData>();
  readonly mode = input<'search' | 'list'>('search');
  readonly onList = input(false);

  readonly add = output<void>();
  readonly toggleWatched = output<void>();
  readonly remove = output<void>();

  // TODO(1): readonly rated = output<number | null>();
}
