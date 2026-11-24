import { NextResponse } from "next/server";
import { publicCalendar } from "../../lib/calendar";
import { readCalendar } from "../../lib/calendar-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const calendar = await readCalendar();
    return NextResponse.json(publicCalendar(calendar), {
      headers: { "Cache-Control": "no-store, private" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Impossibile caricare il calendario.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
