PRAGMA foreign_keys = OFF;

DELETE FROM osteopathic_model;
DELETE FROM vindicate_category;
DELETE FROM body_system;
DELETE FROM body_region;

PRAGMA foreign_keys = ON;

INSERT INTO body_region (name)
VALUES
  ('Thorax'),
  ('Kopf/Hals'),
  ('Abdomen'),
  ('Wirbelsäule'),
  ('Mehrere Gelenke'),
  ('Becken');

INSERT INTO osteopathic_model (name)
VALUES
  ('Biomechanisch'),
  ('Verhaltensbezogen'),
  ('Metabolisch-Energetisch'),
  ('Neurologisch'),
  ('Respiratorisch-Zirkulatorisch');

INSERT INTO vindicate_category (name)
VALUES
  ('Iatrogen/Intoxikation'),
  ('Vaskulär'),
  ('Funktionell'),
  ('Kongenital'),
  ('Degenerativ'),
  ('Infektiös'),
  ('Traumatisch'),
  ('Neoplastisch'),
  ('Autoimmun'),
  ('Endokrin');

INSERT INTO body_system (name)
VALUES
  ('Muskuloskelettal'),
  ('Neurologisch'),
  ('Immunologisch'),
  ('Kardiovaskulär'),
  ('Respiratorisch'),
  ('Gastrointestinal');
