# CLAUDE.md: PopcornList

## Czym jest ten projekt
Prywatny projekt do nauki i zabawy: aplikacja z listą filmów i seriali.
Stack: **Angular** (aktualna wersja: standalone, signals, `@if`/`@for`, zoneless) i **Node.js + Express + TypeScript**.
Autor: programista Javy uczący się Angulara. Słabo zna Angulara, dobrze zna Javę.

## Tryb pracy: NAJPIERW SAM, AI POMAGA
Autor chce **najpierw kodować samodzielnie**. Domyślnie:
- **Nie pisz rozwiązań zadań z `docs/TODO.md`.** Na „podpowiedź do TODO X” dawaj wskazówki stopniowo: najpierw kierunek (który plik, które API), potem konkretniejsza wskazówka, a fragment kodu dopiero na wyraźną prośbę.
- **Vibe coding tylko na wyraźne hasło**, np. „vibe: …” albo „zrób za mnie TODO X”. Wtedy piszesz kod, a **po zmianie krótko wyjaśniasz** (3–6 punktów), co zrobiłeś i dlaczego, z porównaniem do Javy i Springa, gdy to pomaga.
- **Review:** do sprawdzania rozwiązań służy agent `reviewer` (`.claude/agents/reviewer.md`). Gdy autor prosi o review, użyj tego agenta.
- Rzeczy poboczne (konfiguracja, błędy środowiska, wyjaśnienia teorii) możesz robić normalnie.
- Odsyłaj do `docs/TEORIA-ANGULAR.md`, gdy pojawia się temat z teorii.
- Po zaliczeniu TODO zaktualizuj jego status w `docs/TODO.md` (⬜ → ✅).
- **Autor nie chce tracić czasu na CSS:** przy podpowiedziach dawaj gotowe style do skopiowania, a od TODO 5 korzystaj z komponentów PrimeNG.
- **Odpowiadaj po polsku.**

## Zasady techniczne
- UI: wersja startowa ma własny, prosty CSS. **PrimeNG wchodzi w TODO 5**, więc przed TODO 5 nie dodawaj go do projektu.
- Frontend: komponenty standalone, `signal`/`computed`/`effect`, `input()`/`output()`, `inject()`, nowa składnia szablonów (`@if`, `@for`, `@switch`, `@defer`). **Nie używaj** `NgModule`, `*ngIf`, `*ngFor` ani konstruktorowego DI.
- Backend: Node uruchamia `.ts` bezpośrednio (type stripping), więc **importy z rozszerzeniem `.ts`**, bez `enum`, bez parameter properties w konstruktorach (`erasableSyntaxOnly`). Sprawdzanie typów: `npm run typecheck` w `backend/`.
- Klucze API **tylko w `backend/.env`** (w `.gitignore`). Nigdy w kodzie frontendu ani w repozytorium.
- Typy danych: `backend/src/types.ts` i `frontend/src/app/core/models.ts` muszą być zgodne.
- W plikach repozytorium nie wpisuj nazwy użytkownika Windows. Ścieżki zapisuj jako `%USERPROFILE%` albo względne.
- Pliki twórz tylko w tym projekcie (w `%USERPROFILE%\dev-workspace\`).

## Uruchamianie
- `npm run setup`: instalacja zależności (raz)
- `npm run dev`: backend (http://localhost:3000) i frontend (http://localhost:4200) naraz
- Frontend przekierowuje `/api/*` do backendu przez `frontend/proxy.conf.json`.
