"use client";

import {
  BookHeart,
  Check,
  ChevronRight,
  CircleHelp,
  Gift,
  Heart,
  ImagePlus,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DEFAULT_SITE_COPY,
  DEFAULT_CALENDAR,
  getCurrentAdventDay,
  type AdventCalendar,
  type AdventDoor,
  type DailyActivity,
  type SiteCopy,
} from "./lib/calendar";
import type { MemoryBookEntry } from "./lib/memory-book";
import { getSiteThemeStyle } from "./lib/site-theme-style";

type AppTab = "home" | "advent" | "book";
type ResponseValues = Record<string, string>;

async function preparePhoto(file: File): Promise<Blob> {
  const image = await createImageBitmap(file);
  const maxDimension = 1600;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    image.close();
    throw new Error("Impossibile elaborare questa foto.");
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();

  const compressed = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.78),
  );
  if (!compressed) throw new Error("Impossibile comprimere questa foto.");
  return compressed;
}

function activityName(activity: DailyActivity, copy: SiteCopy) {
  switch (activity.type) {
    case "text":
      return copy.textActivityLabel;
    case "photo":
      return copy.photoActivityLabel;
    case "choice":
      return copy.choiceActivityLabel;
    case "slider":
      return copy.sliderActivityLabel;
    case "riddle":
      return copy.riddleActivityLabel;
  }
}

