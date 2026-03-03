export type NamedEntity = {
  id: number;
  name: string;
};

export type BodyRegion = NamedEntity;
export type BodySystem = NamedEntity;
export type VindicateCategory = NamedEntity;
export type OsteopathicModel = NamedEntity;
export type Symptom = NamedEntity;

export type DiseaseRelations = {
  bodyRegions: BodyRegion[];
  bodySystems: BodySystem[];
  vindicateCategories: VindicateCategory[];
  osteopathicModels: OsteopathicModel[];
  symptoms: Symptom[];
};

export type DiseaseRelationsIds = {
  bodyRegionIds: number[];
  bodySystemIds: number[];
  vindicateCategoryIds: number[];
  osteopathicModelIds: number[];
  symptomIds: number[];
};

// intentionally not exported, as it's only used as a building block for other types
type DiseaseInformation = {
  icd: string;
  frequency: string;
  etiology: string;
  pathogenesis: string;
  redFlags: string;
  diagnostics: string;
  therapy: string;
  prognosis: string;
  osteopathicTreatment: string;
};

// intentionally not exported, as it's only used as a building block for other types
type DiseaseBaseFields = {
  name: string;
  description: string;
};

export type Disease = {
  id: number;
} & DiseaseBaseFields &
  DiseaseRelations;

export type DiseaseExtended = Disease & DiseaseInformation;

export type DiseaseWriteBody = DiseaseBaseFields & DiseaseInformation & DiseaseRelationsIds;
