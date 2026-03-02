# Backend (OsteoHub)

Dieses Backend basiert auf:

- **Hono** als Web-Framework
- **Drizzle ORM** für DB-Zugriffe
- **Wrangler** als Cloudflare-Worker Runtime/CLI
- **Cloudflare D1** als Datenbank

## Setup

Im Projekt-Root:

```bash
pnpm install
cp .env.example .env
```

Minimal nötig in `backend/.env`:

```dotenv
CONFIGURATION=development
JWT_SECRET=replace-with-a-secure-random-string
```

Für den vollständigen Auth-Flow werden zusätzlich Secrets benötigt (Google/Cloudflare).

## Lokal starten

Im `backend`-Ordner:

```bash
pnpm start
```

Das startet Wrangler lokal (`wrangler dev`) mit lokaler D1.

## Mit Remote-DB starten

Im `backend`-Ordner:

```bash
pnpm start --remote
```

## Datenbank (lokal)

Im `backend`-Ordner:

```bash
pnpm db:apply:local
pnpm db:seed:local
```

## Deploy

Im `backend`-Ordner:

```bash
pnpm deploy
```

## Typen aktualisieren

```bash
pnpm cf-typegen
```
