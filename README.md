# 🍿 PopcornList

Twoja prywatna lista filmów i seriali: co oglądasz, co chcesz obejrzeć, co już widziałeś.
Projekt do nauki **nowoczesnego Angulara** i **Node.js**, rozwijany krok po kroku (także w trybie vibe coding).

---

## ✨ Funkcjonalność

### Działa już teraz (wersja startowa)
- 🔍 **Wyszukiwanie seriali** (dane z darmowego API TVmaze)
- ➕ **Dodawanie do swojej listy**: plakat, tytuł, rok
- ✅ **Oznaczanie jako obejrzane**
- 🗑️ **Usuwanie z listy**
- 💾 **Zapis listy na serwerze** (plik JSON), więc lista przetrwa odświeżenie strony i restart

### Docelowo (po zrobieniu 15 zadań z [`docs/TODO.md`](docs/TODO.md))
- 🎨 Interfejs na **PrimeNG**: powiadomienia, okna dialogowe, tabela z sortowaniem, własny motyw
- ⭐ Oceny w gwiazdkach i 📝 notatki do każdej pozycji
- 🎛️ Filtry (wszystkie / do obejrzenia / obejrzane) i 📊 statystyki
- 🌙 Tryb ciemny
- 📄 Strona szczegółów serialu (opis, gatunki, ocena, status)
- ⚡ Wyszukiwanie „na żywo” w trakcie pisania
- 📺 Śledzenie obejrzanych **sezonów i odcinków** z paskiem postępu
- 🎲 „Co dziś obejrzeć?”: losowanie z listy i dzisiejsze emisje w TV
- 🗄️ Baza danych SQLite zamiast pliku
- 🧪 Testy frontendu i backendu
- 🎬 **Filmy** (API TMDB, z rejestracją), czyli pełna lista filmów i seriali

---

## 🧱 Stack

| Warstwa | Technologia |
|---|---|
| Frontend | **Angular** (standalone components, signals, nowa składnia szablonów, zoneless) |
| UI | własny CSS → od TODO 5 **PrimeNG** (komponenty i motywy) |
| Review | agent Claude Code `reviewer` (`.claude/agents/reviewer.md`) |
| Backend | **Node.js** + **Express 5** + **TypeScript** (uruchamiany bezpośrednio przez Node) |
| Dane | plik JSON → w TODO 10 **SQLite** |
| Zewnętrzne API | **TVmaze** (seriale, bez klucza) → w TODO 13 **TMDB** (filmy, z kluczem) |

---

## 🚀 Uruchomienie

**Wymagania:** Node.js **24.15+** (`node -v`)

```powershell
cd $env:USERPROFILE\dev-workspace\projects\popcornList

npm run setup     # instalacja zależności (tylko za pierwszym razem)
npm run dev       # uruchamia backend i frontend naraz
```

Otwórz **http://localhost:4200** 🎉

| Co | Adres |
|---|---|
| Aplikacja (Angular) | http://localhost:4200 |
| API (Node) | http://localhost:3000/api/health |

---

## 📁 Struktura

```
popcornList/
├── frontend/                  ← Angular
│   ├── proxy.conf.json        ← przekierowuje /api/* do backendu
│   └── src/app/
│       ├── core/              ← modele danych, serwisy (stan listy, wyszukiwanie)
│       ├── features/          ← strony: Moja lista, Szukaj
│       └── shared/            ← komponenty wielokrotnego użytku (karta serialu)
├── backend/                   ← Node.js + Express
│   └── src/
│       ├── routes/            ← endpointy REST (/api/list, /api/search)
│       ├── services/          ← klient zewnętrznego API (TVmaze)
│       └── repositories/      ← zapis i odczyt listy (plik JSON)
├── docs/
│   ├── TEORIA-ANGULAR.md      ← jak działa Angular (dla programisty Javy)
│   └── TODO.md                ← krok 0 + 15 zadań rozwijających aplikację
├── .claude/agents/reviewer.md ← agent AI do code review
└── CLAUDE.md                  ← zasady pracy z Claude Code (najpierw sam, AI pomaga)
```

---

## 📜 Źródła danych
- Dane seriali: **[TVmaze](https://www.tvmaze.com/api)** (licencja CC BY-SA)
