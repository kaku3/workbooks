import fs from "fs";
import path from "path";
import { getTrakDataPath } from "./config";
import { Holiday } from "../models/holiday";

/**
 * 祝日データを読み込む
 */
export const loadHolidays = (): Holiday[] => {
  const holidaysPath = path.join(getTrakDataPath(), "configs", "holidays.json");

  try {
    const data = JSON.parse(fs.readFileSync(holidaysPath, "utf8"));
    console.log(data);
    return Object.entries(data).map(([date, name]) => ({
      date,
      name: name as string,
    }));
  } catch (error) {
    throw new Error(`祝日データの読み込みに失敗しました: ${error}`);
  }
};
