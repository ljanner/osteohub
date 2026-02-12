# OsteoHub – Krankheitsdatenbank (Projekt-Overview, Web Programming Lab)

## Kontext

**OsteoHub** wird zu einer Web-Applikation in Form einer **Krankheits- und Wissensdatenbank** für Osteopathie-Studierende (und interessierte Personen). Ziel ist es, beim Lernen und beim klinischen Denken zu unterstützen, indem Erkrankungen strukturiert erfasst und über **Filter** sowie **Freitextsuche** schnell auffindbar gemacht werden. Die Datenbank besteht aus Krankheitsprofilen (z.B. _Asthma_) mit medizinischen und osteopathischen Informationen. Inhalte werden über eine geschützte Admin-Oberfläche gepflegt, während Besucher die Datenbank lesen und durchsuchen können.

---

## Anforderungen

**Fachliche Anforderungen (User Stories, MoSCoW)**

### User Story 1: Krankheiten durchsuchen und filtern (Prio `Must`)

Als Besucher möchte ich Krankheiten über Freitext und Filter eingrenzen können, damit ich passende Differentialdiagnosen schneller finde.

**Akzeptanzkriterien**

- Es gibt eine Besucheransicht „Krankheitsdatenbank“ mit:
  - Freitextsuche (z.B. nach Name, Beschreibung, Begriffen in Symptomen/Abschnitten)
  - Filtermöglichkeiten über vordefinierte Kategorien (Details können sich im Projektverlauf ändern).
- Filter und Freitextsuche sind kombinierbar (z.B. Filter + Suchbegriff).
- Die Ergebnisliste aktualisiert sich nachvollziehbar (z.B. per „Suchen“-Button oder live bei Eingabe; Entscheidung wird dokumentiert).
- Pro Treffer werden mindestens angezeigt:
  - Name der Krankheit
  - Kurzinfo (z.B. 1–2 Zeilen Beschreibung oder Auszug)
  - relevante Klassifikationen/Tags (falls vorhanden)
- Es gibt eine Möglichkeit, Filter/Suche zurückzusetzen („Reset“).

---

### User Story 2: Krankheitsdetail anzeigen (Prio `Must`)

Als Besucher möchte ich ein Krankheitsprofil im Detail ansehen, damit ich medizinische Grundlagen und osteopathische Bezüge strukturiert nachschlagen kann.

**Akzeptanzkriterien**

- Ein Klick auf einen Suchtreffer öffnet eine Detailseite/Detailansicht.
- Die Detailansicht stellt Inhalte logisch strukturiert dar.
- „Symptome“ und andere Klassifikationen werden als Labels/Tags getrennt vom Fliesstext dargestellt (sofern vorhanden).
- Externe Quellen/Links (falls erfasst) öffnen in einem neuen Tab.

---

### User Story 3: Admin Login via Google OAuth (Prio `Must`)

Als Admin möchte ich mich via Google OAuth anmelden, damit ich Krankheitsprofile verwalten kann.

**Akzeptanzkriterien**

- Login erfolgt über Google Sign-In via Firebase Authentication.
- Ohne Login ist kein Zugriff auf Admin-Funktionen möglich.
- Nur Accounts, deren E-Mail in einer **hard-coded Admin-Whitelist-Konfiguration** enthalten ist, erhalten Zugriff auf die Admin-Oberfläche.
- Nicht-Admin-Accounts können sich zwar technisch authentifizieren, erhalten aber **keinen Zugriff** auf Admin-Funktionen (z.B. Redirect auf Besucheransicht und Hinweis „Kein Zugriff“ / „Forbidden“).

---

### User Story 4: Krankheitsprofil erstellen (Prio `Must`)

Als Admin möchte ich ein Krankheitsprofil erfassen, damit es in der Datenbank sichtbar und durchsuchbar wird.

**Akzeptanzkriterien**

- Ein Admin kann ein neues Krankheitsprofil über ein Formular anlegen.
- Pflichtfelder (Minimum):
  - Name (Muss-Feld)
  - mindestens ein Inhaltselement (z.B. Beschreibung oder Klinik oder Osteopathie; genaue Mindestanforderung wird dokumentiert)
- Weitere Inhalte sind als strukturierte Felder/Abschnitte erfassbar (z.B. medizinische Abschnitte und osteopathischer Ansatz).
- Klassifikationen (z.B. Tags/Labels wie Symptome, Körperregion, System etc.) können als Liste erfasst werden (genaue Kategorien können sich ändern).
- Beim Speichern werden Metadaten gesetzt:
  - `createdAt` (Zeitstempel)
  - `createdBy` (Admin-ID oder E-Mail)

