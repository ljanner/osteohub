import { diseases } from '../../db/schema';

export type CreateDiseaseBody = Omit<typeof diseases.$inferInsert, 'id'> & {
  bodyRegionIds: number[];
  bodySystemIds: number[];
  vindicateCategoryIds: number[];
  osteopathicModelIds: number[];
  symptomIds: number[];
};

export const isCreateDiseaseBody = (body: unknown): body is CreateDiseaseBody => {
  if (!body || typeof body !== 'object') return false;
  const b = body as CreateDiseaseBody;

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
  ].every(v => typeof v === 'string' && v.trim().length > 0);

  const arraysValid = [
    b.bodyRegionIds,
    b.bodySystemIds,
    b.vindicateCategoryIds,
    b.osteopathicModelIds,
    b.symptomIds
  ].every(v => Array.isArray(v) && v.length > 0 && v.every(id => typeof id === 'number'));

  return stringsValid && arraysValid;
};
