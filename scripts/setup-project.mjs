import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "template.manifest.json");
const projectConfigPath = path.join(root, "project.config.json");
const packagePath = path.join(root, "package.json");
const GIT_STANDARDS_FEATURE = "git-standards";
const GIT_STANDARDS_FILES = [
  ".cz-config.cjs",
  ".husky",
  "commitlint.config.cjs",
  "eslint.config.ts",
  "pnpm-lock.yaml"
];
const GIT_STANDARDS_DEV_DEPENDENCIES = [
  "@commitlint/cli",
  "@commitlint/config-conventional",
  "@robot-admin/git-standards",
  "@typescript-eslint/eslint-plugin",
  "@typescript-eslint/parser",
  "@vue/eslint-config-typescript",
  "commitizen",
  "cz-customizable",
  "eslint",
  "eslint-plugin-vue",
  "husky",
  "lint-staged"
];
const ENVIRONMENTS = [
  [".env.development", "dev"],
  [".env.sit", "sit"],
  [".env.uat", "uat"],
  [".env.pre", "pre"],
  [".env.production", "prd"],
  [".env.vercel", "vercel"]
];

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

async function writeJson(file, value) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const [key, inlineValue] = arg.slice(2).split(/=(.*)/s, 2);
    if (inlineValue !== undefined) {
      options[key] = inlineValue;
      continue;
    }
    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      options[key] = next;
      index += 1;
    } else {
      options[key] = true;
    }
  }
  return options;
}

function required(value, label) {
  const normalized = String(value ?? "").trim();
  if (!normalized) throw new Error(`${label}不能为空`);
  return normalized;
}

function validateProjectName(value) {
  const name = required(value, "项目名称");
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(name)) {
    throw new Error("项目名称只能包含小写字母、数字、点、下划线和连字符");
  }
  return name;
}

function validatePort(value) {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    throw new Error("开发端口必须是 1024 到 65535 之间的整数");
  }
  return port;
}

function validateUrl(value, label) {
  const normalized = required(value, label).replace(/\/+$/, "");
  const url = new URL(normalized);
  if (!new Set(["http:", "https:"]).has(url.protocol)) {
    throw new Error(`${label}必须是 HTTP/HTTPS URL`);
  }
  return normalized;
}

async function ask(rl, label, current) {
  const answer = await rl.question(`${label} [${current}]: `);
  return answer.trim() || String(current);
}

async function askBoolean(rl, label, defaultValue) {
  const answer = (await rl.question(`${label} (${defaultValue ? "Y/n" : "y/N"}): `))
    .trim()
    .toLowerCase();
  if (!answer) return defaultValue;
  return answer === "y" || answer === "yes";
}

async function loadInput(file) {
  if (!file) return {};
  const resolved = path.resolve(process.cwd(), String(file));
  if (!existsSync(resolved)) throw new Error(`配置文件不存在: ${resolved}`);
  return readJson(resolved);
}

function setEnvValue(content, key, value) {
  const line = `${key} = ${value}`;
  const pattern = new RegExp(`^${key}\\s*=.*$`, "m");
  return pattern.test(content)
    ? content.replace(pattern, line)
    : `${content.trimEnd()}\n${line}\n`;
}

function apiPrefix(value) {
  return `/${String(value || "api").replace(/^\/+|\/+$/g, "")}`;
}

function mbasePath(moduleName, projectName) {
  const explicitModule = moduleName && !new Set(["app", "robot-h5"]).has(moduleName)
    ? moduleName
    : projectName.replace(/^wl-app-/, "");
  const segment = String(explicitModule)
    .trim()
    .replace(/^\/+|\/+$/g, "");
  return `/mbase/${segment}/`;
}

