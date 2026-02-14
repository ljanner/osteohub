import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
};

const filters = new Hono<{ Bindings: Bindings }>();

filters.get('/', async c => {
  // GET /filters
  return c.json({
    ok: true,
    data: []
  });
});

filters.get('/:id', async c => {
  // GET /filters/:id
  const id = c.req.param('id');
  return c.json({
    ok: true,
    data: { id }
  });
});

export default filters;
