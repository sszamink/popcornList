/**
 * Błąd z kodem HTTP. Rzucasz go w dowolnym miejscu, a middleware błędów w app.ts
 * zamieni go na odpowiedź JSON z właściwym statusem, np. 404 { "message": "..." }.
 */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
