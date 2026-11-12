# 📋 TODO: rozwój PopcornList

Każde zadanie rozwija działającą aplikację. Po każdym aplikacja nadal działa, tylko umie więcej.
W kodzie miejsca do zmiany są oznaczone komentarzem **`TODO(numer)`**. W VS Code znajdziesz je przez `Ctrl+Shift+F` i wpisanie np. `TODO(3)`.

| Poziom | Zadania | O czym |
|---|---|---|
| 🟢 Proste | 1–4 | podstawy Angulara: komponenty, signals. Czysty Angular, bez bibliotek. |
| 🟡 Średnie | 5–9 | PrimeNG, routing, RxJS, formularze, obsługa błędów |
| 🟠 Zaawansowane | 10–14 | złożone dane, baza danych, testy, `@defer`, dopracowanie UI |
| 🔵 Plan | 15 | integracja z API wymagającym klucza i dodanie filmów |

**Od TODO 5 używasz komponentów PrimeNG**, więc nie tracisz czasu na pisanie CSS i skupiasz się na logice.

## Jak pracować
1. **Najpierw spróbuj sam.** Każde zadanie ma kroki, wskazówki i sekcję „🎯 Ćwiczysz”.
2. Utknąłeś? Napisz do Claude: **„podpowiedź do TODO 3”**. Dostaniesz wskazówkę, bez gotowego kodu.
3. Skończyłeś? Napisz: **„użyj reviewera do sprawdzenia TODO 3”**. Agent zrobi review (opis niżej).
4. Popraw uwagi z review, zrób commit i zaktualizuj status w tabeli.
5. Nie masz czasu albo ochoty na dane zadanie? **„vibe: zrób TODO 3 i wyjaśnij”**. Claude napisze kod i wyjaśni, co zrobił.

## 🤖 Agent do review
W projekcie jest agent `reviewer` (`.claude/agents/reviewer.md`). Jak go używać:
- **„użyj reviewera do sprawdzenia TODO 3”**: sprawdza Twoje zmiany pod kątem opisu zadania,
- **„reviewer: sprawdź moje niezacommitowane zmiany”**: ogólne review.

Agent czyta opis zadania, Twój kod (`git diff`), uruchamia sprawdzanie typów i testy, a potem zwraca:
✅ co dobre → 🔧 co poprawić i dlaczego → 💡 dobra praktyka → **werdykt: gotowe / do poprawy**.
**Niczego nie zmienia w kodzie.** Poprawki robisz sam, bo na nich najwięcej się uczysz.

## Postęp

| # | Zadanie | Poziom | Status |
|---|---|---|---|
| 0 | GitHub i VS Code, pierwsze wypchnięcie projektu | 🟢 | ⬜ |
| 1 | Ocena w gwiazdkach | 🟢 | ⬜ |
| 2 | Filtr listy | 🟢 | ⬜ |
| 3 | Statystyki | 🟢 | ⬜ |
| 4 | Tryb ciemny | 🟢 | ⬜ |
| 5 | Wprowadzenie PrimeNG | 🟡 | ⬜ |
| 6 | Strona szczegółów serialu | 🟡 | ⬜ |
| 7 | Wyszukiwanie „na żywo” | 🟡 | ⬜ |
| 8 | Notatki (formularz w oknie dialogowym) | 🟡 | ⬜ |
| 9 | Ładowanie, błędy, interceptor | 🟡 | ⬜ |
| 10 | Sezony i odcinki | 🟠 | ⬜ |
| 11 | SQLite zamiast pliku JSON | 🟠 | ⬜ |
| 12 | Testy frontendu i backendu | 🟠 | ⬜ |
| 13 | „Co dziś obejrzeć?” i `@defer` | 🟠 | ⬜ |
| 14 | Dopracowanie UI z PrimeNG | 🟠 | ⬜ |
| 15 | Plan: TMDB i filmy | 🔵 | ⬜ |

Legenda: ⬜ do zrobienia · 🟡 w trakcie · ✅ zrobione

