export function exec(cmd: string) {
  const command = new Deno.Command("bash", {
    args: [
      "-c",
      cmd,
    ],
  });

  return command.outputSync();
}
