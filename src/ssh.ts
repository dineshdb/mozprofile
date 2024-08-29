import { fs, parseCsv, path } from "../deps.ts";
import { HOME } from "./config.ts";
import { tryReadTextFile } from "./utils/fs.ts";

interface ServerConfig {
  name?: string;
  ip: string;
  port?: number;
  user?: string;
  password?: string;
  dns?: string;
}

export async function applySSH(configPath: string) {
  await applySSHCsv(configPath);
}

export async function applySSHCsv(configPath: string) {
  const sshCsv = await tryReadTextFile(path.join(configPath, "ssh.csv"));
  if (!sshCsv) {
    return;
  }

  const servers = (await parseCsv(sshCsv, {
    skipFirstRow: true,
    separator: ",",
  })) as unknown as ServerConfig[];

  const sshDir = path.join(HOME, ".ssh");
  await fs.ensureDir(sshDir);

  const txt = servers.map(
    ({ name, user = "root", ip, port = 22 }) => {
      return `Host ${name}\n\tHostName ${ip}\n\tPort ${port}\n\tUser ${user}\n`;
    },
  );

  const basename = path.basename(path.resolve(path.join(configPath, "..")));
  await Deno.writeTextFile(
    path.join(sshDir, "conf.d", `${basename}-sshcsv.conf`),
    txt.join("\n"),
  );
}
