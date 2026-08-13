import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFile(path.join(root, file), 'utf8');

const [
  buildSource,
  viteSource,
  viewportSource,
  unoSource,
  htmlSource,
  navigationSource,
  hostSource,
  navBarSource,
  menuSource,
  routerGuardSource,
  userStoreSource,
] = await Promise.all([
  read('build/vite/build.ts'),
  read('vite.config.ts'),
  read('build/vite/plugin/postcssPxToView.ts'),
  read('uno.config.ts'),
  read('index.html'),
  read('src/platform/mbase/navigation.ts'),
  read('src/platform/mbase/host.ts'),
  read('src/components/C_NavBar/index.vue'),
  read('src/router/menu.ts'),
  read('src/router/router-guards.ts'),
  read('src/store/modules/user.ts'),
]);

assert.match(buildSource, /target:\s*'es2018'/);
assert.match(buildSource, /cssTarget:\s*'chrome61'/);
assert.match(viewportSource, /enableMediaQuery:\s*true/);
assert.doesNotMatch(viewportSource, /maxDisplayWidth:\s*\d+/);
assert.match(viteSource, /postcssLegacyFallbacks\(\)/);
assert.doesNotMatch(viteSource, /return `\$\{use\}@layer components/);
assert.doesNotMatch(unoSource, /outputToCssLayers\s*:/);
assert.match(unoSource, /important:\s*'#app'/);
assert.doesNotMatch(htmlSource, /<style>\s*@layer/);
assert.match(htmlSource, /vendor\/uni\.webview\.1\.5\.8\.js/);
assert.ok(existsSync(path.join(root, 'public/vendor/uni.webview.1.5.8.js')));

assert.match(hostSource, /mbase_host/);
assert.match(hostSource, /VITE_APP_MODE !== 'integrated'/);
assert.match(navigationSource, /router\.afterEach/);
assert.match(navigationSource, /navigation:state/);
assert.match(navigationSource, /mbase:navigation-command/);
assert.match(navBarSource, /v-if="!isMbaseHosted\(\)"/);
assert.ok((menuSource.match(/mbaseRoot:\s*true/g) || []).length >= 5);
assert.match(routerGuardSource, /isIntegratedMode\(\) && getMbaseToken\(\)/);
assert.match(routerGuardSource, /userStore\.clearLocalSession\(\)/);
assert.match(userStoreSource, /await notifyPortalUserLogout\(\);[\s\S]*this\.clearLocalSession\(\)/);

const distDirectory = path.join(root, 'dist');
if (existsSync(distDirectory)) {
  const cssFiles = [];
  const collectCss = async directory => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) await collectCss(entryPath);
      else if (entry.name.endsWith('.css')) cssFiles.push(entryPath);
    }
  };
  await collectCss(distDirectory);
  const css = (await Promise.all(cssFiles.map(file => readFile(file, 'utf8')))).join('\n');
  assert.doesNotMatch(css, /@layer\b/);
}

const sourceFiles = [];
const collectSource = async directory => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await collectSource(entryPath);
    else if (/\.(?:ts|vue)$/.test(entry.name)) sourceFiles.push(entryPath);
  }
};
await collectSource(path.join(root, 'src'));
const source = (await Promise.all(sourceFiles.map(file => readFile(file, 'utf8')))).join('\n');
assert.doesNotMatch(source, /window\.(?:android|webkit)\b/);
assert.doesNotMatch(source, /plus\.webview\b/);
assert.doesNotMatch(source, /postMessage\([^\n]*['"]\*['"]/);

console.log('移动端兼容与 mbase 集成校验通过：PDA 样式、宿主识别、动态标题和单头部协议均已固化');
