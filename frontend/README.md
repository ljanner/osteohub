# Frontend (OsteoHub)

Das Frontend ist eine Angular-Anwendung (Angular 21) und nutzt die Siemens Element Design Library:

- `@siemens/element-ng` für UI-Komponenten
- `@siemens/element-theme` für globale Styles/Tokens
- `@siemens/element-icons` für Icons

Dokumentation: [element.siemens.io](https://element.siemens.io/)

## Development server

Im `frontend`-Ordner:

```bash
pnpm start
```

Anschliessend läuft die App unter `http://localhost:4200/`.

## Backend-Abhängigkeit

Das Frontend verwendet im Development standardmässig das lokale Backend unter
`http://localhost:8787`. Für Login und API-Funktionen muss das Backend parallel laufen.

Root-Command dafür:

```bash
pnpm backend:start
```

Weitere Details findest du in `backend/README.md`.

## Environment-Konfiguration

- Development: `src/environments/environment.development.ts`
- Production: `src/environments/environment.ts`

Der relevante Wert ist `apiBaseUrl`.

## Building

Development Build:

```bash
pnpm build
```

Production Build:

```bash
pnpm build:prod
```

## Testing

Tests (Chrome):

```bash
pnpm test
```

Tests Headless (CI-freundlich):

```bash
pnpm test:headless
```

Hinweis:

- `pnpm test` eignet sich für lokale Entwicklung mit Browser.
- `pnpm test:headless` eignet sich für CI und schnelle lokale Checks ohne sichtbaren Browser.

## Linting

Angular/TypeScript linten:

```bash
pnpm lint
```

SCSS linten:

```bash
pnpm lint:sass
```

Alle Lints ausführen:

```bash
pnpm lint:all
```

## Troubleshooting

- Port `4200` belegt: freien Port verwenden (`pnpm start -- --port 4201`).
- API nicht erreichbar/CORS-Fehler: prüfen, ob das Backend läuft (`pnpm backend:start` im Root).
- Tests starten nicht: lokale Chrome-Installation prüfen oder `pnpm test:headless` nutzen.
