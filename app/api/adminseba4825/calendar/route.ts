import { NextResponse } from "next/server";
import { parseCalendar } from "../../../lib/calendar";
import {
  getCalendarStorage,
  readCalendar,
  writeCalendar,
} from "../../../lib/calendar-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(
      { calendar: await readCalendar(), storage: getCalendarStorage() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Impossibile caricare il calendario.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  let calendar;
  try {
    calendar = parseCalendar(await request.json());
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Configurazione non valida.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    await writeCalendar(calendar);
    return NextResponse.json({ calendar, storage: getCalendarStorage() });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Impossibile salvare il calendario.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