async function updateEnvironmentFiles(config, projectName, moduleName, title, port, localBackendUrl) {
  for (const [fileName, environmentName] of ENVIRONMENTS) {
    const file = path.join(root, fileName);
    if (!existsSync(file)) continue;
    const environment = config.environments?.[environmentName] ?? {};
    const isDevelopment = environmentName === "dev";
    const isDemo = environmentName === "vercel";
    const backendUrl = isDevelopment || isDemo
      ? localBackendUrl
      : validateUrl(environment.webUrl, `${environmentName} API 地址`);
    const prefix = apiPrefix(environment.apiPrefix);
    let content = await readFile(file, "utf8");
    content = setEnvValue(content, "VITE_GLOB_APP_TITLE", title);
    content = setEnvValue(content, "VITE_GLOB_APP_ID", projectName);
    content = setEnvValue(content, "VITE_GLOB_API_URL_PREFIX", prefix);
    if (isDevelopment) {
      content = setEnvValue(content, "VITE_PORT", port);
      content = setEnvValue(
        content,
        "VITE_PROXY",
        JSON.stringify([
          [prefix, `${backendUrl}${prefix}`],
          ["/upload", `${backendUrl}/upload`]
        ])
      );
      content = setEnvValue(content, "VITE_GLOB_API_URL", "");
      content = setEnvValue(content, "VITE_GLOB_UPLOAD_URL", "");
    } else if (isDemo) {
      content = setEnvValue(content, "VITE_PUBLIC_PATH", "/");
      content = setEnvValue(content, "VITE_APP_MODE", "standalone");
      content = setEnvValue(content, "VITE_GLOB_API_URL", "");
      content = setEnvValue(content, "VITE_GLOB_UPLOAD_URL", "");
    } else {
      content = setEnvValue(content, "VITE_GLOB_API_URL", backendUrl);
      content = setEnvValue(content, "VITE_GLOB_UPLOAD_URL", `${backendUrl}${prefix}/upload`);
    }
    if (["sit", "uat", "pre", "prd"].includes(environmentName)) {
      content = setEnvValue(content, "VITE_APP_MODE", "integrated");
      content = setEnvValue(content, "VITE_PUBLIC_PATH", mbasePath(moduleName, projectName));
      content = setEnvValue(content, "VITE_MBASE_ORIGIN", new URL(backendUrl).origin);
    }
    await writeFile(file, content, "utf8");
  }
}

async function removeGitStandards(pkg) {
  const next = structuredClone(pkg);
  for (const dependency of GIT_STANDARDS_DEV_DEPENDENCIES) {
    delete next.devDependencies?.[dependency];
  }
  for (const script of ["prepare", "cz", "lint"]) {
    delete next.scripts?.[script];
  }
  delete next.config;
  delete next["lint-staged"];
  await Promise.all(
    GIT_STANDARDS_FILES.map((file) =>
      rm(path.join(root, file), { recursive: true, force: true })
    )
  );
  return next;
}

