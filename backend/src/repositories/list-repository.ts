import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { HttpError } from '../errors.ts';
import type { ListItem, ListItemChanges, NewListItem } from '../types.ts';

/**
 * Repozytorium listy - zapis w pliku backend/data/list.json.
 *
 * Reszta aplikacji używa tylko funkcji z obiektu `listRepository`, więc w TODO(11)
 * podmienisz implementację na SQLite, nie zmieniając ani jednej linii w routach.
 *
 * Uwaga: zapis do pliku nie jest odporny na równoczesne zapisy - dla jednej osoby wystarczy.
 */
const DATA_DIR = new URL('../../data/', import.meta.url);
const DATA_FILE = new URL('list.json', DATA_DIR);

async function readAll(): Promise<ListItem[]> {
  try {
    return JSON.parse(await readFile(DATA_FILE, 'utf8')) as ListItem[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []; // pliku jeszcze nie ma - pusta lista
    }
    throw error;
  }
}

async function writeAll(items: ListItem[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf8');
}

export const listRepository = {
  async findAll(): Promise<ListItem[]> {
    const items = await readAll();
    return items.sort((a, b) => b.addedAt.localeCompare(a.addedAt)); // najnowsze na górze
  },

  async add(newItem: NewListItem): Promise<ListItem> {
    const items = await readAll();
    const exists = items.some(
      (item) => item.source === newItem.source && item.externalId === newItem.externalId,
    );
    if (exists) {
      throw new HttpError(409, `"${newItem.title}" jest już na Twojej liście`);
    }

    const item: ListItem = {
      ...newItem,
      id: randomUUID(),
      watched: false,
      addedAt: new Date().toISOString(),
    };
    items.push(item);
    await writeAll(items);
    return item;
  },

  async update(id: string, changes: ListItemChanges): Promise<ListItem> {
    const items = await readAll();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new HttpError(404, 'Nie znaleziono pozycji na liście');
    }
    items[index] = { ...items[index], ...changes };
    await writeAll(items);
    return items[index];
  },

  async remove(id: string): Promise<void> {
    const items = await readAll();
    const remaining = items.filter((item) => item.id !== id);
    if (remaining.length === items.length) {
      throw new HttpError(404, 'Nie znaleziono pozycji na liście');
    }
    await writeAll(remaining);
  },
};
