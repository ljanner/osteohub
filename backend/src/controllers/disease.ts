import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';

import {
  diseaseBodyRegions,
  diseaseBodySystems,
  diseaseOsteopathicModels,
  diseases,
  diseaseSymptoms,
  diseaseVindicateCategories,
  relations
} from '../db/schema';
import authMiddleware from '../middleware/auth';
import {
  isCreateDiseaseBody,
  isPutDiseaseBody,
  mapToDiseaseValues,
  setDiseaseRelations,
  validateDiseaseRelationIds
} from './util/disease.helpers';
import { parseIdParam } from './util/request';

type Bindings = {
  DB: D1Database;
};

const diseaseController = new Hono<{ Bindings: Bindings }>();

diseaseController.get('/', async c => {
  const db = drizzle(c.env.DB, { relations });
  const diseasesList = await db.query.diseases.findMany({
    orderBy: { name: 'asc' },
    columns: {
      id: true,
      name: true,
      description: true
    },
    with: {
      bodyRegions: true,
      bodySystems: true,
      vindicateCategories: true,
      osteopathicModels: true,
      symptoms: true
    }
  });

  return c.json(diseasesList);
});

diseaseController.get('/:id', async c => {
  const db = drizzle(c.env.DB, { relations });
  const id = Number.parseInt(c.req.param('id'), 10);

  if (Number.isNaN(id)) {
    return c.json(
      {
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
        error: 'Disease not found'
      },
      404
    );
  }

  return c.json(disease);
});

diseaseController.post('/', authMiddleware(), async c => {
  const body = await c.req.json<unknown>().catch(() => null);

  if (!isCreateDiseaseBody(body)) {
    return c.json({ error: 'Invalid request body' }, 400);
  }

  const db = drizzle(c.env.DB, { relations });

  const relationIdsAreValid = await validateDiseaseRelationIds(db, body);
  if (!relationIdsAreValid) {
    return c.json({ error: 'One or more provided IDs do not exist' }, 422);
  }

  let addedDisease: typeof diseases.$inferSelect | undefined;
  try {
    [addedDisease] = await db.insert(diseases).values(mapToDiseaseValues(body)).returning();
  } catch {
    return c.json({ error: 'Failed to create disease' }, 500);
  }

  try {
    await setDiseaseRelations(db, addedDisease.id, body, false);
  } catch {
    try {
      await db.delete(diseases).where(eq(diseases.id, addedDisease.id));
    } catch {
      return c.json({ error: 'Failed to rollback disease creation' }, 500);
    }
    return c.json({ error: 'Failed to create disease relations' }, 500);
  }

  return c.json(addedDisease, 201);
});

diseaseController.put('/:id', authMiddleware(), async c => {
  const id = parseIdParam(c);
  if (id === null) {
    return c.json({ error: 'Invalid disease id' }, 400);
  }

  const body = await c.req.json<unknown>().catch(() => null);
  if (!isPutDiseaseBody(body)) {
    return c.json({ error: 'Invalid request body' }, 400);
  }

  const db = drizzle(c.env.DB, { relations });

  const existingDisease = await db.query.diseases.findFirst({
    where: {
      id
    },
    columns: {
      id: true
    }
  });

  if (!existingDisease) {
    return c.json({ error: 'Disease not found' }, 404);
  }

  const relationIdsAreValid = await validateDiseaseRelationIds(db, body);
  if (!relationIdsAreValid) {
    return c.json({ error: 'One or more provided IDs do not exist' }, 422);
  }

  let updatedDisease: typeof diseases.$inferSelect | undefined;
  try {
    [updatedDisease] = await db
      .update(diseases)
      .set(mapToDiseaseValues(body))
      .where(eq(diseases.id, id))
      .returning();
  } catch {
    return c.json({ error: 'Failed to update disease' }, 500);
  }

  if (!updatedDisease) {
    return c.json({ error: 'Disease not found' }, 404);
  }

  try {
    await setDiseaseRelations(db, id, body, true);
  } catch {
    return c.json({ error: 'Failed to update disease relations' }, 500);
  }

  return c.json(updatedDisease);
});

diseaseController.delete('/:id', authMiddleware(), async c => {
  const db = drizzle(c.env.DB, { relations });
  const id = Number.parseInt(c.req.param('id'), 10);

  if (Number.isNaN(id)) {
    return c.json({ error: 'Invalid disease id' }, 400);
  }

  const [, , , , , deletedDiseases] = await db.batch([
    db.delete(diseaseBodyRegions).where(eq(diseaseBodyRegions.diseaseId, id)),
    db.delete(diseaseBodySystems).where(eq(diseaseBodySystems.diseaseId, id)),
    db.delete(diseaseVindicateCategories).where(eq(diseaseVindicateCategories.diseaseId, id)),
    db.delete(diseaseOsteopathicModels).where(eq(diseaseOsteopathicModels.diseaseId, id)),
    db.delete(diseaseSymptoms).where(eq(diseaseSymptoms.diseaseId, id)),
    db.delete(diseases).where(eq(diseases.id, id)).returning()
  ]);
  const deletedDisease = deletedDiseases?.[0];

  if (!deletedDisease) {
    return c.json({ error: 'Disease not found' }, 404);
  }

  return c.json(deletedDisease);
});

export default diseaseController;
