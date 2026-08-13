import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(file) {
  return JSON.parse(await readFile(path.join(root, file), "utf8"));
}

async function main() {
  const [manifest, pkg, config, nvmrc] = await Promise.all([
    readJson("template.manifest.json"),
    readJson("package.json"),
    readJson("project.config.json"),
    readFile(path.join(root, ".nvmrc"), "utf8")
  ]);
  const errors = [];

  if (manifest.id !== "mobile.robot-h5" || manifest.category !== "mobile") {
    errors.push("模板 ID 或 category 不正确");
  }
  if (pkg.version !== manifest.version) {
    errors.push("package.json 与模板清单版本不一致");
  }
  if (pkg.engines?.node !== manifest.runtime?.node) {
    errors.push("Node 版本约束未与模板清单对齐");
  }
  if (pkg.packageManager !== manifest.runtime?.packageManager) {
    errors.push("pnpm 版本未与模板清单对齐");
  }
  if (nvmrc.trim() !== manifest.runtime?.recommendedNode) {
    errors.push(".nvmrc 未与模板清单对齐");
  }
  if (!existsSync(path.join(root, "scripts", "setup-project.mjs"))) {
    errors.push("缺少模板初始化脚本");
  }
  for (const requiredFile of [
    "scripts/verify-mobile-compat.mjs",
    "src/platform/mbase/index.ts",
    "src/platform/mbase/navigation.ts",
    "public/vendor/uni.webview.1.5.8.js",
    "docs/mbase-integration.md",
    "docs/pda-compatibility.md"
  ]) {
    if (!existsSync(path.join(root, requiredFile))) {
      errors.push(`缺少模板基础能力文件: ${requiredFile}`);
    }
  }
  for (const feature of manifest.features ?? []) {
    if (feature.defaultEnabled && !config.features?.includes(feature.id)) {
      errors.push(`默认能力未写入 project.config.json: ${feature.id}`);
    }
    if (feature.package && !pkg.devDependencies?.[feature.package]) {
      errors.push(`能力 ${feature.id} 缺少依赖 ${feature.package}`);
    }
  }

  if (errors.length) {
    console.error("模板契约校验失败：");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
    return;
  }
  console.log(`模板契约校验通过：${manifest.id}@${manifest.version}`);
}

main().catch((error) => {
  console.error(`模板契约校验异常：${error.message}`);
  process.exitCode = 1;
});
