import { Hono } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { sign } from 'hono/jwt';

interface JwtPayload {
  sub: string;
  name: string;
  picture: string;
  iat: number;
  exp: number;
}

type AuthEnv = { Variables: { jwtPayload: JwtPayload } };

const authController = new Hono<AuthEnv>();

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

const isDev = (): boolean => process.env.CONFIGURATION === 'development';

const redirectUrl = isDev()
  ? 'http://localhost:8787/auth/callback'
  : 'https://api.osteohub.ch/auth/callback';

const frontendUrl = isDev() ? 'http://localhost:4200' : 'https://osteohub.ch';

const allowedEmails = (): string[] => {
  return (process.env.ALLOWED_EMAILS ?? '')
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);
};

const cookieOptions = () => ({
  httpOnly: true,
  secure: !isDev(),
  sameSite: 'Lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
  ...(isDev() ? {} : { domain: '.osteohub.ch' })
});

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const generateState = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
};

authController.get('/google', c => {
  const state = generateState();

  setCookie(c, 'oauth_state', state, {
    httpOnly: true,
    secure: !isDev(),
    sameSite: 'Lax',
    path: '/auth/callback',
    maxAge: 600,
    ...(isDev() ? {} : { domain: '.osteohub.ch' })
  });

  const params = new URLSearchParams({
    client_id: requireEnv('GOOGLE_CLIENT_ID'),
    redirect_uri: redirectUrl,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state
  });

  return c.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
});

authController.get('/callback', async c => {
  const code = c.req.query('code');
  const error = c.req.query('error');
  const state = c.req.query('state');
  const storedState = getCookie(c, 'oauth_state');

  deleteCookie(c, 'oauth_state', {
    path: '/auth/callback',
    ...(isDev() ? {} : { domain: '.osteohub.ch' })
  });

  if (!state || !storedState || state !== storedState) {
    return c.redirect(`${frontendUrl}/login?error=auth_denied`);
  }

  if (error || !code) {
    return c.redirect(`${frontendUrl}/login?error=auth_denied`);
  }

  try {
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: requireEnv('GOOGLE_CLIENT_ID'),
        client_secret: requireEnv('GOOGLE_CLIENT_SECRET'),
        redirect_uri: redirectUrl,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      return c.redirect(`${frontendUrl}/login?error=token_exchange_failed`);
    }

    const tokenData = (await tokenResponse.json()) as { access_token: string };

    const userResponse = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    if (!userResponse.ok) {
      return c.redirect(`${frontendUrl}/login?error=userinfo_failed`);
    }

    const user = (await userResponse.json()) as {
      email: string;
      name: string;
      picture: string;
    };

    if (!allowedEmails().includes(user.email.toLowerCase())) {
      return c.redirect(`${frontendUrl}/login?error=not_allowed`);
    }

    const now = Math.floor(Date.now() / 1000);
    const token = await sign(
      {
        sub: user.email,
        name: user.name,
        picture: user.picture,
        iat: now,
        exp: now + 60 * 60 * 24 * 7
      },
      requireEnv('JWT_SECRET'),
      'HS256'
    );

    setCookie(c, 'osteohub_token', token, cookieOptions());
    return c.redirect(`${frontendUrl}/overview`);
  } catch {
    return c.redirect(`${frontendUrl}/login?error=server_error`);
  }
});

authController.get('/me', c => {
  const { sub, name, picture } = c.get('jwtPayload');
  return c.json({ sub, name, picture });
});

authController.post('/logout', c => {
  deleteCookie(c, 'osteohub_token', {
    path: '/',
    ...(isDev() ? {} : { domain: '.osteohub.ch' })
  });
  return c.json({ success: true });
});

export default authController;
