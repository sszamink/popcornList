import { Router } from 'express';
import { HttpError } from '../errors.ts';
import { searchShows } from '../services/tvmaze.ts';

/** GET /api/search?q=breaking -> lista wyników z TVmaze */
export const searchRouter = Router();

searchRouter.get('/', async (req, res) => {
  const query = String(req.query.q ?? '').trim();
  if (query.length < 2) {
    throw new HttpError(400, 'Wpisz co najmniej 2 znaki');
  }
  // TODO(15): parametr ?type=series|movie|all i wyszukiwanie także w TMDB
  res.json(await searchShows(query));
});
