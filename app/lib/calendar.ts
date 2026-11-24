import initialConfig from "../../sitoConfig.json";

export type AdventDoor = {
  day: number;
  title: string;
  message: string;
  imageUrl: string;
  received: boolean;
  dayType: "small" | "medium" | "large";
  story: string;
  physicalClue: string;
  bigChest: boolean;
  chestAmount: number;
  activities: DailyActivity[];
};

export type DailyActivity = {
  id: string;
  type: "text" | "photo" | "choice" | "slider" | "riddle";
  prompt: string;
  required: boolean;
  options: string[];
  max: number | null;
  answer: string;
};

export type AdventDayType = AdventDoor["dayType"];
export type DailyActivityType = DailyActivity["type"];

export type SiteTheme = {
  background: string;
  surface: string;
  text: string;
  primary: string;
  primaryDark: string;
  primarySoft: string;
  accent: string;
  gold: string;
  muted: string;
  line: string;
  backgroundImage: string;
};

export type SiteCopy = {
  brand: string;
  topbarNote: string;
  nightMessage: string;
  calendarEyebrow: string;
  unlockedDaysLabel: string;
  dateRangeLabel: string;
  adventSectionTitle: string;
  memoriesLabel: string;
  requiredActivityLabel: string;
  textActivityLabel: string;
  photoActivityLabel: string;
  choiceActivityLabel: string;
  sliderActivityLabel: string;
  riddleActivityLabel: string;
  textAnswerPlaceholder: string;
  riddleAnswerPlaceholder: string;
  emptyOptionsMessage: string;
  changePhotoAction: string;
  photoUploadAction: string;
  photoUploadingStatus: string;
  photoCompressionNote: string;
  siteTitleAccessible: string;
  pwaDescription: string;
  closeDayAction: string;
  mainNavigationLabel: string;
  completedDoorLabel: string;
  largeDoorLabel: string;
  mediumDoorLabel: string;
  decemberDoorLabel: string;
  unlockedDoorLabel: string;
  lockedDoorLabel: string;
  dayDateTemplate: string;
  defaultDayTitle: string;
  storyHeading: string;
  clueHeading: string;
  giftHeading: string;
  giftRevealAction: string;
  giftCoverLabel: string;
  giftHideAction: string;
  giftRevealedStatus: string;
  giftHiddenStatus: string;
  missionHeading: string;
  missionDescription: string;
  noMissionMessage: string;
  emptyActivityPrompt: string;
  saveInProgress: string;
  photoPreparingStatus: string;
  photoPreparedStatus: string;
  daySavedStatus: string;
  imageValidationError: string;
  updateMemoryAction: string;
  completeDayAction: string;
  bookEyebrow: string;
  bookTitle: string;
  bookIntroduction: string;
  bookPageCounterTemplate: string;
  bookProgressMessage: string;
  bookDateTemplate: string;
  bookDayTitleTemplate: string;
  bookWaitingTitle: string;
  bookWaitingMessage: string;
  pdfProgress: string;
  pdfDownloadAction: string;
  pdfLockedAction: string;
  pdfHeaderTemplate: string;
  pdfDateTemplate: string;
  pdfClueLabel: string;
  pdfGiftMessageLabel: string;
  pdfGiftPhotoLabelTemplate: string;
  pdfMemoryLabel: string;
  pdfWaitingMessage: string;
  pdfFooter: string;
  pdfPageNumberTemplate: string;
  pdfOverflowMessage: string;
  pdfPhotoDownloadError: string;
  pdfPhotoHttpErrorTemplate: string;
  pdfPhotoCanvasError: string;
  homeEyebrow: string;
  homeTitle: string;
  homeStory: string;
  homeDaysLabel: string;
  homeMemoriesLabel: string;
  homeNextChapterLabel: string;
  homeCalendarAction: string;
  homeTab: string;
  homeTabIcon: string;
  adventTab: string;
  bookTab: string;
  adventTabIcon: string;
  bookTabIcon: string;
  unlockedDoorIcon: string;
  lockedDoorIcon: string;
  completedDoorIcon: string;
  doorDecorationSymbol: string;
  closingMessage: string;
  futureMessages: string[];
};

