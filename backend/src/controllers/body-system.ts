import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';

import { relations } from '../db/schema';

type Bindings = {
  DB: D1Database;
};

const bodySystemController = new Hono<{ Bindings: Bindings }>();

bodySystemController.get('/', async c => {
  const db = drizzle(c.env.DB, { relations });
  const bodySystemsList = await db.query.bodySystems.findMany();
  return c.json({
    ok: true,
    data: bodySystemsList
  });
});

export default bodySystemController;
