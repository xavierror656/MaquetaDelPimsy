import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 30000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'],['html',{open:'never'}]] : 'list',
  use: {baseURL: 'http://localhost:4173', locale: 'es-MX', viewport: {width: 1280, height: 900}},
  webServer: {command: 'node tests/serve.mjs', url: 'http://localhost:4173/index.html', reuseExistingServer: !process.env.CI, timeout: 15000},
});
