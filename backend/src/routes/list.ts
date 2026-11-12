import { Router } from 'express';
import { HttpError } from '../errors.ts';
import { listRepository } from '../repositories/list-repository.ts';
import type { ListItemChanges, NewListItem } from '../types.ts';

/**
 * REST API listy:
 *   GET    /api/list       -> wszystkie pozycje
 *   POST   /api/list       -> dodaj pozycję (body: NewListItem)
 *   PATCH  /api/list/:id   -> zmień pola (body: ListItemChanges)
 *   DELETE /api/list/:id   -> usuń pozycję
 *
 * Express 5 sam przekazuje błędy z funkcji async do middleware błędów (app.ts),
 * dlatego wystarczy `throw new HttpError(...)` - bez try/catch.
 */
export const listRouter = Router();

listRouter.get('/', async (_req, res) => {
  res.json(await listRepository.findAll());
});

listRouter.post('/', async (req, res) => {
  const created = await listRepository.add(parseNewItem(req.body));
  res.status(201).json(created);
});

listRouter.patch('/:id', async (req, res) => {
  const updated = await listRepository.update(req.params.id, parseChanges(req.body));
  res.json(updated);
});

listRouter.delete('/:id', async (req, res) => {
  await listRepository.remove(req.params.id);
  res.status(204).end();
});

// --- Walidacja danych wejściowych (nigdy nie ufaj temu, co przychodzi z sieci!) ---

function parseNewItem(body: unknown): NewListItem {
  const b = (body ?? {}) as Record<string, unknown>;

  if (typeof b.externalId !== 'number' || typeof b.title !== 'string' || b.title.trim() === '') {
    throw new HttpError(400, 'Wymagane pola: externalId (liczba) i title (tekst)');
  }
  if (b.source !== 'tvmaze' || (b.type !== 'series' && b.type !== 'movie')) {
    throw new HttpError(400, 'Nieprawidłowe pole source lub type');
  }

  return {
    externalId: b.externalId,
    source: b.source,
    type: b.type,
    title: b.title.trim(),
    year: typeof b.year === 'number' ? b.year : null,
    posterUrl: typeof b.posterUrl === 'string' ? b.posterUrl : null,
  };
}

function parseChanges(body: unknown): ListItemChanges {
  const b = (body ?? {}) as Record<string, unknown>;
  const changes: ListItemChanges = {};

  if (b.watched !== undefined) {
    if (typeof b.watched !== 'boolean') {
      throw new HttpError(400, 'Pole watched musi być true albo false');
    }
    changes.watched = b.watched;
  }
  // TODO(1): rating - liczba całkowita 1-5 albo null
  // TODO(8): notes  - tekst, maks. 500 znaków

  if (Object.keys(changes).length === 0) {
    throw new HttpError(400, 'Brak pól do zmiany');
  }
  return changes;
}
