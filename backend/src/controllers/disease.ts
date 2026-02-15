import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';

import { relations } from '../db/schema';

type Bindings = {
  DB: D1Database;
};

const diseaseController = new Hono<{ Bindings: Bindings }>();

diseaseController.get('/', async c => {
  const db = drizzle(c.env.DB, { relations });
  const diseasesList = await db.query.diseases.findMany({
    columns: {
      name: true,
      description: true
    },
    with: {
      bodyRegions: {
        columns: {
          name: true
        }
      },
      bodySystems: {
        columns: {
          name: true
        }
      },
      vindicateCategories: {
        columns: {
          name: true
        }
      },
      osteopathicModels: {
        columns: {
          name: true
        }
      },
      symptoms: {
        columns: {
          name: true
        }
      }
    }
  });

  return c.json({
    ok: true,
    data: diseasesList
  });
});

diseaseController.get('/:id', async c => {
  const db = drizzle(c.env.DB, { relations });
  const id = Number.parseInt(c.req.param('id'), 10);

  if (Number.isNaN(id)) {
    return c.json(
      {
        ok: false,
        error: 'Invalid disease id'
      },
      400
    );
  }

  const disease = await db.query.diseases.findFirst({
    where: {
      id
    },
    with: {
      bodyRegions: true,
      bodySystems: true,
      vindicateCategories: true,
      osteopathicModels: true,
      symptoms: true
    }
  });

  if (!disease) {
    return c.json(
      {
        ok: false,
        error: 'Disease not found'
      },
      404
    );
  }

  return c.json({
    ok: true,
    data: disease
  });
});

export default diseaseController;
