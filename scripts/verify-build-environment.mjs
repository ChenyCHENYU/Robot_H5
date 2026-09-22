import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  ENVIRONMENTS,
  detectBranchName,
  getEnvironment,
  getEnvironmentFromBranch,
  getEnvironmentFromMode,
  getViteEnvironmentValues,
  resolveBuildEnvironment,
} from './build-environment.mjs'

const projectConfig = JSON.parse(readFileSync(resolve('project.config.json'), 'utf8'))

assert.equal(getEnvironment('test').name, 'sit')
assert.equal(getEnvironment('prd').name, 'production')
assert.equal(getEnvironmentFromMode('pre')?.name, 'pre')
assert.equal(getEnvironmentFromBranch('origin/sit')?.name, 'sit')
assert.equal(detectBranchName({ GITHUB_REF_NAME: 'uat' }), 'uat')
assert.equal(detectBranchName({ GIT_BRANCH: 'origin/main' }), 'main')
assert.equal(resolveBuildEnvironment({ branch: 'main' })?.name, 'production')
assert.equal(getEnvironmentFromBranch('prd'), null, 'prd 不是生产发布分支')
assert.deepEqual(ENVIRONMENTS.production.branches, ['main'])
assert.throws(
  () => resolveBuildEnvironment({ branch: 'prd' }),
  /dev \/ sit \/ uat \/ pre \/ main/
)
assert.equal(
  resolveBuildEnvironment({
    branch: 'main',
    explicitEnvironment: 'prd',
  }).name,
  'production',
  'prd 可作为环境参数别名，但生产分支必须是 main'
)
assert.throws(
  () =>
    resolveBuildEnvironment({
      branch: 'sit',
      explicitEnvironment: 'uat',
    }),
  /H5 环境与分支冲突/
)
assert.throws(
  () =>
    resolveBuildEnvironment({
      branch: 'feature/demo',
      explicitEnvironment: 'prd',
    }),
  /dev \/ sit \/ uat \/ pre \/ main/
)
assert.equal(
  resolveBuildEnvironment({
    branch: 'main',
    explicitEnvironment: 'vercel',
    allowDemo: true,
  }).name,
  'vercel',
  'Vercel DEMO 保留独立显式构建入口'
)
assert.throws(
  () =>
    resolveBuildEnvironment({
      branch: 'main',
      explicitEnvironment: 'vercel',
    }),
  /pnpm build:vercel/,
  '标准 build:h5 不能被环境变量切换成 DEMO'
)

for (const name of Object.keys(ENVIRONMENTS)) {
  const values = getViteEnvironmentValues(name)
  assert.equal(values.VITE_ENV, name, `${name} 的 VITE_ENV 必须与环境名一致`)
  assert.match(values.VITE_GLOB_APP_ID, /\S+/, `${name} 缺少 VITE_GLOB_APP_ID`)
  assert.equal(values.VITE_OUTPUT_DIR, 'dist', `${name} 的输出目录必须是 dist`)

  if (['sit', 'uat', 'pre', 'production'].includes(name)) {
    assert.equal(values.VITE_APP_MODE, 'integrated', `${name} 必须为 integrated 模式`)
    assert.equal(values.VITE_USE_MOCK, 'false', `${name} 必须关闭 Mock`)
    assert.match(
      values.VITE_MBASE_ORIGIN || '',
      /^https:\/\//,
      `${name} 缺少 HTTPS 的 VITE_MBASE_ORIGIN`
    )
  }
}

for (const name of ['sit', 'uat', 'pre', 'prd']) {
  const environment = projectConfig.environments?.[name]
  assert.ok(environment, `project.config.json 缺少 ${name} 环境`)
  assert.match(environment.webUrl, /^https:\/\//)
  assert.equal(environment.apiPrefix, `${name === 'prd' ? 'prd' : name}-api`)
}

const setupSource = readFileSync(resolve('scripts/setup-project.mjs'), 'utf8')
assert.match(setupSource, /\["development", "dev"\]/)
assert.match(setupSource, /\["pre", "pre"\]/)
assert.match(setupSource, /\["vercel", "vercel"\]/)
assert.doesNotMatch(setupSource, /\.env\.(?:test|integrated)/)

console.log('Robot_H5 环境选择、分支锁与配置契约校验通过')
