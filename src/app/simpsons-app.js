import { startApp } from '@open-cells/core';
import { routes } from '../router/routes.js';
import { appConfig } from '../config/app.config.js';

startApp({
  routes,
  mainNode: 'app-content',
  viewLimit: 2,
  persistentPages: ['character-details'],
  appConfig,
  commonPages: ['character-details']
});
