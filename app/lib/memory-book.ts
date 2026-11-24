import { del, list, put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase-admin";

export type MemoryBookEntry = {
  day: number;
  answers: Record<string, string>;
  photoUrls: Record<string, string>;
  completedAt: string;
};

const bookPrefix = "advent-calendar/book/entries.json";
const bookFilePath = path.join(process.cwd(), "data", "memory-book.json");

function assertBlobStorageConfigured() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "Archivio non configurato: collega uno storage Vercel Blob al progetto.",
    );
  }
}

function parseEntries(value: unknown): MemoryBookEntry[] {
  if (!Array.isArray(value)) {
    throw new Error("L'archivio dei ricordi non è valido.");
  }

  return value.map((entry) => {
    if (
      !entry ||
      typeof entry !== "object" ||
      !Number.isInteger(entry.day) ||
      entry.day < 1 ||
      entry.day > 25 ||
      !entry.answers ||
      typeof entry.answers !== "object" ||
      Array.isArray(entry.answers) ||
      !Object.values(entry.answers).every((answer) => typeof answer === "string") ||
      !entry.photoUrls ||
      typeof entry.photoUrls !== "object" ||
      Array.isArray(entry.photoUrls) ||
      !Object.values(entry.photoUrls).every((url) => typeof url === "string") ||
      typeof entry.completedAt !== "string"
    ) {
      throw new Error("Una pagina del libro dei ricordi non è valida.");
    }

    return {
      day: entry.day as number,
      answers: Object.fromEntries(
        Object.entries(entry.answers as Record<string, string>).map(([id, answer]) => [
          id.slice(0, 80),
          answer.slice(0, 5000),
        ]),
      ),
      photoUrls: Object.fromEntries(
        Object.entries(entry.photoUrls as Record<string, string>).map(([id, url]) => [
          id.slice(0, 80),
          url.slice(0, 2048),
        ]),
      ),
      completedAt: entry.completedAt.slice(0, 50),
    };
  });
}

async function findStoredBook() {
  assertBlobStorageConfigured();
  const { blobs } = await list({ prefix: bookPrefix, limit: 1000 });
  return blobs.sort(
    (first, second) => second.uploadedAt.getTime() - first.uploadedAt.getTime(),
  )[0];
}

export async function readMemoryBook(): Promise<MemoryBookEntry[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("memory_book_entries")
      .select("day, answers, photo_urls, completed_at")
      .order("day", { ascending: true });
    if (error) throw new Error(`Impossibile leggere il libro da Supabase: ${error.message}`);
    const entries = parseEntries(
      (data ?? []).map((entry) => ({
        day: entry.day,
        answers: entry.answers,
        photoUrls: entry.photo_urls,
        completedAt: entry.completed_at,
      })),
    );
    if (entries.length > 0) return entries;

    const { data: migration, error: migrationReadError } = await supabase
      .from("storage_migrations")
      .select("id")
      .eq("id", "memory_book_v1")
      .maybeSingle();
    if (migrationReadError) {
      throw new Error(`Impossibile controllare la migrazione Supabase: ${migrationReadError.message}`);
    }
    if (migration) return entries;

    const legacyEntries = await readLegacyMemoryBook();
    if (legacyEntries.length > 0) {
      const { error: importError } = await supabase
        .from("memory_book_entries")
        .upsert(
          legacyEntries.map((entry) => ({
            day: entry.day,
            answers: entry.answers,
            photo_urls: entry.photoUrls,
            completed_at: entry.completedAt,
          })),
          { onConflict: "day" },
        );
      if (importError) {
        throw new Error(`Impossibile importare il libro esistente in Supabase: ${importError.message}`);
      }
    }

    const { error: migrationWriteError } = await supabase
      .from("storage_migrations")
      .upsert(
        { id: "memory_book_v1", completed_at: new Date().toISOString() },
        { onConflict: "id" },
      );
    if (migrationWriteError) {
      throw new Error(`Impossibile completare la migrazione Supabase: ${migrationWriteError.message}`);
    }
    return legacyEntries;
  }

  return readLegacyMemoryBook();
}

async function readLegacyMemoryBook(): Promise<MemoryBookEntry[]> {
  if (process.env.VERCEL !== "1") {
    try {
      const contents = await fs.readFile(bookFilePath, "utf8");
      return parseEntries(JSON.parse(contents));
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        return [];
      }
      throw error;
    }
  }

  if (isSupabaseConfigured() && !process.env.BLOB_READ_WRITE_TOKEN) return [];
  const storedBook = await findStoredBook();
  if (!storedBook) return [];

  const response = await fetch(storedBook.url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Impossibile leggere il libro dei ricordi (${response.status}).`);
  }

  return parseEntries(await response.json());
}

export async function saveMemoryBookEntry(entry: MemoryBookEntry): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabaseAdmin()
      .from("memory_book_entries")
      .upsert(
        {
          day: entry.day,
          answers: entry.answers,
          photo_urls: entry.photoUrls,
          completed_at: entry.completedAt,
        },
        { onConflict: "day" },
      );
    if (error) throw new Error(`Impossibile salvare il ricordo su Supabase: ${error.message}`);
    return;
  }

  const entries = await readMemoryBook();
  const updatedEntries = [
    ...entries.filter((existingEntry) => existingEntry.day !== entry.day),
    entry,
  ].sort((first, second) => first.day - second.day);
  const serializedEntries = JSON.stringify(updatedEntries);

  if (process.env.VERCEL !== "1") {
    await fs.mkdir(path.dirname(bookFilePath), { recursive: true });
    await fs.writeFile(bookFilePath, `${serializedEntries}\n`, "utf8");
    return;
  }

  const oldBook = await findStoredBook();
  const savedBook = await put(bookPrefix, serializedEntries, {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
  if (oldBook) await del(oldBook.url);
  if (!savedBook.url) {
    throw new Error("Vercel Blob non ha restituito l'indirizzo del libro.");
  }
}
