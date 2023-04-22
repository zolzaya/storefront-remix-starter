import { createCookieSessionStorage } from '@remix-run/node';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'superb_session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: ['awdbhbjahdbaw'],
  },
});
