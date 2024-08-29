export const CONFIG_BASE_DIR = "config";
export const HOME: string = Deno.env.get("HOME")!;

if (!HOME) {
  console.error("$HOME not found");
  Deno.exit(1);
}
