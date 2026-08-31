import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import {
  detectBranchName,
  resolveBuildEnvironment,
} from './build-environment.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)

function readArg(name) {
  const inline = args.find(arg => arg.startsWith(`--${name}=`))
  if (inline) return inline.slice(inline.indexOf('=') + 1)
  const index = args.indexOf(`--${name}`)
  return index >= 0 ? args[index + 1] || '' : ''
}

function runNode(entry, entryArgs, childEnv) {
  const result = spawnSync(process.execPath, [entry, ...entryArgs], {
    cwd: root,
    env: childEnv,
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  if ((result.status ?? 1) !== 0) process.exit(result.status ?? 1)
}

function verifyBuildIdentity(outputDirectory, environment, viteEnvironment) {
  const identityPath = resolve(outputDirectory, 'env.json')
  if (!existsSync(identityPath)) {
    throw new Error(`构建产物缺少 env.json：${identityPath}`)
  }
  const identity = JSON.parse(readFileSync(identityPath, 'utf8'))
  if (
    identity?.build?.environment !== environment.name ||
    identity?.build?.target !== 'h5' ||
    !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(
      String(identity?.build?.builtAt || '')
    ) ||
    identity?.runtime?.publicPath !== viteEnvironment.VITE_PUBLIC_PATH ||
    identity?.application?.id !== viteEnvironment.VITE_GLOB_APP_ID
  ) {
    throw new Error(
      `env.json 校验失败：期望 ${environment.label}/h5/${viteEnvironment.VITE_GLOB_APP_ID}`
    )
  }
  const serialized = JSON.stringify(identity).toLowerCase()
  if (/secret|password|access_token|refresh_token|private_key/.test(serialized)) {
    throw new Error('env.json 包含敏感字段，已终止构建')
  }
  console.log(`产物身份证校验通过：${identityPath}`)
}

const branch = detectBranchName(process.env, root)
const explicitEnvironment = readArg('env') || process.env.DEPLOY_ENV || ''
const legacyCommand = readArg('legacy')
const environment = resolveBuildEnvironment({
  explicitEnvironment,
  branch,
  allowDemo: legacyCommand === 'build:vercel',
})

const viteEnvironment = loadEnv(environment.mode, root, '')
const outputDirectory = resolve(root, viteEnvironment.VITE_OUTPUT_DIR || 'dist')
const childEnv = {
  ...process.env,
  ROBOT_H5_BUILD_ENTRY: '1',
  ROBOT_H5_BUILD_ENVIRONMENT: environment.name,
  ROBOT_H5_BUILD_MODE: environment.mode,
}

if (legacyCommand) {
  const message =
    environment.name === 'vercel'
      ? `[演示入口] ${legacyCommand} 已隔离为 standalone DEMO 构建`
      : `[兼容入口] ${legacyCommand} 仅校验当前分支环境；新流水线统一执行 pnpm build:h5`
  console.warn(message)
}

console.log('')
console.log('Robot_H5 统一构建')
console.log(`- 目标端：H5`)
console.log(`- 环境：${environment.label} (${environment.name})`)
console.log(`- 模式：${environment.mode}`)
console.log(`- 分支：${branch || '未知'}`)
console.log(`- 应用：${viteEnvironment.VITE_GLOB_APP_ID || '未配置'}`)
console.log(`- API：${viteEnvironment.VITE_GLOB_API_URL || '同源'}${viteEnvironment.VITE_GLOB_API_URL_PREFIX || ''}`)
console.log('')

const vueTsc = resolve(root, 'node_modules', 'vue-tsc', 'bin', 'vue-tsc.js')
const vite = resolve(root, 'node_modules', 'vite', 'bin', 'vite.js')
if (!existsSync(vueTsc) || !existsSync(vite)) {
  throw new Error('缺少本地构建依赖，请先执行 pnpm install')
}

runNode(vueTsc, ['--noEmit'], childEnv)
runNode(vite, ['build', '--mode', environment.mode], childEnv)
verifyBuildIdentity(outputDirectory, environment, viteEnvironment)
