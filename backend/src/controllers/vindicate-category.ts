import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';

import { relations } from '../db/schema';

type Bindings = {
  DB: D1Database;
};

const vindicateCategoryController = new Hono<{ Bindings: Bindings }>();

vindicateCategoryController.get('/', async c => {
  const db = drizzle(c.env.DB, { relations });
  const vindicateCategoriesList = await db.query.vindicateCategories.findMany();
  return c.json(vindicateCategoriesList);
});

export default vindicateCategoryController;