---

### User Story 5: Krankheitsprofil bearbeiten (Prio `Must`)

Als Admin möchte ich bestehende Krankheitsprofile bearbeiten, damit Inhalte korrekt und aktuell bleiben.

**Akzeptanzkriterien**

- Ein Admin kann ein Krankheitsprofil öffnen und Inhalte sowie Klassifikationen anpassen.
- Beim Speichern werden Metadaten aktualisiert:
  - `updatedAt`
  - `updatedBy`
- Änderungen sind nach dem Speichern in der Besucheransicht sichtbar.

---

### User Story 6: Krankheitsprofil löschen (Prio `Must`)

Als Admin möchte ich Krankheitsprofile löschen, damit falsche oder nicht mehr relevante Einträge nicht mehr angezeigt werden.

**Akzeptanzkriterien**

- Ein Admin kann ein Krankheitsprofil löschen.
- Vor dem Löschen erscheint eine Bestätigung („Bist du sicher?“).
- Gelöschte Einträge sind in der Besucheransicht nicht mehr sichtbar.

---

### User Story 7: Admin-Übersicht für Krankheitsprofile (Prio `Should`)

Als Admin möchte ich eine Liste aller Krankheitsprofile sehen, damit ich Inhalte schnell finde und verwalten kann.

**Akzeptanzkriterien**

- Admin sieht eine Liste/Tabelle aller Krankheitsprofile (z.B. Name, letzte Änderung, Tags).
- Aktionen pro Eintrag: Bearbeiten, Löschen.
- Suche/Sortierung (z.B. nach Name oder Änderungsdatum) ist verfügbar.

---

### Zusätzliche Anforderungen / Bonus (Prio `Could`)

### User Story 8: Entwicklungs- & Test-Setup mit Firebase Emulator (Prio `Could`)

Als Entwickler möchte ich lokal mit Firebase Emulatoren arbeiten, damit ich Auth/Firestore/Security Rules realistisch entwickeln und testen kann, ohne produktive Daten zu gefährden.

**Akzeptanzkriterien**

- Das Projekt enthält eine dokumentierte Emulator-Konfiguration (mind. Auth + Firestore).
- Es gibt ein klares Setup in der Dokumentation („wie starte ich lokal“).
- Security Rules können lokal gegen Emulator geprüft werden (z.B. definierte Testfälle oder nachvollziehbare manuelle Testfälle).

---

## Qualitätsanforderungen

- **Usability**:
  - Filter und Suche sind verständlich, wichtige Zustände sind sichtbar (z.B. „X Treffer“, aktive Filter als Chips/Badges).
- **Responsive Design**:
  - Besucheransicht ist für Mobile, Tablet und Desktop nutzbar.
- **Performance**:
  - Such-/Filterinteraktion fühlt sich responsiv an (Zielvorgabe und Messmethode werden dokumentiert).
- **Security by Design**:
  - Schreibzugriffe (Create/Update/Delete) sind durch Firebase Security Rules abgesichert (nicht nur durch UI-Guards).
  - Nur Whitelist-Admins dürfen Krankheitsprofile erstellen/ändern/löschen.
- **Nachvollziehbarkeit/Auditing (Datenebene)**:
  - Bei Create/Update werden `createdAt/createdBy` bzw. `updatedAt/updatedBy` gesetzt.

---

## Angedachter Technologie-Stack

- **Frontend**: Angular (SPA)
- **Backend/Plattform**: Firebase
  - Firebase Authentication (Google OAuth)
  - Firestore (Datenhaltung für Krankheitsprofile)
  - Firebase Hosting
  - Firebase Security Rules
  - Firebase Emulator Suite (Auth + Firestore) für lokale Entwicklung & Tests
- **Testing**:
  - Angular Unit Tests (z.B. Services/Guards/Validation)

---

## Abgrenzungen (Scope)

- Keine Registrierung und kein Login für normale Besucher (nur Admin-Login).
- Kein medizinisches Expertensystem/Diagnose-Automatismus: OsteoHub unterstützt beim Lernen und beim Strukturieren von Wissen, stellt aber **keine Diagnose**.
- Keine vollständige Festlegung aller Filterkategorien in dieser Overview; Filterkategorien können im Projektverlauf angepasst werden.
- Admin-Whitelist ist hard-coded (keine UI zur Admin-Verwaltung).
- Keine komplexe Rollen-/Rechteverwaltung (nur Admin vs. Nicht-Admin).
