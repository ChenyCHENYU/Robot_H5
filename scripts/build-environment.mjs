import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const environmentFile = resolve(root, 'build', 'environments.json')
const environmentDocument = JSON.parse(readFileSync(environmentFile, 'utf8'))

export const ENVIRONMENTS = Object.freeze(environmentDocument.environments)
export const ENVIRONMENT_NAMES = Object.freeze(Object.keys(ENVIRONMENTS))

function readGitValue(args, cwd = root) {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return ''
  }
}

export function normalizeBranchName(value) {
  return String(value || '')
    .trim()
    .replace(/^refs\/heads\//, '')
    .replace(/^refs\/remotes\//, '')
    .replace(/^(origin|gitee)\//, '')
}

export function detectBranchName(env = process.env, cwd = root) {
  const ciBranch = [
    env.CI_COMMIT_REF_NAME,
    env.CI_COMMIT_BRANCH,
    env.BRANCH_NAME,
    env.GITHUB_HEAD_REF,
    env.GITHUB_REF_NAME,
    env.BUILD_SOURCEBRANCHNAME,
    env.GIT_LOCAL_BRANCH,
    env.GIT_BRANCH,
  ].find(value => String(value || '').trim())

  return normalizeBranchName(
    ciBranch || readGitValue(['rev-parse', '--abbrev-ref', 'HEAD'], cwd)
  )
}

export function getEnvironment(value) {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
  const entry = Object.entries(ENVIRONMENTS).find(
    ([name, config]) =>
      name === normalized || config.aliases.includes(normalized)
  )
  if (!entry) {
    throw new Error(
      `不支持的构建环境：${value || '空值'}，可选 dev / sit / uat / pre / prd / vercel`
    )
  }
  return { name: entry[0], ...entry[1] }
}

export function getEnvironmentFromMode(mode) {
  const entry = Object.entries(ENVIRONMENTS).find(
    ([, config]) => config.mode === mode
  )
  return entry ? { name: entry[0], ...entry[1] } : null
}

export function getEnvironmentFromBranch(value) {
  const branch = normalizeBranchName(value)
  const entry = Object.entries(ENVIRONMENTS).find(([, config]) =>
    config.branches.includes(branch)
  )
  return entry ? { name: entry[0], ...entry[1] } : null
}

export function resolveBuildEnvironment({
  explicitEnvironment,
  branch,
  allowDemo = false,
}) {
  const branchName = normalizeBranchName(branch)
  const branchEnvironment = getEnvironmentFromBranch(branchName)
  const explicitConfig = explicitEnvironment
    ? getEnvironment(explicitEnvironment)
    : null

  // Vercel 是模板演示站专用构建，不属于企业标准发布分支。
  if (explicitConfig?.name === 'vercel') {
    if (!allowDemo) {
      throw new Error('DEMO 环境只能通过 pnpm build:vercel 专用入口构建')
    }
    return explicitConfig
  }

  if (!branchEnvironment) {
    throw new Error(
      `无法从分支 ${branchName || '未知'} 自动识别 H5 环境；请使用 dev / sit / uat / pre / main 标准发布分支`
    )
  }

  // 标准 H5 环境只由分支决定；显式参数和 CI 变量只能做一致性断言。
  if (explicitConfig && branchEnvironment.name !== explicitConfig.name) {
    throw new Error(
      `H5 环境与分支冲突：当前 ${branchName} 分支固定对应 ${branchEnvironment.label}，流水线却声明 ${explicitConfig.label}`
    )
  }

  return branchEnvironment
}

export function readGitCommit(env = process.env, cwd = root) {
  return (
    String(env.CI_COMMIT_SHA || env.GIT_COMMIT || '').trim() ||
    readGitValue(['rev-parse', 'HEAD'], cwd)
  )
}

export function isGitDirty(cwd = root) {
  return Boolean(readGitValue(['status', '--porcelain'], cwd))
}
