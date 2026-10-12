import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

// 复用封面 SVG，导出适合仓库 README 预览的 2 倍分辨率 PNG。
const source = await readFile(new URL('../docs/assets/robot-h5-banner.svg', import.meta.url), 'utf8');
const output = fileURLToPath(new URL('../docs/assets/robot-h5-banner.png', import.meta.url));
const browser = await chromium.launch();
try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 340 }, deviceScaleFactor: 2 });
    const valid = await page.evaluate(svg => !new DOMParser().parseFromString(svg, 'image/svg+xml').querySelector('parsererror'), source);
    assert.ok(valid, '封面 SVG 必须是有效 XML');
    await page.setContent(`<style>html,body{margin:0}svg{display:block}</style>${source}`);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('svg').first().screenshot({ path: output, omitBackground: true, animations: 'disabled' });
    console.log(`README 封面已导出：${output}（2400 × 680）`);
} finally {
    await browser.close();
}
