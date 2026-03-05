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

-- ============================================================
-- Additional symptoms for new diseases
-- ============================================================

INSERT INTO symptom (name)
VALUES
  ('Atemnot/Dyspnoe'),
  ('Giemen/Pfeifen bei Ausatmung'),
  ('Engegefühl im Brustkorb'),
  ('Husten (trocken oder produktiv)'),
  ('Drückender Kopfschmerz bilateral'),
  ('Nacken-/Schulter-Verspannung'),
  ('Kopfschmerz verstärkt bei Stress'),
  ('Bauchkrämpfe/Bauchschmerzen'),
  ('Blähungen'),
  ('Stuhlunregelmässigkeit (Durchfall/Verstopfung)'),
  ('Kreuzschmerz mit Ausstrahlung ins Bein'),
  ('Sensibilitätsstörungen im Bein/Fuss'),
  ('Kraftminderung im Bein'),
  ('Lasègue-Zeichen positiv'),
  ('Symmetrische Gelenkschwellung'),
  ('Morgensteifigkeit >60 Minuten'),
  ('Müdigkeit/Fatigue'),
  ('Chronischer Beckenschmerz'),
  ('Schmerz verstärkt bei langem Sitzen'),
  ('Dyspareunie'),
  ('Schwindel bei Kopfbewegung'),
  ('Nackenschmerz'),
  ('Gleichgewichtsstörung'),
  ('Sodbrennen/retrosternales Brennen'),
  ('Aufstossen'),
  ('Schluckbeschwerden (Dysphagie)'),
  ('Kribbeln/Taubheit in Arm/Hand'),
  ('Schweregefühl im Arm'),
  ('Schmerz verstärkt bei Überkopfarbeit'),
  ('Kälteintoleranz'),
  ('Gewichtszunahme'),
  ('Konzentrationsstörungen');

