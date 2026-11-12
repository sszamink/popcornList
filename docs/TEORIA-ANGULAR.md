# 📘 Teoria: jak działa Angular (i backend w Node)

> Pisane dla programisty **Javy**, który dopiero poznaje Angulara.
> Wszystkie przykłady pochodzą z PopcornList. Otwórz wskazany plik i czytaj go równolegle z tym tekstem.

**Spis treści**
1. [Wielki obraz](#1-wielki-obraz)
2. [Ściągawka: Java/Spring → Angular](#2-ściągawka-javaspring--angular)
3. [Struktura projektu: co gdzie leży](#3-struktura-projektu-co-gdzie-leży)
4. [Komponenty](#4-komponenty)
5. [Szablony (HTML z supermocami)](#5-szablony-html-z-supermocami)
6. [Signals: stan aplikacji](#6-signals-stan-aplikacji)
7. [Komunikacja komponentów: input() i output()](#7-komunikacja-komponentów-input-i-output)
8. [Serwisy i Dependency Injection](#8-serwisy-i-dependency-injection)
9. [HTTP i Observable](#9-http-i-observable)
10. [Routing](#10-routing)
11. [Formularze (wstęp do TODO 8)](#11-formularze-wstęp-do-todo-8)
12. [RxJS w minimalnej dawce (wstęp do TODO 7)](#12-rxjs-w-minimalnej-dawce-wstęp-do-todo-7)
13. [Backend: Node.js + Express](#13-backend-nodejs--express)
14. [Krok po kroku: co się dzieje po kliknięciu „Dodaj”](#14-krok-po-kroku-co-się-dzieje-po-kliknięciu-dodaj)
15. [Najczęstsze błędy](#15-najczęstsze-błędy)
16. [Słowniczek](#16-słowniczek)
17. [PrimeNG: biblioteka komponentów (od TODO 5)](#17-primeng-biblioteka-komponentów-od-todo-5)

---

## 1. Wielki obraz

PopcornList to dwie osobne aplikacje, które rozmawiają ze sobą przez HTTP:

```
 ┌─────────────────────────┐      HTTP (JSON)      ┌──────────────────────┐      HTTP      ┌──────────────┐
 │  FRONTEND (Angular)     │  ───────────────────▶ │  BACKEND (Node.js)   │ ─────────────▶ │  TVmaze API  │
 │  działa w PRZEGLĄDARCE  │  ◀─────────────────── │  działa na serwerze  │ ◀───────────── │  (internet)  │
 │  localhost:4200         │   /api/list, /api/... │  localhost:3000      │                └──────────────┘
 └─────────────────────────┘                       │  zapisuje listę ─▶ data/list.json
                                                   └──────────────────────┘
```

- **Angular** to framework do budowania **SPA** (Single Page Application). Przeglądarka pobiera aplikację **raz**, a potem przy przejściu między „stronami” **nie przeładowuje się**. Angular sam podmienia fragmenty widoku i dociąga dane z API.
- **Backend** robi to, czego przeglądarka robić nie powinna: trzyma dane, ukrywa klucze API i rozmawia z zewnętrznymi serwisami.
- W trakcie developmentu Angular działa na porcie **4200**, a Node na **3000**. Zapytania do `/api/...` frontend przekazuje do backendu dzięki plikowi **`frontend/proxy.conf.json`**.

---

## 2. Ściągawka: Java/Spring → Angular

| Java / Spring | Angular / TypeScript | Gdzie w PopcornList |
|---|---|---|
| klasa z polami | `interface` / `type` | `core/models.ts` |
| `record SearchResult(...)` | `interface SearchResult { ... }` | `core/models.ts` |
| `@Service` (singleton) | `@Injectable({ providedIn: 'root' })` | `core/list-store.ts` |
| wstrzykiwanie przez konstruktor | `private http = inject(HttpClient)` | `core/search-api.ts` |
| `@Controller` + widok (np. Thymeleaf) | **komponent** = klasa + szablon HTML | `features/*/` |
| `RestTemplate` / `WebClient` | `HttpClient` | `core/list-store.ts` |
| `CompletableFuture<T>` | `Observable<T>` (RxJS) albo `Promise<T>` | odpowiedzi z `HttpClient` |
| `@GetMapping("/search")` | trasa w `app.routes.ts` (dla stron) | `app.routes.ts` |
| `List<T>` | `T[]` | wszędzie |
| `Optional<T>` | `T \| null` | `year: number \| null` |
| `x -> x * 2` | `x => x * 2` | wszędzie |
| Maven + `pom.xml` | npm + `package.json` | `frontend/`, `backend/` |
| JUnit + Mockito | Vitest + `TestBed` | TODO 12 |
| biblioteka UI, np. Vaadin | PrimeNG (gotowe komponenty) | TODO 5 i dalej |

---

## 3. Struktura projektu: co gdzie leży

```
frontend/
├── angular.json             ← konfiguracja budowania (jak pom.xml dla buildu)
├── package.json             ← zależności i skrypty (npm start, npm test)
├── proxy.conf.json          ← /api/* → http://localhost:3000
└── src/
    ├── index.html           ← jedyna "prawdziwa" strona HTML; zawiera <app-root>
    ├── main.ts              ← punkt startowy (jak public static void main)
    ├── styles.css           ← style globalne (kolory jako zmienne CSS)
    └── app/
        ├── app.config.ts    ← konfiguracja aplikacji: router, HttpClient...
        ├── app.routes.ts    ← mapa adresów URL → strony
        ├── app.ts / .html / .css   ← komponent główny: nagłówek, menu, <router-outlet>
        ├── core/            ← "mózg": modele i serwisy
        │   ├── models.ts        ← typy danych (zgodne z backendem!)
        │   ├── search-api.ts    ← wyszukiwanie przez backend
        │   └── list-store.ts    ← STAN listy + operacje (dodaj, usuń, obejrzane)
        ├── features/        ← strony (każda w swoim folderze)
        │   ├── my-list/         ← "Moja lista"
        │   └── search/          ← "Szukaj"
        └── shared/          ← komponenty wielokrotnego użytku
            └── show-card/       ← karta serialu (używana na obu stronach)
```

**Jak startuje aplikacja:**
1. Przeglądarka ładuje `index.html`, w którym jest znacznik `<app-root></app-root>`.
2. `main.ts` uruchamia Angulara: `bootstrapApplication(App, appConfig)`.
3. Angular znajduje komponent z `selector: 'app-root'` (czyli `App`) i wstawia jego szablon w miejsce `<app-root>`.
4. Router patrzy na adres URL i w miejscu `<router-outlet>` wyświetla właściwą stronę.

---

## 4. Komponenty

**Komponent** to klocek interfejsu: **klasa TypeScript** (logika i stan) połączona z **szablonem HTML** (widok) i **stylami CSS**.

```ts
@Component({
  selector: 'app-show-card',          // nazwa znacznika: <app-show-card>
  imports: [SlicePipe],               // czego używa szablon (inne komponenty, pipes)
  templateUrl: './show-card.html',    // widok
  styleUrl: './show-card.css',        // style - działają TYLKO w tym komponencie
})
export class ShowCard {
  // stan i logika
}
```

- **Standalone:** nowoczesne komponenty są samodzielne i same deklarują w `imports`, czego potrzebują. W starych tutorialach zobaczysz `NgModule`. To przeszłość, ignoruj je.
- **Style są izolowane:** `.card` w `show-card.css` nie wpłynie na `.card` w innym komponencie. Style wspólne są w `src/styles.css`.
- **Podział na typy komponentów:**
  - **strony** (`features/`): znają serwisy, pobierają dane, reagują na akcje,
  - **komponenty prezentacyjne** (`shared/`): dostają dane przez `input()` i zgłaszają zdarzenia przez `output()`. Nie wiedzą nic o HTTP. Przykład: `ShowCard`.

👉 **Zobacz:** `shared/show-card/show-card.ts` (komponent prezentacyjny) i `features/my-list/my-list-page.ts` (strona).

---

## 5. Szablony (HTML z supermocami)

### Wyświetlanie danych: interpolacja `{{ }}`
```html
<h3>{{ item().title }}</h3>
```

### Wiązanie właściwości: `[atrybut]`
```html
<img [src]="item().posterUrl" [alt]="item().title" />
<article [class.watched]="item().watched">   <!-- dodaje klasę CSS, gdy warunek = true -->
```

### Wiązanie zdarzeń: `(zdarzenie)`
```html
<button (click)="remove.emit()">Usuń</button>
<input (input)="onInput($event)" />
```

### Instrukcje sterujące: `@if`, `@for`, `@switch`
```html
@if (store.loading()) {
  <p>Ładowanie…</p>
} @else {
  @for (item of store.items(); track item.id) {
    <app-show-card [item]="item" />
  } @empty {
    <p>Lista jest pusta</p>
  }
}
```
- **`track item.id`** jest **wymagany**. Mówi Angularowi, po czym rozpoznać elementy, żeby przy zmianie listy przerysować tylko to, co się zmieniło (podobnie do `equals` i `hashCode` w kolekcjach).
- Stara składnia `*ngIf` i `*ngFor` też działa, ale w nowym kodzie używamy `@if` i `@for`.

### `@defer`: leniwe ładowanie fragmentu (TODO 13)
```html
@defer (on viewport) { <app-heavy-chart /> } @placeholder { <p>…</p> }
```
Kod komponentu ładuje się dopiero wtedy, gdy fragment pojawi się na ekranie.

### Pipes: formatowanie w szablonie
```html
{{ item().summary | slice:0:140 }}
{{ store.watchedPercent() | percent }}
{{ item().addedAt | date:'dd.MM.yyyy' }}
```
Pipe trzeba dodać do `imports` komponentu (np. `SlicePipe`, `PercentPipe`, `DatePipe`).

---

## 6. Signals: stan aplikacji

**Signal** to „pudełko z wartością, które powiadamia, gdy wartość się zmieni”. Angular wie, które fragmenty widoku czytają dany signal, i **przerysowuje tylko je**.

```ts
const count = signal(0);        // utwórz z wartością początkową
count();                        // ODCZYT - wywołujesz jak funkcję!
count.set(5);                   // ustaw nową wartość
count.update((c) => c + 1);     // ustaw na podstawie poprzedniej
```

### `computed()`: wartość wyliczana z innych signals
```ts
const items = signal<ListItem[]>([]);
const watchedCount = computed(() => items().filter((i) => i.watched).length);
```
- Przelicza się **automatycznie**, gdy zmieni się `items`, i tylko wtedy (wynik jest zapamiętywany).
- **Nie da się go ustawić ręcznie**, bo to wartość pochodna. Porównaj z polem z getterem, który zawsze liczy na świeżo, tylko że `computed` jest sprytniejszy.

### `effect()`: reakcja na zmianę (efekt uboczny)
```ts
effect(() => {
  localStorage.setItem('theme', theme());   // uruchomi się przy każdej zmianie theme
});
```
Używaj go do rzeczy **poza Angularem**: `localStorage`, logów, ręcznych zmian w DOM. **Nie** używaj `effect`, żeby ustawiać inne signals, bo od tego jest `computed`.

### Zasada w PopcornList: stan listy w jednym miejscu
```ts
// core/list-store.ts
private readonly _items = signal<ListItem[]>([]);   // prywatny: zmienia go tylko serwis
readonly items = this._items.asReadonly();          // publiczny: tylko do odczytu
```
Komponenty **czytają** `store.items()`, ale nie mogą go zmienić bezpośrednio. Zmiany idą przez metody serwisu (`add`, `remove`...). To enkapsulacja, którą znasz z Javy.

### Dlaczego signals?
Nowy Angular działa **bez zone.js** (tryb *zoneless*). Nie „zgaduje”, co się zmieniło, tylko dokładnie wie, bo signals same to zgłaszają. Dzięki temu jest szybciej i bardziej przewidywalnie.

---

## 7. Komunikacja komponentów: input() i output()

```
          Strona (rodzic)                               ShowCard (dziecko)
   ┌───────────────────────────┐   [item]="item"    ┌──────────────────────┐
   │ my-list-page              │ ─────────────────▶ │ item = input()       │  dane W DÓŁ
   │                           │                    │                      │
   │ (remove)="store.remove()" │ ◀───────────────── │ remove = output()    │  zdarzenia W GÓRĘ
   └───────────────────────────┘    remove.emit()   └──────────────────────┘
```

**W dziecku** (`show-card.ts`):
```ts
item = input.required<ShowCardData>();   // wymagane dane wejściowe
mode = input<'search' | 'list'>('search'); // opcjonalne, z wartością domyślną
remove = output<void>();                 // zdarzenie
```
`input()` to też signal, więc w szablonie i kodzie odczytujesz go przez `item()`.

**W rodzicu** (`my-list-page.html`):
```html
<app-show-card [item]="item" mode="list" (remove)="store.remove(item)" />
```

**Zasada:** dziecko nie wie, co rodzic zrobi ze zdarzeniem. Mówi tylko „kliknięto Usuń”. Dzięki temu `ShowCard` działa i na liście, i w wynikach wyszukiwania.

---

## 8. Serwisy i Dependency Injection

**Serwis** to klasa z logiką, która nie dotyczy widoku: pobieranie danych i wspólny stan. To dokładnie odpowiednik `@Service` w Springu.

```ts
@Injectable({ providedIn: 'root' })   // jeden egzemplarz na całą aplikację (singleton)
export class SearchApi {
  private http = inject(HttpClient);  // wstrzyknięcie zależności

  search(query: string) {
    return this.http.get<SearchResult[]>('/api/search', { params: { q: query } });
  }
}
```

**Użycie w komponencie:**
```ts
export class SearchPage {
  private api = inject(SearchApi);
  protected store = inject(ListStore);   // protected = dostępne w szablonie
}
```

- `inject()` działa jak `@Autowired` przy polu, ale jest **bezpieczne i zalecane** w Angularze. Można też wstrzykiwać przez konstruktor, ale nowy styl to `inject()`.
- `providedIn: 'root'` oznacza, że Angular sam utworzy jeden egzemplarz, gdy ktoś go pierwszy raz potrzebuje.
- Dzięki DI w testach (TODO 12) podstawisz atrapę zamiast prawdziwego HTTP, zupełnie jak Mockito.

---

## 9. HTTP i Observable

```ts
this.http.get<ListItem[]>('/api/list')     // zwraca Observable<ListItem[]>
  .subscribe({
    next: (items) => this._items.set(items),   // sukces
    error: (err) => this._error.set(...),      // błąd
  });
```

**Najważniejsze o `Observable` z `HttpClient`:**
1. **Jest leniwy:** zapytanie **nie poleci**, dopóki ktoś nie wywoła `.subscribe()`. To najczęstszy błąd początkujących („wołam metodę, a nic się nie dzieje”).
2. Dla HTTP emituje **jedną wartość** (odpowiedź) i się kończy, więc w praktyce działa jak `CompletableFuture`.
3. `<ListItem[]>` to **tylko podpowiedź typu**. TypeScript nie sprawdza, czy serwer naprawdę zwrócił takie dane. Dlatego modele frontendu muszą zgadzać się z backendem.

**Proxy:** w kodzie piszemy `/api/list`, a nie `http://localhost:3000/api/list`. Serwer deweloperski Angulara przekazuje takie zapytania do backendu (`proxy.conf.json`). Dzięki temu nie ma problemów z CORS, a na produkcji adres się nie zmienia.

---

## 10. Routing

```ts
// app.routes.ts
export const routes: Routes = [
  { path: '', component: MyListPage },                       // localhost:4200/
  { path: 'search', loadComponent: () =>                     // localhost:4200/search
      import('./features/search/search-page').then((m) => m.SearchPage) },
  { path: '**', redirectTo: '' },                            // nieznany adres → strona główna
];
```

- **`<router-outlet />`** w `app.html` to miejsce, w którym router wyświetla aktualną stronę.
- **`routerLink`** to link bez przeładowania strony: `<a routerLink="/search">Szukaj</a>`. Zwykłe `href` przeładowałoby całą aplikację.
- **`routerLinkActive="active"`** dodaje klasę CSS, gdy link wskazuje aktualną stronę (podświetlenie w menu).
- **`loadComponent`** to **lazy loading**: kod strony pobiera się dopiero przy pierwszym wejściu na nią, więc aplikacja startuje szybciej.
- **Parametry trasy jako `input()`** (TODO 6): dla trasy `show/:id` wystarczy w komponencie napisać `id = input.required<string>()`. Działa to dzięki `withComponentInputBinding()` w `app.config.ts`.

---

## 11. Formularze (wstęp do TODO 8)

Angular ma dwa podejścia. Nowoczesne i zalecane do nauki to **reactive forms**: formularz opisujesz w kodzie TypeScript.

```ts
notes = new FormControl('', {
  nonNullable: true,
  validators: [Validators.maxLength(500)],
});
```
```html
<textarea [formControl]="notes"></textarea>
@if (notes.hasError('maxlength')) {
  <p class="error">Maksymalnie 500 znaków</p>
}
<button [disabled]="notes.invalid">Zapisz</button>
```
Komponent musi mieć `ReactiveFormsModule` w `imports`.

W wersji startowej pole wyszukiwania nie używa formularzy. Wartość trafia prosto do signala przez `(input)`. To najprostsze podejście przy jednym polu.

---

## 12. RxJS w minimalnej dawce (wstęp do TODO 7)

RxJS to biblioteka do pracy ze **strumieniami zdarzeń w czasie**: wpisywanie liter, kliknięcia, odpowiedzi HTTP. Strumień przetwarzasz operatorami w `.pipe(...)`, podobnie jak w Java Stream API, tylko w czasie:

| Operator | Co robi | Analogia z Java Stream |
|---|---|---|
| `map(x => ...)` | przekształca każdą wartość | `map` |
| `filter(x => ...)` | przepuszcza tylko pasujące | `filter` |
| `debounceTime(400)` | czeka 400 ms ciszy, a potem przepuszcza **ostatnią** wartość | (brak, to operator czasowy) |
| `distinctUntilChanged()` | pomija powtórzenia tej samej wartości | (podobne do `distinct`) |
| `switchMap(q => http...)` | dla każdej wartości startuje nowe zapytanie i **anuluje poprzednie** | (brak) |

**Signals czy RxJS?** Do **stanu** (co jest na liście, jaki filtr) używaj signals. Do **zdarzeń w czasie** (wpisywanie z opóźnieniem, anulowanie zapytań) sprawdza się RxJS. Mostki między nimi to `toSignal()` i `toObservable()` z `@angular/core/rxjs-interop`.

---

## 13. Backend: Node.js + Express

**Node.js** uruchamia JavaScript i TypeScript **poza przeglądarką**, na serwerze. **Express** to minimalistyczny framework HTTP, coś jak bardzo odchudzony Spring MVC.

```ts
// routes/list.ts
listRouter.get('/', async (_req, res) => {          // GET /api/list
  res.json(await listRepository.findAll());
});

listRouter.post('/', async (req, res) => {          // POST /api/list
  const created = await listRepository.add(parseNewItem(req.body));
  res.status(201).json(created);
});
```

| Spring | Express | Gdzie |
|---|---|---|
| `@RestController` + `@RequestMapping("/api/list")` | `Router()` podpięty w `app.use('/api/list', listRouter)` | `app.ts` |
| `@GetMapping`, `@PostMapping` | `router.get(...)`, `router.post(...)` | `routes/*.ts` |
| `@PathVariable id` | `req.params.id` | `routes/list.ts` |
| `@RequestParam q` | `req.query.q` | `routes/search.ts` |
| `@RequestBody` | `req.body` (dzięki `express.json()`) | `routes/list.ts` |
| `@RestControllerAdvice` | middleware błędów z 4 parametrami | `app.ts` |
| `ResponseStatusException` | `throw new HttpError(404, '...')` | `errors.ts` |
| `@Repository` | moduł `listRepository` | `repositories/` |

**`async`/`await`** to sposób na kod asynchroniczny, który wygląda jak synchroniczny. `await` „czeka” na wynik (np. odczyt pliku albo odpowiedź HTTP), ale **nie blokuje** serwera: w tym czasie Node obsługuje inne zapytania.

**TypeScript bez kompilacji:** Node 24 uruchamia pliki `.ts` bezpośrednio, bo po prostu usuwa typy. Stąd dwie zasady w backendzie: importy z końcówką `.ts` (`'./errors.ts'`) i brak niektórych konstrukcji (np. `enum`). Typy sprawdzasz komendą `npm run typecheck`.

---

## 14. Krok po kroku: co się dzieje po kliknięciu „Dodaj”

1. **`search-page.html`**: użytkownik klika „Dodaj” na karcie. `ShowCard` wywołuje `add.emit()`.
2. **`search-page.html`**: rodzic nasłuchuje `(add)="store.add(result)"` i woła serwis.
3. **`core/list-store.ts`**: `add()` wysyła `POST /api/list` z danymi serialu przez `HttpClient`.
4. **Proxy** (`proxy.conf.json`): serwer Angulara przekazuje zapytanie na `localhost:3000`.
5. **`backend/src/app.ts`**: Express parsuje JSON i kieruje zapytanie do `listRouter`.
6. **`backend/src/routes/list.ts`**: `parseNewItem()` waliduje dane; złe dane dają błąd 400.
7. **`backend/src/repositories/list-repository.ts`**: sprawdza duplikat (409), nadaje `id` i datę, zapisuje do `data/list.json`.
8. Backend odpowiada **201** z nową pozycją w JSON.
9. **`list-store.ts`**: w `next:` wykonuje `_items.update(list => [item, ...list])`.
10. **Signal się zmienił**, więc Angular przerysowuje to, co go czyta: licznik w menu i przycisk „✓ Na liście” na karcie. Bez żadnego ręcznego odświeżania.

---

## 15. Najczęstsze błędy

| Objaw | Przyczyna | Rozwiązanie |
|---|---|---|
| Wołam metodę z `HttpClient` i nic się nie dzieje | brak `.subscribe()` | Observable jest leniwy, więc trzeba go zasubskrybować |
| W szablonie widać `[object Object]` albo funkcję zamiast wartości | brak nawiasów przy signalu | `items()` zamiast `items` |
| „X is not a known element” | komponent nie jest w `imports` | dodaj go do `imports` w `@Component` |
| „The pipe 'percent' could not be found” | pipe nie jest w `imports` | dodaj `PercentPipe` do `imports` |
| `@for` wymaga `track` | brak `track` | `@for (x of list(); track x.id)` |
| Zapytania do `/api` dają 404 albo błąd połączenia | backend nie działa albo nie działa proxy | uruchom przez `npm run dev` w katalogu głównym |
| Zmieniłem signal, a widok się nie odświeża | zmiana obiektu „w środku” zamiast podmiany | `update(list => [...list, x])` zamiast `list().push(x)` |

---

## 16. Słowniczek

| Pojęcie | Znaczenie |
|---|---|
| **SPA** | aplikacja jednostronicowa: ładuje się raz, potem tylko podmienia widoki |
| **Komponent** | klocek UI: klasa, szablon i style |
| **Szablon** | HTML komponentu z wiązaniami (`{{ }}`, `[ ]`, `( )`, `@if`, `@for`) |
| **Signal** | reaktywna wartość, która powiadamia o zmianach |
| **computed** | signal wyliczany z innych signals |
| **effect** | kod uruchamiany po zmianie signals (efekty uboczne) |
| **input / output** | dane do komponentu / zdarzenia z komponentu |
| **Serwis** | klasa z logiką i stanem współdzielonym przez komponenty |
| **DI (Dependency Injection)** | Angular sam dostarcza zależności (`inject()`) |
| **Observable** | strumień wartości w czasie (RxJS); z HTTP przychodzi jedna wartość |
| **Pipe** | funkcja formatująca w szablonie (`| date`, `| percent`) |
| **Router** | mapuje adresy URL na komponenty (strony) |
| **Lazy loading** | ładowanie kodu strony dopiero przy wejściu na nią |
| **Zoneless** | tryb, w którym Angular odświeża widok na podstawie signals, bez zone.js |
| **Proxy** | przekierowanie `/api/*` z serwera Angulara do backendu |
| **Middleware** (Express) | funkcja, przez którą przechodzi zapytanie (parsowanie JSON, obsługa błędów) |
| **PrimeNG** | biblioteka gotowych komponentów UI dla Angulara (od TODO 5) |
| **Dyrektywa** | atrybut, który zmienia zachowanie lub wygląd elementu, np. `pInputText`, `routerLink` |

---

## 17. PrimeNG: biblioteka komponentów (od TODO 5)

**PrimeNG** to zestaw gotowych, ostylowanych komponentów dla Angulara: przyciski, pola formularzy, okna dialogowe, powiadomienia, tabele, kalendarze. Zamiast pisać wszystko od zera (HTML, CSS, obsługa klawiatury, dostępność), bierzesz gotowy klocek i konfigurujesz go przez `input()` i `output()`.

### Dlaczego dopiero w TODO 5?
W TODO 1–4 budujesz komponenty sam, żeby zrozumieć mechanizm. Potem PrimeNG oszczędza czas, a Ty **już rozumiesz**, co dzieje się w środku. To jak z kolekcjami w Javie: najpierw warto wiedzieć, jak działa `HashMap`, a potem po prostu go używać.

### Trzy rzeczy, które musisz zrozumieć

**1. Konfiguracja globalna (provider):** raz, w `app.config.ts`:
```ts
providePrimeNG({
  theme: { preset: Aura, options: { darkModeSelector: "[data-theme='dark']" } },
})
```
- `preset` to gotowy motyw (np. Aura): kolory, zaokrąglenia, cienie,
- `darkModeSelector` mówi PrimeNG, kiedy włączyć ciemne kolory. U nas wtedy, gdy `<html>` ma `data-theme="dark"`, czyli przy przełączniku z TODO 4.

**2. Komponenty i dyrektywy:** importujesz je w `imports` komponentu, tak jak własne:
```ts
@Component({
  imports: [ButtonModule, TagModule],   // albo pojedyncze komponenty - zależnie od wersji, zobacz dokumentację
  template: `
    <p-button label="Dodaj" icon="pi pi-plus" (onClick)="add()" />
    <p-tag value="Drama" severity="info" />
    <input pInputText [value]="query()" />     <!-- dyrektywa: dodaje styl do zwykłego <input> -->
  `,
})
```
- `<p-button>` to **komponent** (własny znacznik),
- `pInputText` to **dyrektywa**: atrybut, który „ulepsza” zwykły element HTML,
- zdarzenia PrimeNG często mają przedrostek `on`, np. `(onClick)`. Sprawdzaj w dokumentacji.

**3. Serwisy biblioteki:** niektóre komponenty steruje się przez serwis, np. powiadomienia:
```ts
private messages = inject(MessageService);          // wstrzyknięcie jak każdego serwisu
this.messages.add({ severity: 'success', summary: 'Dodano', detail: 'Breaking Bad' });
```
W szablonie głównym wystarczy raz umieścić `<p-toast />`, a `MessageService` musi być w `providers`.

### Jak czytać dokumentację komponentu ([primeng.org](https://primeng.org))
Każdy komponent ma te same sekcje:
- **Import**: co dodać do `imports`,
- **Basic / przykłady**: kod do skopiowania,
- **API → Properties (Inputs)**: co możesz ustawić, np. `label`, `severity`, `disabled`,
- **API → Emitters (Outputs)**: jakie zdarzenia emituje, np. `onClick`, `onChange`,
- **Theming**: jak zmienić wygląd.

To dokładnie te same `input()` i `output()`, które sam pisałeś w TODO 1, tylko w cudzym komponencie.

### Własny komponent czy z biblioteki?
| Sytuacja | Wybór |
|---|---|
| typowy element UI (przycisk, dialog, tabela, kalendarz) | **biblioteka**: szybciej, lepsza dostępność, mniej błędów |
| element specyficzny dla Twojej aplikacji (karta serialu) | **własny komponent**, ewentualnie zbudowany z mniejszych klocków PrimeNG |
| nauka mechanizmu | **raz napisz sam**, potem używaj biblioteki (TODO 1 → TODO 14) |

---

📚 **Dalej:** oficjalna dokumentacja i samouczki na **[angular.dev](https://angular.dev)**. Uważaj na stare tutoriale (z `NgModule`, `*ngIf`, `angular.io`), bo uczą przestarzałego stylu.
