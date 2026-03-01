import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';

import { diseaseSymptoms, relations, symptoms } from '../db/schema';
import authMiddleware from '../middleware/auth';
import { parseIdParam, parseNameBody } from '../utils/request';

type Bindings = {
  DB: D1Database;
};

const symptomController = new Hono<{ Bindings: Bindings }>();

symptomController.get('/', async c => {
  const db = drizzle(c.env.DB, { relations });
  const symptomsList = await db.query.symptoms.findMany({ orderBy: { name: 'asc' } });
  return c.json(symptomsList);
});

symptomController.post('/', authMiddleware(), async c => {
  const name = await parseNameBody(c);
  if (!name) return c.json({ error: 'Invalid request body' }, 400);

  const db = drizzle(c.env.DB, { relations });
  const [created] = await db.insert(symptoms).values({ name }).returning();

  return c.json(created, 201);
});

symptomController.patch('/:id', authMiddleware(), async c => {
  const id = parseIdParam(c);
  if (id === null) return c.json({ error: 'Invalid id' }, 400);

  const name = await parseNameBody(c);
  if (!name) return c.json({ error: 'Invalid request body' }, 400);

  const db = drizzle(c.env.DB, { relations });
  const [updated] = await db.update(symptoms).set({ name }).where(eq(symptoms.id, id)).returning();

  if (!updated) return c.json({ error: 'Not found' }, 404);

  return c.json(updated);
});

symptomController.delete('/:id', authMiddleware(), async c => {
  const id = parseIdParam(c);
  if (id === null) return c.json({ error: 'Invalid id' }, 400);

  const db = drizzle(c.env.DB, { relations });
  const [, deletedCategories] = await db.batch([
    db.delete(diseaseSymptoms).where(eq(diseaseSymptoms.symptomId, id)),
    db.delete(symptoms).where(eq(symptoms.id, id)).returning()
  ]);
  const deleted = deletedCategories?.[0];

  if (!deleted) return c.json({ error: 'Not found' }, 404);

  return c.json(deleted);
});

export default symptomController;