export const DEFAULT_SITE_COPY: SiteCopy = {
  brand: "UN DICEMBRE PER NOI",
  topbarNote: "fatto con amore",
  nightMessage: "messaggio segreto per la mia nottambula",
  calendarEyebrow: "IL TUO CALENDARIO DELL'AVVENTO",
  unlockedDaysLabel: "giorni sbloccati",
  dateRangeLabel: "1—25 DICEMBRE",
  adventSectionTitle: "Ogni giorno, un pezzetto di noi",
  memoriesLabel: "ricordi",
  requiredActivityLabel: "Da completare",
  textActivityLabel: "Il tuo pensiero",
  photoActivityLabel: "Una foto per noi",
  choiceActivityLabel: "La tua scelta",
  sliderActivityLabel: "Il tuo voto",
  riddleActivityLabel: "La risposta all'enigma",
  textAnswerPlaceholder: "Scrivi qui il tuo pensiero…",
  riddleAnswerPlaceholder: "La parola scritta sul bigliettino…",
  emptyOptionsMessage: "Le opzioni arriveranno presto. Torna a trovarmi 💚",
  changePhotoAction: "Cambia foto",
  photoUploadAction: "Scegli una foto",
  photoUploadingStatus: "Carico e comprimo…",
  photoCompressionNote: "La foto viene compressa sul dispositivo prima del caricamento.",
  siteTitleAccessible: "Un dicembre per noi",
  pwaDescription: "Un calendario dell'Avvento pieno di piccole sorprese.",
  closeDayAction: "Chiudi il giorno",
  mainNavigationLabel: "Navigazione principale",
  completedDoorLabel: "ricordo salvato",
  largeDoorLabel: "speciale",
  mediumDoorLabel: "MEDIO",
  decemberDoorLabel: "DIC",
  unlockedDoorLabel: "apri la tappa",
  lockedDoorLabel: "da scoprire",
  dayDateTemplate: "GIORNO {day} · DICEMBRE",
  defaultDayTitle: "Un nuovo capitolo di noi",
  storyHeading: "Il capitolo di oggi",
  clueHeading: "Cerca il pacchetto",
  giftHeading: "IL TUO REGALO DI OGGI",
  giftRevealAction: "Tocca per scartare e scoprire il regalo.",
  giftCoverLabel: "Tocca per scartare",
  giftHideAction: "Regalo svelato. Tocca per coprirlo di nuovo.",
  giftRevealedStatus: "Il tuo regalo è svelato.",
  giftHiddenStatus: "Una piccola sorpresa ti aspetta.",
  missionHeading: "La nostra piccola missione",
  missionDescription: "I tuoi momenti diventano pagine del libro.",
  noMissionMessage: "Oggi niente missioni extra: goditi la sorpresa e il nostro capitolo.",
  emptyActivityPrompt: "Una piccola missione per te",
  saveInProgress: "Salvo…",
  photoPreparingStatus: "Preparo la foto…",
  photoPreparedStatus: "Foto pronta. Salva la giornata per aggiungerla al libro.",
  daySavedStatus: "Giornata completata: il ricordo è nel vostro libro 💚",
  imageValidationError: "Scegli un file immagine.",
  updateMemoryAction: "Aggiorna il ricordo",
  completeDayAction: "Completa la giornata",
  bookEyebrow: "I NOSTRI RICORDI",
  bookTitle: "Il Nostro Libro",
  bookIntroduction: "Un pezzetto di noi, una pagina alla volta.",
  bookPageCounterTemplate: "{count} di 25 pagine",
  bookProgressMessage: "Il nostro libro sta prendendo forma.",
  bookDateTemplate: "DICEMBRE · {day}",
  bookDayTitleTemplate: "Il nostro giorno {day}",
  bookWaitingTitle: "Questo ricordo deve ancora arrivare",
  bookWaitingMessage: "La pagina del {day} dicembre è pronta ad aspettarci.",
  pdfProgress: "Creo il vostro libro…",
  pdfDownloadAction: "Scarica il nostro libro in PDF",
  pdfLockedAction: "Il libro si scarica il 25 dicembre",
  pdfHeaderTemplate: "{brand} · PAGINA {day}",
  pdfDateTemplate: "Il {day} dicembre",
  pdfClueLabel: "L'indizio per il pacchetto",
  pdfGiftMessageLabel: "Il biglietto del regalo",
  pdfGiftPhotoLabelTemplate: "Regalo · {title}",
  pdfMemoryLabel: "Il nostro ricordo",
  pdfWaitingMessage: "Questa giornata aspetta ancora la sua pagina.",
  pdfFooter: "Con tutto il mio amore",
  pdfPageNumberTemplate: "{day} / 25",
  pdfOverflowMessage: "Il contenuto del {day} dicembre è troppo lungo per una pagina. Accorcia la storia o le risposte e riprova.",
  pdfPhotoDownloadError: "Non riesco a scaricare una delle foto. Controlla la connessione e riprova.",
  pdfPhotoHttpErrorTemplate: "Una foto del libro non è raggiungibile (errore {status}).",
  pdfPhotoCanvasError: "Impossibile preparare una foto per il PDF.",
  homeEyebrow: "UNA STORIA TUTTA NOSTRA",
  homeTitle: "Il nostro piccolo dicembre",
  homeStory: "Qui comincia il nostro dicembre, fatto di piccole sorprese e ricordi da custodire.",
  homeDaysLabel: "giorni da vivere insieme",
  homeMemoriesLabel: "ricordi nel libro",
  homeNextChapterLabel: "prossimo capitolo",
  homeCalendarAction: "Scopri il calendario",
  homeTab: "Home",
  homeTabIcon: "🏠",
  adventTab: "Avvento",
  bookTab: "Il Nostro Libro",
  adventTabIcon: "🎄",
  bookTabIcon: "📖",
  unlockedDoorIcon: "🎁",
  lockedDoorIcon: "🔒",
  completedDoorIcon: "✓",
  doorDecorationSymbol: "✦",
  closingMessage: "Le sorprese più belle hanno bisogno di un po’ di attesa. Ogni giorno avrà il suo momento.",
  futureMessages: [
    "Non fare la furba, mancano ancora {days} giorni! Torna più tardi 🎁",
    "Il Grinch ti sta guardando… ci vediamo tra {days} giorni!",
    "Piano, curiosona: ancora {days} giorni di attesa 💚",
    "Questo pacchetto non scappa. Mancano {days} giorni ✨",
  ],
};

