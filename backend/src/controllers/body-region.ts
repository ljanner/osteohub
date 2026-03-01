import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';

import { bodyRegions, diseaseBodyRegions, relations } from '../db/schema';
import authMiddleware from '../middleware/auth';
import { parseIdParam, parseNameBody } from './util/request';

type Bindings = {
  DB: D1Database;
};

const bodyRegionController = new Hono<{ Bindings: Bindings }>();

bodyRegionController.get('/', async c => {
  const db = drizzle(c.env.DB, { relations });
  const bodyRegionsList = await db.query.bodyRegions.findMany({ orderBy: { name: 'asc' } });

  return c.json(bodyRegionsList);
});

bodyRegionController.post('/', authMiddleware(), async c => {
  const name = await parseNameBody(c);
  if (!name) return c.json({ error: 'Invalid request body' }, 400);

  const db = drizzle(c.env.DB, { relations });
  const [created] = await db.insert(bodyRegions).values({ name }).returning();

  return c.json(created, 201);
});

bodyRegionController.patch('/:id', authMiddleware(), async c => {
  const id = parseIdParam(c);
  if (id === null) return c.json({ error: 'Invalid id' }, 400);

  const name = await parseNameBody(c);
  if (!name) return c.json({ error: 'Invalid request body' }, 400);

  const db = drizzle(c.env.DB, { relations });
  const [updated] = await db
    .update(bodyRegions)
    .set({ name })
    .where(eq(bodyRegions.id, id))
    .returning();

  if (!updated) return c.json({ error: 'Not found' }, 404);
  return c.json(updated);
});

bodyRegionController.delete('/:id', authMiddleware(), async c => {
  const id = parseIdParam(c);
  if (id === null) return c.json({ error: 'Invalid id' }, 400);

  const db = drizzle(c.env.DB, { relations });
  const [, deletedCategories] = await db.batch([
    db.delete(diseaseBodyRegions).where(eq(diseaseBodyRegions.bodyRegionId, id)),
    db.delete(bodyRegions).where(eq(bodyRegions.id, id)).returning()
  ]);
  const deleted = deletedCategories?.[0];

  if (!deleted) return c.json({ error: 'Not found' }, 404);

  return c.json(deleted);
});

export default bodyRegionController;
