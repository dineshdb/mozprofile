import { fs, path } from "../deps.ts";
import { HOME } from "./config.ts";
import { copyDir } from "./utils.ts";

export async function applySSH(configPath: string) {
  const sshDir = path.join(HOME, ".ssh");
  await fs.ensureDir(sshDir);
  await copyDir(path.join(configPath, "ssh"), sshDir);
}
