import { parseIni, path } from "../deps.ts";
import { HOME } from "./config.ts";
import { copyDir } from "./utils.ts";

export const MOZILLA_DIR = path.join(HOME, ".mozilla");
export const MOZILLA_INI_PATH = path.join(
  MOZILLA_DIR,
  "firefox",
  "profiles.ini",
);

type ProfileInfo = {
  Name?: string;
  IsRelative?: string;
  Path?: string;
  Default?: string;
  Locked?: string;
};

function getIniFile() {
  const parsed: Record<string, ProfileInfo> = parseIni(
    Deno.readTextFileSync(MOZILLA_INI_PATH),
  );
  return parsed;
}

function getFirefoxProfiles() {
  const parsed = getIniFile();
  const profiles = Object.values(parsed).filter((profile) => !!profile.Path);
  return profiles;
}

export async function applyMozProfile(configPath: string) {
  const profiles = getFirefoxProfiles();
  for (const profile of profiles) {
    if (profile.Path) {
      const profileDir = path.join(MOZILLA_DIR, "firefox", profile.Path);
      await copyDir(path.join(configPath, "mozprofile"), profileDir);
    }
  }
}