export const DEFAULT_SITE_THEME: SiteTheme = {
  background: "#5a0404",
  surface: "#6b1111",
  text: "#fff8f3",
  primary: "#5a0404",
  primaryDark: "#fff3ed",
  primarySoft: "#842121",
  accent: "#ffd1c6",
  gold: "#f0ca7b",
  muted: "#ead8d2",
  line: "#a75b56",
  backgroundImage: "/sfondo%20sito.png",
};

const largeChestAmounts: Record<number, number> = {
  5: 10,
  10: 15,
  15: 20,
  20: 25,
  25: 30,
};

function defaultDoor(day: number): AdventDoor {
  const chestAmount = largeChestAmounts[day] ?? 0;
  return {
    day,
    title: "",
    message: "",
    imageUrl: "",
    received: false,
    dayType: chestAmount > 0 ? "large" : "small",
    story: "",
    physicalClue: "",
    bigChest: chestAmount > 0,
    chestAmount,
    activities: [],
  };
}

function parseActivity(value: unknown, day: number, index: number): DailyActivity {
  if (!value || typeof value !== "object") {
    throw new Error(`L'attività ${index + 1} del giorno ${day} non è valida.`);
  }

  const activity = value as Partial<DailyActivity>;
  const supportedTypes: DailyActivityType[] = ["text", "photo", "choice", "slider", "riddle"];
  if (
    typeof activity.id !== "string" ||
    !supportedTypes.includes(activity.type as DailyActivityType) ||
    typeof activity.prompt !== "string" ||
    typeof activity.required !== "boolean" ||
    !Array.isArray(activity.options) ||
    !activity.options.every((option) => typeof option === "string") ||
    (activity.max !== null && typeof activity.max !== "number") ||
    typeof activity.answer !== "string"
  ) {
    throw new Error(`L'attività ${index + 1} del giorno ${day} non è valida.`);
  }

  return {
    id: activity.id.slice(0, 80),
    type: activity.type as DailyActivityType,
    prompt: activity.prompt.slice(0, 1000),
    required: activity.required,
    options: activity.options
      .slice(0, 20)
      .map((option) => option.slice(0, 200).trim())
      .filter(Boolean),
    max:
      activity.max !== null && Number.isFinite(activity.max)
        ? Math.max(1, Math.min(1_000_000, Math.floor(activity.max)))
        : null,
    answer: activity.answer.slice(0, 200),
  };
};

export type AdventCalendar = {
  recipient: string;
  heading: string;
  introduction: string;
  previewMode: boolean;
  siteCopy: SiteCopy;
  theme: SiteTheme;
  doors: AdventDoor[];
};

