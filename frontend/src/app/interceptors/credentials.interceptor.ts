import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../../environments/environment';

const apiOrigin = new URL(environment.apiBaseUrl).origin;

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  try {
    const reqOrigin = new URL(req.url).origin;
    if (reqOrigin === apiOrigin) {
      return next(req.clone({ withCredentials: true }));
    }
  } catch {
    // Relative URL or malformed — don't attach credentials
  }
  return next(req);
};
