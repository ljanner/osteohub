import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import authController from './controllers/auth';
import bodyRegionController from './controllers/body-region';
import bodySystemController from './controllers/body-system';
import diseaseController from './controllers/disease';
import osteopathicModelController from './controllers/osteopathic-model';
import symptomsController from './controllers/symptom';
import vindicateCategoryController from './controllers/vindicate-category';

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
    allowHeaders: ['Content-Type'],
    credentials: true,
    maxAge: 86400
  })
);

// Public auth routes (login flow)
app.route('/auth', authController);

app.route('/disease', diseaseController);
app.route('/body-region', bodyRegionController);
app.route('/body-system', bodySystemController);
app.route('/osteopathic-model', osteopathicModelController);
app.route('/vindicate-category', vindicateCategoryController);
app.route('/symptom', symptomsController);

export default app;
