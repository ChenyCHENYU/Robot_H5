import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  ENVIRONMENTS,
  detectBranchName,
  getEnvironment,
  getEnvironmentFromBranch,
  getEnvironmentFromMode,
  resolveBuildEnvironment,
} from './build-environment.mjs'

const projectConfig = JSON.parse(readFileSync(resolve('project.config.json'), 'utf8'))

assert.equal(getEnvironment('test').name, 'sit')
assert.equal(getEnvironment('prd').name, 'production')
assert.equal(getEnvironmentFromMode('pre')?.name, 'pre')
assert.equal(getEnvironmentFromBranch('origin/sit')?.name, 'sit')
assert.equal(detectBranchName({ GITHUB_REF_NAME: 'uat' }), 'uat')
assert.equal(resolveBuildEnvironment({ branch: 'main' })?.name, 'production')
assert.equal(resolveBuildEnvironment({ branch: 'prd' })?.name, 'production')
assert.throws(
  () =>
    resolveBuildEnvironment({
      branch: 'sit',
      explicitEnvironment: 'uat',
    }),
  /构建环境与分支冲突/
)
assert.throws(
  () =>
    resolveBuildEnvironment({
      branch: 'feature/demo',
      explicitEnvironment: 'prd',
    }),
  /生产构建只能从/
)

for (const [name, config] of Object.entries(ENVIRONMENTS)) {
  const envPath = resolve(`.env.${config.mode}`)
  const source = readFileSync(envPath, 'utf8')
  assert.match(source, new RegExp(`VITE_ENV\\s*=\\s*['"]?${name}['"]?`))
  assert.match(source, /VITE_GLOB_APP_ID\s*=\s*\S+/)
  assert.match(source, /VITE_OUTPUT_DIR\s*=\s*['"]?dist['"]?/)

  if (['sit', 'uat', 'pre', 'production'].includes(name)) {
    assert.match(source, /VITE_APP_MODE\s*=\s*integrated/)
    assert.match(source, /VITE_USE_MOCK\s*=\s*false/)
    assert.match(source, /VITE_MBASE_ORIGIN\s*=\s*https:\/\//)
  }
}

for (const name of ['sit', 'uat', 'pre', 'prd']) {
  const environment = projectConfig.environments?.[name]
  assert.ok(environment, `project.config.json 缺少 ${name} 环境`)
  assert.match(environment.webUrl, /^https:\/\//)
  assert.equal(environment.apiPrefix, `${name === 'prd' ? 'prd' : name}-api`)
}

const setupSource = readFileSync(resolve('scripts/setup-project.mjs'), 'utf8')
assert.match(setupSource, /\["\.env\.sit", "sit"\]/)
assert.match(setupSource, /\["\.env\.pre", "pre"\]/)
assert.match(setupSource, /\["\.env\.vercel", "vercel"\]/)
assert.doesNotMatch(setupSource, /\.env\.(?:test|integrated)/)

console.log('Robot_H5 环境选择、分支锁与配置契约校验通过')
