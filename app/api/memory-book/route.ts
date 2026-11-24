import { NextResponse } from "next/server";
import { getCurrentAdventDay, type AdventDoor } from "../../lib/calendar";
import { readCalendar } from "../../lib/calendar-store";
import {
  readMemoryBook,
  saveMemoryBookEntry,
  type MemoryBookEntry,
} from "../../lib/memory-book";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.values(value).every((item) => typeof item === "string")
  );
}

function isAllowedPhotoUrl(value: string) {
  if (/^\/uploads\/[a-zA-Z0-9-]+\.webp$/.test(value)) return true;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    if (url.hostname.endsWith(".public.blob.vercel-storage.com")) return true;

    const supabaseUrl = process.env.SUPABASE_URL;
    if (!supabaseUrl) return false;
    const configuredOrigin = new URL(supabaseUrl).origin;
    return (
      url.origin === configuredOrigin &&
      url.pathname.startsWith("/storage/v1/object/public/advent-assets/memories/")
    );
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    return NextResponse.json(
      { entries: await readMemoryBook() },
      { headers: { "Cache-Control": "no-store, private" } },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Impossibile caricare il libro dei ricordi.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Risposte non valide." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Risposte non valide." }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  if (
    !Number.isInteger(body.day) ||
    (body.day as number) < 1 ||
    (body.day as number) > 25 ||
    !isStringRecord(body.answers) ||
    !isStringRecord(body.photoUrls)
  ) {
    return NextResponse.json({ error: "Giorno o risposte non validi." }, { status: 400 });
  }

  try {
    const calendar = await readCalendar();
    const day = body.day as number;
    if (!calendar.previewMode && day > getCurrentAdventDay()) {
      return NextResponse.json(
        { error: "Questa giornata non è ancora sbloccata." },
        { status: 403 },
      );
    }

    const door: AdventDoor | undefined = calendar.doors.find((item) => item.day === day);
    if (!door) {
      return NextResponse.json({ error: "Giornata non trovata." }, { status: 404 });
    }

    const activityIds = new Set(door.activities.map((activity) => activity.id));
    const hasUnknownResponse = Object.keys(body.answers).some((id) => !activityIds.has(id))
      || Object.keys(body.photoUrls).some((id) => !activityIds.has(id));
    if (hasUnknownResponse) {
      return NextResponse.json({ error: "La giornata contiene risposte non riconosciute." }, { status: 400 });
    }

    for (const [id, url] of Object.entries(body.photoUrls)) {
      if (!activityIds.has(id) || !isAllowedPhotoUrl(url)) {
        return NextResponse.json({ error: "Una foto caricata non è valida." }, { status: 400 });
      }
    }

    for (const activity of door.activities) {
      const answer = body.answers[activity.id]?.trim() ?? "";
      const photoUrl = body.photoUrls[activity.id];
      const hasResponse = activity.type === "photo" ? Boolean(photoUrl) : Boolean(answer);

      if (activity.required && !hasResponse) {
        return NextResponse.json(
          { error: "Completa tutte le attività obbligatorie prima di salvare." },
          { status: 400 },
        );
      }

      if (
        activity.type === "riddle" &&
        hasResponse &&
        answer.toLocaleLowerCase("it-IT") !== activity.answer.trim().toLocaleLowerCase("it-IT")
      ) {
        return NextResponse.json(
          { error: "La parola non è quella giusta. Riprova!" },
          { status: 400 },
        );
      }
    }

    const entry: MemoryBookEntry = {
      day,
      answers: body.answers,
      photoUrls: body.photoUrls,
      completedAt: new Date().toISOString(),
    };
    await saveMemoryBookEntry(entry);
    return NextResponse.json({ entry }, {
      headers: { "Cache-Control": "no-store, private" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Impossibile salvare le risposte.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
