import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';

import { diseaseOsteopathicModels, osteopathicModels, relations } from '../db/schema';
import authMiddleware from '../middleware/auth';
import { parseIdParam, parseNameBody } from './util/request';

type Bindings = {
  DB: D1Database;
};

const osteopathicModelController = new Hono<{ Bindings: Bindings }>();

osteopathicModelController.get('/', async c => {
  const db = drizzle(c.env.DB, { relations });
  const osteopathicModelsList = await db.query.osteopathicModels.findMany({
    orderBy: { name: 'asc' }
  });

  return c.json(osteopathicModelsList);
});

osteopathicModelController.post('/', authMiddleware(), async c => {
  const name = await parseNameBody(c);
  if (!name) return c.json({ error: 'Invalid request body' }, 400);

  const db = drizzle(c.env.DB, { relations });
  const [created] = await db.insert(osteopathicModels).values({ name }).returning();

  return c.json(created, 201);
});

osteopathicModelController.patch('/:id', authMiddleware(), async c => {
  const id = parseIdParam(c);
  if (id === null) return c.json({ error: 'Invalid id' }, 400);

  const name = await parseNameBody(c);
  if (!name) return c.json({ error: 'Invalid request body' }, 400);

  const db = drizzle(c.env.DB, { relations });
  const [updated] = await db
    .update(osteopathicModels)
    .set({ name })
    .where(eq(osteopathicModels.id, id))
    .returning();

  if (!updated) return c.json({ error: 'Not found' }, 404);

  return c.json(updated);
});

osteopathicModelController.delete('/:id', authMiddleware(), async c => {
  const id = parseIdParam(c);
  if (id === null) return c.json({ error: 'Invalid id' }, 400);

  const db = drizzle(c.env.DB, { relations });
  const [, deletedCategories] = await db.batch([
    db.delete(diseaseOsteopathicModels).where(eq(diseaseOsteopathicModels.osteopathicModelId, id)),
    db.delete(osteopathicModels).where(eq(osteopathicModels.id, id)).returning()
  ]);
  const deleted = deletedCategories?.[0];

  if (!deleted) return c.json({ error: 'Not found' }, 404);

  return c.json(deleted);
});

export default osteopathicModelController;
