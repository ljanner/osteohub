import type { Context, Next } from 'hono';
import { jwt } from 'hono/jwt';

const authMiddleware = () => {
  return async (c: Context, next: Next) => {
    const middleware = jwt({
      secret: process.env.JWT_SECRET!,
      alg: 'HS256',
      cookie: 'osteohub_token'
    });
    return middleware(c, next);
  };
};

export default authMiddleware;
