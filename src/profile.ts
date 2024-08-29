import { fs, git, parseYaml, path } from "../deps.ts";
import { HOME } from "./config.ts";
import { applyMozProfile } from "./firefox.ts";
import { updateRepo } from "./git.ts";
import { applySSH } from "./ssh.ts";

export async function applyProfile(basePath: string) {
  const configPath = path.join(basePath, "config");
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
    const { code, stderr } = await git(
      `clone ${url} ${localGitClonePath}`,
    );
    if (code !== 0) {
      console.error("git:", new TextDecoder().decode(stderr));
      Deno.exit(code);
    }
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
    console.error("config.yaml not found");
    Deno.exit(1);
  }

  return parseYaml(await Deno.readTextFile("config.yaml")) as Config;
}