-- ============================================================
-- Additional diseases
-- ============================================================

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
    'Asthma bronchiale',
    'J45',
    'Chronisch-entzündliche Atemwegserkrankung mit reversibler Bronchokonstriktion, Schleimhautödem und vermehrter Schleimproduktion.',
    'Häufig: ca. 5-7 % der Erwachsenen und bis 10 % der Kinder in der Schweiz betroffen.',
    'Multifaktoriell: genetische Prädisposition (Atopie), Umweltallergene (Pollen, Hausstaubmilben, Tierhaare), Infektionen, körperliche Belastung, kalte Luft und berufliche Exposition.',
    'Chronische Entzündung der Bronchialschleimhaut führt zu Hyperreagibilität der Atemwege, Bronchokonstriktion durch glatte Muskulatur, Schleimhautödem und Hyper­sekretion mit resultierender Atemwegsobstruktion.',
    'Status asthmaticus (therapierefraktärer Anfall), Zyanose, Sprechdyspnoe, Bewusstse­inseintrübung, Atemfrequenz >25/min, Abfall der Sauerstoffsättigung.',
    'Lungenfunktionsprüfung (Spirometrie) mit Reversibilitätstest, Peak-Flow-Messung, Allergiediagnostik (Prick-Test, spezifisches IgE), ggf. Provokationstest.',
    'Stufentherapie gemäss GINA-Leitlinie: inhalative Kortikosteroide (ICS) als Basistherapie, kurzwirksame Beta-2-Agonisten (SABA) als Reliever, bei Bedarf Langzeitbronchodilatatoren (LABA), Leukotrien-Antagonisten, Biologika bei schwerem Asthma.',
    'Unter konsequenter Therapie gut kontrollierbar; bei Kindern teilweise „Herauswachsen" möglich. Ohne Behandlung chronischer Verlauf mit Remodelling der Atemwege.',
    'Thorakale Mobilisation zur Verbesserung der Atemmechanik, Zwerchfellbehandlung, Rippen-/Wirbelsäulenmobilisation, vegetative Regulation über zervikothorakalen Übergang und viszerale Techniken am Bronchialsystem.'
  ),
  (
    'Spannungskopfschmerz',
    'G44.2',
    'Häufigste primäre Kopfschmerzform mit beidseitigem, drückendem Charakter von leichter bis mittlerer Intensität.',
    'Sehr häufig: Lebenszeitprävalenz bis 80 %; episodisch bei ca. 40 % der Bevölkerung, chronisch bei 2-3 %.',
    'Multifaktoriell: muskuläre Verspannung (perikranielle Muskulatur), psychischer Stress, Fehlhaltungen, Schlafmangel, Dehydratation und hormonelle Faktoren.',
    'Erhöhte Empfindlichkeit perikranieller Schmerzrezeptoren, zentrale Sensitivierung bei chronischer Form, muskuläre Triggerpunkte und myofasziale Dysfunktion als periphere Unterhalter.',
    'Plötzlicher Vernichtungskopfschmerz, neurologische Ausfälle, Fieber mit Nackensteifigkeit, erstmaliger Kopfschmerz >50 Jahre, Bewusstseinsveränderung, rascher progredienter Verlauf.',
    'Klinische Diagnose gemäss ICHD-3-Kriterien, Ausschluss sekundärer Ursachen, Kopfschmerztagebuch, bei Warnsymptomen bildgebende Abklärung (cMRT).',
    'Episodisch: Analgetika (Ibuprofen, Paracetamol), Stressmanagement. Chronisch: Amitriptylin prophylaktisch, kognitive Verhaltenstherapie, Physiotherapie, Biofeedback und regelmässige Ausdauerbewegung.',
    'Episodische Form meist selbstlimitierend; chronische Form oft langwierig, aber durch multimodalen Ansatz deutlich besserbar.',
    'Subokzipitale Dekompression, Behandlung zervikaler Dysfunktionen (C0-C3), myofasziale Release-Techniken der perikraniellen und zervikalen Muskulatur, kraniosakrale Techniken und Stressregulation über das vegetative Nervensystem.'
  ),
  (
    'Reizdarmsyndrom',
    'K58',
    'Funktionelle gastrointestinale Störung mit chronischen Bauchschmerzen und veränderten Stuhlgewohnheiten ohne nachweisbares organisches Korrelat.',
    'Häufig: Prävalenz 10-15 % in westlichen Industrieländern; Frauen ca. doppelt so häufig betroffen wie Männer.',
    'Biopsychosoziales Modell: viszerale Hypersensitivität, gestörte Darm-Hirn-Achse, post­infektiöse Veränderungen, psychosozialer Stress, Dysbiose der Darmflora und Nahrungsmittelunverträglichkeiten.',
    'Veränderte Darmmotilität und viszerale Hyperalgesie durch Sensitivierung afferenter Neurone, low-grade Inflammation der Mukosa, Störung der Darm-Hirn-Achse mit Einfluss auf Schmerzverarbeitung und Motilität.',
    'Blut im Stuhl, unerklärter Gewichtsverlust, Fieber, Anämie, nächtliche Symptomatik, Erstmanifestation >50 Jahre, familiäre Belastung mit kolorektalem Karzinom.',
    'Ausschlussdiagnose gemäss Rom-IV-Kriterien: Anamnese, Basislabor (BB, CRP, Zöliakie-Serologie, TSH), Stuhldiagnostik (Calprotectin), Koloskopie bei Warnsymptomen.',
    'Multimodal: Ernährungsberatung (low-FODMAP-Diät), Stressmanagement, Spasmolytika (Pfefferminzöl, Butylscopolamin), Probiotika, bei Bedarf Antidepressiva (niedrigdosiert) und Psycho­therapie.',
    'Chronisch-rezidivierend, aber keine Progression zu organischen Erkrankungen; Symptomkontrolle durch Lebensstilanpassung und Therapie meist gut erreichbar.',
    'Viszerale Techniken an Dünn-/Dickdarm, Behandlung thorakolumbaler und sakraler Segmente (vegetative Versorgung), Zwerchfellrelease, kraniosakrale Techniken zur parasympathischen Regulation und Spannungsreduktion im lumbopelvinen Bereich.'
  ),
  (
    'Lumbaler Bandscheibenvorfall',
    'M51.1',
    'Protrusion oder Prolaps von Nucleus-pulposus-Material der lumbalen Bandscheibe mit möglicher Kompression von Nervenwurzeln.',
    'Häufig: Inzidenz 5-20 pro 1''000 Erwachsene/Jahr; Altersgipfel 30-50 Jahre.',
    'Degenerative Veränderungen des Anulus fibrosus in Kombination mit mechanischer Belastung; Risikofaktoren: schweres Heben, Vibrationsexposition, Übergewicht, sitzende Tätigkeit und genetische Prädisposition.',
    'Rissbildung im Anulus fibrosus ermöglicht Verlagerung des Nucleus pulposus nach posterior/posterolateral mit Kompression der Nervenwurzel; es kommt zu mechanischer Irritation und chemisch-entzündlicher Reaktion (TNF-α, IL-1).',
    'Cauda-equina-Syndrom (Blasen-/Mastdarmstörung, Reithosenanästhesie), rasch progrediente Parese, bilaterale neurologische Ausfälle, Fieber mit Rückenschmerz.',
    'Klinische Untersuchung (Lasègue, Motorik, Sensibilität, Reflexe), MRT der LWS als Goldstandard, Röntgen zum Ausschluss ossärer Pathologie, ggf. Elektromyographie.',
    'Konservativ (>90 %): Frühmobilisation, Analgesie (NSAR, ggf. kurzzeitig Opioide), Physiotherapie, Rückenschule. Bei persistierenden neurologischen Defi­ziten oder Versagen konservativer Therapie: operative Diskektomie.',
    'Günstig: ca. 90 % der Patienten bessern sich unter konservativer Therapie innerhalb von 6-12 Wochen; Rezidivrisiko ca. 5-15 %.',
    'Entlastung der betroffenen Segmente (L4/L5, L5/S1), myofasziale Behandlung der lum­balen und glutealen Muskulatur, neurale Mobilisation (Nervus ischiadicus), Beckenmechanik normalisieren und segmentale Stabilisation fördern.'
  ),
  (
    'Rheumatoide Arthritis',
    'M05-M06',
    'Chronisch-entzündliche Autoimmunerkrankung mit symmetrischer Polyarthritis, primär der kleinen Gelenke (Hände, Füsse), und möglicher Systembeteiligung.',
    'Prävalenz ca. 0.5-1 % der Bevölkerung; Frauen 2-3 mal häufiger betroffen; Manifestationsgipfel 40-60 Jahre.',
    'Autoimmunprozess bei genetischer Prädisposition (HLA-DR4) und Umweltfaktoren (Rauchen, Infektionen); Bildung von Autoantikörpern (RF, Anti-CCP) gegen körpereigene Strukturen.',
    'Infiltration der Synovialmembran durch Immunzellen → Pannusbildung → enzymatische Destruktion von Knorpel und Knochen; systemische Entzündung über proinflammatorische Zytokine (TNF-α, IL-6).',
    'Rasch progrediente Gelenkdestruktion, Vaskulitis, interstitielle Lungenerkrankung, atlantoaxiale Subluxation (Myelopathie-Zeichen), schwere Allgemeinsymptome.',
    'Klinische Kriterien (ACR/EULAR 2010), Labor (BSG, CRP, RF, Anti-CCP-Antikörper), bildgebend Röntgen Hände/Füsse, Gelenk-Sonografie/MRT zur Frühdiagnostik.',
    'Frühzeitige DMARD-Therapie (Methotrexat als Ankersubstanz), bei Bedarf Biologika (TNF-Inhibitoren, IL-6-Blocker), NSAR und niedrigdosierte Glukokortikoide als Bridging, Ergo-/Physiotherapie, Gelenkschutzberatung.',
    'Unter moderner Therapie (Treat-to-Target) ist Remission oder niedrige Krankheitsaktivität erreichbar; ohne Behandlung fortschreitende Gelenkdestruktion und Funktionsverlust.',
    'Sanfte Mobilisation der betroffenen Gelenke (keine forcierte Manipulation im Schub), myofasziale Entlastung der Umgebungsmuskulatur, Lymphdrainage-Techniken, kraniosakrale Behandlung und Förderung der allgemeinen Selbstregulation.'
  ),
  (
    'Chronisches Beckenschmerz-Syndrom',
    'N94.8',
    'Persistierender, nicht-zyklischer Schmerz im Beckenbereich über mindestens 6 Monate ohne alleinig erklärende organische Ursache.',
    'Prävalenz bei Frauen ca. 4-25 % (je nach Studie); bei Männern als chronische Prostatitis/CPPS ca. 2-10 %.',
    'Multifaktoriell: myofasziale Dysfunktion des Beckenbodens, viszerale Sensibilisierung, vorangegangene Infektionen/Operationen, psychische Belastung, hormonelle Einflüsse und biomechanische Fehlbelastung.',
    'Zentrale und periphere Sensitivierung führt zu chronischer Schmerzreaktion; myofasziale Triggerpunkte im Beckenboden, Hypertonus der Beckenbodenmuskulatur und gestörte vegetative Regulation unterhalten den Schmerz.',
    'Akuter Harnverhalt, Hämaturie, Fieber, unerklärter Gewichtsverlust, tastbare Raumforderung im Becken.',
    'Ausschlussdiagnose: gynäkologische/urologische Abklärung, Becken-Sonografie, ggf. MRT, Beckenbodenassessment, Schmerzanamnese und psychosoziale Evaluation.',
    'Multimodal: Beckenbodenphysiotherapie, Schmerzedukation, Entspannungstechniken, medika­mentös (NSAR, Amitriptylin), psychotherapeutische Begleitung (CBT), ggf. Triggerpunkt-Infiltrationen.',
    'Chronischer Verlauf, aber bei konsequenter multimodaler Therapie deutliche Besserung der Lebensqualität in 50-70 % der Fälle möglich.',
    'Beckenbodenrelease (interne und externe Techniken), sakroiliakale und lumbopelvine Mobilisation, viszerale Techniken an Blase/Uterus/Prostata, kraniosakrale Therapie und Regulation des autonomen Nervensystems über sakrale Segmente.'
  ),
  (
    'Thoracic-Outlet-Syndrom',
    'G54.0',
    'Neurovaskuläres Kompressionssyndrom im Bereich der oberen Thoraxapertur mit Einengung des Plexus brachialis und/oder der Arteria/Vena subclavia.',
    'Selten bis mittelhäufig: geschätzte Prävalenz 3-80 pro 1''000 (je nach Diagnosekriterien); neurogene Form am häufigsten; Frauen häufiger betroffen.',
    'Anatomische Prädisposition (Halsrippe, Bandanomalien), muskuläre Dysbalance (Mm. scaleni, M. pectoralis minor), Trauma (HWS-Distorsion), repetitive Überkopfarbeit und Haltungsinsuffizienz.',
    'Kompression neurovaskulärer Strukturen in drei Engstellen: Scalenuslücke, kostoklavikulärer Raum und subpectoraler Raum; chronische Kompression führt zu Demyelinisierung und/oder vaskulärer Insuffizienz.',
    'Akute arterielle Ischämie oder venöse Thrombose der oberen Extremität, rasch progrediente Atrophie der Handmuskulatur, Horner-Syndrom.',
    'Klinische Provokationstests (Adson, Wright, Roos), Doppler-/Duplexsonografie, Röntgen HWS/Thorax (Halsrippe?), MR-Angiografie, elektrophysiologische Diagnostik.',
    'Konservativ (Erstlinie): Physiotherapie mit Haltungskorrektur, Dehnung der Scaleni und des M. pectoralis minor, Kräftigung der Schultergürtelstabilisatoren. Operativ bei Versagen: Scalenotomie, Resektion Halsrippe/1. Rippe.',
    'Konservativ in ca. 60-70 % erfolgreich; operative Ergebnisse gut bei klarer vaskulärer Indikation; neurogene Form teils langwierig.',
    'Mobilisation des zervikothorakalen Übergangs und der 1. Rippe, myofasziales Release der Mm. scaleni und des M. pectoralis minor, Behandlung der Schlüsselbein-Mechanik, neurale Mobilisation des Plexus brachialis und Verbesserung der thorakalen Atemmechanik.'
  ),
  (
    'Gastroösophageale Refluxkrankheit',
    'K21',
    'Rückfluss von Mageninhalt in den Ösophagus mit typischen Beschwerden (Sodbrennen) und möglicher Schleimhautschädigung.',
    'Sehr häufig in westlichen Industrieländern: Prävalenz 10-20 % (mindestens wöchentliche Symptome).',
    'Insuffizienz des unteren Ösophagussphinkters (UÖS), Hiatushernie, erhöhter intra­abdomineller Druck (Adipositas, Schwangerschaft), Ernährungsfaktoren (Fett, Alkohol, Koffein) und Medikamente.',
    'Inadäquate Relaxation oder verminderte Grundspannung des UÖS ermöglicht Reflux von Salzsäure und Pepsin; chronische Exposition der Ösophagusschleimhaut führt zu Entzündung (Ösophagitis) und ggf. Barrett-Metaplasie.',
    'Dysphagie, Odynophagie, unerklärter Gewichtsverlust, GI-Blutung (Hämatemesis/Melaena), Anämie, Symptome >5 Jahre (Barrett-Screening).',
    'Klinische Diagnose bei typischen Symptomen, Therapieversuch mit PPI als diagnostischer Test, Gastroskopie bei Warnsymptomen oder Therapieresistenz, ggf. 24h-pH-Metrie/Impedanzmessung.',
    'Lebensstilmodifikation (Gewichtsreduktion, Kopfhochlagern, Auslöser meiden), Protonenpumpeninhibitoren (PPI) als Standardtherapie, H2-Blocker, Antazida; bei Versagen laparoskopische Fundoplicatio.',
    'Unter PPI-Therapie gute Symptomkontrolle; Langzeittherapie oft erforderlich; Barrett-Ösophagus als Komplikation erfordert Surveillance.',
    'Behandlung des Zwerchfells (Crus-Technik), viszerale Mobilisation des Magens und des ösophagogastralen Übergangs, thorakale Wirbelsäulenmobilisation (Th5-Th9), Spannungsreduktion im Oberbauch und vegetative Regulation über den N. vagus.'
  ),
  (
    'Hashimoto-Thyreoiditis',
    'E06.3',
    'Chronische Autoimmunthyreoiditis mit lymphozytärer Infiltration der Schilddrüse und häufig resultierender Hypothyreose.',
    'Häufigste Ursache der Hypothyreose in Jod-suffizienten Gebieten; Prävalenz ca. 5-10 % (subklinisch eingeschlossen); Frauen 5-10 mal häufiger betroffen.',
    'Autoimmunprozess mit genetischer Prädisposition (HLA-DR3/5), Umweltfaktoren (Jodüberschuss, Stress, Infektionen, Rauchen) und geschlechtsspezifischen Faktoren (Östrogen).',
    'T-Zell-vermittelte Destruktion von Thyreozyten und Bildung von Autoantikörpern (Anti-TPO, Anti-Thyreoglobulin); fortschreitender Parenchymverlust führt zu Hypothyreose mit erniedrigtem fT4 und erhöhtem TSH.',
    'Myxödem-Koma (Bewusstseinseintrübung, Hypothermie, Bradykardie), grosse Struma mit Kompressionssymptomen, Verdacht auf Schilddrüsenlymphom bei rascher Grössenprogredienz.',
    'Labor: TSH, fT4, Anti-TPO-Antikörper (>90 % positiv), Anti-Thyreoglobulin-Antikörper; Schilddrüsen-Sonografie (echoarm, inhomogen); Szintigrafie selten nötig.',
    'Levothyroxin-Substitution bei manifester Hypothyreose (TSH-gesteuert), Monitoring alle 6-12 Monate, Selensubstitution (Evidenz begrenzt), Behandlung von Komorbiditäten (z.B. Eisenmangel, Vitamin D).',
    'Hypothyreose unter Substitution gut behandelbar; lebenslange Medikation meist erforderlich; regelmässige Verlaufskontrollen nötig.',
    'Kraniosakrale Techniken zur Regulation des neuroendokrinen Systems, sanfte Techniken an der Halsregion (Schilddrüse/Hyoid), Behandlung des zervikothorakalen Übergangs, Förderung der lymphatischen Drainage zervikal und mediastinal, vegetative Balance über parasympathische Stimulation.'
  ),
  (
    'Zervikogener Schwindel',
    'R42',
    'Schwindel und Gleichgewichtsstörungen, die von Dysfunktionen der oberen Halswirbelsäule ausgehen (propriozeptive Fehlsteuerung).',
    'Prävalenz unklar aufgrund schwieriger Abgrenzung; geschätzt 7-15 % aller Schwindelpatienten; häufig post-traumatisch (nach HWS-Distorsion).',
    'Gestörte propriozeptive Afferenzen aus Gelenkkapseln, Ligamenten und tiefer Nackenmuskulatur der oberen HWS (C0-C3) infolge von Trauma, degenerativen Veränderungen oder muskulärer Dysfunktion.',
    'Fehlerhafte propriozeptive Signale aus der oberen HWS werden in den Vestibulariskernen mit vestibulären und visuellen Informationen integriert; Mismatch führt zu Schwindel, Unsicher­heit und Nystagmus.',
    'Vertigo mit Hirnstammsymptomen (Doppelbilder, Dysarthrie, Schluckstörung, Drop Attack), plötzlicher Hörverlust, schwerer Drehschwindel mit vegetativer Krise.',
    'Ausschlussdiagnose: HNO-Untersuchung (Nystagmusprüfung, kalorische Testung), neurologische Abklärung, Doppler der Vertebralarterien, MRT HWS/Hirn bei Verdacht auf zentrale Ursache; manuelle Untersuchung der oberen HWS.',
    'Manuelle Therapie/Mobilisation der oberen HWS, zervikale sensomotorische Übungen (Propriozeptionstraining), vestibuläre Rehabilitation, Ausdauertraining und bei Bedarf medikamentöse Unterstützung (Antivertiginosa kurzfristig).',
    'Bei adäquater Therapie gute Prognose; nach HWS-Trauma Besserung oft über Wochen bis Monate; chronische Verläufe bei persistierender zervikaler Dysfunktion möglich.',
    'Spezifische Mobilisation der Segmente C0-C3 (HVLA oder MET nach Befund), subokzipitale Muskelrelease-Techniken, Behandlung des kraniozervikalen Übergangs, kraniosakrale Techniken an den Temporalknochen und Förderung der propriozeptiven Reafferenz.'
  );