export function parseCalendar(value: unknown): AdventCalendar {
  if (!value || typeof value !== "object") {
    throw new Error("La configurazione del calendario non è valida.");
  }

  const candidate = value as Partial<AdventCalendar>;
  if (
    typeof candidate.recipient !== "string" ||
    typeof candidate.heading !== "string" ||
    typeof candidate.introduction !== "string" ||
    (candidate.previewMode !== undefined && typeof candidate.previewMode !== "boolean") ||
    (candidate.siteCopy !== undefined &&
      (!candidate.siteCopy ||
        typeof candidate.siteCopy !== "object" ||
        Array.isArray(candidate.siteCopy))) ||
    (candidate.theme !== undefined &&
      (!candidate.theme ||
        typeof candidate.theme !== "object" ||
        Array.isArray(candidate.theme))) ||
    !Array.isArray(candidate.doors) ||
    (candidate.doors.length !== 24 && candidate.doors.length !== 25)
  ) {
    throw new Error("La configurazione deve contenere i testi e tutte le 25 caselle.");
  }

  const siteCopy = {
    ...DEFAULT_SITE_COPY,
    ...(candidate.siteCopy ?? {}),
  } as SiteCopy;
  const siteCopyTextKeys: Array<Exclude<keyof SiteCopy, "futureMessages">> = [
    "brand",
    "topbarNote",
    "nightMessage",
    "calendarEyebrow",
    "unlockedDaysLabel",
    "dateRangeLabel",
    "adventSectionTitle",
    "memoriesLabel",
    "requiredActivityLabel",
    "textActivityLabel",
    "photoActivityLabel",
    "choiceActivityLabel",
    "sliderActivityLabel",
    "riddleActivityLabel",
    "textAnswerPlaceholder",
    "riddleAnswerPlaceholder",
    "emptyOptionsMessage",
    "changePhotoAction",
    "photoUploadAction",
    "photoUploadingStatus",
    "photoCompressionNote",
    "siteTitleAccessible",
    "pwaDescription",
    "closeDayAction",
    "mainNavigationLabel",
    "completedDoorLabel",
    "largeDoorLabel",
    "mediumDoorLabel",
    "decemberDoorLabel",
    "unlockedDoorLabel",
    "lockedDoorLabel",
    "dayDateTemplate",
    "defaultDayTitle",
    "storyHeading",
    "clueHeading",
    "giftHeading",
    "giftRevealAction",
    "giftCoverLabel",
    "giftHideAction",
    "giftRevealedStatus",
    "giftHiddenStatus",
    "missionHeading",
    "missionDescription",
    "noMissionMessage",
    "emptyActivityPrompt",
    "saveInProgress",
    "photoPreparingStatus",
    "photoPreparedStatus",
    "daySavedStatus",
    "imageValidationError",
    "updateMemoryAction",
    "completeDayAction",
    "bookEyebrow",
    "bookTitle",
    "bookIntroduction",
    "bookPageCounterTemplate",
    "bookProgressMessage",
    "bookDateTemplate",
    "bookDayTitleTemplate",
    "bookWaitingTitle",
    "bookWaitingMessage",
    "pdfProgress",
    "pdfDownloadAction",
    "pdfLockedAction",
    "pdfHeaderTemplate",
    "pdfDateTemplate",
    "pdfClueLabel",
    "pdfGiftMessageLabel",
    "pdfGiftPhotoLabelTemplate",
    "pdfMemoryLabel",
    "pdfWaitingMessage",
    "pdfFooter",
    "pdfPageNumberTemplate",
    "pdfOverflowMessage",
    "pdfPhotoDownloadError",
    "pdfPhotoHttpErrorTemplate",
    "pdfPhotoCanvasError",
    "homeEyebrow",
    "homeTitle",
    "homeStory",
    "homeDaysLabel",
    "homeMemoriesLabel",
    "homeNextChapterLabel",
    "homeCalendarAction",
    "homeTab",
    "homeTabIcon",
    "adventTab",
    "bookTab",
    "adventTabIcon",
    "bookTabIcon",
    "unlockedDoorIcon",
    "lockedDoorIcon",
    "completedDoorIcon",
    "doorDecorationSymbol",
    "closingMessage",
  ];
  for (const key of siteCopyTextKeys) {
    if (typeof siteCopy[key] !== "string") {
      throw new Error(`Il testo di configurazione "${key}" non è valido.`);
    }
    siteCopy[key] = siteCopy[key].slice(0, 1000);
  }
  if (
    !Array.isArray(siteCopy.futureMessages) ||
    !siteCopy.futureMessages.every((message) => typeof message === "string")
  ) {
    throw new Error("I messaggi delle caselle bloccate non sono validi.");
  }
  siteCopy.futureMessages = siteCopy.futureMessages
    .slice(0, 20)
    .map((message) => message.slice(0, 300));

  const theme = {
    ...DEFAULT_SITE_THEME,
    ...(candidate.theme ?? {}),
  } as SiteTheme;
  const themeColorKeys: Array<Exclude<keyof SiteTheme, "backgroundImage">> = [
    "background",
    "surface",
    "text",
    "primary",
    "primaryDark",
    "primarySoft",
    "accent",
    "gold",
    "muted",
    "line",
  ];
  for (const key of themeColorKeys) {
    if (typeof theme[key] !== "string" || !/^#[\da-fA-F]{6}$/.test(theme[key])) {
      throw new Error(`Il colore di configurazione "${key}" non è valido.`);
    }
  }
  if (
    typeof theme.backgroundImage !== "string" ||
    !/^\/[a-zA-Z0-9._%\- ]+$/.test(theme.backgroundImage)
  ) {
    throw new Error("Il percorso dell'immagine di sfondo non è valido.");
  }
  theme.backgroundImage = theme.backgroundImage.slice(0, 200);

  const doors = Array.from({ length: 25 }, (_, index) => {
    const day = index + 1;
    const defaults = defaultDoor(day);
    const door = candidate.doors?.[index];
    if (!door && index === 24) return defaults;

    if (
      !door ||
      typeof door !== "object" ||
      door.day !== day ||
      typeof door.title !== "string" ||
      typeof door.message !== "string" ||
      typeof door.imageUrl !== "string" ||
      typeof door.received !== "boolean" ||
      (door.dayType !== undefined &&
        door.dayType !== "small" &&
        door.dayType !== "medium" &&
        door.dayType !== "large") ||
      (door.story !== undefined && typeof door.story !== "string") ||
      (door.physicalClue !== undefined && typeof door.physicalClue !== "string") ||
      (door.bigChest !== undefined && typeof door.bigChest !== "boolean") ||
      (door.chestAmount !== undefined &&
        (typeof door.chestAmount !== "number" ||
          !Number.isFinite(door.chestAmount) ||
          door.chestAmount < 0 ||
          door.chestAmount > 100_000)) ||
      (door.activities !== undefined && !Array.isArray(door.activities))
    ) {
      throw new Error(`La configurazione della casella ${day} non è valida.`);
    }

    const activities = door.activities ?? [];
    if (activities.length > 10) {
      throw new Error(`Il giorno ${day} può contenere al massimo 10 attività.`);
    }

    return {
      day,
      title: door.title.slice(0, 100),
      message: door.message.slice(0, 3000),
      imageUrl: door.imageUrl.slice(0, 2048),
      received: door.received,
      dayType: door.dayType ?? defaults.dayType,
      story: (door.story ?? "").slice(0, 5000),
      physicalClue: (door.physicalClue ?? "").slice(0, 1000),
      bigChest: door.bigChest ?? defaults.bigChest,
      chestAmount: door.chestAmount ?? defaults.chestAmount,
      activities: activities.map((activity, activityIndex) =>
        parseActivity(activity, day, activityIndex),
      ),
    };
  });

  return {
    recipient: candidate.recipient.slice(0, 80),
    heading: candidate.heading.slice(0, 120),
    introduction: candidate.introduction.slice(0, 300),
    previewMode: candidate.previewMode ?? false,
    siteCopy,
    theme,
    doors,
  };
}

export const DEFAULT_CALENDAR = parseCalendar(initialConfig);

export function getCurrentAdventDay(now = new Date()): number {
  const dateParts = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "numeric",
    timeZone: "Europe/Rome",
  }).formatToParts(now);
  const month = Number(dateParts.find((part) => part.type === "month")?.value);
  const day = Number(dateParts.find((part) => part.type === "day")?.value);
  return month === 12 ? Math.min(day, 25) : 0;
}

export function publicCalendar(calendar: AdventCalendar): AdventCalendar {
  const currentDay = calendar.previewMode ? 25 : getCurrentAdventDay();

  return {
    ...calendar,
    doors: calendar.doors.map((door) => {
      if (door.day > currentDay) {
        return {
          ...door,
          title: "",
          message: "",
          imageUrl: "",
          received: false,
          story: "",
          physicalClue: "",
          activities: [],
        };
      }

      return {
        ...door,
        title: door.received ? door.title : "",
        message: door.received ? door.message : "",
        imageUrl: door.received ? door.imageUrl : "",
        activities: door.activities.map((activity) => ({ ...activity, answer: "" })),
      };
    }),
  };
}
