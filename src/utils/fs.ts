export async function tryReadTextFile(file: string) {
  try {
    return await Deno.readTextFile(file);
  } catch (_) {
    return undefined;
  }
}