-- ============================================================
-- Additional disease ↔ body_region relations
-- ============================================================

INSERT INTO disease_body_region (diseaseId, bodyRegionId)
VALUES
  (
    (SELECT id FROM disease WHERE name = 'Asthma bronchiale'),
    (SELECT id FROM body_region WHERE name = 'Thorax')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Spannungskopfschmerz'),
    (SELECT id FROM body_region WHERE name = 'Kopf/Hals')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Reizdarmsyndrom'),
    (SELECT id FROM body_region WHERE name = 'Abdomen')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Lumbaler Bandscheibenvorfall'),
    (SELECT id FROM body_region WHERE name = 'Wirbelsäule')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Rheumatoide Arthritis'),
    (SELECT id FROM body_region WHERE name = 'Mehrere Gelenke')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Chronisches Beckenschmerz-Syndrom'),
    (SELECT id FROM body_region WHERE name = 'Becken')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Thoracic-Outlet-Syndrom'),
    (SELECT id FROM body_region WHERE name = 'Thorax')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Thoracic-Outlet-Syndrom'),
    (SELECT id FROM body_region WHERE name = 'Kopf/Hals')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Gastroösophageale Refluxkrankheit'),
    (SELECT id FROM body_region WHERE name = 'Thorax')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Gastroösophageale Refluxkrankheit'),
    (SELECT id FROM body_region WHERE name = 'Abdomen')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Hashimoto-Thyreoiditis'),
    (SELECT id FROM body_region WHERE name = 'Kopf/Hals')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Zervikogener Schwindel'),
    (SELECT id FROM body_region WHERE name = 'Kopf/Hals')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Zervikogener Schwindel'),
    (SELECT id FROM body_region WHERE name = 'Wirbelsäule')
  );