export default function HomePage() {
  const [calendar, setCalendar] = useState<AdventCalendar>(DEFAULT_CALENDAR);
  const [entries, setEntries] = useState<MemoryBookEntry[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [currentDay, setCurrentDay] = useState(0);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [giftRevealed, setGiftRevealed] = useState(false);
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [answers, setAnswers] = useState<ResponseValues>({});
  const [photoUrls, setPhotoUrls] = useState<ResponseValues>({});
  const [photoBusyId, setPhotoBusyId] = useState("");
  const [saving, setSaving] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [nightBadge, setNightBadge] = useState(false);
  const copy = calendar.siteCopy;
  const navItems = [
    { tab: "home" as const, label: copy.homeTab, icon: copy.homeTabIcon },
    { tab: "advent" as const, label: copy.adventTab, icon: copy.adventTabIcon },
    { tab: "book" as const, label: copy.bookTab, icon: copy.bookTabIcon },
  ];

  const loadCalendar = useCallback(async () => {
    const response = await fetch("/api/calendar", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Calendario non disponibile.");
    setCalendar(data as AdventCalendar);
  }, []);

  const loadEntries = useCallback(async () => {
    const response = await fetch("/api/memory-book", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Libro non disponibile.");
    const nextEntries = data.entries as MemoryBookEntry[];
    setEntries((current) =>
      JSON.stringify(current) === JSON.stringify(nextEntries) ? current : nextEntries,
    );
  }, []);

  useEffect(() => {
    setCurrentDay(getCurrentAdventDay());
    const currentHour = Number(
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hourCycle: "h23",
        timeZone: "Europe/Rome",
      }).format(new Date()),
    );
    setNightBadge(currentHour >= 0 && currentHour < 3);
    void Promise.all([loadCalendar(), loadEntries()])
      .then(() => setError(""))
      .catch((cause: unknown) =>
        setError(cause instanceof Error ? cause.message : "Impossibile caricare il calendario."),
      );

    const refreshOnFocus = () => {
      if (document.visibilityState !== "visible") return;
      void loadCalendar().catch((cause: unknown) =>
        setError(cause instanceof Error ? cause.message : "Impossibile aggiornare il calendario."),
      );
      void loadEntries().catch((cause: unknown) =>
        setError(cause instanceof Error ? cause.message : "Impossibile aggiornare il libro."),
      );
    };

    const refreshInterval = window.setInterval(refreshOnFocus, 15_000);
    window.addEventListener("focus", refreshOnFocus);
    document.addEventListener("visibilitychange", refreshOnFocus);
    return () => {
      window.clearInterval(refreshInterval);
      window.removeEventListener("focus", refreshOnFocus);
      document.removeEventListener("visibilitychange", refreshOnFocus);
    };
  }, [loadCalendar, loadEntries]);

  useEffect(() => {
    if (activeTab !== "book") return;
    const refreshBookInterval = window.setInterval(() => {
      void loadEntries().catch((cause: unknown) =>
        setError(cause instanceof Error ? cause.message : "Impossibile aggiornare il libro."),
      );
    }, 20_000);
    return () => window.clearInterval(refreshBookInterval);
  }, [activeTab, loadEntries]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (activeDay !== null && (activeDay <= currentDay || calendar.previewMode)) {
      document.getElementById("giorno-selezionato")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeDay, calendar.previewMode, currentDay]);

  useEffect(() => {
    if (activeDay === null) return;
    const savedEntry = entries.find((entry) => entry.day === activeDay);
    setAnswers(savedEntry?.answers ?? {});
    setPhotoUrls(savedEntry?.photoUrls ?? {});
    setStatus("");
    setError("");
  }, [activeDay, entries]);

  const selectedDoor = useMemo(
    () => calendar.doors.find((door) => door.day === activeDay) ?? null,
    [activeDay, calendar.doors],
  );

  useEffect(() => {
    setGiftRevealed(false);
    setGiftModalOpen(false);
  }, [activeDay, selectedDoor?.imageUrl]);

  useEffect(() => {
    if (!giftModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setGiftModalOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [giftModalOpen]);

  const completedDays = useMemo(
    () => new Set(entries.map((entry) => entry.day)),
    [entries],
  );

  const christmasDayReached =
    new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "numeric",
      timeZone: "Europe/Rome",
    })
      .formatToParts(new Date())
      .some((part) => part.type === "month" && part.value === "12") &&
    new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "numeric",
      timeZone: "Europe/Rome",
    })
      .formatToParts(new Date())
      .some((part) => part.type === "day" && Number(part.value) >= 25);

  function chooseDay(day: number) {
    if (day > currentDay && !calendar.previewMode) {
      const daysRemaining = day - currentDay;
      const messages = copy.futureMessages.length
        ? copy.futureMessages
        : DEFAULT_SITE_COPY.futureMessages;
      const message = messages[Math.floor(Math.random() * messages.length)];
      setToast(message.replaceAll("{days}", String(daysRemaining)));
      return;
    }

    changeTab("advent", false);
    setActiveDay(day);
    setStatus("");
    setError("");
  }

  async function uploadMemoryPhoto(activityId: string, file?: File) {
    if (!file) return;
    setPhotoBusyId(activityId);
    setStatus(copy.photoPreparingStatus);
    setError("");
    try {
      if (!file.type.startsWith("image/")) {
        throw new Error(copy.imageValidationError);
      }
      const compressed = await preparePhoto(file);
      const formData = new FormData();
      formData.set("file", compressed, `ricordo-${activeDay}-${activityId}.webp`);
      const response = await fetch("/api/memory-book/photo", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Impossibile caricare la foto.");
      setPhotoUrls((current) => ({ ...current, [activityId]: data.imageUrl as string }));
      setStatus(copy.photoPreparedStatus);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossibile caricare la foto.");
      setStatus("");
    } finally {
      setPhotoBusyId("");
    }
  }

  async function saveDay() {
    if (!selectedDoor || activeDay === null) return;
    setSaving(true);
    setStatus(copy.saveInProgress);
    setError("");
    try {
      const response = await fetch("/api/memory-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: activeDay,
          answers,
          photoUrls,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Impossibile salvare la giornata.");
      setEntries((current) => [
        ...current.filter((entry) => entry.day !== activeDay),
        data.entry as MemoryBookEntry,
      ].sort((first, second) => first.day - second.day));
      setStatus(copy.daySavedStatus);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossibile salvare la giornata.");
      setStatus("");
    } finally {
      setSaving(false);
    }
  }

  async function downloadMemoryBook() {
    if (!christmasDayReached) return;
    setDownloadingPdf(true);
    setError("");
    try {
      const { createMemoryBookPdf } = await import("./lib/create-memory-book-pdf");
      const pdf = await createMemoryBookPdf(calendar, entries);
      pdf.save("Il-Nostro-Libro.pdf");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossibile creare il PDF.");
    } finally {
      setDownloadingPdf(false);
    }
  }

  function changeTab(tab: AppTab, resetVerticalScroll = true) {
    setActiveTab(tab);
    if (resetVerticalScroll) window.scrollTo(0, 0);
  }

  function renderActivity(activity: DailyActivity) {
    const value = answers[activity.id] ?? "";
    const photoUrl = photoUrls[activity.id] ?? "";

    return (
      <article className="mission-card" key={activity.id}>
        <div className="mission-title">
          <span className="mission-icon">
            {activity.type === "photo" ? <ImagePlus size={17} /> : <Sparkles size={17} />}
          </span>
          <div>
            <p>{activityName(activity, copy)}</p>
            {activity.required && <span>{copy.requiredActivityLabel}</span>}
          </div>
        </div>
        <h3>{activity.prompt || copy.emptyActivityPrompt}</h3>

        {activity.type === "text" && (
          <textarea
            className="answer-text"
            value={value}
            maxLength={5000}
            rows={4}
            placeholder={copy.textAnswerPlaceholder}
            onChange={(event) =>
              setAnswers((current) => ({ ...current, [activity.id]: event.target.value }))
            }
          />
        )}

        {activity.type === "riddle" && (
          <input
            className="answer-input"
            value={value}
            maxLength={200}
            placeholder={copy.riddleAnswerPlaceholder}
            onChange={(event) =>
              setAnswers((current) => ({ ...current, [activity.id]: event.target.value }))
            }
          />
        )}

        {activity.type === "choice" && (
          <div className="choice-list">
            {activity.options.map((option) => (
              <label className={`choice-option ${value === option ? "is-chosen" : ""}`} key={option}>
                <input
                  type="radio"
                  name={`choice-${activity.id}`}
                  value={option}
                  checked={value === option}
                  onChange={() =>
                    setAnswers((current) => ({ ...current, [activity.id]: option }))
                  }
                />
                <span>{option}</span>
                {value === option && <Check size={16} />}
              </label>
            ))}
            {activity.options.length === 0 && (
              <p className="mission-hint">{copy.emptyOptionsMessage}</p>
            )}
          </div>
        )}

        {activity.type === "slider" && (
          <div className="slider-response">
            <input
              type="range"
              min={1}
              max={activity.max ?? 100}
              value={value || 1}
              onChange={(event) =>
                setAnswers((current) => ({ ...current, [activity.id]: event.target.value }))
              }
            />
            <span>{value || "1"} / {activity.max ?? 100}</span>
          </div>
        )}

        {activity.type === "photo" && (
          <div className="memory-upload">
            {photoUrl && (
              <div className="memory-photo-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl} alt="Il tuo ricordo fotografico" />
                <button
                  type="button"
                  onClick={() =>
                    setPhotoUrls((current) => {
                      const next = { ...current };
                      delete next[activity.id];
                      return next;
                    })
                  }
                >
                  {copy.changePhotoAction}
                </button>
              </div>
            )}
            {!photoUrl && (
              <label className={`memory-upload-button ${photoBusyId === activity.id ? "is-uploading" : ""}`}>
                <ImagePlus size={17} />
                {photoBusyId === activity.id ? copy.photoUploadingStatus : copy.photoUploadAction}
                <input
                  type="file"
                  accept="image/*"
                  disabled={photoBusyId !== ""}
                  onChange={(event) => {
                    void uploadMemoryPhoto(activity.id, event.target.files?.[0]);
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            )}
            <span>{copy.photoCompressionNote}</span>
          </div>
        )}
      </article>
    );
  }

  return (
    <>
    <main className="app-shell" style={getSiteThemeStyle(calendar.theme)}>
      {nightBadge && (
        <div className="night-badge"><Sparkles size={14} /> {copy.nightMessage}</div>
      )}

      {error && <p className="notice error-notice app-error" role="alert">{error}</p>}

      {activeTab === "home" && (
        <section className="app-content home-view" id="home-panel" aria-label={copy.homeTab}>
            <header className="home-hero">
              <p className="eyebrow"><span /> {copy.homeEyebrow}</p>
              <p className="recipient">{calendar.recipient}</p>
              <h1>{copy.homeTitle || calendar.heading}</h1>
              <p className="home-story">{copy.homeStory}</p>
            </header>

            <div className="home-details" aria-label="I nostri piccoli traguardi">
              <article className="home-detail-card">
                <span>{copy.homeDaysLabel}</span>
                <strong>{calendar.doors.length}</strong>
                <small>1—25 DICEMBRE</small>
              </article>
              <article className="home-detail-card">
                <span>{copy.homeMemoriesLabel}</span>
                <strong>{entries.length}</strong>
                <small>{copy.bookTitle}</small>
              </article>
              <article className="home-detail-card">
                <span>{copy.homeNextChapterLabel}</span>
                <strong>{currentDay >= 25 ? "25" : String(Math.max(1, currentDay + 1)).padStart(2, "0")}</strong>
                <small>{currentDay >= 25 ? "NATALE" : "DICEMBRE"}</small>
              </article>
            </div>

            <button
              type="button"
              className="home-calendar-action"
              onClick={() => changeTab("advent")}
            >
              <span>{copy.homeCalendarAction}</span>
              <ChevronRight size={18} aria-hidden="true" />
            </button>

            <p className="closing-note">
              <LockKeyhole size={15} aria-hidden="true" />
              <span>{copy.closingMessage}</span>
            </p>
        </section>
      )}
      {activeTab === "advent" && (
        <section className="app-content advent-view" id="advent-panel" aria-label={copy.adventTab}>
          <div className="advent-hero">
            <p className="eyebrow"><span /> {copy.calendarEyebrow}</p>
            <p className="recipient">{calendar.recipient}</p>
            <h1>{calendar.heading}</h1>
            <p className="intro-description">{calendar.introduction}</p>
          </div>

          <div className="section-heading advent-section-heading">
            <div>
              <p className="eyebrow">{copy.dateRangeLabel}</p>
              <h2>{copy.adventSectionTitle}</h2>
            </div>
          </div>

          <div className="calendar-board calendar-board-25">
            {calendar.doors.map((door) => {
              const isUnlocked = door.day <= currentDay || calendar.previewMode;
              const isComplete = completedDays.has(door.day);
              return (
                <button
                  key={door.day}
                  type="button"
                  className={[
                    "door-card",
                    "calendar-step",
                    isUnlocked ? "step-unlocked" : "step-locked",
                    isComplete ? "step-completed" : "",
                    door.dayType === "large" ? "step-large" : "",
                    door.dayType === "medium" ? "step-medium" : "",
                    activeDay === door.day ? "step-selected" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => chooseDay(door.day)}
                  aria-label={
                    isComplete
                      ? `Giorno ${door.day}, completato`
                      : isUnlocked
                        ? `Apri il giorno ${door.day}`
                        : `Giorno ${door.day}, bloccato`
                  }
                >
                  <span className="door-topline">
                    <span className="door-date">{door.dayType === "large" ? copy.largeDoorLabel : door.dayType === "medium" ? copy.mediumDoorLabel : copy.decemberDoorLabel}</span>
                    <span className="step-type-icon">
                      {isComplete
                        ? copy.completedDoorIcon
                        : isUnlocked
                          ? copy.unlockedDoorIcon
                          : copy.lockedDoorIcon}
                    </span>
                  </span>
                  <span className="door-number">{String(door.day).padStart(2, "0")}</span>
                  <span className="door-label">
                    {isComplete ? copy.completedDoorLabel : isUnlocked ? copy.unlockedDoorLabel : copy.lockedDoorLabel}
                  </span>
                  <span className="door-decor" aria-hidden="true">{copy.doorDecorationSymbol}</span>
                </button>
              );
            })}
          </div>

          {selectedDoor && activeDay !== null && (activeDay <= currentDay || calendar.previewMode) && (
            <section className="selected-day-card" id="giorno-selezionato">
              <div className="selected-day-header">
                <div>
                  <p className="eyebrow">{copy.dayDateTemplate.replace("{day}", String(selectedDoor.day).padStart(2, "0"))}</p>
                  <h2>{selectedDoor.title || copy.defaultDayTitle}</h2>
                </div>
                <button
                  type="button"
                  className="close-day-button"
                  onClick={() => setActiveDay(null)}
                  aria-label={copy.closeDayAction}
                >
                  ×
                </button>
              </div>

              {selectedDoor.story && (
                <section className="day-story">
                  <h3><BookHeart size={17} /> {copy.storyHeading}</h3>
                  <p>{selectedDoor.story}</p>
                </section>
              )}

              {selectedDoor.physicalClue && (
                <section className="day-clue">
                  <h3><CircleHelp size={17} /> {copy.clueHeading}</h3>
                  <p>{selectedDoor.physicalClue}</p>
                </section>
              )}

              {selectedDoor.received && selectedDoor.imageUrl && (
                <section className="gift-reveal">
                  <p className="eyebrow"><Gift size={14} /> {copy.giftHeading}</p>
                  <button
                    type="button"
                    className="gift-wrap"
                    onClick={() => {
                      setGiftRevealed(false);
                      setGiftModalOpen(true);
                    }}
                    aria-haspopup="dialog"
                    aria-label={copy.giftRevealAction}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedDoor.imageUrl} alt={selectedDoor.title || `Regalo del ${selectedDoor.day} dicembre`} />
                    <span className="gift-wrap-cover" aria-hidden="true">
                      <span className="gift-wrap-symbol">{copy.unlockedDoorIcon}</span>
                      <span>{copy.giftCoverLabel}</span>
                    </span>
                  </button>
                  <p className="gift-reveal-hint">{copy.giftHiddenStatus}</p>
                  {selectedDoor.message && <p className="gift-reveal-message">{selectedDoor.message}</p>}
                </section>
              )}

              {selectedDoor.activities.length > 0 && (
                <section className="missions-section">
                  <div className="mission-section-title">
                    <Sparkles size={18} />
                    <div><h3>{copy.missionHeading}</h3><p>{copy.missionDescription}</p></div>
                  </div>
                  {selectedDoor.activities.map(renderActivity)}
                </section>
              )}

              {!selectedDoor.activities.length && (
                <p className="no-mission-note">
                  <Heart size={15} /> {copy.noMissionMessage}
                </p>
              )}

              <div className="save-day-area">
                {error && <p className="notice error-notice" role="alert">{error}</p>}
                {status && <p className="day-status-message" role="status"><Check size={15} /> {status}</p>}
                <button
                  type="button"
                  className="save-day-button"
                  onClick={() => void saveDay()}
                  disabled={saving || photoBusyId !== ""}
                >
                  {saving
                    ? copy.saveInProgress
                    : completedDays.has(selectedDoor.day)
                      ? copy.updateMemoryAction
                      : copy.completeDayAction}
                  <ChevronRight size={17} />
                </button>
              </div>
            </section>
          )}
        </section>
      )}
      {activeTab === "book" && (
        <section className="app-content book-view" id="book-panel" aria-label={copy.bookTab}>
          <div className="book-header">
            <p className="eyebrow"><span /> {copy.bookEyebrow}</p>
            <h1>{copy.bookTitle}</h1>
            <p>{copy.bookIntroduction}</p>
          </div>

          <div className="book-progress-card">
            <span className="book-progress-icon"><BookHeart size={20} /></span>
            <div>
              <strong>{copy.bookPageCounterTemplate.replace("{count}", String(entries.length))}</strong>
              <span>{copy.bookProgressMessage}</span>
            </div>
            <div className="book-progress-track"><span style={{ width: `${Math.min(100, entries.length * 4)}%` }} /></div>
          </div>

          <div className="book-pages">
            {calendar.doors.map((door) => {
              const entry = entries.find((item) => item.day === door.day);
              return (
                <article className={`book-page ${entry ? "book-page-ready" : "book-page-waiting"}`} key={door.day}>
                  <span className="book-page-date">{copy.bookDateTemplate.replace("{day}", String(door.day).padStart(2, "0"))}</span>
                  {entry ? (
                    <>
                      <h2>{door.title || copy.bookDayTitleTemplate.replace("{day}", String(door.day))}</h2>
                      {door.story && <p className="book-story">{door.story}</p>}
                      {door.received && door.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="book-gift-image" src={door.imageUrl} alt={door.title || "Regalo ricevuto"} />
                      )}
                      {door.activities.map((activity) => {
                        const answer = entry.answers[activity.id];
                        const imageUrl = entry.photoUrls[activity.id];
                        if (!answer && !imageUrl) return null;
                        return (
                          <div className="book-answer" key={activity.id}>
                            <strong>{activity.prompt || activityName(activity, copy)}</strong>
                            {answer && <p>{answer}</p>}
                            {imageUrl && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={imageUrl} alt={activity.prompt || "Ricordo fotografico"} />
                            )}
                          </div>
                        );
                      })}
                      {door.received && door.message && <p className="book-gift-note">{door.message}</p>}
                    </>
                  ) : (
                    <>
                      <div className="book-waiting-icon"><LockKeyhole size={19} /></div>
                      <h2>{copy.bookWaitingTitle}</h2>
                      <p>{copy.bookWaitingMessage.replace("{day}", String(door.day))}</p>
                    </>
                  )}
                </article>
              );
            })}
          </div>

          <button
            type="button"
            className="download-book-button"
            onClick={() => void downloadMemoryBook()}
            disabled={!christmasDayReached || downloadingPdf}
          >
            <BookHeart size={17} />
            {downloadingPdf
              ? copy.pdfProgress
              : christmasDayReached
                ? copy.pdfDownloadAction
                : copy.pdfLockedAction}
          </button>
          {error && <p className="notice error-notice app-error" role="alert">{error}</p>}
        </section>
      )}

      {toast && (
        <div className="toast-message" role="status">
          <LockKeyhole size={17} /> {toast}
        </div>
      )}
    </main>
      <nav
        className="bottom-navigation"
        style={getSiteThemeStyle(calendar.theme)}
        aria-label={copy.mainNavigationLabel}
      >
        <div className="nav-track">
          <span
            className="nav-indicator"
            style={{
              transform: `translateX(${activeTab === "home" ? 0 : activeTab === "advent" ? 100 : 200}%)`,
            }}
            aria-hidden="true"
          />
          {navItems.map(({ tab, label, icon }) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? "nav-tab is-active" : "nav-tab"}
              onClick={() => changeTab(tab)}
              aria-current={activeTab === tab ? "page" : undefined}
            >
              <span className="nav-tab-icon" aria-hidden="true">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>
      {giftModalOpen && selectedDoor?.received && selectedDoor.imageUrl && (
        <div
          className="gift-modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setGiftModalOpen(false);
          }}
        >
          <section
            className="gift-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gift-modal-title"
          >
            <div className="gift-modal-header">
              <div>
                <p className="eyebrow">{copy.dayDateTemplate.replace("{day}", String(selectedDoor.day).padStart(2, "0"))}</p>
                <h2 id="gift-modal-title">{copy.giftHeading}</h2>
              </div>
              <button
                type="button"
                className="gift-modal-close"
                onClick={() => setGiftModalOpen(false)}
                aria-label={copy.closeDayAction}
              >
                ×
              </button>
            </div>
            <button
              type="button"
              className={`gift-modal-stage ${giftRevealed ? "is-unwrapped" : ""}`}
              onClick={() => setGiftRevealed(true)}
              aria-expanded={giftRevealed}
              aria-label={giftRevealed ? copy.giftRevealedStatus : copy.giftRevealAction}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedDoor.imageUrl} alt={selectedDoor.title || `Regalo del ${selectedDoor.day} dicembre`} />
              {!giftRevealed && (
                <span className="gift-modal-cover" aria-hidden="true">
                  <span className="gift-modal-icon">{copy.unlockedDoorIcon}</span>
                  <span>{copy.giftCoverLabel}</span>
                </span>
              )}
            </button>
            <p className="gift-modal-status" role="status">
              {giftRevealed ? copy.giftRevealedStatus : copy.giftHiddenStatus}
            </p>
            {giftRevealed && selectedDoor.message && (
              <p className="gift-modal-message">{selectedDoor.message}</p>
            )}
            <button
              type="button"
              className="gift-modal-action"
              onClick={() => {
                if (giftRevealed) setGiftModalOpen(false);
                else setGiftRevealed(true);
              }}
            >
              {giftRevealed ? copy.closeDayAction : copy.giftCoverLabel}
            </button>
          </section>
        </div>
      )}
    </>
  );
}
