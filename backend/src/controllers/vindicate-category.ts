import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';

import { diseaseVindicateCategories, relations, vindicateCategories } from '../db/schema';
import authMiddleware from '../middleware/auth';
import { parseIdParam, parseNameBody } from './util/request';

type Bindings = {
  DB: D1Database;
};

const vindicateCategoryController = new Hono<{ Bindings: Bindings }>();

vindicateCategoryController.get('/', async c => {
  const db = drizzle(c.env.DB, { relations });
  const vindicateCategoriesList = await db.query.vindicateCategories.findMany({
    orderBy: { name: 'asc' }
  });

  return c.json(vindicateCategoriesList);
});

vindicateCategoryController.post('/', authMiddleware(), async c => {
  const name = await parseNameBody(c);
  if (!name) return c.json({ error: 'Invalid request body' }, 400);

  const db = drizzle(c.env.DB, { relations });
  const [created] = await db.insert(vindicateCategories).values({ name }).returning();

  return c.json(created, 201);
});

vindicateCategoryController.patch('/:id', authMiddleware(), async c => {
  const id = parseIdParam(c);
  if (id === null) return c.json({ error: 'Invalid id' }, 400);

  const name = await parseNameBody(c);
  if (!name) return c.json({ error: 'Invalid request body' }, 400);

  const db = drizzle(c.env.DB, { relations });
  const [updated] = await db
    .update(vindicateCategories)
    .set({ name })
    .where(eq(vindicateCategories.id, id))
    .returning();

  if (!updated) return c.json({ error: 'Not found' }, 404);

  return c.json(updated);
});

vindicateCategoryController.delete('/:id', authMiddleware(), async c => {
  const id = parseIdParam(c);
  if (id === null) return c.json({ error: 'Invalid id' }, 400);

  const db = drizzle(c.env.DB, { relations });
  const [, deletedCategories] = await db.batch([
    db
      .delete(diseaseVindicateCategories)
      .where(eq(diseaseVindicateCategories.vindicateCategoryId, id)),
    db.delete(vindicateCategories).where(eq(vindicateCategories.id, id)).returning()
  ]);
  const deleted = deletedCategories?.[0];

  if (!deleted) return c.json({ error: 'Not found' }, 404);

  return c.json(deleted);
});

export default vindicateCategoryController;
