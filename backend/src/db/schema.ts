import { defineRelations } from 'drizzle-orm';
import { index, int, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const bodyRegions = sqliteTable('body_region', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull()
});

export const bodySystems = sqliteTable('body_system', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull()
});

export const vindicateCategories = sqliteTable('vindicate_category', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull()
});

export const osteopathicModels = sqliteTable('osteopathic_model', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull()
});

export const symptoms = sqliteTable('symptom', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull()
});

export const diseases = sqliteTable('disease', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  icd: text().notNull(),
  description: text().notNull(),
  frequency: text().notNull(),
  etiology: text().notNull(),
  pathogenesis: text().notNull(),
  redFlags: text().notNull(),
  diagnostics: text().notNull(),
  therapy: text().notNull(),
  prognosis: text().notNull(),
  osteopathicTreatment: text().notNull()
});

export const diseaseBodyRegions = sqliteTable(
  'disease_body_region',
  {
    diseaseId: int()
      .notNull()
      .references(() => diseases.id),
    bodyRegionId: int()
      .notNull()
      .references(() => bodyRegions.id)
  },
  table => [
    primaryKey({ columns: [table.diseaseId, table.bodyRegionId] }),
    index('disease_body_region_disease_id_idx').on(table.diseaseId),
    index('disease_body_region_body_region_id_idx').on(table.bodyRegionId)
  ]
);

export const diseaseBodySystems = sqliteTable(
  'disease_body_system',
  {
    diseaseId: int()
      .notNull()
      .references(() => diseases.id),
    bodySystemId: int()
      .notNull()
      .references(() => bodySystems.id)
  },
  table => [
    primaryKey({ columns: [table.diseaseId, table.bodySystemId] }),
    index('disease_body_system_disease_id_idx').on(table.diseaseId),
    index('disease_body_system_body_system_id_idx').on(table.bodySystemId)
  ]
);

export const diseaseVindicateCategories = sqliteTable(
  'disease_vindicate_category',
  {
    diseaseId: int()
      .notNull()
      .references(() => diseases.id),
    vindicateCategoryId: int()
      .notNull()
      .references(() => vindicateCategories.id)
  },
  table => [
    primaryKey({ columns: [table.diseaseId, table.vindicateCategoryId] }),
    index('disease_vindicate_category_disease_id_idx').on(table.diseaseId),
    index('disease_vindicate_category_vindicate_category_id_idx').on(table.vindicateCategoryId)
  ]
);

export const diseaseOsteopathicModels = sqliteTable(
  'disease_osteopathic_model',
  {
    diseaseId: int()
      .notNull()
      .references(() => diseases.id),
    osteopathicModelId: int()
      .notNull()
      .references(() => osteopathicModels.id)
  },
  table => [
    primaryKey({ columns: [table.diseaseId, table.osteopathicModelId] }),
    index('disease_osteopathic_model_disease_id_idx').on(table.diseaseId),
    index('disease_osteopathic_model_osteopathic_model_id_idx').on(table.osteopathicModelId)
  ]
);

export const diseaseSymptoms = sqliteTable(
  'disease_symptom',
  {
    diseaseId: int()
      .notNull()
      .references(() => diseases.id),
    symptomId: int()
      .notNull()
      .references(() => symptoms.id)
  },
  table => [
    primaryKey({ columns: [table.diseaseId, table.symptomId] }),
    index('disease_symptom_disease_id_idx').on(table.diseaseId),
    index('disease_symptom_symptom_id_idx').on(table.symptomId)
  ]
);

