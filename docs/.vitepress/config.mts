import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";

type PackageEntry = {
  key: string;
  packageName: string;
  packageDir: string;
  docsDir: string;
  docsRoute: string;
};

const configDir = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(configDir, "../..");
const registry = JSON.parse(readFileSync(resolve(rootDir, "packages.registry.json"), "utf8")) as {
  packages: PackageEntry[];
};

const packages = registry.packages;
const packageLinks = packages.map((entry) => ({
  text: entry.packageName,
  link: entry.docsRoute,
}));

const packageSidebars = Object.fromEntries(packages.map((entry) => [
  entry.docsRoute,
  [
    {
      text: entry.packageName,
      items: [
        { text: "Overview", link: entry.docsRoute },
        { text: "Changelogs", link: `${entry.docsRoute}changelogs/` },
      ],
    },
  ],
]));

export default defineConfig({
  title: "liberte ts-packages",
  description: "TypeScript packages and release notes for liberte-top.",
  base: process.env.VITEPRESS_BASE ?? "/",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "Packages", link: "/packages/" },
    ],
    search: {
      provider: "local",
    },
    sidebar: {
      "/packages/": [
        {
          text: "Packages",
          items: packageLinks,
        },
      ],
      ...packageSidebars,
    },
  },
});
