import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';

import { bodySystems, diseaseBodySystems, relations } from '../db/schema';
import authMiddleware from '../middleware/auth';
import { parseIdParam, parseNameBody } from './util/request';

type Bindings = {
  DB: D1Database;
};

const bodySystemController = new Hono<{ Bindings: Bindings }>();

bodySystemController.get('/', async c => {
  const db = drizzle(c.env.DB, { relations });
  const bodySystemsList = await db.query.bodySystems.findMany({ orderBy: { name: 'asc' } });

  return c.json(bodySystemsList);
});

bodySystemController.post('/', authMiddleware(), async c => {
  const name = await parseNameBody(c);
  if (!name) return c.json({ error: 'Invalid request body' }, 400);

  const db = drizzle(c.env.DB, { relations });
  const [created] = await db.insert(bodySystems).values({ name }).returning();

  return c.json(created, 201);
});

bodySystemController.patch('/:id', authMiddleware(), async c => {
  const id = parseIdParam(c);
  if (id === null) return c.json({ error: 'Invalid id' }, 400);

  const name = await parseNameBody(c);
  if (!name) return c.json({ error: 'Invalid request body' }, 400);

  const db = drizzle(c.env.DB, { relations });
  const [updated] = await db
    .update(bodySystems)
    .set({ name })
    .where(eq(bodySystems.id, id))
    .returning();

  if (!updated) return c.json({ error: 'Not found' }, 404);

  return c.json(updated);
});

bodySystemController.delete('/:id', authMiddleware(), async c => {
  const id = parseIdParam(c);
  if (id === null) return c.json({ error: 'Invalid id' }, 400);

  const db = drizzle(c.env.DB, { relations });
  const [, deletedCategories] = await db.batch([
    db.delete(diseaseBodySystems).where(eq(diseaseBodySystems.bodySystemId, id)),
    db.delete(bodySystems).where(eq(bodySystems.id, id)).returning()
  ]);
  const deleted = deletedCategories?.[0];

  if (!deleted) return c.json({ error: 'Not found' }, 404);

  return c.json(deleted);
});

export default bodySystemController;
