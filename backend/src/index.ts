import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';

import { symptoms } from './db/schema';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/symptoms', async c => {
  const db = drizzle(c.env.DB);
  const symptomsList = await db.select().from(symptoms).all();
  return c.json({
    ok: true,
    data: symptomsList
  });
});

export default app;
