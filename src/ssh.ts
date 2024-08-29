import { path } from "../deps.ts";
import { HOME } from "./config.ts";
import { copyDir } from "./utils.ts";

export async function applySSH(basePath: string) {
  await copyDir(path.join(basePath, "ssh"), path.join(HOME, ".ssh"));
}