-- ============================================================
-- Additional disease ↔ body_system relations
-- ============================================================

INSERT INTO disease_body_system (diseaseId, bodySystemId)
VALUES
  (
    (SELECT id FROM disease WHERE name = 'Asthma bronchiale'),
    (SELECT id FROM body_system WHERE name = 'Respiratorisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Asthma bronchiale'),
    (SELECT id FROM body_system WHERE name = 'Immunologisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Spannungskopfschmerz'),
    (SELECT id FROM body_system WHERE name = 'Neurologisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Spannungskopfschmerz'),
    (SELECT id FROM body_system WHERE name = 'Muskuloskelettal')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Reizdarmsyndrom'),
    (SELECT id FROM body_system WHERE name = 'Gastrointestinal')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Lumbaler Bandscheibenvorfall'),
    (SELECT id FROM body_system WHERE name = 'Muskuloskelettal')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Lumbaler Bandscheibenvorfall'),
    (SELECT id FROM body_system WHERE name = 'Neurologisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Rheumatoide Arthritis'),
    (SELECT id FROM body_system WHERE name = 'Muskuloskelettal')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Rheumatoide Arthritis'),
    (SELECT id FROM body_system WHERE name = 'Immunologisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Chronisches Beckenschmerz-Syndrom'),
    (SELECT id FROM body_system WHERE name = 'Muskuloskelettal')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Thoracic-Outlet-Syndrom'),
    (SELECT id FROM body_system WHERE name = 'Kardiovaskulär')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Thoracic-Outlet-Syndrom'),
    (SELECT id FROM body_system WHERE name = 'Neurologisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Gastroösophageale Refluxkrankheit'),
    (SELECT id FROM body_system WHERE name = 'Gastrointestinal')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Hashimoto-Thyreoiditis'),
    (SELECT id FROM body_system WHERE name = 'Immunologisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Zervikogener Schwindel'),
    (SELECT id FROM body_system WHERE name = 'Neurologisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Zervikogener Schwindel'),
    (SELECT id FROM body_system WHERE name = 'Muskuloskelettal')
  );

