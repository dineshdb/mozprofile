#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-run

import { fs, path } from "./deps.ts";
import { HOME } from "./src/config.ts";
import { generateIncludeFile } from "./src/git.ts";
import {
  applyProfile,
  Config,
  getConfig,
  prepareGitProfile,
} from "./src/profile.ts";
import { exec } from "./src/utils/exec.ts";

export default async function main() {
  if (!fs.existsSync("config.yaml")) {
    console.error("config.yaml not found");
    Deno.exit(1);
  }

  const config = await getConfig(".");
  await fs.ensureDir(path.join(HOME, ".local", "share", "profbuilder"));
  const importedProfiles: Config[] = [];
  for (const profile of config.profile) {
    if (profile.path) {
      console.log(`Applying profile from ${profile.path}`);
      importedProfiles.push(await getConfig(profile.path));
      await applyProfile(profile.path);
      continue;
    }
    if (profile.url) {
      const localGitClonePath = await prepareGitProfile(profile.url);
      console.log(`Applying profile from ${profile.url}`);
      importedProfiles.push(await getConfig(localGitClonePath));
      await applyProfile(localGitClonePath);
    }
  }

  const allProfiles = [...importedProfiles, config];
  const finalSections = allProfiles.filter((p) => p.finally).map((p) =>
    p.finally!
  ).flat();
  for (const finalSection of finalSections) {
    const { code, stdout, stderr } = exec(finalSection.if);
    if (code === 0 && finalSection.then) {
      const { code, stderr } = exec(finalSection.then);
      if (code !== 0) {
        const error = new TextDecoder().decode(stderr);
        console.error(finalSection.error ?? "Error running command", error);
        Deno.exit(code);
      }
      if (finalSection.title) {
        console.log("Finally:", finalSection.title);
      }
    }
  }

  await generateIncludeFile();
}

if (import.meta.main) {
  main();
}
