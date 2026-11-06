import { bootstrapApplication } from '@angular/platform-browser';
import { inject } from '@vercel/analytics';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

// Privacy-friendly page-view counting (no cookies). It only reports from the deployed site.
inject();