-- ============================================================
-- Additional disease ↔ vindicate_category relations
-- ============================================================

INSERT INTO disease_vindicate_category (diseaseId, vindicateCategoryId)
VALUES
  (
    (SELECT id FROM disease WHERE name = 'Asthma bronchiale'),
    (SELECT id FROM vindicate_category WHERE name = 'Funktionell')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Spannungskopfschmerz'),
    (SELECT id FROM vindicate_category WHERE name = 'Funktionell')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Reizdarmsyndrom'),
    (SELECT id FROM vindicate_category WHERE name = 'Funktionell')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Lumbaler Bandscheibenvorfall'),
    (SELECT id FROM vindicate_category WHERE name = 'Degenerativ')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Lumbaler Bandscheibenvorfall'),
    (SELECT id FROM vindicate_category WHERE name = 'Traumatisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Rheumatoide Arthritis'),
    (SELECT id FROM vindicate_category WHERE name = 'Autoimmun')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Chronisches Beckenschmerz-Syndrom'),
    (SELECT id FROM vindicate_category WHERE name = 'Funktionell')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Thoracic-Outlet-Syndrom'),
    (SELECT id FROM vindicate_category WHERE name = 'Vaskulär')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Thoracic-Outlet-Syndrom'),
    (SELECT id FROM vindicate_category WHERE name = 'Kongenital')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Gastroösophageale Refluxkrankheit'),
    (SELECT id FROM vindicate_category WHERE name = 'Funktionell')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Hashimoto-Thyreoiditis'),
    (SELECT id FROM vindicate_category WHERE name = 'Autoimmun')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Hashimoto-Thyreoiditis'),
    (SELECT id FROM vindicate_category WHERE name = 'Endokrin')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Zervikogener Schwindel'),
    (SELECT id FROM vindicate_category WHERE name = 'Funktionell')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Zervikogener Schwindel'),
    (SELECT id FROM vindicate_category WHERE name = 'Traumatisch')
  );