function npmrc(npmRegistry, jhlcRegistry) {
  return [
    "# 由 JH4J 移动端模板初始化脚本生成",
    "auto-install-peers=true",
    "strict-peer-dependencies=false",
    `registry=${npmRegistry}/`,
    `@jhlc:registry=${jhlcRegistry}/`,
    "save-exact=true",
    ""
  ].join("\n");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(`JH4J 移动端模板初始化\n\n用法:\n  pnpm setup\n  pnpm setup -- --yes --config ./project-input.json\n\n参数:\n  --project-name <name>\n  --title <title>\n  --port <port>\n  --local-backend <url>\n  --npm-registry <url>\n  --jhlc-registry <url>\n  --no-standards\n  --config <json-file>\n  --created-by <source>\n  --yes`);
    return;
  }

  const [manifest, sourceConfig, sourcePackage, input] = await Promise.all([
    readJson(manifestPath),
    readJson(projectConfigPath),
    readJson(packagePath),
    loadInput(options.config)
  ]);
  const interactive = process.stdin.isTTY && process.stdout.isTTY && !options.yes;
  const rl = interactive
    ? createInterface({ input: process.stdin, output: process.stdout })
    : null;

  try {
    const directoryName = path.basename(root).toLowerCase();
    const inferredName = /^[a-z0-9][a-z0-9._-]*$/.test(directoryName)
      ? directoryName
      : manifest.defaults.projectName;
    let projectName = options["project-name"] ?? input.projectName ??
      (sourceConfig.projectName === "robot-h5" ? inferredName : sourceConfig.projectName);
    let title = options.title ?? input.title ?? sourceConfig.title;
    let port = options.port ?? input.devServerPort ?? sourceConfig.devServerPort;
    let localBackendUrl = options["local-backend"] ?? input.localBackendUrl ?? sourceConfig.localBackendUrl;
    let npmRegistry = options["npm-registry"] ?? input.npmRegistry ?? manifest.defaults.npmRegistry;
    let jhlcRegistry = options["jhlc-registry"] ?? input.jhlcRegistry ?? manifest.defaults.jhlcRegistry;
    let features = Array.isArray(input.features)
      ? [...input.features]
      : [...(sourceConfig.features ?? [])];
    if (options["no-standards"]) {
      features = features.filter((feature) => feature !== GIT_STANDARDS_FEATURE);
    }

    if (interactive) {
      console.log("\nJH4J 移动端模板初始化。直接回车可接受默认值。\n");
      projectName = await ask(rl, "项目名称", projectName);
      title = await ask(rl, "应用标题", title);
      port = await ask(rl, "开发端口", port);
      localBackendUrl = await ask(rl, "本地 API 地址", localBackendUrl);
      npmRegistry = await ask(rl, "npm registry", npmRegistry);
      jhlcRegistry = await ask(rl, "@jhlc registry", jhlcRegistry);
      const standards = await askBoolean(
        rl,
        "是否启用完整 Git 与代码质量规范",
        features.includes(GIT_STANDARDS_FEATURE)
      );
      features = standards
        ? [...new Set([...features, GIT_STANDARDS_FEATURE])]
        : features.filter((feature) => feature !== GIT_STANDARDS_FEATURE);
    }

    projectName = validateProjectName(projectName);
    title = required(title, "应用标题");
    port = validatePort(port);
    localBackendUrl = validateUrl(localBackendUrl, "本地 API 地址");
    npmRegistry = validateUrl(npmRegistry, "npm registry");
    jhlcRegistry = validateUrl(jhlcRegistry, "@jhlc registry");

    const nextConfig = {
      ...sourceConfig,
      ...input,
      projectName,
      moduleName: input.moduleName ?? sourceConfig.moduleName,
      title,
      devServerPort: port,
      localBackendUrl,
      features,
      environments: {
        ...sourceConfig.environments,
        ...(input.environments ?? {})
      }
    };
    const nextPackage = features.includes(GIT_STANDARDS_FEATURE)
      ? { ...sourcePackage, name: projectName }
      : { ...(await removeGitStandards(sourcePackage)), name: projectName };
    delete nextPackage.repository;

    await Promise.all([
      writeJson(projectConfigPath, nextConfig),
      writeJson(packagePath, nextPackage),
      writeFile(path.join(root, ".npmrc"), npmrc(npmRegistry, jhlcRegistry), "utf8"),
      updateEnvironmentFiles(nextConfig, projectName, nextConfig.moduleName, title, port, localBackendUrl)
    ]);

    const indexPath = path.join(root, "index.html");
    if (existsSync(indexPath)) {
      const html = await readFile(indexPath, "utf8");
      await writeFile(
        indexPath,
        html.replace(/<div class="shell-brand">.*?<\/div>/, `<div class="shell-brand">${title}</div>`),
        "utf8"
      );
    }
    const readmePath = path.join(root, "README.md");
    if (existsSync(readmePath)) {
      const readme = await readFile(readmePath, "utf8");
      await writeFile(readmePath, readme.replace(/^# .+$/m, `# ${projectName}`), "utf8");
    }

    await mkdir(path.join(root, ".jhlc"), { recursive: true });
    await writeJson(path.join(root, ".jhlc", "project.json"), {
      schemaVersion: 1,
      template: { id: manifest.id, version: manifest.version },
      platformVersion: null,
      createdAt: new Date().toISOString(),
      createdBy: String(options["created-by"] || "git-clone"),
      parameters: { projectName, title, devServerPort: port, localBackendUrl, features }
    });

    console.log(`\n初始化完成：${projectName}`);
    console.log(`应用标题：${title}`);
    console.log(`开发端口：${port}`);
    console.log(`标准能力：${features.length ? features.join(", ") : "未启用"}`);
    console.log("\n下一步：pnpm install && pnpm dev\n");
  } finally {
    rl?.close();
  }
}

main().catch((error) => {
  console.error(`\n初始化失败：${error.message}\n`);
  process.exitCode = 1;
});
