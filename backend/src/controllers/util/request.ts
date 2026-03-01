import { Context } from 'hono';

export const parseIdParam = (c: Context): number | null => {
  const id = Number.parseInt(c.req.param('id'), 10);
  return Number.isNaN(id) ? null : id;
};

export const parseNameBody = async (c: Context): Promise<string | null> => {
  const body = await c.req.json<unknown>().catch(() => null);
  if (
    !body ||
    typeof body !== 'object' ||
    typeof (body as Record<string, unknown>).name !== 'string' ||
    !(body as Record<string, string>).name.trim()
  ) {
    return null;
  }
  return (body as Record<string, string>).name.trim();
};
