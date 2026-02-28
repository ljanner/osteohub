import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIconConfig } from '@siemens/element-ng/icon';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIconConfig({ disableSvgIcons: false }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ],
};
