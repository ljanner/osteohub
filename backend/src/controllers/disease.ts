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
import { isCreateDiseaseBody } from './util/disease.helpers';

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

  let addedDisease: typeof diseases.$inferSelect | undefined;
  try {
    [addedDisease] = await db
      .insert(diseases)
      .values({
        name: body.name.trim(),
        icd: body.icd.trim(),
        description: body.description.trim(),
        frequency: body.frequency.trim(),
        etiology: body.etiology.trim(),
        pathogenesis: body.pathogenesis.trim(),
        redFlags: body.redFlags.trim(),
        diagnostics: body.diagnostics.trim(),
        therapy: body.therapy.trim(),
        prognosis: body.prognosis.trim(),
        osteopathicTreatment: body.osteopathicTreatment.trim()
      })
      .returning();
  } catch {
    return c.json({ error: 'Failed to create disease' }, 500);
  }

  try {
    const diseaseId = addedDisease.id;
    // prettier-ignore
    const { bodyRegionIds, bodySystemIds, vindicateCategoryIds, osteopathicModelIds, symptomIds } = body;
    // prettier-ignore
    await db.batch([
      db.insert(diseaseBodyRegions).values(bodyRegionIds.map(bodyRegionId => ({ diseaseId, bodyRegionId }))),
      db.insert(diseaseBodySystems).values(bodySystemIds.map(bodySystemId => ({ diseaseId, bodySystemId }))),
      db.insert(diseaseVindicateCategories).values(vindicateCategoryIds.map(vindicateCategoryId => ({ diseaseId, vindicateCategoryId }))),
      db.insert(diseaseOsteopathicModels).values(osteopathicModelIds.map(osteopathicModelId => ({ diseaseId, osteopathicModelId }))),
      db.insert(diseaseSymptoms).values(symptomIds.map(symptomId => ({ diseaseId, symptomId })))
    ]);
  } catch {
    await db.delete(diseases).where(eq(diseases.id, addedDisease.id));
    return c.json({ error: 'One or more provided IDs do not exist' }, 422);
  }

  return c.json(addedDisease, 201);
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
