import { NextResponse } from "next/server";
import { loadHolidays } from "../../../backend/services/holiday";

export async function GET() {
  try {
    const holidays = loadHolidays();
    return NextResponse.json({
      success: true,
      holidays,
    });
  } catch (error) {
    console.error("Error loading holidays:", error);
    return NextResponse.json(
      {
        success: false,
        error: "休日データの取得に失敗しました",
      },
      { status: 500 }
    );
  }
}
