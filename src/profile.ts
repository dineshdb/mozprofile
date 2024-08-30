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

type Config = {
  profile: {
    path?: string;
    url?: string;
  }[];
};

export async function getConfig(): Promise<Config> {
  if (!fs.existsSync("config.yaml")) {
    throw new Error("config.yaml not found");
  }

  return parseYaml(await Deno.readTextFile("config.yaml")) as Config;
}
