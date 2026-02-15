import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';

import { relations } from '../db/schema';

type Bindings = {
  DB: D1Database;
};

const osteopathicModelController = new Hono<{ Bindings: Bindings }>();

osteopathicModelController.get('/', async c => {
  const db = drizzle(c.env.DB, { relations });
  const osteopathicModelsList = await db.query.osteopathicModels.findMany();
  return c.json(osteopathicModelsList);
});

export default osteopathicModelController;
