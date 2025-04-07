import fs from "fs";
import path from "path";
import { getTrakDataPath } from "./config";
import { type Preference } from "../models/preference";

/**
 * ユーザー設定を保存するディレクトリのパスを取得
 */
const getPreferencesDir = () => {
  const dir = path.join(getTrakDataPath(), "preferences");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

/**
 * ユーザー設定を読み込む
 */
export const loadPreference = (userEmail: string): Preference => {
  const preferencePath = path.join(getPreferencesDir(), `${userEmail}.json`);

  if (!fs.existsSync(preferencePath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(preferencePath, "utf-8"));
};

/**
 * ユーザー設定を保存
 */
export const savePreference = (
  userEmail: string,
  preference: Preference
): void => {
  const preferencePath = path.join(getPreferencesDir(), `${userEmail}.json`);
  fs.writeFileSync(preferencePath, JSON.stringify(preference, null, 2));
};
