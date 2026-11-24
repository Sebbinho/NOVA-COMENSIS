import { NextResponse } from "next/server";
import { storeCalendarImage } from "../../../lib/calendar-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Caricamento non valido." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Seleziona una foto da caricare." }, { status: 400 });
  }

  try {
    const imageUrl = await storeCalendarImage(file, "memories");
    return NextResponse.json({ imageUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Impossibile caricare la foto.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
