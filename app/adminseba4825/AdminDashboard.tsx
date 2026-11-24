"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Cloud, Heart, ImagePlus, LockKeyhole, Upload } from "lucide-react";
import {
  DEFAULT_CALENDAR,
  type AdventCalendar,
  type AdventDoor,
  type AdventDayType,
  type DailyActivity,
  type DailyActivityType,
  type SiteCopy,
  type SiteTheme,
} from "../lib/calendar";
import { getSiteThemeStyle } from "../lib/site-theme-style";

type StorageMode = "file" | "vercel-blob" | "supabase";

const siteCopyFields: Array<{ key: Exclude<keyof SiteCopy, "futureMessages">; label: string }> = [
  { key: "brand", label: "Nome del sito" },
  { key: "topbarNote", label: "Nota nell'intestazione" },
  { key: "nightMessage", label: "Messaggio notturno" },
  { key: "calendarEyebrow", label: "Testo sopra il titolo del calendario" },
  { key: "unlockedDaysLabel", label: "Etichetta dei giorni sbloccati" },
  { key: "dateRangeLabel", label: "Intervallo date" },
  { key: "adventSectionTitle", label: "Titolo della sezione Avvento" },
  { key: "memoriesLabel", label: "Etichetta ricordi" },
  { key: "requiredActivityLabel", label: "Etichetta attività obbligatoria" },
  { key: "textActivityLabel", label: "Nome attività di testo" },
  { key: "photoActivityLabel", label: "Nome attività foto" },
  { key: "choiceActivityLabel", label: "Nome attività sondaggio" },
  { key: "sliderActivityLabel", label: "Nome attività slider" },
  { key: "riddleActivityLabel", label: "Nome attività enigma" },
  { key: "textAnswerPlaceholder", label: "Segnaposto risposta testuale" },
  { key: "riddleAnswerPlaceholder", label: "Segnaposto risposta enigma" },
  { key: "emptyOptionsMessage", label: "Messaggio sondaggio senza opzioni" },
  { key: "changePhotoAction", label: "Pulsante cambia foto" },
  { key: "photoUploadAction", label: "Pulsante carica foto" },
  { key: "photoUploadingStatus", label: "Testo caricamento foto" },
  { key: "photoCompressionNote", label: "Nota compressione foto" },
  { key: "siteTitleAccessible", label: "Nome accessibile del sito" },
  { key: "pwaDescription", label: "Descrizione app / motori di ricerca" },
  { key: "closeDayAction", label: "Etichetta chiusura giornata" },
  { key: "mainNavigationLabel", label: "Etichetta accessibile navigazione" },
  { key: "completedDoorLabel", label: "Etichetta tappa completata" },
  { key: "largeDoorLabel", label: "Etichetta tappa speciale" },
  { key: "mediumDoorLabel", label: "Etichetta tappa media" },
  { key: "decemberDoorLabel", label: "Etichetta tappa normale" },
  { key: "unlockedDoorLabel", label: "Etichetta tappa sbloccata" },
  { key: "lockedDoorLabel", label: "Etichetta tappa bloccata" },
  { key: "dayDateTemplate", label: "Data giornata (usa {day} per il numero)" },
  { key: "defaultDayTitle", label: "Titolo predefinito della giornata" },
  { key: "storyHeading", label: "Titolo della storia" },
  { key: "clueHeading", label: "Titolo dell'indizio" },
  { key: "giftHeading", label: "Titolo del regalo" },
  { key: "giftRevealAction", label: "Azione per svelare il regalo" },
  { key: "giftCoverLabel", label: "Testo visibile sulla copertura regalo" },
  { key: "giftHideAction", label: "Azione per ricoprire il regalo" },
  { key: "giftRevealedStatus", label: "Messaggio regalo svelato" },
  { key: "giftHiddenStatus", label: "Messaggio regalo coperto" },
  { key: "missionHeading", label: "Titolo delle missioni" },
  { key: "missionDescription", label: "Descrizione delle missioni" },
  { key: "noMissionMessage", label: "Messaggio senza missioni" },
  { key: "emptyActivityPrompt", label: "Testo attività senza domanda" },
  { key: "saveInProgress", label: "Testo durante il salvataggio" },
  { key: "photoPreparingStatus", label: "Testo durante la preparazione foto" },
  { key: "photoPreparedStatus", label: "Messaggio foto pronta" },
  { key: "daySavedStatus", label: "Messaggio giornata salvata" },
  { key: "imageValidationError", label: "Errore file immagine non valido" },
  { key: "updateMemoryAction", label: "Pulsante aggiorna ricordo" },
  { key: "completeDayAction", label: "Pulsante completa giornata" },
  { key: "bookEyebrow", label: "Testo sopra Il Nostro Libro" },
  { key: "bookTitle", label: "Titolo del libro" },
  { key: "bookIntroduction", label: "Introduzione del libro" },
  { key: "bookPageCounterTemplate", label: "Contatore pagine (usa {count})" },
  { key: "bookProgressMessage", label: "Messaggio progresso libro" },
  { key: "bookDateTemplate", label: "Data pagina libro (usa {day})" },
  { key: "bookDayTitleTemplate", label: "Titolo pagina (usa {day})" },
  { key: "bookWaitingTitle", label: "Titolo ricordo in attesa" },
  { key: "bookWaitingMessage", label: "Messaggio ricordo in attesa (usa {day})" },
  { key: "pdfProgress", label: "Testo durante la creazione PDF" },
  { key: "pdfDownloadAction", label: "Pulsante download PDF" },
  { key: "pdfLockedAction", label: "Pulsante PDF prima di Natale" },
  { key: "pdfHeaderTemplate", label: "Intestazione PDF (usa {brand} e {day})" },
  { key: "pdfDateTemplate", label: "Data PDF (usa {day})" },
  { key: "pdfClueLabel", label: "Etichetta indizio nel PDF" },
  { key: "pdfGiftMessageLabel", label: "Etichetta biglietto nel PDF" },
  { key: "pdfGiftPhotoLabelTemplate", label: "Didascalia regalo PDF (usa {title})" },
  { key: "pdfMemoryLabel", label: "Etichetta ricordo nel PDF" },
  { key: "pdfWaitingMessage", label: "Messaggio pagina PDF in attesa" },
  { key: "pdfFooter", label: "Firma a piè di pagina PDF" },
  { key: "pdfPageNumberTemplate", label: "Numero pagina PDF (usa {day})" },
  { key: "pdfOverflowMessage", label: "Errore contenuto troppo lungo PDF (usa {day})" },
  { key: "pdfPhotoDownloadError", label: "Errore download foto PDF" },
  { key: "pdfPhotoHttpErrorTemplate", label: "Errore HTTP foto PDF (usa {status})" },
  { key: "pdfPhotoCanvasError", label: "Errore preparazione foto PDF" },
  { key: "homeEyebrow", label: "Soprattitolo della Home" },
  { key: "homeTitle", label: "Titolo della Home" },
  { key: "homeStory", label: "Storia della Home" },
  { key: "homeDaysLabel", label: "Etichetta giorni nella Home" },
  { key: "homeMemoriesLabel", label: "Etichetta ricordi nella Home" },
  { key: "homeNextChapterLabel", label: "Etichetta prossimo capitolo nella Home" },
  { key: "homeCalendarAction", label: "Pulsante per aprire il calendario" },
  { key: "homeTab", label: "Nome scheda Home" },
  { key: "adventTab", label: "Nome scheda Avvento" },
  { key: "bookTab", label: "Nome scheda libro" },
  { key: "closingMessage", label: "Frase finale con lucchetto" },
];

