import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';

import { relations } from '../db/schema';

type Bindings = {
  DB: D1Database;
};

const bodyRegionController = new Hono<{ Bindings: Bindings }>();

bodyRegionController.get('/', async c => {
  const db = drizzle(c.env.DB, { relations });
  const bodyRegionsList = await db.query.bodyRegions.findMany();
  return c.json(bodyRegionsList);
});

export default bodyRegionController;
