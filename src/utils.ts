import { fs } from "../deps.ts";

export async function copyDir(source: string, target: string) {
  const exists = await fs.exists(source);
  if (!exists) {
    return;
  }
  await fs.copy(source, target, {
    overwrite: true,
  });
}
