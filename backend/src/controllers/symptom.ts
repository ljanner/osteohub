import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';

import { relations } from '../db/schema';

type Bindings = {
  DB: D1Database;
};

const symptomController = new Hono<{ Bindings: Bindings }>();

symptomController.get('/', async c => {
  const db = drizzle(c.env.DB, { relations });
  const symptomsList = await db.query.symptoms.findMany();
  return c.json({
    ok: true,
    data: symptomsList
  });
});

export default symptomController;
