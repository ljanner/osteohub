PRAGMA foreign_keys = OFF;

DELETE FROM disease_symptom;
DELETE FROM disease_osteopathic_model;
DELETE FROM disease_vindicate_category;
DELETE FROM disease_body_system;
DELETE FROM disease_body_region;
DELETE FROM disease;
DELETE FROM symptom;
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
  ('Becken'),
  ('Fuss/Vorfuss');

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

INSERT INTO symptom (name)
VALUES
  ('Anlaufschmerz'),
  ('Belastungsschmerz'),
  ('Ruheschmerz'),
  ('Nachtschmerz'),
  ('Gelenkschwellung/Erguss'),
  ('Gelenksteifigkeit nach Ruhe'),
  ('Vorfussschmerz im Interdigitalraum'),
  ('Brennender Schmerz mit Ausstrahlung in die Zehen'),
  ('Taubheitsgefühl in den Zehen'),
  ('Elektrisierender Schmerz im Vorfuss');

INSERT INTO disease (
  name,
  icd,
  description,
  frequency,
  etiology,
  pathogenesis,
  redFlags,
  diagnostics,
  therapy,
  prognosis,
  osteopathicTreatment
)
VALUES
  (
    'Arthrose',
    'M15-M19',
    'Degenerative Gelenkerkrankung mit fortschreitender Knorpel- und Knochenveränderung, häufig an Hüfte, Knie und Fingergelenken.',
    'Häufige Erkrankung, vor allem bei älteren Menschen; in der Schweiz 2022 bei 10.6 % der Männer und 17.8 % der Frauen ab 15 Jahren.',
    'Multifaktoriell: genetische Disposition, Übergewicht, mechanische Überbelastung, Gelenkfehlstellungen/Trauma, metabolische Faktoren und Grunderkrankungen.',
    'Gestörter Stoffwechsel des Gelenksgewebes führt zu Chondrozytenverlust, Knorpeldegeneration, Gelenkspaltverschmälerung und sekundär zu Osteophyten sowie subchondralen Zysten.',
    'Plötzliche starke Symptomverschlechterung, systemische oder neurologische Begleitsymptome, atypische Lokalisation/Verläufe oder auffällige Bildgebung.',
    'Klinische Diagnose anhand Symptomatik, Bestätigung meist mittels Röntgen; bei unklaren Befunden ergänzend MRT.',
    'Symptomorientiert mit Edukation, angepasster Aktivität, Gewichtsreduktion, NSAR, ggf. intraartikulären Glukokortikoiden, Physio/Ergotherapie, Hilfsmitteln sowie bei Bedarf operativen Verfahren.',
    'Nicht heilbar, aber bei konsequenter Therapie und Lebensstilanpassung meist gut kontrollierbar.',
    'Dysbalancen ausgleichen, Belastung vom betroffenen Gelenk reduzieren, Spannung in Muskeln und Faszien der Umgebung regulieren.'
  ),
  (
    'Morton-Neurom',
    'G57.6',
    'Perineurale Fibrose/Entrapment eines plantaren Interdigitalnervs, typischerweise im 3. Interdigitalraum des Vorfusses.',
    'Häufig bei Erwachsenen mittleren Alters; Frauen sind häufiger betroffen als Männer.',
    'Chronische mechanische Reizung und Kompression des Interdigitalnervs durch enge Schuhe, hohe Absätze, repetitive Vorfussbelastung oder Fussfehlstatik.',
    'Wiederholte Irritation führt zu perineuraler Fibrose und Verdickung des Nervs mit neuropathischer Schmerzsymptomatik im Vorfuss.',
    'Persistierende Ruheschmerzen, progrediente neurologische Ausfälle, deutliche Ruheschmerz-Nachtschmerz-Zunahme oder atypische Befundkonstellationen mit Verdacht auf alternative Pathologie.',
    'Klinische Untersuchung mit druckdolentem Interdigitalraum und reproduzierbaren Beschwerden; ergänzend Sonografie oder MRT bei unklaren Fällen.',
    'Konservativ mit Schuhmodifikation, Vorfussentlastung/Einlagen, Aktivitätsanpassung, Analgetika und ggf. Infiltration; bei Persistenz operative Dekompression oder Exzision.',
    'Unter konsequenter konservativer Therapie oft gut beeinflussbar; bei Therapieversagen verbessert eine Operation die Beschwerden in vielen Fällen.',
    'Biomechanische Belastungsmuster des Vorfusses normalisieren, Gewebespannung lokal und entlang myofaszialer Ketten reduzieren und neurovaskuläre Gleitfähigkeit unterstützen.'
  );

INSERT INTO disease_body_region (diseaseId, bodyRegionId)
VALUES
  (
    (SELECT id FROM disease WHERE name = 'Arthrose'),
    (SELECT id FROM body_region WHERE name = 'Mehrere Gelenke')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Morton-Neurom'),
    (SELECT id FROM body_region WHERE name = 'Fuss/Vorfuss')
  );

INSERT INTO disease_body_system (diseaseId, bodySystemId)
VALUES
  (
    (SELECT id FROM disease WHERE name = 'Arthrose'),
    (SELECT id FROM body_system WHERE name = 'Muskuloskelettal')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Morton-Neurom'),
    (SELECT id FROM body_system WHERE name = 'Neurologisch')
  );

INSERT INTO disease_vindicate_category (diseaseId, vindicateCategoryId)
VALUES
  (
    (SELECT id FROM disease WHERE name = 'Arthrose'),
    (SELECT id FROM vindicate_category WHERE name = 'Degenerativ')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Morton-Neurom'),
    (SELECT id FROM vindicate_category WHERE name = 'Funktionell')
  );

INSERT INTO disease_osteopathic_model (diseaseId, osteopathicModelId)
VALUES
  (
    (SELECT id FROM disease WHERE name = 'Arthrose'),
    (SELECT id FROM osteopathic_model WHERE name = 'Biomechanisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Arthrose'),
    (SELECT id FROM osteopathic_model WHERE name = 'Metabolisch-Energetisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Morton-Neurom'),
    (SELECT id FROM osteopathic_model WHERE name = 'Biomechanisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Morton-Neurom'),
    (SELECT id FROM osteopathic_model WHERE name = 'Neurologisch')
  );

INSERT INTO disease_symptom (diseaseId, symptomId)
VALUES
  (
    (SELECT id FROM disease WHERE name = 'Arthrose'),
    (SELECT id FROM symptom WHERE name = 'Anlaufschmerz')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Arthrose'),
    (SELECT id FROM symptom WHERE name = 'Belastungsschmerz')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Arthrose'),
    (SELECT id FROM symptom WHERE name = 'Ruheschmerz')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Arthrose'),
    (SELECT id FROM symptom WHERE name = 'Nachtschmerz')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Arthrose'),
    (SELECT id FROM symptom WHERE name = 'Gelenkschwellung/Erguss')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Arthrose'),
    (SELECT id FROM symptom WHERE name = 'Gelenksteifigkeit nach Ruhe')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Morton-Neurom'),
    (SELECT id FROM symptom WHERE name = 'Belastungsschmerz')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Morton-Neurom'),
    (SELECT id FROM symptom WHERE name = 'Vorfussschmerz im Interdigitalraum')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Morton-Neurom'),
    (SELECT id FROM symptom WHERE name = 'Brennender Schmerz mit Ausstrahlung in die Zehen')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Morton-Neurom'),
    (SELECT id FROM symptom WHERE name = 'Taubheitsgefühl in den Zehen')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Morton-Neurom'),
    (SELECT id FROM symptom WHERE name = 'Elektrisierender Schmerz im Vorfuss')
  );
