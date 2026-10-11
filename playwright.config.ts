import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: false,
    workers: 1,
    retries: process.env.CI ? 1 : 0,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: { ...devices['iPhone 13'], browserName: 'chromium', baseURL: 'http://127.0.0.1:8888/robot-h5/', trace: 'retain-on-failure' },
    webServer: {
        command: 'pnpm dev --host 127.0.0.1 --strictPort',
        url: 'http://127.0.0.1:8888/robot-h5/login',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
    },
});
