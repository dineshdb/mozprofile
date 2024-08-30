import { path } from "../deps.ts";
import { HOME } from "./config.ts";

export async function generateIncludeFile() {
  const configDir = path.join(HOME, ".config", "gitconfig.d");
  const entries: Deno.DirEntry[] = Array.from(Deno.readDirSync(configDir));
  var files = Array.from(entries)
    .filter((entry) => entry.isFile)
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith("."))
    .filter((name) => !name.startsWith("_"));

  const text = `[include]\n${files.map((file) => `\tpath = ${file}`).join("\n")
    }\n`;
  await Deno.writeTextFile(path.join(configDir, "_include.conf"), text);
}
