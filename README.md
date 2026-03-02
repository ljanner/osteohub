# OsteoHub

OsteoHub ist eine Wissens- und Krankheitsdatenbank für Osteopathie-Studierende.

## Voraussetzungen

- Node.js (LTS, empfohlen: 24+)
- pnpm (Projekt nutzt `pnpm@10`)

Versionen prüfen:

```bash
node -v
pnpm -v
```

## Installation

1. Abhängigkeiten installieren:

```bash
pnpm install
```

2. Backend-Umgebungsvariablen aus der Vorlage erstellen:

```bash
cp backend/.env.example backend/.env
```

Danach `backend/.env` bei Bedarf anpassen. Mindestwerte sind:

```dotenv
CONFIGURATION=development
JWT_SECRET=XYZ
```

`JWT_SECRET` kann ein beliebiger sicherer String sein.

Für den vollen Funktionsumfang sollten zusätzlich weitere Variablen gesetzt werden, deren Werte
hier nicht dokumentiert werden können, da es sich um Secrets handelt:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_DATABASE_ID`
- `CLOUDFLARE_D1_TOKEN`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Hinweis: Ohne die Google-Variablen funktioniert der lokale Login nicht.

3. Lokale Datenbank-Migrationen anwenden:

```bash
pnpm backend:db:apply:local
```

4. Lokale Datenbank mit Seed-Daten vorbereiten:

```bash
pnpm backend:db:seed:local
```

Danach ist die Datenbank bereit.

## Projekt starten

Frontend starten:

```bash
pnpm frontend:start
```

Backend starten:

```bash
pnpm backend:start
```

## Linting

Dieses Projekt nutzt **ESLint** (Code-Qualität, inkl. TypeScript-Regeln) und **Prettier**
(Formatierung). Der Gesamt-Check kombiniert Prettier + Frontend-ESLint + Backend-ESLint:

```bash
pnpm lint:all
```

Nur Frontend linten:

```bash
pnpm frontend:lint:all
```

Nur Backend linten:

```bash
pnpm backend:lint
```

Prettier-Checks und Auto-Fix:

```bash
pnpm prettier:check
pnpm prettier:fix
```
