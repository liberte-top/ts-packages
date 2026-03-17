import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const mode = process.argv[2] ?? "any";
const tag = process.argv[3] ?? process.env.GITHUB_REF_NAME;

if (!tag) {
  throw new Error("missing tag name");
}

if (!["stable", "beta", "any"].includes(mode)) {
  throw new Error(`unsupported mode: ${mode}`);
}

const rootDir = resolve(fileURLToPath(new URL("../../", import.meta.url)));
const registry = JSON.parse(readFileSync(resolve(rootDir, "packages.registry.json"), "utf8"));

const stablePattern = /^(?<key>[a-z0-9][a-z0-9-]*)\/v(?<version>\d+\.\d+\.\d+)$/;
const betaPattern = /^(?<key>[a-z0-9][a-z0-9-]*)\/v(?<version>\d+\.\d+\.\d+-beta(?:\.\d+)?)$/;

const stableMatch = tag.match(stablePattern);
const betaMatch = tag.match(betaPattern);
const match = stableMatch ?? betaMatch;

if (!match?.groups) {
  throw new Error(`unsupported tag format: ${tag}`);
}

const releaseType = stableMatch ? "stable" : "beta";

if (mode !== "any" && releaseType !== mode) {
  throw new Error(`tag ${tag} is ${releaseType}, expected ${mode}`);
}

const entry = registry.packages.find((candidate) => candidate.key === match.groups.key);

if (!entry) {
  throw new Error(`unknown package key: ${match.groups.key}`);
}

const version = match.groups.version;
const packageJsonPath = resolve(rootDir, entry.packageDir, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

if (packageJson.name !== entry.packageName) {
  throw new Error(`registry package name mismatch for ${entry.key}`);
}

if (packageJson.version !== version) {
  throw new Error(`tag version ${version} does not match ${packageJson.name} version ${packageJson.version}`);
}

if (releaseType === "stable") {
  const changelogDir = resolve(rootDir, entry.docsDir, "changelogs", `v${version}`);
  if (!existsSync(changelogDir)) {
    throw new Error(`missing changelog directory: ${entry.docsDir}/changelogs/v${version}`);
  }

  const latestStable = getLatestStableVersion(entry.key, tag);
  if (latestStable && compareStableVersions(version, latestStable) <= 0) {
    throw new Error(`stable version ${version} must be greater than ${latestStable}`);
  }
}

writeOutput("release_type", releaseType);
writeOutput("package_key", entry.key);
writeOutput("package_name", entry.packageName);
writeOutput("package_dir", entry.packageDir);
writeOutput("docs_dir", entry.docsDir);
writeOutput("docs_route", entry.docsRoute);
writeOutput("version", version);
writeOutput("tag", tag);

console.log(JSON.stringify({
  releaseType,
  packageKey: entry.key,
  packageName: entry.packageName,
  packageDir: entry.packageDir,
  docsDir: entry.docsDir,
  version,
  tag,
}, null, 2));

function getLatestStableVersion(packageKey, currentTag) {
  const output = execFileSync("git", ["tag", "--list", `${packageKey}/v*`], {
    cwd: rootDir,
    encoding: "utf8",
  }).trim();

  if (!output) {
    return null;
  }

  const versions = output
    .split("\n")
    .filter(Boolean)
    .filter((tagName) => tagName !== currentTag)
    .map((tagName) => tagName.match(stablePattern)?.groups?.version ?? null)
    .filter((candidate) => candidate !== null)
    .sort(compareStableVersions);

  return versions.at(-1) ?? null;
}

function compareStableVersions(left, right) {
  const leftParts = left.split(".").map((value) => Number.parseInt(value, 10));
  const rightParts = right.split(".").map((value) => Number.parseInt(value, 10));

  for (let index = 0; index < 3; index += 1) {
    const delta = leftParts[index] - rightParts[index];
    if (delta !== 0) {
      return delta;
    }
  }

  return 0;
}

function writeOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) {
    return;
  }

  appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}
