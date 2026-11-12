import express from 'express';
import type { ErrorRequestHandler } from 'express';
import { HttpError } from './errors.ts';
import { listRouter } from './routes/list.ts';
import { searchRouter } from './routes/search.ts';

/**
 * Tworzy aplikację Express (bez uruchamiania serwera).
 * Rozdzielenie app.ts / server.ts ułatwi testy w TODO(12): w teście tworzysz app
 * i odpytujesz ją, bez startowania prawdziwego serwera na stałym porcie.
 */
export function createApp() {
  const app = express();

  app.use(express.json()); // parsuje body JSON w POST/PATCH

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/search', searchRouter);
  app.use('/api/list', listRouter);
  // TODO(6): app.use('/api/shows', showsRouter)  - szczegóły serialu
  // TODO(13): app.use('/api/schedule', scheduleRouter) - dzisiejsze emisje

  // Nieznany adres -> 404
  app.use((_req, res) => {
    res.status(404).json({ message: 'Nie ma takiego endpointu' });
  });

  // Middleware błędów - musi mieć 4 parametry, żeby Express go rozpoznał
  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ message: 'Coś poszło nie tak po stronie serwera' });
  };
  app.use(errorHandler);

  return app;
}
