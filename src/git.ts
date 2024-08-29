import { git } from "../deps.ts";

export async function updateRepo(dir: string) {
  const cwd = Deno.cwd();
  try {
    Deno.chdir(dir);
    const { code, stderr } = await git("pull");
    if (code !== 0) {
      console.error("git:", new TextDecoder().decode(stderr));
      throw new Error("failed to update repo");
    }
  } finally {
    Deno.chdir(cwd);
  }
}
