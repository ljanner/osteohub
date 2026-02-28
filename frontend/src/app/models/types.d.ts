export type BodyRegion = {
  id: number;
  name: string;
};

export type BodySystem = {
  id: number;
  name: string;
};

export type VindicateCategory = {
  id: number;
  name: string;
};

export type OsteopathicModel = {
  id: number;
  name: string;
};

export type Symptom = {
  id: number;
  name: string;
};

export type Disease = {
  id: number;
  name: string;
  description: string;
  bodyRegions: BodyRegion[];
  bodySystems: BodySystem[];
  vindicateCategories: VindicateCategory[];
  osteopathicModels: OsteopathicModel[];
  symptoms: Symptom[];
};

export type DiseaseExtended = Disease & {
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

export type FilterCategories = {
  bodyRegions: number[];
  bodySystems: number[];
  vindicateCategories: number[];
  osteopathicModels: number[];
  symptoms: number[];
};
