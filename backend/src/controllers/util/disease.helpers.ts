import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';

import {
  bodyRegions,
  bodySystems,
  diseaseBodyRegions,
  diseaseBodySystems,
  diseaseOsteopathicModels,
  diseases,
  diseaseSymptoms,
  diseaseVindicateCategories,
  osteopathicModels,
  symptoms,
  vindicateCategories
} from '../../db/schema';

export type DiseaseRelationIds = {
  bodyRegionIds: number[];
  bodySystemIds: number[];
  vindicateCategoryIds: number[];
  osteopathicModelIds: number[];
  symptomIds: number[];
};

type DiseaseTextFields = Omit<typeof diseases.$inferInsert, 'id'>;

export type DiseaseWriteBody = DiseaseTextFields & DiseaseRelationIds;

export type CreateDiseaseBody = DiseaseWriteBody;
export type PutDiseaseBody = DiseaseWriteBody;

export const hasOnlyKnownIds = (providedIds: number[], existingRows: { id: number }[]): boolean => {
  const existingIds = new Set(existingRows.map(row => row.id));
  return providedIds.every(id => existingIds.has(id));
};

export const validateDiseaseRelationIds = async (
  db: ReturnType<typeof drizzle>,
  relationIds: DiseaseRelationIds
): Promise<boolean> => {
  const [
    existingBodyRegions,
    existingBodySystems,
    existingVindicateCategories,
    existingModels,
    existingSymptoms
  ] = await db.batch([
    db.select({ id: bodyRegions.id }).from(bodyRegions),
    db.select({ id: bodySystems.id }).from(bodySystems),
    db.select({ id: vindicateCategories.id }).from(vindicateCategories),
    db.select({ id: osteopathicModels.id }).from(osteopathicModels),
    db.select({ id: symptoms.id }).from(symptoms)
  ] as const);

  return (
    hasOnlyKnownIds(relationIds.bodyRegionIds, existingBodyRegions) &&
    hasOnlyKnownIds(relationIds.bodySystemIds, existingBodySystems) &&
    hasOnlyKnownIds(relationIds.vindicateCategoryIds, existingVindicateCategories) &&
    hasOnlyKnownIds(relationIds.osteopathicModelIds, existingModels) &&
    hasOnlyKnownIds(relationIds.symptomIds, existingSymptoms)
  );
};

export const setDiseaseRelations = async (
  db: ReturnType<typeof drizzle>,
  diseaseId: number,
  relationIds: DiseaseRelationIds,
  replaceExisting: boolean
): Promise<void> => {
  const { bodyRegionIds, bodySystemIds, vindicateCategoryIds, osteopathicModelIds, symptomIds } =
    relationIds;

  if (replaceExisting) {
    await db.batch([
      db.delete(diseaseBodyRegions).where(eq(diseaseBodyRegions.diseaseId, diseaseId)),
      db.delete(diseaseBodySystems).where(eq(diseaseBodySystems.diseaseId, diseaseId)),
      db
        .delete(diseaseVindicateCategories)
        .where(eq(diseaseVindicateCategories.diseaseId, diseaseId)),
      db.delete(diseaseOsteopathicModels).where(eq(diseaseOsteopathicModels.diseaseId, diseaseId)),
      db.delete(diseaseSymptoms).where(eq(diseaseSymptoms.diseaseId, diseaseId)),
      db
        .insert(diseaseBodyRegions)
        .values(bodyRegionIds.map(bodyRegionId => ({ diseaseId, bodyRegionId }))),
      db
        .insert(diseaseBodySystems)
        .values(bodySystemIds.map(bodySystemId => ({ diseaseId, bodySystemId }))),
      db
        .insert(diseaseVindicateCategories)
        .values(
          vindicateCategoryIds.map(vindicateCategoryId => ({ diseaseId, vindicateCategoryId }))
        ),
      db
        .insert(diseaseOsteopathicModels)
        .values(osteopathicModelIds.map(osteopathicModelId => ({ diseaseId, osteopathicModelId }))),
      db.insert(diseaseSymptoms).values(symptomIds.map(symptomId => ({ diseaseId, symptomId })))
    ] as const);
    return;
  }

  await db.batch([
    db
      .insert(diseaseBodyRegions)
      .values(bodyRegionIds.map(bodyRegionId => ({ diseaseId, bodyRegionId }))),
    db
      .insert(diseaseBodySystems)
      .values(bodySystemIds.map(bodySystemId => ({ diseaseId, bodySystemId }))),
    db
      .insert(diseaseVindicateCategories)
      .values(
        vindicateCategoryIds.map(vindicateCategoryId => ({ diseaseId, vindicateCategoryId }))
      ),
    db
      .insert(diseaseOsteopathicModels)
      .values(osteopathicModelIds.map(osteopathicModelId => ({ diseaseId, osteopathicModelId }))),
    db.insert(diseaseSymptoms).values(symptomIds.map(symptomId => ({ diseaseId, symptomId })))
  ] as const);
};

const hasNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

const hasValidIdArray = (value: unknown): value is number[] => {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(id => Number.isInteger(id) && id > 0) &&
    new Set(value).size === value.length
  );
};

const isDiseaseWriteBody = (body: unknown): body is DiseaseWriteBody => {
  if (!body || typeof body !== 'object') return false;
  const b = body as DiseaseWriteBody;

  const stringsValid = [
    b.name,
    b.icd,
    b.description,
    b.frequency,
    b.etiology,
    b.pathogenesis,
    b.redFlags,
    b.diagnostics,
    b.therapy,
    b.prognosis,
    b.osteopathicTreatment
  ].every(hasNonEmptyString);

  const arraysValid = [
    b.bodyRegionIds,
    b.bodySystemIds,
    b.vindicateCategoryIds,
    b.osteopathicModelIds,
    b.symptomIds
  ].every(hasValidIdArray);

  return stringsValid && arraysValid;
};

export const isCreateDiseaseBody = (body: unknown): body is CreateDiseaseBody =>
  isDiseaseWriteBody(body);

export const isPutDiseaseBody = (body: unknown): body is PutDiseaseBody => isDiseaseWriteBody(body);

export const mapToDiseaseValues = (body: DiseaseWriteBody): DiseaseTextFields => ({
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
});