-- ============================================================
-- Additional disease ↔ osteopathic_model relations
-- ============================================================

INSERT INTO disease_osteopathic_model (diseaseId, osteopathicModelId)
VALUES
  (
    (SELECT id FROM disease WHERE name = 'Asthma bronchiale'),
    (SELECT id FROM osteopathic_model WHERE name = 'Respiratorisch-Zirkulatorisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Asthma bronchiale'),
    (SELECT id FROM osteopathic_model WHERE name = 'Biomechanisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Spannungskopfschmerz'),
    (SELECT id FROM osteopathic_model WHERE name = 'Biomechanisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Spannungskopfschmerz'),
    (SELECT id FROM osteopathic_model WHERE name = 'Verhaltensbezogen')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Reizdarmsyndrom'),
    (SELECT id FROM osteopathic_model WHERE name = 'Verhaltensbezogen')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Reizdarmsyndrom'),
    (SELECT id FROM osteopathic_model WHERE name = 'Neurologisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Lumbaler Bandscheibenvorfall'),
    (SELECT id FROM osteopathic_model WHERE name = 'Biomechanisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Lumbaler Bandscheibenvorfall'),
    (SELECT id FROM osteopathic_model WHERE name = 'Neurologisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Rheumatoide Arthritis'),
    (SELECT id FROM osteopathic_model WHERE name = 'Biomechanisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Rheumatoide Arthritis'),
    (SELECT id FROM osteopathic_model WHERE name = 'Metabolisch-Energetisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Chronisches Beckenschmerz-Syndrom'),
    (SELECT id FROM osteopathic_model WHERE name = 'Biomechanisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Chronisches Beckenschmerz-Syndrom'),
    (SELECT id FROM osteopathic_model WHERE name = 'Neurologisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Thoracic-Outlet-Syndrom'),
    (SELECT id FROM osteopathic_model WHERE name = 'Biomechanisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Thoracic-Outlet-Syndrom'),
    (SELECT id FROM osteopathic_model WHERE name = 'Respiratorisch-Zirkulatorisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Gastroösophageale Refluxkrankheit'),
    (SELECT id FROM osteopathic_model WHERE name = 'Metabolisch-Energetisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Gastroösophageale Refluxkrankheit'),
    (SELECT id FROM osteopathic_model WHERE name = 'Biomechanisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Hashimoto-Thyreoiditis'),
    (SELECT id FROM osteopathic_model WHERE name = 'Metabolisch-Energetisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Zervikogener Schwindel'),
    (SELECT id FROM osteopathic_model WHERE name = 'Biomechanisch')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Zervikogener Schwindel'),
    (SELECT id FROM osteopathic_model WHERE name = 'Neurologisch')
  );

