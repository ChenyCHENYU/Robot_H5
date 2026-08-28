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
  mbaseEntrySource,
  h5ConfigSource,
  navBarSource,
  menuSource,
  routerGuardSource,
  userStoreSource,
  companyContextSource,
  permissionApiSource,
  baseRouterSource,
  integratedEnvSource,
  httpSource,
  httpEnumSource,
] = await Promise.all([
  read('build/vite/build.ts'),
  read('vite.config.ts'),
  read('build/vite/plugin/postcssPxToView.ts'),
  read('uno.config.ts'),
  read('index.html'),
  read('src/platform/mbase/navigation.ts'),
  read('src/platform/mbase/host.ts'),
  read('src/platform/mbase/index.ts'),
  read('src/h5.config.ts'),
  read('src/components/C_NavBar/index.vue'),
  read('src/router/menu.ts'),
  read('src/router/router-guards.ts'),
  read('src/store/modules/user.ts'),
  read('src/platform/mbase/company-context.ts'),
  read('src/api/permission.ts'),
  read('src/router/base.ts'),
  read('.env.integrated'),
  read('src/utils/http/index.ts'),
  read('src/utils/http/httpEnum.ts'),
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
assert.doesNotMatch(htmlSource, /uni\.webview/);
assert.ok(existsSync(path.join(root, 'public/vendor/uni.webview.1.5.8.js')));

assert.match(hostSource, /detectMbaseHost/);
assert.match(hostSource, /VITE_APP_MODE !== 'integrated'/);
assert.match(mbaseEntrySource, /@robot-h5\/core\/bridge/);
assert.match(h5ConfigSource, /mbase:\s*\{/);
assert.match(h5ConfigSource, /VITE_MBASE_ORIGIN/);
assert.match(h5ConfigSource, /appSdkUrl/);
assert.match(navigationSource, /router\.afterEach/);
assert.match(navigationSource, /@robot-h5\/core\/bridge/);
assert.match(navigationSource, /navigation:state/);
assert.match(navigationSource, /mbase:navigation-command/);
assert.match(navBarSource, /v-if="!isMbaseHosted\(\)"/);
assert.ok((menuSource.match(/mbaseRoot:\s*true/g) || []).length >= 5);
assert.match(routerGuardSource, /if \(!isIntegratedMode\(\) \|\| !token\) return 'unavailable'/);
assert.match(routerGuardSource, /userStore\.clearLocalSession\(\)/);
assert.match(routerGuardSource, /await initializeMbaseCompanyContext/);
assert.match(routerGuardSource, /PageEnum\.PORTAL_CONTEXT_ERROR/);
assert.ok(
  routerGuardSource.indexOf('await initializeMbaseCompanyContext') <
    routerGuardSource.indexOf('await userStore.GetUserInfo'),
  '公司上下文必须先于用户信息和权限请求完成初始化'
);
assert.match(userStoreSource, /await notifyPortalUserLogout\(\);[\s\S]*this\.clearLocalSession\(\)/);
assert.match(userStoreSource, /setKeepAliveComponents\(\[\]\)/);
assert.match(companyContextSource, /\/hrms\/user\/changeCompany/);
assert.match(companyContextSource, /withMbaseCompanyContext/);
assert.match(companyContextSource, /getMbaseCompanyScopedKey/);
assert.match(permissionApiSource, /withMbaseCompanyContext/);
assert.match(baseRouterSource, /PortalContextErrorRoute/);
assert.match(integratedEnvSource, /VITE_MBASE_COMPANY_SYNC_MODE\s*=\s*server/);
assert.match(httpSource, /isIntegratedMode\(\) \? 'Bearer'/);
assert.match(companyContextSource, /code !== 200 && code !== 2000/);
assert.match(httpSource, /ResultEnum\.PLATFORM_SUCCESS/);
assert.match(httpSource, /ResultEnum\.PLATFORM_TOKEN_EXPIRED/);
assert.match(httpEnumSource, /PLATFORM_SUCCESS = 2000/);

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

  const jsDirectory = path.join(distDirectory, 'static', 'js');
  if (existsSync(jsDirectory)) {
    const jsFiles = (await readdir(jsDirectory, { withFileTypes: true }))
      .filter(entry => entry.isFile() && entry.name.endsWith('.js'))
      .map(entry => path.join(jsDirectory, entry.name));
    const javascript = (await Promise.all(jsFiles.map(file => readFile(file, 'utf8')))).join('\n');
    assert.doesNotMatch(javascript, /WEB_INVOKE_APPSERVICE/);
  }
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
assert.ok(!existsSync(path.join(root, 'src/platform/mbase/transport.ts')));
assert.ok(!existsSync(path.join(root, 'src/platform/mbase/capability.ts')));

console.log('移动端兼容与 mbase 集成校验通过：PDA 样式、宿主识别、动态标题和单头部协议均已固化');