---

## 0. 🟢 GitHub i VS Code: pierwsze wypchnięcie projektu

**Cel:** projekt jest w repozytorium na GitHubie, a commity robisz wygodnie z VS Code.

**🎯 Ćwiczysz:** Git w VS Code (panel Source Control), połączenie VS Code z kontem GitHub, `.gitignore` i pilnowanie, żeby sekrety nie trafiły do repozytorium.

**Kroki:**
1. **Konfiguracja Gita** (jeśli jeszcze jej nie robiłeś). W PowerShellu:
   ```powershell
   git config --global user.name "Imię Nazwisko"
   git config --global user.email "twoj@email.com"   # ten sam co na GitHubie
   git config --global init.defaultBranch main
   ```
2. **VS Code:** zainstaluj ze strony [code.visualstudio.com](https://code.visualstudio.com) i otwórz folder projektu (`File → Open Folder` → `popcornList`). VS Code zaproponuje rozszerzenie **Angular Language Service**. Zainstaluj je.
3. **Logowanie do GitHuba:** kliknij ikonę konta (lewy dolny róg) → **Sign in with GitHub** → zaloguj się w przeglądarce.
4. **Inicjalizacja repozytorium:** panel **Source Control** (`Ctrl+Shift+G`) → **Initialize Repository**.
5. **Sprawdź listę zmian, zanim zrobisz commit!** Na liście **NIE** może być:
   - `node_modules/` (tysiące plików, instaluje się je przez `npm install`),
   - `backend/.env` (sekrety),
   - `backend/data/` (Twoja prywatna lista).

   Jeśli coś z tego widzisz, sprawdź `.gitignore`.
6. **Pierwszy commit:** wpisz wiadomość, np. `Start: PopcornList (Angular + Node)`, i kliknij **Commit**. Jeśli VS Code zapyta o „stage all changes”, wybierz **Yes**.
7. **Publikacja:** kliknij **Publish Branch** → wybierz **public** albo **private**. VS Code sam utworzy repozytorium `popcornList` na GitHubie.
8. Otwórz repozytorium na github.com i sprawdź, czy README ładnie się wyświetla.

**Gotowe, gdy:** projekt jest na GitHubie, a na liście plików nie ma `node_modules`, `.env` ani `data`.

---

## 1. 🟢 Ocena w gwiazdkach (1–5)

**Cel:** na karcie serialu z listy można kliknąć od 1 do 5 gwiazdek. Ocena zapisuje się na serwerze.

**🎯 Ćwiczysz:** tworzenie własnego komponentu od zera, **`input()`** (dane do komponentu) i **`output()`** (zdarzenie z komponentu), komunikację rodzic ↔ dziecko oraz rozszerzenie API o nowe pole.

**Kroki:**
1. Backend, `types.ts`: dodaj `rating: number | null` do `ListItem` i `ListItemChanges`. W `list-repository.ts` nowe pozycje dostają `rating: null`.
2. Backend, `routes/list.ts`: w `parseChanges` przyjmij `rating`, czyli liczbę całkowitą 1–5 albo `null`. Inne wartości dają błąd 400.
3. Frontend, `core/models.ts`: dodaj `rating` do typu `ListItem`.
4. Utwórz komponent `shared/star-rating/star-rating.ts`:
   - `value = input<number | null>(null)`: aktualna ocena,
   - `rated = output<number>()`: emitowane po kliknięciu gwiazdki,
   - w szablonie `@for` po `[1, 2, 3, 4, 5]`, a gwiazdka „pełna”, jeśli `n <= value()`.
5. W `ListStore` dodaj metodę `rate(item, rating)`, wzorowaną na `toggleWatched`.
6. Użyj `<app-star-rating>` w `show-card` (tylko w trybie listy) i podepnij zdarzenie.

**Gotowe style** (wklej do `star-rating.css`, żeby nie tracić czasu na CSS):
```css
.stars { display: inline-flex; gap: 2px; }
.star { background: none; border: none; cursor: pointer; font-size: 1.3rem; padding: 0; color: #c9c9c9; }
.star.filled { color: #f5b301; }
.star:hover { transform: scale(1.15); }
```

**Bonus:** kliknięcie w aktualną ocenę ją kasuje (`null`). W TODO 14 porównasz swój komponent z gotowym `<p-rating>`.

---

## 2. 🟢 Filtr listy

**Cel:** nad listą trzy przyciski: **Wszystkie / Do obejrzenia / Obejrzane**.

**🎯 Ćwiczysz:** **`signal()`** jako stan komponentu, **`computed()`** do wyliczania przefiltrowanej listy, wiązanie klas (`[class.active]`) i zdarzeń (`(click)`).

**Kroki:**
1. W `my-list-page.ts` dodaj `filter = signal<'all' | 'toWatch' | 'watched'>('all')`.
2. Dodaj `visibleItems = computed(() => ...)`, który filtruje `store.items()` według `filter()`.
3. W szablonie zamień `@for` po `store.items()` na `visibleItems()`.
4. Dodaj trzy przyciski, które ustawiają filtr: `(click)="filter.set('watched')"`. Aktywny przycisk wyróżnij: `[class.active]="filter() === 'watched'"`.

**Gotowe style** (do `my-list-page.css`):
```css
.filters { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.filters button { padding: 0.4rem 0.9rem; border-radius: 999px; border: 1px solid var(--border); background: var(--surface); color: var(--text); cursor: pointer; }
.filters button.active { background: var(--primary); border-color: var(--primary); color: #fff; }
```

---

## 3. 🟢 Statystyki

**Cel:** w nagłówku albo nad listą widać np. „📺 12 na liście · ✅ 5 obejrzanych · ⏳ 7 do obejrzenia (42%)”.

**🎯 Ćwiczysz:** **`computed()`** do stanu pochodnego w serwisie, **pipes** (`percent`) i `@if` do obsługi pustej listy.

**Kroki:**
1. W `core/list-store.ts` dodaj `computed`: `totalCount`, `watchedCount`, `toWatchCount` i `watchedPercent`.
2. Wyświetl je w `my-list-page.html` (albo w `app.html`, żeby były widoczne wszędzie).
3. Użyj pipe'a: `{{ store.watchedPercent() | percent }}`. Pamiętaj o `PercentPipe` w `imports` komponentu.
4. Gdy lista jest pusta, nie pokazuj statystyk (`@if`).

**Pytanie do przemyślenia:** dlaczego statystyki lepiej trzymać w serwisie (`ListStore`) niż w komponencie?

---

## 4. 🟢 Tryb ciemny

**Cel:** przycisk 🌙/☀️ w nagłówku przełącza motyw. Wybór jest zapamiętany po odświeżeniu.

**🎯 Ćwiczysz:** własny **serwis** (`@Injectable`, `inject()`), **`effect()`** do efektów ubocznych (zapis do `localStorage`, zmiana atrybutu na `<html>`) i zmienne CSS.

**Kroki:**
1. W `src/styles.css` motyw jasny jest w zmiennych `:root`, a **ciemne kolory czekają już w zakomentowanym bloku** `[data-theme='dark']`. Odkomentuj go.
2. Utwórz `core/theme.ts`, czyli serwis z `theme = signal<'light' | 'dark'>(...)`. Wartość startowa pochodzi z `localStorage` albo z ustawień systemu (`matchMedia('(prefers-color-scheme: dark)')`).
3. W konstruktorze serwisu dodaj `effect()`, który przy każdej zmianie motywu:
   - ustawia `document.documentElement.dataset['theme']`,
   - zapisuje wartość do `localStorage`.
4. Dodaj przycisk w `app.html`, który przełącza motyw (miejsce jest oznaczone `TODO(4)`).

**Pytanie do przemyślenia:** czym różni się `effect()` od `computed()`? Kiedy którego użyć?

---

## 5. 🟡 Wprowadzenie PrimeNG

**Cel:** w projekcie działa biblioteka komponentów **PrimeNG**. Przyciski i komunikaty korzystają z jej komponentów, a tryb ciemny z TODO 4 przełącza także motyw PrimeNG.

**🎯 Ćwiczysz:** dodawanie biblioteki do istniejącego projektu, konfigurację przez **providery** w `app.config.ts`, system motywów, czytanie dokumentacji komponentów i wstrzykiwanie serwisu biblioteki (`MessageService`).

**Kroki:**
1. Instalacja (w `frontend/`):
   ```powershell
   npm install primeng @primeuix/themes primeicons
   ```
2. W `app.config.ts` dodaj `providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: "[data-theme='dark']" } } })`. Dzięki `darkModeSelector` tryb ciemny z TODO 4 zadziała także dla PrimeNG, bez dodatkowego kodu.
3. Ikony: dodaj `primeicons/primeicons.css` do `styles` w `angular.json` (albo zaimportuj w `styles.css`).
4. **Przyciski:** zamień zwykłe `<button>` na `<p-button>` (`label`, `icon`, `severity`, `text`, `outlined`) w karcie serialu, w wyszukiwarce i w filtrach z TODO 2. Usuń niepotrzebny już CSS przycisków.
5. **Komunikaty:** zamień czerwony baner błędów (`store.error()`) na **`<p-toast>`**:
   - dodaj `MessageService` do `providers` w `app.config.ts`,
   - w `ListStore` przy błędzie wołaj `messageService.add({ severity: 'error', summary: 'Błąd', detail: ... })`,
   - przy udanym dodaniu pokaż powiadomienie „Dodano do listy ✓” (`severity: 'success'`).
6. Sprawdź, czy przycisk trybu ciemnego przełącza też komponenty PrimeNG.

**Dokumentacja:** [primeng.org](https://primeng.org). Każdy komponent ma przykłady i opis API (sekcje *Inputs* i *Events*). To dokładnie te same `input()` i `output()`, które poznałeś w TODO 1.

---

## 6. 🟡 Strona szczegółów serialu

**Cel:** kliknięcie w tytuł otwiera stronę `/show/123` z dużym plakatem, opisem, gatunkami, oceną, statusem (np. „Ended”) i stacją TV.

**🎯 Ćwiczysz:** **routing** (nowa trasa z parametrem), **parametry trasy jako `input()`** (`withComponentInputBinding`), `routerLink`, nowy endpoint w Node, stany ładowania i komponenty PrimeNG `p-tag` i `p-skeleton`.

**Kroki:**
1. Backend, `services/tvmaze.ts`: funkcja `getShowDetails(id)` → `GET https://api.tvmaze.com/shows/{id}`. Zmapuj odpowiedź na nowy typ `ShowDetails` (dodaj go do `types.ts`).
2. Backend: nowy plik `routes/shows.ts` z `GET /api/shows/:id`. Podłącz go w `app.ts`.
3. Frontend: dodaj typ `ShowDetails` w `models.ts` i metodę `getDetails(id)` w `search-api.ts`.
4. Utwórz stronę `features/show-details/show-details-page.ts`. Parametr `id` odbierz jako `id = input.required<string>()`. To działa dzięki `withComponentInputBinding()` w `app.config.ts`, które już jest włączone.
5. W `app.routes.ts` dodaj trasę `{ path: 'show/:id', loadComponent: () => import(...) }`. To **lazy loading**.
6. W `show-card` zrób z tytułu link: `[routerLink]="['/show', item().externalId]"`.
7. UI: gatunki jako `<p-tag>`, a podczas ładowania `<p-skeleton>` w miejscu plakatu i tekstu.

**Bonus:** przycisk „Dodaj do listy” na stronie szczegółów.

---

## 7. 🟡 Wyszukiwanie „na żywo”

**Cel:** wyniki pojawiają się w trakcie pisania (bez klikania „Szukaj”), ale nie przy każdym naciśnięciu klawisza. Dopiero 400 ms po przerwie w pisaniu i od 2 znaków.

**🎯 Ćwiczysz:** podstawy **RxJS** (`debounceTime`, `distinctUntilChanged`, `switchMap`), łączenie **signals ↔ Observable** (`toObservable`, `toSignal`) i anulowanie nieaktualnych zapytań HTTP.

**Kroki:**
1. W `search-page.ts` zamień ręczne `search()` na strumień:
   ```ts
   results = toSignal(
     toObservable(this.query).pipe(
       debounceTime(400),
       distinctUntilChanged(),
       filter((q) => q.trim().length >= 2),
       switchMap((q) => this.api.search(q)),
     ),
     { initialValue: [] },
   );
   ```
2. Zrozum, co robi `switchMap`: gdy przyjdzie nowe zapytanie, **anuluje** poprzednie. Wtedy stara, wolniejsza odpowiedź nie nadpisze nowszej.
3. Pole wyszukiwania zamień na `pInputText` z ikoną lupy (`p-iconfield` + `p-inputicon`).

**Alternatywa do porównania:** sprawdź API `httpResource` / `resource` w dokumentacji Angulara, czyli nowszy sposób ładowania danych oparty na signals.

---

## 8. 🟡 Notatki (formularz w oknie dialogowym)

**Cel:** przy pozycji na liście jest przycisk 📝. Otwiera okno z notatką (np. „polecił Marek”, „skończyłem na S2E5”). Edycja w formularzu z walidacją.

**🎯 Ćwiczysz:** **reactive forms** (`FormControl`, `Validators`), komunikaty walidacji, okno dialogowe (`p-dialog`) sterowane signalem i endpoint `PATCH` z walidacją po stronie serwera, czyli walidację w dwóch miejscach i to, dlaczego obie są potrzebne.

**Kroki:**
1. Backend: pole `notes: string` (domyślnie `""`) w `types.ts`, w repozytorium i w `parseChanges`, maks. 500 znaków.
2. Frontend: komponent `shared/notes-dialog/notes-dialog.ts` z `<p-dialog [(visible)]="...">` i `FormControl<string>` z `Validators.maxLength(500)`.
3. Pole: `<textarea pTextarea [formControl]="notes">` z licznikiem znaków („123/500”) i komunikatem błędu.
4. Przyciski „Zapisz” i „Anuluj” (`p-button`). „Zapisz” jest wyłączony, gdy formularz jest niepoprawny albo nic się nie zmieniło.
5. Zapis przez nową metodę `ListStore.updateNotes(item, notes)` i powiadomienie przez `p-toast`.

**Pytanie do przemyślenia:** skoro frontend waliduje długość, po co walidacja na backendzie?

---

## 9. 🟡 Ładowanie, błędy i interceptor

**Cel:** aplikacja zachowuje się porządnie, gdy coś idzie nie tak: brak internetu, TVmaze nie odpowiada, wyłączony backend.

**🎯 Ćwiczysz:** **funkcyjny HTTP interceptor** (`HttpInterceptorFn`), globalną obsługę błędów, stany UI (ładowanie, błąd, pusto, dane), **timeout** po stronie Node i spójny format błędów API.

**Kroki:**
1. Backend, `services/tvmaze.ts`: dodaj timeout `fetch(url, { signal: AbortSignal.timeout(5000) })` i obsłuż przekroczenie czasu jako błąd 504 z czytelnym komunikatem.
2. Frontend: utwórz `core/error.interceptor.ts`, który przechwytuje **każdy** błąd HTTP i pokazuje `p-toast` z polem `message` odpowiedzi backendu (albo ogólnym komunikatem, gdy backend nie odpowiada). W interceptorze użyj `inject(MessageService)`.
3. Zarejestruj go: `provideHttpClient(withFetch(), withInterceptors([errorInterceptor]))`.
4. Usuń obsługę błędów rozsianą po `ListStore` i stronach, bo interceptor robi to w jednym miejscu.
5. Globalny wskaźnik ładowania: drugi interceptor liczy trwające zapytania (signal w serwisie), a w nagłówku pojawia się cienki `p-progressbar` (`mode="indeterminate"`).
6. Przetestuj: zatrzymaj backend i spróbuj dodać serial.

---

## 10. 🟠 Sezony i odcinki

**Cel:** na stronie szczegółów (TODO 6) widać listę sezonów i odcinków z checkboxami „obejrzane” oraz pasek postępu. Zaznaczenie wszystkich odcinków automatycznie oznacza serial jako obejrzany.

**🎯 Ćwiczysz:** pracę ze **złożonymi, zagnieżdżonymi danymi**, grupowanie (odcinki → sezony), projektowanie API (co zapisywać i jak), `computed` dla postępu oraz `p-accordion`, `p-checkbox` i `p-progressbar`.

**Kroki:**
1. Backend: `getEpisodes(id)` → `GET https://api.tvmaze.com/shows/{id}/episodes` i endpoint `GET /api/shows/:id/episodes`.
2. Backend: pole `watchedEpisodeIds: number[]` w `ListItem`. Zastanów się nad API: przesyłać całą tablicę w `PATCH` czy dodać osobne endpointy, np. `PUT /api/list/:id/episodes/:episodeId`? Zapisz swoją decyzję i uzasadnienie.
3. Frontend: pogrupuj odcinki po sezonach (`computed` + `Map` albo `reduce`) i wyświetl sezony jako panele `p-accordion`.
4. Pasek postępu (`p-progressbar`) dla całego serialu i dla każdego sezonu („S1: 8/10”).
5. Przycisk „zaznacz cały sezon”.
6. Gdy obejrzane są wszystkie odcinki, ustaw `watched: true`.

---

## 11. 🟠 SQLite zamiast pliku JSON

**Cel:** lista jest przechowywana w prawdziwej bazie danych. Reszta aplikacji (routy, frontend) **nie zmienia się wcale**.

**🎯 Ćwiczysz:** SQL (tabele, `SELECT`, `INSERT`, `UPDATE`, `DELETE`, parametry zapytań), **wzorzec repozytorium** (podmiana implementacji za tym samym interfejsem), **migrację danych** i ochronę przed SQL injection.

**Kroki:**
1. Użyj modułu wbudowanego w Node: `import { DatabaseSync } from 'node:sqlite'`. Nie trzeba niczego instalować. Możliwe, że Node wypisze ostrzeżenie „experimental”; w projekcie do nauki to nie problem.
2. Utwórz `repositories/sqlite-list-repository.ts` z **tymi samymi funkcjami** co `listRepository`: `findAll`, `add`, `update`, `remove`.
3. Przy starcie utwórz tabelę (`CREATE TABLE IF NOT EXISTS list_items (...)`). Pomyśl, jak zapisać `watchedEpisodeIds` z TODO 10: osobna tabela czy JSON w kolumnie?
4. **Zawsze używaj parametrów** (`db.prepare('... WHERE id = ?').get(id)`), nigdy nie sklejaj SQL ze Stringów.
5. Napisz skrypt `scripts/migrate-json-to-sqlite.ts`, który przeniesie istniejące dane z `data/list.json`.
6. Podmień import w routach na nowe repozytorium.

**Porównanie z Javą:** to dokładnie ten sam pomysł co interfejs repozytorium w Spring Data. Zmieniasz implementację, a serwisy i kontrolery tego nie zauważają.

---

## 12. 🟠 Testy frontendu i backendu

**Cel:** kluczowa logika ma automatyczne testy, które uruchamiasz jedną komendą.

**🎯 Ćwiczysz:** testowanie serwisów Angulara (`TestBed`, `HttpTestingController`, czyli atrapa HTTP), testy komponentów, testy API w Node (`node:test`) oraz przypadki brzegowe i błędy.

**Kroki:**
1. **Frontend** (`npm test` w `frontend/`; nowy Angular domyślnie używa Vitest):
   - `ListStore`: `load()` ustawia `items`, `add()` dodaje na początek listy, `remove()` usuwa. Użyj `provideHttpClientTesting()` i `HttpTestingController`.
   - `ShowCard`: wyświetla tytuł i rok; kliknięcie „Dodaj” emituje zdarzenie.
   - Statystyki i filtr z TODO 2–3.
2. **Backend** (`node --test`):
   - plik `src/app.test.ts`: uruchom `createApp()` na losowym porcie (`listen(0)`) i odpytuj endpointy przez `fetch`,
   - przypadki: POST z poprawnymi danymi daje 201, duplikat daje 409, brak tytułu daje 400, PATCH nieistniejącej pozycji daje 404,
   - testy nie mogą psuć Twojej prawdziwej listy, więc ustaw osobny plik danych albo bazę w pamięci (np. przez zmienną środowiskową).
3. Dodaj skrypt `"test"` w `package.json` backendu i w głównym `package.json`.

**Porównanie z Javą:** `HttpTestingController` to odpowiednik Mockito dla HTTP, a test API przypomina `@SpringBootTest` z `TestRestTemplate`.

---

## 13. 🟠 „Co dziś obejrzeć?” i `@defer`

**Cel:** nowa strona `/tonight`:
- przycisk 🎲 **„Losuj”** wybiera losowy serial z listy „do obejrzenia”,
- sekcja **„Dziś w TV”** pokazuje dzisiejsze emisje (TVmaze), ładowane dopiero po przewinięciu.

**🎯 Ćwiczysz:** **`@defer`** (leniwe ładowanie fragmentu widoku z `@placeholder` i `@loading`), nowy endpoint z danymi zależnymi od daty i łączenie danych (oznacz w emisjach seriale, które masz na liście).

**Kroki:**
1. Backend: `getTodaySchedule()` → `GET https://api.tvmaze.com/schedule?country=PL` (możesz przetestować też `US`) i endpoint `GET /api/schedule`.
2. Frontend: strona `features/tonight/tonight-page.ts` z trasą `/tonight` (lazy loading jak w TODO 6).
3. Losowanie: `computed` z listą kandydatów i `signal` z wylosowaną pozycją. Pomyśl, jak uniknąć wylosowania dwa razy z rzędu tego samego.
4. Sekcja „Dziś w TV” w osobnym komponencie, opakowana w:
   ```html
   @defer (on viewport) {
     <app-today-schedule />
   } @placeholder {
     <p-skeleton height="8rem" />
   } @loading {
     <p-progressbar mode="indeterminate" />
   }
   ```
5. W emisjach wyróżnij seriale, które są na Twojej liście (`p-tag` „Na liście”).

---

## 14. 🟠 Dopracowanie UI z PrimeNG

**Cel:** aplikacja wygląda i działa jak „prawdziwy produkt”: alternatywny widok tabeli, własne kolory i dobre działanie na telefonie.

**🎯 Ćwiczysz:** zaawansowany komponent **`p-table`** (sortowanie, filtrowanie, paginacja), **własny preset motywu** (`definePreset`), responsywność oraz świadomy wybór między własnym komponentem a gotowym z biblioteki.

**Kroki:**
1. **Widok tabeli:** na „Mojej liście” przełącznik **Kafelki / Tabela** (`p-selectbutton`). Widok tabeli to `p-table` z kolumnami: plakat, tytuł, rok, ocena, status i akcje, z sortowaniem po każdej kolumnie i paginacją. Wybrany widok zapamiętaj w `localStorage`.
2. **Własny motyw:** utwórz preset na bazie Aura z „popcornowym” kolorem głównym (np. żółto-pomarańczowym) przez `definePreset(Aura, { semantic: { primary: {...} } })`.
3. **Gwiazdki: porównanie.** Zamień swój `star-rating` z TODO 1 na `<p-rating>` w jednym miejscu. Porównaj w README: co daje gotowy komponent, a co własny? Kiedy wybrać który?
4. **Potwierdzenie usuwania:** `p-confirmdialog` („Na pewno usunąć ‘Breaking Bad’?”).
5. **Responsywność:** na telefonie menu zwija się do ikon, a karty układają się w jedną kolumnę. Sprawdź w DevTools (`F12` → ikona telefonu).

---

## 15. 🔵 Plan: TMDB i filmy

**Cel:** aplikacja obsługuje **filmy i seriale**. Dane filmów pochodzą z **TMDB** (The Movie Database), które wymaga darmowej rejestracji i klucza API.

**🎯 Ćwiczysz:** integrację z **API wymagającym uwierzytelnienia**, bezpieczne przechowywanie sekretów (`.env`), **wzorzec adaptera** (dwa źródła danych za jednym interfejsem), rozszerzanie modelu danych bez psucia istniejących danych i warunki licencyjne zewnętrznych API.

### Etap 1: Rejestracja i klucz
1. Załóż konto na [themoviedb.org](https://www.themoviedb.org).
2. W ustawieniach konta, w sekcji **API**, poproś o dostęp. Do projektu prywatnego i do nauki wystarczy darmowy dostęp. Skopiuj **API Read Access Token**.
3. Skopiuj `backend/.env.example` do `backend/.env` i wpisz `TMDB_API_TOKEN=...`.
4. ⚠️ Token **tylko** w `backend/.env`. Nigdy we frontendzie (każdy mógłby go podejrzeć w przeglądarce) ani w repozytorium. Przed commitem sprawdź, czy `.env` nie ma na liście zmian.

### Etap 2: Backend, drugi dostawca danych
1. `types.ts`: `Source = 'tvmaze' | 'tmdb'`.
2. Nowy plik `services/tmdb.ts`:
   - wyszukiwanie filmów: `GET https://api.themoviedb.org/3/search/movie?query=...&language=pl-PL`, z nagłówkiem `Authorization: Bearer ${process.env.TMDB_API_TOKEN}`,
   - mapowanie na **ten sam** typ `SearchResult` z `type: 'movie'` i `source: 'tmdb'`,
   - plakaty: `https://image.tmdb.org/t/p/w342{poster_path}`.
3. Brak tokenu nie może wywalać serwera: wyszukiwanie filmów zwraca wtedy czytelny błąd 503 „Brak klucza TMDB”, a seriale z TVmaze działają dalej.
4. `routes/search.ts`: parametr `?type=series|movie|all`. Dla `all` wyszukaj w obu źródłach **równolegle** (`Promise.all`) i połącz wyniki.
5. `parseNewItem`: akceptuj `source: 'tmdb'`.

### Etap 3: Frontend
1. `models.ts`: zaktualizuj `Source`.
2. Na stronie wyszukiwania przełącznik **Seriale / Filmy / Wszystko** (`p-selectbutton`).
3. Na kartach ikonka 🎬 (film) albo 📺 (serial). Na liście możesz dodać filtr po typie (rozszerzenie TODO 2).
4. Szczegóły filmu (rozszerzenie TODO 6): trasa rozróżnia źródło, np. `/movie/:id` albo `/details/:source/:id`.

### Etap 4: Decyzje do podjęcia (zapisz je w README)
- Czy seriale też przenieść do TMDB (jedno źródło, opisy po polsku), czy zostawić TVmaze (odcinki i emisje z TODO 10 i 13)?
- Jak traktować seriale zapisane wcześniej z `source: 'tvmaze'`? Migracja czy współistnienie?
- **Licencja TMDB:** w aplikacji trzeba umieścić informację o źródle danych, np. w stopce: *„This product uses the TMDB API but is not endorsed or certified by TMDB”* wraz z logo TMDB. Sprawdź aktualne zasady na stronie TMDB.

**Gotowe, gdy:** wyszukasz film, dodasz go do listy obok seriali, a aplikacja nadal działa bez tokenu TMDB (tylko filmy są wtedy niedostępne).