const siteIconFields: Array<{ key: "homeTabIcon" | "adventTabIcon" | "bookTabIcon" | "unlockedDoorIcon" | "lockedDoorIcon" | "completedDoorIcon" | "doorDecorationSymbol"; label: string }> = [
  { key: "homeTabIcon", label: "Simbolo scheda Home" },
  { key: "adventTabIcon", label: "Simbolo scheda Avvento" },
  { key: "bookTabIcon", label: "Simbolo scheda libro" },
  { key: "unlockedDoorIcon", label: "Simbolo casella apribile" },
  { key: "lockedDoorIcon", label: "Simbolo casella bloccata" },
  { key: "completedDoorIcon", label: "Simbolo casella completata" },
  { key: "doorDecorationSymbol", label: "Decorazione sulle caselle" },
];

const themeColorFields: Array<{ key: Exclude<keyof SiteTheme, "backgroundImage">; label: string }> = [
  { key: "background", label: "Colore di sfondo" },
  { key: "surface", label: "Colore delle superfici" },
  { key: "text", label: "Colore delle scritte (testo principale)" },
  { key: "primary", label: "Colore principale" },
  { key: "primaryDark", label: "Colore principale scuro" },
  { key: "primarySoft", label: "Colore principale chiaro" },
  { key: "accent", label: "Colore di accento" },
  { key: "gold", label: "Colore dettagli dorati" },
  { key: "muted", label: "Colore testo secondario" },
  { key: "line", label: "Colore bordi" },
];

