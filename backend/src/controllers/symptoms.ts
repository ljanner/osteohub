import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';

import { relations, symptoms } from '../db/schema';

type Bindings = {
  DB: D1Database;
};

const symptomsController = new Hono<{ Bindings: Bindings }>();

symptomsController.get('/', async c => {
  const db = drizzle(c.env.DB, { relations });
  const symptomsList = await db.select().from(symptoms).all();
  return c.json({
    ok: true,
    data: symptomsList
  });
});

export default symptomsController;
