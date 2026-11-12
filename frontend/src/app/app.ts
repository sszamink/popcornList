import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ListStore } from './core/list-store';

/** Komponent główny: nagłówek z menu, miejsce na strony (<router-outlet>) i stopka. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly store = inject(ListStore);

  constructor() {
    // Lista jest potrzebna na obu stronach (np. przycisk "✓ Na liście"), więc ładujemy ją raz, na starcie.
    this.store.load();
  }

  // TODO(4): protected readonly theme = inject(ThemeService);
}
