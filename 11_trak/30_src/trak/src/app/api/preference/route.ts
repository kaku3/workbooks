import { auth } from "@/auth/serverAuth";
import { NextResponse } from "next/server";
import { loadPreference, savePreference } from "@/backend/services/preference";
import { type Preference } from "@/backend/models/preference";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = loadPreference(session.user.email);
    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error reading preferences:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences: Preference = await request.json();
    savePreference(session.user.email, preferences);
    return NextResponse.json({ message: "Preferences updated" });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