export const relations = defineRelations(
  {
    diseases,
    bodyRegions,
    bodySystems,
    vindicateCategories,
    osteopathicModels,
    symptoms,
    diseaseBodyRegions,
    diseaseBodySystems,
    diseaseVindicateCategories,
    diseaseOsteopathicModels,
    diseaseSymptoms
  },
  r => ({
    diseases: {
      bodyRegions: r.many.bodyRegions({
        from: r.diseases.id.through(r.diseaseBodyRegions.diseaseId),
        to: r.bodyRegions.id.through(r.diseaseBodyRegions.bodyRegionId)
      }),
      bodySystems: r.many.bodySystems({
        from: r.diseases.id.through(r.diseaseBodySystems.diseaseId),
        to: r.bodySystems.id.through(r.diseaseBodySystems.bodySystemId)
      }),
      vindicateCategories: r.many.vindicateCategories({
        from: r.diseases.id.through(r.diseaseVindicateCategories.diseaseId),
        to: r.vindicateCategories.id.through(r.diseaseVindicateCategories.vindicateCategoryId)
      }),
      osteopathicModels: r.many.osteopathicModels({
        from: r.diseases.id.through(r.diseaseOsteopathicModels.diseaseId),
        to: r.osteopathicModels.id.through(r.diseaseOsteopathicModels.osteopathicModelId)
      }),
      symptoms: r.many.symptoms({
        from: r.diseases.id.through(r.diseaseSymptoms.diseaseId),
        to: r.symptoms.id.through(r.diseaseSymptoms.symptomId)
      })
    },
    bodyRegions: {
      diseases: r.many.diseases({
        from: r.bodyRegions.id.through(r.diseaseBodyRegions.bodyRegionId),
        to: r.diseases.id.through(r.diseaseBodyRegions.diseaseId)
      })
    },
    bodySystems: {
      diseases: r.many.diseases({
        from: r.bodySystems.id.through(r.diseaseBodySystems.bodySystemId),
        to: r.diseases.id.through(r.diseaseBodySystems.diseaseId)
      })
    },
    vindicateCategories: {
      diseases: r.many.diseases({
        from: r.vindicateCategories.id.through(r.diseaseVindicateCategories.vindicateCategoryId),
        to: r.diseases.id.through(r.diseaseVindicateCategories.diseaseId)
      })
    },
    osteopathicModels: {
      diseases: r.many.diseases({
        from: r.osteopathicModels.id.through(r.diseaseOsteopathicModels.osteopathicModelId),
        to: r.diseases.id.through(r.diseaseOsteopathicModels.diseaseId)
      })
    },
    symptoms: {
      diseases: r.many.diseases({
        from: r.symptoms.id.through(r.diseaseSymptoms.symptomId),
        to: r.diseases.id.through(r.diseaseSymptoms.diseaseId)
      })
    },
    diseaseBodyRegions: {
      disease: r.one.diseases({
        from: r.diseaseBodyRegions.diseaseId,
        to: r.diseases.id,
        optional: false
      }),
      bodyRegion: r.one.bodyRegions({
        from: r.diseaseBodyRegions.bodyRegionId,
        to: r.bodyRegions.id,
        optional: false
      })
    },
    diseaseBodySystems: {
      disease: r.one.diseases({
        from: r.diseaseBodySystems.diseaseId,
        to: r.diseases.id,
        optional: false
      }),
      bodySystem: r.one.bodySystems({
        from: r.diseaseBodySystems.bodySystemId,
        to: r.bodySystems.id,
        optional: false
      })
    },
    diseaseVindicateCategories: {
      disease: r.one.diseases({
        from: r.diseaseVindicateCategories.diseaseId,
        to: r.diseases.id,
        optional: false
      }),
      vindicateCategory: r.one.vindicateCategories({
        from: r.diseaseVindicateCategories.vindicateCategoryId,
        to: r.vindicateCategories.id,
        optional: false
      })
    },
    diseaseOsteopathicModels: {
      disease: r.one.diseases({
        from: r.diseaseOsteopathicModels.diseaseId,
        to: r.diseases.id,
        optional: false
      }),
      osteopathicModel: r.one.osteopathicModels({
        from: r.diseaseOsteopathicModels.osteopathicModelId,
        to: r.osteopathicModels.id,
        optional: false
      })
    },
    diseaseSymptoms: {
      disease: r.one.diseases({
        from: r.diseaseSymptoms.diseaseId,
        to: r.diseases.id,
        optional: false
      }),
      symptom: r.one.symptoms({
        from: r.diseaseSymptoms.symptomId,
        to: r.symptoms.id,
        optional: false
      })
    }
  })
);
