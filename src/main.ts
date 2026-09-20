import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { RuraPenthe } from './app/pages/rura-penthe/rura-penthe';

bootstrapApplication(RuraPenthe, appConfig)
  .catch((err) => console.error(err));
