import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  captureGitInfo: { commit: true },
  expect: {
    timeout: process.env.CI ? 15000 : 5000,
  },
  failOnFlakyTests: !!process.env.CI,
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  globalTimeout: process.env.CI ? 60 * 60 * 1000 : undefined,
  maxFailures: process.env.CI ? 1 : 0,
  outputDir: 'test-results/',
  preserveOutput: 'failures-only',

  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'WebKit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  quiet: !!process.env.CI,
  reportSlowTests: { max: 0, threshold: 5 * 60 * 1000 },

  reporter:
    process.env.CI ?
      [['github'], ['json', { outputFile: './test_results/test-results.json' }]]
    : [
        ['line', { FORCE_COLOR: true }],
        ['json', { outputFile: './test_results/test-results.json' }],
      ],

  retries: process.env.CI ? 1 : 0,
  testDir: './tests',
  timeout: 2 * 60 * 1000,
  tsconfig: './tsconfig.test.json',

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    extraHTTPHeaders: {
      'x-vercel-protection-bypass':
        process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '',
      'x-vercel-set-bypass-cookie': 'samesitenone',
    },
    headless: true,
    launchOptions: {
      slowMo: process.env.CI ? 100 : 0,
    },
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },

  workers: process.env.CI ? 1 : undefined,
});
