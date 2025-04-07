import { useState, useCallback } from "react";
import { Holiday } from "../../backend/models/holiday";

export interface HolidayStore {
  holidays: Holiday[];
  isLoadingHolidays: boolean;
  holidaysError: string | null;
  fetchHolidays: () => Promise<void>;
}

// 休日管理のカスタムフック
export function useHolidayStore(): HolidayStore {
  // 休日関連の状態
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(true);
  const [holidaysError, setHolidaysError] = useState<string | null>(null);

  // 休日データの取得
  const fetchHolidays = useCallback(async () => {
    console.log("[ApplicationContext] fetchHolidays called");
    setIsLoadingHolidays(true);

    try {
      const response = await fetch("/api/holidays");
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "休日データの取得に失敗しました");
      }

      console.log("[ApplicationContext] fetchHolidays success:", data.holidays);
      setHolidays(data.holidays);
      setHolidaysError(null);
    } catch (err) {
      console.error("[ApplicationContext] fetchHolidays error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "予期せぬエラーが発生しました";
      setHolidaysError(errorMessage);
    } finally {
      setIsLoadingHolidays(false);
    }
  }, []);

  return {
    holidays,
    isLoadingHolidays,
    holidaysError,
    fetchHolidays,
  };
}
