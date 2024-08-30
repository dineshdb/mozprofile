import { fs, parseYaml, path } from "../deps.ts";
import { HOME } from "./config.ts";
import { applyMozProfile } from "./firefox.ts";
import { applyHome } from "./home.ts";
import { applySSH } from "./ssh.ts";
import { gitClone, updateRepo } from "./utils/git.ts";

export async function applyProfile(basePath: string) {
  const configPath = path.join(basePath, "config");
  // we don't do any preprocessing with ~ so let's just apply it first
  await applyHome(configPath);
  await Promise.all([applyMozProfile(configPath), applySSH(configPath)]);
}

export async function prepareGitProfile(url: string) {
  const profileName = path.basename(url).replace(/\.git$/, "");
  const localGitClonePath = path.join(
    HOME,
    ".local",
    "share",
    "profbuilder",
    "git",
    profileName,
  );

  const exists = await fs.exists(localGitClonePath);
  if (exists) {
    await updateRepo(localGitClonePath);
  } else {
    await gitClone(url, localGitClonePath);
  }

  return localGitClonePath;
}

export type Config = {
  profile: {
    path?: string;
    url?: string;
  }[];
  finally?: FinalCleanup;
};

type FinalCleanup = {
  title?: string;
  error?: string;
  if: string;
  then?: string;
  else?: string;
};

export async function getConfig(profileDir: string): Promise<Config> {
  const configPath = path.join(profileDir, "config.yaml");
  if (!fs.existsSync(configPath)) {
    throw new Error("config.yaml not found");
  }

  return parseYaml(await Deno.readTextFile(configPath)) as Config;
}