export default function AdminDashboard() {
  const [calendar, setCalendar] = useState<AdventCalendar>(DEFAULT_CALENDAR);
  const [selectedDay, setSelectedDay] = useState(1);
  const [storage, setStorage] = useState<StorageMode | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("Caricamento configurazione…");
  const [messageType, setMessageType] = useState<"info" | "error" | "success">("info");
  const [newActivityType, setNewActivityType] = useState<DailyActivityType>("text");

  const selectedDoor = calendar.doors[selectedDay - 1];
  const now = new Date();
  const decemberDay = now.getMonth() === 11 ? now.getDate() : 0;

  useEffect(() => {
    fetch("/api/adminseba4825/calendar", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Impossibile caricare la configurazione.");
        setCalendar(data.calendar as AdventCalendar);
        setStorage(data.storage as StorageMode);
        setMessage("Configurazione caricata.");
      })
      .catch((error: unknown) => {
        setMessage(error instanceof Error ? error.message : "Impossibile caricare la configurazione.");
        setMessageType("error");
      });
  }, []);

  function updateCalendar<K extends keyof AdventCalendar>(key: K, value: AdventCalendar[K]) {
    setCalendar((current) => ({ ...current, [key]: value }));
  }

  function updateSiteCopy<K extends keyof SiteCopy>(key: K, value: SiteCopy[K]) {
    updateCalendar("siteCopy", { ...calendar.siteCopy, [key]: value });
  }

  function updateTheme<K extends keyof SiteTheme>(key: K, value: SiteTheme[K]) {
    updateCalendar("theme", { ...calendar.theme, [key]: value });
  }

  function updateDoor<K extends keyof AdventDoor>(key: K, value: AdventDoor[K]) {
    setCalendar((current) => ({
      ...current,
      doors: current.doors.map((door) =>
        door.day === selectedDay ? { ...door, [key]: value } : door,
      ),
    }));
  }

  function updateActivity(activityId: string, changes: Partial<DailyActivity>) {
    updateDoor(
      "activities",
      selectedDoor.activities.map((activity) =>
        activity.id === activityId ? { ...activity, ...changes } : activity,
      ),
    );
  }

  function addActivity() {
    const activity: DailyActivity = {
      id: crypto.randomUUID(),
      type: newActivityType,
      prompt: "",
      required: false,
      options: [],
      max: newActivityType === "slider" ? 100 : null,
      answer: "",
    };
    updateDoor("activities", [...selectedDoor.activities, activity]);
  }

  function removeActivity(activityId: string) {
    updateDoor(
      "activities",
      selectedDoor.activities.filter((activity) => activity.id !== activityId),
    );
  }

  function updateDayType(dayType: AdventDayType) {
    updateDoor("dayType", dayType);
    updateDoor("bigChest", dayType === "large");
    updateDoor(
      "chestAmount",
      dayType === "large"
        ? selectedDoor.chestAmount || 10
        : 0,
    );
  }

  async function saveCalendar(nextCalendar = calendar, successMessage = "Modifiche salvate.") {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/adminseba4825/calendar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextCalendar),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Impossibile salvare le modifiche.");
      setCalendar(data.calendar as AdventCalendar);
      setStorage(data.storage as StorageMode);
      setMessage(successMessage);
      setMessageType("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Impossibile salvare le modifiche.");
      setMessageType("error");
    } finally {
      setBusy(false);
    }
  }

  async function uploadImage(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setMessage("Carico la foto del regalo…");
    setMessageType("info");
    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch("/api/adminseba4825/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Impossibile caricare l'immagine.");
      updateDoor("imageUrl", data.imageUrl as string);
      setMessage("Foto caricata. Salva le modifiche per collegarla a questa casella.");
      setMessageType("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Impossibile caricare l'immagine.");
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  }

  function setReceived(received: boolean) {
    const nextCalendar = {
      ...calendar,
      doors: calendar.doors.map((door) =>
        door.day === selectedDay ? { ...door, received } : door,
      ),
    };
    setCalendar(nextCalendar);
    void saveCalendar(
      nextCalendar,
      received ? "Regalo pubblicato: ora è visibile dal link." : "Sorpresa nascosta di nuovo.",
    );
  }

  return (
    <main className="admin-page" style={getSiteThemeStyle(calendar.theme)}>
      <header className="admin-topbar">
        <Link className="admin-back-link" href="/">
          <ArrowLeft size={17} /> Torna al calendario
        </Link>
        <span className="admin-brand"><Heart size={16} fill="currentColor" /> UN DICEMBRE PER NOI</span>
      </header>

      <div className="admin-layout">
        <section className="admin-heading">
          <p className="eyebrow">PROGRAMMAZIONE AVVENTO</p>
          <h1>Prepara i 25 giorni</h1>
          <p>Storie, indizi, regali e missioni: puoi pianificare ogni giornata in anticipo.</p>
        </section>

        <div className="admin-summary">
          <span><strong>25</strong> tappe in programma</span>
          <span className="summary-separator" aria-hidden="true" />
          <span>{calendar.previewMode ? "Modalità prova attiva" : "Calendario programmato"}</span>
        </div>

        <div className={`storage-notice ${storage === "vercel-blob" || storage === "supabase" ? "storage-ready" : ""}`}>
          <Cloud size={18} />
          <div>
            <strong>
              {storage === "supabase"
                ? "Supabase collegato"
                : storage === "vercel-blob"
                  ? "Archivio Vercel Blob attivo"
                  : "Configurazione locale"}
            </strong>
            <span>
              {storage === "supabase"
                ? "Configurazione, ricordi e foto sono archiviati nel progetto Supabase collegato."
                : storage === "vercel-blob"
                  ? "I contenuti e le foto salvati qui saranno visibili a chiunque abbia il link."
                  : "In sviluppo le modifiche aggiornano sitoConfig.json. Configura Supabase per usare un archivio cloud persistente."}
            </span>
          </div>
        </div>

        <section className="admin-card preview-settings">
          <label className="preview-toggle">
            <input
              type="checkbox"
              checked={calendar.previewMode}
              onChange={(event) => updateCalendar("previewMode", event.target.checked)}
            />
            <span>
              <strong>Modalità prova</strong>
              <small>
                {calendar.previewMode
                  ? "Tutte le giornate sono apribili dal sito pubblico per provare l'esperienza. Il contatore resta sulla data reale."
                  : "Le giornate si aprono soltanto secondo le date di dicembre."}
              </small>
            </span>
          </label>
          <button
            type="button"
            className="save-button"
            onClick={() => void saveCalendar()}
            disabled={busy}
          >
            {busy ? "Salvataggio…" : "Salva modalità prova"}
          </button>
        </section>

        <section className="admin-card general-settings">
          <div className="admin-card-heading">
            <span className="admin-icon"><Heart size={18} /></span>
            <div><h2>Il messaggio iniziale</h2><p>Personalizza la pagina che vedrà la tua fidanzata.</p></div>
          </div>
          <div className="form-grid">
            <label className="field">
              <span>Dedica</span>
              <input
                value={calendar.recipient}
                maxLength={80}
                onChange={(event) => updateCalendar("recipient", event.target.value)}
              />
            </label>
            <label className="field">
              <span>Titolo</span>
              <input
                value={calendar.heading}
                maxLength={120}
                onChange={(event) => updateCalendar("heading", event.target.value)}
              />
            </label>
            <label className="field field-wide">
              <span>Descrizione</span>
              <textarea
                value={calendar.introduction}
                maxLength={300}
                rows={2}
                onChange={(event) => updateCalendar("introduction", event.target.value)}
              />
            </label>
          </div>
          <details className="site-copy-settings">
            <summary>Aspetto e colori del sito</summary>
            <div className="form-grid site-copy-grid theme-color-grid">
              {themeColorFields.map(({ key, label }) => (
                <label className="field theme-color-field" key={key}>
                  <span className="theme-color-label">
                    <i
                      className="theme-color-swatch"
                      style={{ backgroundColor: calendar.theme[key] }}
                      aria-hidden="true"
                    />
                    <span>{label}</span>
                    <code>{calendar.theme[key].toUpperCase()}</code>
                  </span>
                  <input
                    type="color"
                    value={calendar.theme[key]}
                    onChange={(event) => updateTheme(key, event.target.value)}
                  />
                </label>
              ))}
              <label className="field field-wide">
                <span>Immagine di sfondo (percorso dentro public/)</span>
                <input
                  value={calendar.theme.backgroundImage}
                  maxLength={200}
                  onChange={(event) => updateTheme("backgroundImage", event.target.value)}
                />
              </label>
            </div>
            <div className="editor-actions">
              <button type="button" className="save-button" onClick={() => void saveCalendar()} disabled={busy}>
                {busy ? "Salvataggio…" : "Salva aspetto"}
              </button>
            </div>
          </details>
          <details className="site-copy-settings">
            <summary>Simboli ed emoji</summary>
            <p className="admin-helper-text">
              Personalizza le icone delle tre schede e i simboli che compaiono sulle caselle.
            </p>
            <div className="form-grid site-copy-grid">
              {siteIconFields.map(({ key, label }) => (
                <label className="field" key={key}>
                  <span>{label}</span>
                  <input
                    value={calendar.siteCopy[key]}
                    maxLength={24}
                    onChange={(event) => updateSiteCopy(key, event.target.value)}
                  />
                </label>
              ))}
            </div>
            <div className="editor-actions">
              <button type="button" className="save-button" onClick={() => void saveCalendar()} disabled={busy}>
                {busy ? "Salvataggio…" : "Salva simboli"}
              </button>
            </div>
          </details>
          <details className="site-copy-settings">
            <summary>Altri testi della pagina pubblica</summary>
            <div className="form-grid site-copy-grid">
              {siteCopyFields.map(({ key, label }) => (
                <label className="field" key={key}>
                  <span>{label}</span>
                  {key === "closingMessage" || key === "bookIntroduction" || key === "noMissionMessage" || key === "homeStory" ? (
                    <textarea
                      value={calendar.siteCopy[key]}
                      maxLength={1000}
                      rows={key === "homeStory" ? 6 : 2}
                      onChange={(event) => updateSiteCopy(key, event.target.value)}
                    />
                  ) : (
                    <input
                      value={calendar.siteCopy[key]}
                      maxLength={1000}
                      onChange={(event) => updateSiteCopy(key, event.target.value)}
                    />
                  )}
                </label>
              ))}
              <label className="field field-wide">
                <span>Messaggi casuali per i giorni bloccati (uno per riga; {`{days}`} = giorni mancanti)</span>
                <textarea
                  value={calendar.siteCopy.futureMessages.join("\n")}
                  rows={4}
                  onChange={(event) =>
                    updateSiteCopy(
                      "futureMessages",
                      event.target.value.split("\n").slice(0, 20),
                    )
                  }
                />
              </label>
            </div>
          </details>
          <div className="editor-actions">
            <button type="button" className="save-button" onClick={() => void saveCalendar()} disabled={busy}>
              {busy ? "Salvataggio…" : "Salva impostazioni del sito"}
            </button>
          </div>
        </section>

        <div className="admin-editor">
          <section className="admin-card day-picker">
            <div className="admin-card-heading">
              <span className="admin-icon"><LockKeyhole size={18} /></span>
              <div><h2>Giorni 1–25</h2><p>Seleziona la tappa da programmare.</p></div>
            </div>
            <div className="day-picker-grid">
              {calendar.doors.map((door) => {
                const isToday = decemberDay === door.day;
                const isComplete = door.received;
                const isLocked = decemberDay === 0 || door.day > decemberDay;
                const dayStatus = isComplete
                  ? "Completato"
                  : isToday
                    ? "Sbloccabile oggi"
                    : isLocked
                      ? "Bloccato"
                      : "Da recuperare";
                return (
                <button
                  type="button"
                  key={door.day}
                  className={`day-picker-button ${door.day === selectedDay ? "is-selected" : ""} ${door.bigChest ? "is-chest" : ""} ${isToday ? "is-today" : ""} ${isComplete ? "is-received" : ""}`}
                  onClick={() => setSelectedDay(door.day)}
                  aria-label={`Modifica giorno ${door.day}, ${dayStatus}`}
                  aria-pressed={door.day === selectedDay}
                  title={`Giorno ${door.day} · ${dayStatus}`}
                >
                  <span>{door.day}</span>
                </button>
                );
              })}
            </div>
            <div className="day-status-legend">
              <span><i className="legend-today" /> Oggi</span>
              <span><i className="legend-chest" /> Tappa speciale</span>
              <span><i className="legend-complete" /> Regalo svelato</span>
            </div>
          </section>

          <section className="admin-card gift-editor">
            <div className="admin-card-heading">
              <span className="admin-icon"><ImagePlus size={18} /></span>
              <div><h2>Programma il {String(selectedDay).padStart(2, "0")} dicembre</h2><p>Modifiche salvate qui valgono soltanto per questo giorno.</p></div>
            </div>

            <label className="field">
              <span>Tipo di giornata</span>
              <select
                value={selectedDoor.dayType}
                onChange={(event) => updateDayType(event.target.value as AdventDayType)}
              >
                <option value="small">Tappa piccola</option>
                <option value="medium">Tappa media</option>
                <option value="large">Tappa speciale</option>
              </select>
            </label>

            <label className="field">
              <span>Titolo della giornata o del regalo</span>
              <input
                value={selectedDoor.title}
                maxLength={100}
                placeholder="Un pensiero solo per lei"
                onChange={(event) => updateDoor("title", event.target.value)}
              />
            </label>

            <label className="field">
              <span>Capitolo della storia</span>
              <textarea
                value={selectedDoor.story}
                maxLength={5000}
                rows={4}
                placeholder="Scrivi il capitolo che leggerà oggi…"
                onChange={(event) => updateDoor("story", event.target.value)}
              />
            </label>

            <label className="field">
              <span>Indizio per trovare il pacchetto fisico</span>
              <textarea
                value={selectedDoor.physicalClue}
                maxLength={1000}
                rows={2}
                placeholder="Dove troverà il regalo?"
                onChange={(event) => updateDoor("physicalClue", event.target.value)}
              />
            </label>

            <label className="field">
              <span>Messaggio per lei</span>
              <textarea
                value={selectedDoor.message}
                maxLength={3000}
                rows={5}
                placeholder="Scrivi qui il tuo messaggio…"
                onChange={(event) => updateDoor("message", event.target.value)}
              />
            </label>

            <section className="activity-builder" aria-labelledby="activity-builder-title">
              <div className="activity-builder-heading">
                <div>
                  <h3 id="activity-builder-title">Missioni del giorno</h3>
                  <p>Aggiungi una o più attività: testo, foto, scelta, slider o enigma.</p>
                </div>
                <span className="activity-count">{selectedDoor.activities.length}/10</span>
              </div>

              {selectedDoor.activities.map((activity, index) => (
                <article className="activity-card" key={activity.id}>
                  <div className="activity-card-heading">
                    <strong>Attività {index + 1}</strong>
                    <button
                      type="button"
                      className="remove-activity-button"
                      onClick={() => removeActivity(activity.id)}
                    >
                      Rimuovi
                    </button>
                  </div>

                  <label className="field">
                    <span>Tipo</span>
                    <select
                      value={activity.type}
                      onChange={(event) =>
                        updateActivity(activity.id, {
                          type: event.target.value as DailyActivityType,
                          options:
                            event.target.value === "choice" ? activity.options : [],
                          max:
                            event.target.value === "slider"
                              ? activity.max ?? 100
                              : null,
                          answer: event.target.value === "riddle" ? activity.answer : "",
                        })
                      }
                    >
                      <option value="text">Domanda + risposta scritta</option>
                      <option value="photo">Domanda + foto</option>
                      <option value="choice">Scelta / sondaggio</option>
                      <option value="slider">Slider numerico</option>
                      <option value="riddle">Enigma con parola chiave</option>
                    </select>
                  </label>

                  <label className="field">
                    <span>
                      {activity.type === "riddle"
                        ? "Indizio o consegna dell'enigma"
                        : activity.type === "photo"
                          ? "Cosa deve fotografare?"
                          : activity.type === "choice"
                            ? "Domanda del sondaggio"
                            : activity.type === "slider"
                              ? "Domanda dello slider"
                              : "Domanda"}
                    </span>
                    <textarea
                      value={activity.prompt}
                      maxLength={1000}
                      rows={2}
                      placeholder="Scrivi qui la consegna…"
                      onChange={(event) =>
                        updateActivity(activity.id, { prompt: event.target.value })
                      }
                    />
                  </label>

                  {activity.type === "choice" && (
                    <fieldset className="choice-option-editor">
                      <legend>Opzioni del sondaggio</legend>
                      {activity.options.map((option, optionIndex) => (
                        <div className="choice-option-editor-row" key={`${activity.id}-${optionIndex}`}>
                          <label className="field">
                            <span>Opzione {optionIndex + 1}</span>
                            <input
                              value={option}
                              maxLength={200}
                              placeholder={`Scrivi l'opzione ${optionIndex + 1}`}
                              onChange={(event) =>
                                updateActivity(activity.id, {
                                  options: activity.options.map((currentOption, index) =>
                                    index === optionIndex ? event.target.value : currentOption,
                                  ),
                                })
                              }
                            />
                          </label>
                          <button
                            type="button"
                            className="remove-activity-button"
                            onClick={() =>
                              updateActivity(activity.id, {
                                options: activity.options.filter((_, index) => index !== optionIndex),
                              })
                            }
                            aria-label={`Rimuovi opzione ${optionIndex + 1}`}
                          >
                            Rimuovi
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="add-activity-button"
                        disabled={activity.options.length >= 20}
                        onClick={() =>
                          updateActivity(activity.id, {
                            options: [...activity.options, ""],
                          })
                        }
                      >
                        Aggiungi un'opzione
                      </button>
                    </fieldset>
                  )}

                  {activity.type === "slider" && (
                    <label className="field">
                      <span>Valore massimo dello slider</span>
                      <input
                        type="number"
                        min={1}
                        max={1000000}
                        value={activity.max ?? 100}
                        onChange={(event) =>
                          updateActivity(activity.id, {
                            max: Math.max(1, Number(event.target.value) || 1),
                          })
                        }
                      />
                    </label>
                  )}

                  {activity.type === "riddle" && (
                    <label className="field">
                      <span>Risposta corretta (non visibile dal link pubblico)</span>
                      <input
                        value={activity.answer}
                        maxLength={200}
                        placeholder="Parola da scrivere sul bigliettino"
                        onChange={(event) =>
                          updateActivity(activity.id, { answer: event.target.value })
                        }
                      />
                    </label>
                  )}

                  <label className="activity-required">
                    <input
                      type="checkbox"
                      checked={activity.required}
                      onChange={(event) =>
                        updateActivity(activity.id, { required: event.target.checked })
                      }
                    />
                    <span>Richiesta per completare la giornata</span>
                  </label>
                </article>
              ))}

              <div className="add-activity-row">
                <label className="activity-type-select">
                  <span className="sr-only">Tipo di attività da aggiungere</span>
                  <select
                    value={newActivityType}
                    disabled={selectedDoor.activities.length >= 10}
                    onChange={(event) =>
                      setNewActivityType(event.target.value as DailyActivityType)
                    }
                  >
                    <option value="text">Risposta scritta</option>
                    <option value="photo">Allega una foto</option>
                    <option value="choice">Scelta / sondaggio</option>
                    <option value="slider">Slider numerico</option>
                    <option value="riddle">Enigma</option>
                  </select>
                </label>
                <button
                  type="button"
                  className="add-activity-button"
                  onClick={addActivity}
                  disabled={selectedDoor.activities.length >= 10}
                >
                  Aggiungi attività
                </button>
              </div>
            </section>

            <div className="upload-field">
              <div className="upload-label"><span>Foto del regalo</span><small>Carica l'immagine già scontornata, preferibilmente in PNG trasparente. Massimo 10 MB.</small></div>
              <label className={`upload-button ${uploading ? "is-disabled" : ""}`}>
                <Upload size={17} />
                {uploading ? "Caricamento…" : selectedDoor.imageUrl ? "Sostituisci foto" : "Carica una foto"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                  disabled={uploading}
                  onChange={(event) => {
                    void uploadImage(event.target.files?.[0]);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            </div>

            {selectedDoor.imageUrl && (
              <div className="admin-image-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedDoor.imageUrl} alt={`Anteprima regalo del ${selectedDay} dicembre`} />
                <span>{selectedDoor.received ? "Visibile a chi ha il link" : "Ancora nascosta"}</span>
              </div>
            )}

            <div className={`publish-state ${selectedDoor.received ? "is-published" : ""}`}>
              <span className="publish-indicator"><Check size={14} /></span>
              <div>
                <strong>{selectedDoor.received ? "Regalo pubblicato" : "Regalo non ancora ricevuto"}</strong>
                <span>{selectedDoor.received ? "La foto e il messaggio sono visibili a tutti dal calendario." : "Quando glielo consegni, clicca qui per svelare foto e messaggio."}</span>
              </div>
            </div>

            <div className="editor-actions">
              <button
                type="button"
                className="save-button"
                onClick={() => void saveCalendar()}
                disabled={busy || uploading}
              >
                {busy ? "Salvataggio…" : "Salva modifiche"}
              </button>
              {selectedDoor.received ? (
                <button
                  type="button"
                  className="hide-button"
                  onClick={() => setReceived(false)}
                  disabled={busy || uploading}
                >
                  Nascondi la sorpresa
                </button>
              ) : (
                <button
                  type="button"
                  className="publish-button"
                  onClick={() => setReceived(true)}
                  disabled={busy || uploading || !selectedDoor.imageUrl}
                  title={!selectedDoor.imageUrl ? "Carica prima la foto del regalo" : undefined}
                >
                  <Heart size={16} /> Segna come regalo ricevuto
                </button>
              )}
            </div>

            <p className={`admin-status status-${messageType}`} role="status" aria-live="polite">
              {messageType === "success" && <Check size={15} />}
              {message}
            </p>
          </section>
        </div>

        <div className="admin-footer-note">
          <LockKeyhole size={14} />
          <span>Questa pagina non è collegata al calendario pubblico. Le foto non pubblicate restano fuori dalla pagina regalo.</span>
        </div>
      </div>
    </main>
  );
}