-- ============================================================
-- Additional disease ↔ symptom relations
-- ============================================================

INSERT INTO disease_symptom (diseaseId, symptomId)
VALUES
  -- Asthma bronchiale
  (
    (SELECT id FROM disease WHERE name = 'Asthma bronchiale'),
    (SELECT id FROM symptom WHERE name = 'Atemnot/Dyspnoe')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Asthma bronchiale'),
    (SELECT id FROM symptom WHERE name = 'Giemen/Pfeifen bei Ausatmung')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Asthma bronchiale'),
    (SELECT id FROM symptom WHERE name = 'Engegefühl im Brustkorb')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Asthma bronchiale'),
    (SELECT id FROM symptom WHERE name = 'Husten (trocken oder produktiv)')
  ),
  -- Spannungskopfschmerz
  (
    (SELECT id FROM disease WHERE name = 'Spannungskopfschmerz'),
    (SELECT id FROM symptom WHERE name = 'Drückender Kopfschmerz bilateral')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Spannungskopfschmerz'),
    (SELECT id FROM symptom WHERE name = 'Nacken-/Schulter-Verspannung')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Spannungskopfschmerz'),
    (SELECT id FROM symptom WHERE name = 'Kopfschmerz verstärkt bei Stress')
  ),
  -- Reizdarmsyndrom
  (
    (SELECT id FROM disease WHERE name = 'Reizdarmsyndrom'),
    (SELECT id FROM symptom WHERE name = 'Bauchkrämpfe/Bauchschmerzen')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Reizdarmsyndrom'),
    (SELECT id FROM symptom WHERE name = 'Blähungen')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Reizdarmsyndrom'),
    (SELECT id FROM symptom WHERE name = 'Stuhlunregelmässigkeit (Durchfall/Verstopfung)')
  ),
  -- Lumbaler Bandscheibenvorfall
  (
    (SELECT id FROM disease WHERE name = 'Lumbaler Bandscheibenvorfall'),
    (SELECT id FROM symptom WHERE name = 'Kreuzschmerz mit Ausstrahlung ins Bein')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Lumbaler Bandscheibenvorfall'),
    (SELECT id FROM symptom WHERE name = 'Sensibilitätsstörungen im Bein/Fuss')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Lumbaler Bandscheibenvorfall'),
    (SELECT id FROM symptom WHERE name = 'Kraftminderung im Bein')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Lumbaler Bandscheibenvorfall'),
    (SELECT id FROM symptom WHERE name = 'Lasègue-Zeichen positiv')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Lumbaler Bandscheibenvorfall'),
    (SELECT id FROM symptom WHERE name = 'Ruheschmerz')
  ),
  -- Rheumatoide Arthritis
  (
    (SELECT id FROM disease WHERE name = 'Rheumatoide Arthritis'),
    (SELECT id FROM symptom WHERE name = 'Symmetrische Gelenkschwellung')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Rheumatoide Arthritis'),
    (SELECT id FROM symptom WHERE name = 'Morgensteifigkeit >60 Minuten')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Rheumatoide Arthritis'),
    (SELECT id FROM symptom WHERE name = 'Müdigkeit/Fatigue')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Rheumatoide Arthritis'),
    (SELECT id FROM symptom WHERE name = 'Gelenksteifigkeit nach Ruhe')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Rheumatoide Arthritis'),
    (SELECT id FROM symptom WHERE name = 'Gelenkschwellung/Erguss')
  ),
  -- Chronisches Beckenschmerz-Syndrom
  (
    (SELECT id FROM disease WHERE name = 'Chronisches Beckenschmerz-Syndrom'),
    (SELECT id FROM symptom WHERE name = 'Chronischer Beckenschmerz')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Chronisches Beckenschmerz-Syndrom'),
    (SELECT id FROM symptom WHERE name = 'Schmerz verstärkt bei langem Sitzen')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Chronisches Beckenschmerz-Syndrom'),
    (SELECT id FROM symptom WHERE name = 'Dyspareunie')
  ),
  -- Thoracic-Outlet-Syndrom
  (
    (SELECT id FROM disease WHERE name = 'Thoracic-Outlet-Syndrom'),
    (SELECT id FROM symptom WHERE name = 'Kribbeln/Taubheit in Arm/Hand')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Thoracic-Outlet-Syndrom'),
    (SELECT id FROM symptom WHERE name = 'Schweregefühl im Arm')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Thoracic-Outlet-Syndrom'),
    (SELECT id FROM symptom WHERE name = 'Schmerz verstärkt bei Überkopfarbeit')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Thoracic-Outlet-Syndrom'),
    (SELECT id FROM symptom WHERE name = 'Nacken-/Schulter-Verspannung')
  ),
  -- Gastroösophageale Refluxkrankheit
  (
    (SELECT id FROM disease WHERE name = 'Gastroösophageale Refluxkrankheit'),
    (SELECT id FROM symptom WHERE name = 'Sodbrennen/retrosternales Brennen')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Gastroösophageale Refluxkrankheit'),
    (SELECT id FROM symptom WHERE name = 'Aufstossen')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Gastroösophageale Refluxkrankheit'),
    (SELECT id FROM symptom WHERE name = 'Schluckbeschwerden (Dysphagie)')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Gastroösophageale Refluxkrankheit'),
    (SELECT id FROM symptom WHERE name = 'Engegefühl im Brustkorb')
  ),
  -- Hashimoto-Thyreoiditis
  (
    (SELECT id FROM disease WHERE name = 'Hashimoto-Thyreoiditis'),
    (SELECT id FROM symptom WHERE name = 'Müdigkeit/Fatigue')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Hashimoto-Thyreoiditis'),
    (SELECT id FROM symptom WHERE name = 'Kälteintoleranz')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Hashimoto-Thyreoiditis'),
    (SELECT id FROM symptom WHERE name = 'Gewichtszunahme')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Hashimoto-Thyreoiditis'),
    (SELECT id FROM symptom WHERE name = 'Konzentrationsstörungen')
  ),
  -- Zervikogener Schwindel
  (
    (SELECT id FROM disease WHERE name = 'Zervikogener Schwindel'),
    (SELECT id FROM symptom WHERE name = 'Schwindel bei Kopfbewegung')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Zervikogener Schwindel'),
    (SELECT id FROM symptom WHERE name = 'Nackenschmerz')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Zervikogener Schwindel'),
    (SELECT id FROM symptom WHERE name = 'Gleichgewichtsstörung')
  ),
  (
    (SELECT id FROM disease WHERE name = 'Zervikogener Schwindel'),
    (SELECT id FROM symptom WHERE name = 'Nacken-/Schulter-Verspannung')
  );
