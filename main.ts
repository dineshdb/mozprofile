#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-run

import { fs, path } from "./deps.ts";
import { HOME } from "./src/config.ts";
import { generateIncludeFile } from "./src/git.ts";
import { applyProfile, getConfig, prepareGitProfile } from "./src/profile.ts";

export default async function main() {
  if (!fs.existsSync("config.yaml")) {
    console.error("config.yaml not found");
    Deno.exit(1);
  }

  const config = await getConfig();
  await fs.ensureDir(path.join(HOME, ".local", "share", "profbuilder"));
  for (const profile of config.profile) {
    if (profile.path) {
      console.log(`Applying profile from ${profile.path}`);
      await applyProfile(profile.path);
      continue;
    }
    if (profile.url) {
      const localGitClonePath = await prepareGitProfile(profile.url);
      console.log(`Applying profile from ${profile.url}`);
      await applyProfile(localGitClonePath);
    }
  }
  await generateIncludeFile();
}

if (import.meta.main) {
  main();
}
