import { del, list, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { DEFAULT_CALENDAR, parseCalendar, type AdventCalendar } from "./calendar";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase-admin";

const configPrefix = "advent-calendar/config.json";
const configFilePath = path.join(process.cwd(), "sitoConfig.json");
const isVercel = process.env.VERCEL === "1";
const supabaseBucket = "advent-assets";

export type CalendarStorage = "file" | "vercel-blob" | "supabase";

export function getCalendarStorage(): CalendarStorage {
  if (isSupabaseConfigured()) return "supabase";
  return isVercel ? "vercel-blob" : "file";
}

function assertBlobStorageConfigured() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "Archivio non configurato: collega uno storage Vercel Blob al progetto.",
    );
  }
}

async function findStoredConfig() {
  assertBlobStorageConfigured();
  const { blobs } = await list({ prefix: configPrefix, limit: 1000 });
  return blobs.sort(
    (first, second) => second.uploadedAt.getTime() - first.uploadedAt.getTime(),
  )[0];
}

export async function readCalendar(): Promise<AdventCalendar> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdmin()
      .from("advent_calendar")
      .select("config")
      .eq("id", "main")
      .maybeSingle();
    if (error) throw new Error(`Impossibile leggere il calendario da Supabase: ${error.message}`);
    if (data) return parseCalendar(data.config);

    const legacyCalendar = await readLegacyCalendar();
    const { error: migrationError } = await getSupabaseAdmin()
      .from("advent_calendar")
      .upsert(
        { id: "main", config: legacyCalendar, updated_at: new Date().toISOString() },
        { onConflict: "id" },
      );
    if (migrationError) {
      throw new Error(`Impossibile inizializzare il calendario su Supabase: ${migrationError.message}`);
    }
    return legacyCalendar;
  }

  return readLegacyCalendar();
}

async function readLegacyCalendar(): Promise<AdventCalendar> {
  if (isVercel) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      if (isSupabaseConfigured()) return DEFAULT_CALENDAR;
      assertBlobStorageConfigured();
    }
    const storedConfig = await findStoredConfig();
    if (!storedConfig) return DEFAULT_CALENDAR;
    const response = await fetch(storedConfig.url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Impossibile leggere la configurazione (${response.status}).`);
    }
    return parseCalendar(await response.json());
  }

  const contents = await fs.readFile(configFilePath, "utf8");
  return parseCalendar(JSON.parse(contents));
}

export async function writeCalendar(calendar: AdventCalendar): Promise<void> {
  const validatedCalendar = parseCalendar(calendar);

  if (isSupabaseConfigured()) {
    const { error } = await getSupabaseAdmin()
      .from("advent_calendar")
      .upsert(
        { id: "main", config: validatedCalendar, updated_at: new Date().toISOString() },
        { onConflict: "id" },
      );
    if (error) throw new Error(`Impossibile salvare il calendario su Supabase: ${error.message}`);
    return;
  }

  if (!isVercel) {
    await fs.writeFile(
      configFilePath,
      `${JSON.stringify(validatedCalendar, null, 2)}\n`,
      "utf8",
    );
    return;
  }

  const oldConfig = await findStoredConfig();
  const savedConfig = await put(
    configPrefix,
    JSON.stringify(validatedCalendar),
    {
      access: "public",
      addRandomSuffix: true,
      contentType: "application/json",
      cacheControlMaxAge: 0,
    },
  );

  if (oldConfig) await del(oldConfig.url);
  if (!savedConfig.url) {
    throw new Error("Vercel Blob non ha restituito l'indirizzo della configurazione.");
  }
}

export async function storeCalendarImage(
  file: File,
  category: "gifts" | "memories" = "gifts",
): Promise<string> {
  if (file.size === 0 || file.size > 10 * 1024 * 1024) {
    throw new Error("L'immagine deve pesare al massimo 10 MB.");
  }

  const extensions: Record<string, string> = {
    "image/avif": "avif",
    "image/gif": "gif",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const extension = extensions[file.type];
  if (!extension) {
    throw new Error("Formato non supportato. Usa JPG, PNG, WebP, AVIF o GIF.");
  }

  const filename = `${randomUUID()}.${extension}`;

  if (isSupabaseConfigured()) {
    const storagePath = `${category}/${filename}`;
    const { error } = await getSupabaseAdmin()
      .storage
      .from(supabaseBucket)
      .upload(storagePath, file, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });
    if (error) throw new Error(`Impossibile caricare la foto su Supabase: ${error.message}`);
    const { data } = getSupabaseAdmin().storage.from(supabaseBucket).getPublicUrl(storagePath);
    if (!data.publicUrl) throw new Error("Supabase non ha restituito l'indirizzo della foto.");
    return data.publicUrl;
  }

  if (!isVercel) {
    const uploadsDirectory = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDirectory, { recursive: true });
    await fs.writeFile(
      path.join(uploadsDirectory, filename),
      Buffer.from(await file.arrayBuffer()),
      { flag: "wx" },
    );
    return `/uploads/${filename}`;
  }

  assertBlobStorageConfigured();
  const savedImage = await put(`advent-calendar/${category}/${filename}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
    cacheControlMaxAge: 31_536_000,
  });
  return savedImage.url;
}
