import { path } from "../deps.ts";
import { HOME } from "./config.ts";
import { copyDir } from "./utils.ts";

export const applyHome = (configPath: string) =>
  copyDir(path.join(configPath, "~"), HOME);
