import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import diseases from './controllers/diseases';
import filters from './controllers/filters';
import symptoms from './controllers/symptoms';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

const allowedOrigins = ['https://osteohub.ch', 'https://www.osteohub.ch'];
if (process.env.CONFIGURATION === 'development') {
  allowedOrigins.push('http://localhost:4200');
}

app.use(
  '*',
  cors({
    origin: allowedOrigins,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400
  })
);

app.route('/filters', filters);
app.route('/diseases', diseases);
app.route('/symptoms', symptoms);

export default app;
