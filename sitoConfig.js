// npm run dev  // Per esportare statico e servirlo con Python:
// npm run build && next export -o out && python -m http.server 3000 --directory out
// sitoConfig.js
// Configurazione centrale completa e modulare.
// Ogni valore può essere modificato qui per cambiare il sito senza toccare `app/page.tsx`.

const sitoConfig = {
  // Visibilità delle sezioni della pagina
  visibilitaSezioni: {
    mostraHome: true,
    mostraChiSiamo: true,
    mostraMenu: true,
    mostraGalleria: true,
    mostraRecensioni: true,
    mostraInstagram: true,
    mostraContatti: true,
  },

  // INFORMAZIONI GENERALI
  infoGenerali: {
    nomeAttivita: "A.S.D. NOVA COMENSIS",
    logo: "assets/logo-nova-comensis.png",
    testoCopyright: "© A.S.D. NOVA COMENSIS",
    sitoUrl: "",
    linkMappe: "",
    linkInstagram: "https://www.instagram.com/nova.comensis/",
    linkFacebook: "",
    linkWhatsApp: "",
    linkLasciaRecensione: "",
    googlePlaceId: "",
    contatti: {
      indirizzo: "Via Adamello 18, Como (CO)",
      telefono: "",
      email: "novacomensis@gmail.com",
      orari: [
        { giorno: "Lunedì", orario: "" },
        { giorno: "Martedì", orario: "" },
        { giorno: "Mercoledì", orario: "" },
        { giorno: "Giovedì", orario: "" },
        { giorno: "Venerdì", orario: "" },
        { giorno: "Sabato", orario: "" },
        { giorno: "Domenica", orario: "" },
      ],
    },
  },

  // Contatti (singoli valori per binding semplice)
  contatti: {
    indirizzo: "Via Adamello 18, Como (CO)",
    telefono: "",
    email: "novacomensis@gmail.com",
  },

  // Orari: array generico
  orari: [
    { giorno: "Lunedì", orario: "11:00 – 22:00" },
    { giorno: "Martedì", orario: "11:00 – 22:00" },
    { giorno: "Mercoledì", orario: "11:00 – 22:00" },
    { giorno: "Giovedì", orario: "11:00 – 22:00" },
    { giorno: "Venerdì", orario: "11:00 – 22:00" },
    { giorno: "Sabato", orario: "11:00 – 22:00" },
    { giorno: "Domenica", orario: "11:00 – 22:00" },
  ],

  // Navbar
 navbar: {
    etichettaBottone: "Ordina Ora",
    linkBottone: "tel:+393932985493",
    brandTesto: "LOVE STREET FOOD",
    brandAccentTesto: "TRIESTE",
    brandTestoColore: "#FDF9EF",
    brandAccentColore: "#4f89c0",
  },

  // Hero
  testiHero: {
    preTitle: "",
    riga1: "NOVA COMENSIS",
    riga2: "La squadra più social di Como",
    riga3: "",
    sottotitolo: "Calcio a 7, CSI - Como. Allenamenti, partite e contenuti social.",
    btnPrimario: "Scopri il Club",
    btnPrimarioHref: "#chi-siamo",
    btnSecondario: "Contattaci",
    btnSecondarioHref: "#contatti",
  },

  // Sezione Chi Siamo
  sezioneChiSiamo: {
    preTitolo: "Chi Siamo",
    titoloPrincipale: "A.S.D. NOVA COMENSIS",
    testoEvidenziato: "",
    paragrafo1: "L'A.S.D. Nova Comensis nasce dalla passione per lo sport di squadra e dalla voglia di innovare la narrazione calcistica locale. Segui allenamenti, matchday e contenuti esclusivi.",
    paragrafo2: "",
    paragrafo3: "",
    titoloAsporto: "",
    testoLinkUdine: "",
    linkUdine: "",
  },

  // Sezione Menu
  // Menu removed — site uses `teamInfo`, `heroNova`, `galleriaNova`, `sponsorsNova`, `contattiNova` for Nova Comensis
  sezioneMenu: null,

  // Legacy gallery removed — use `galleriaNova.slots`
  sezioneGalleria: null,

  // Legacy Instagram section removed — use `contattiNova.instagram` or social blocks
  sezioneInstagram: null,

  // Legacy contacts removed — use `contattiNova` and `infoGenerali.contatti` instead
  sezioneContatti: null,

  // Legacy reviews removed
  sezioneRecensioni: null,

  // Design e colori (mantenuto)
  design_e_colori: {
    fontTitoli: "Chakra Petch",
    fontTesto: "Montserrat",

    // PALETTE UFFICIALE NOVA
    coloriGenerali: {
      bluReale: "#0055B8",
      navy: "#0B1B36",
      oro: "#C59B27",
      ciano: "#1E90FF",
      bianco: "#FFFFFF",
    },

    // Sezioni con i colori realmente usati dal layout
    sezioni: {
      navbar: {
        background: "#0B1B36",
        text: "#FFFFFF",
        title: "#0055B8",
        accent: "#C59B27",
        border: "#C59B27",
        buttonBg: "#0055B8",
        buttonText: "#FFFFFF",
        mobileText: "#FFFFFF",
        mobileButtonBg: "#0055B8",
        mobileButtonText: "#FFFFFF",
        mobileBorder: "#1E90FF",
      },
      hero: {
        background: "#0B1B36",
        text: "#FFFFFF",
        title: "#0055B8",
        accent: "#C59B27",
        border: "#1E90FF",
        buttonBg: "#C59B27",
        buttonText: "#0B1B36",
      },
      chiSiamo: {
        background: "#FFFFFF",
        text: "#0B1B36",
        title: "#0055B8",
        accent: "#1E90FF",
        border: "#1E90FF",
      },
      menu: {
        background: "#0B1B36",
        text: "#FFFFFF",
        title: "#1E90FF",
        accent: "#C59B27",
        border: "#C59B27",
        barBg: "#1E90FF",
        barText: "#FFFFFF",
        barBorder: "#1E90FF",
      },
      galleria: {
        background: "#FFFFFF",
        text: "#0B1B36",
        title: "#0055B8",
        accent: "#1E90FF",
        border: "#C59B27",
      },
      recensioni: {
        background: "#0B1B36",
        text: "#FFFFFF",
        title: "#C59B27",
        accent: "#0055B8",
        border: "#C59B27",
        buttonBg: "#1E90FF",
        buttonText: "#FFFFFF",
      },
      instagram: {
        background: "#16110D",
        text: "#FFFFFF",
        title: "#C59B27",
        accent: "#0055B8",
        border: "#C59B27",
        buttonBg: "#C59B27",
        buttonText: "#FFFFFF",
      },
      contatti: {
        background: "#FFFFFF",
        text: "#0B1B36",
        title: "#0055B8",
        accent: "#C59B27",
        border: "#C59B27",
        buttonBg: "#C59B27",
        buttonText: "#FFFFFF",
        secondaryBg: "#0B1B36",
        secondaryText: "#FFFFFF",
      },
      footer: {
        background: "#0B1B36",
        text: "#FFFFFF",
        title: "#C59B27",
        accent: "#C59B27",
        border: "#C59B27",
      },
    },
  },

  // Slot immagini centralizzato (tutte le immagini provengono da public/cartella-foto)
  slotImmagini: {
    logo: "assets/logo-nova-comensis.png",
    heroBg: "assets/hero-bg.png",
    gallery: [
      "assets/gallery/foto-1.png",
      "assets/gallery/foto-2.png",
      "assets/gallery/foto-3.png",
      "assets/gallery/foto-4.png",
    ],
    // array con tutte le immagini (inclusi logo e hero)
    all: [
      "assets/logo-nova-comensis.png",
      "assets/hero-bg.png",
      "assets/gallery/foto-1.png",
      "assets/gallery/foto-2.png",
      "assets/gallery/foto-3.png",
      "assets/gallery/foto-4.png",
    ]
  },
  // --- Nova Comensis specific dynamic content (merged from provided data.json)
  teamInfo: {
    name: "A.S.D. NOVA COMENSIS",
    slogan: "La squadra più social di Como",
    foundationDate: "26 Maggio 2025",
    league: "CSI Calcio a 7 - Serie C Open (Como)",
    cf: "95150890135",
    presidents: ["Claudio Galli", "Lorenzo Ferro"],
    coach: "Casciaro",
    logo: "assets/logo-nova-comensis.png",
  },
  heroNova: {
    title: "NOVA COMENSIS",
    subtitle: "La squadra più social di Como",
    buttonText: "Scopri il Club",
    bgImage: "assets/hero-bg.png",
  },
  chiSiamoNova: {
    title: "Chi Siamo",
    description: "L'A.S.D. Nova Comensis nasce dalla passione per lo sport di squadra e dalla voglia di innovare la narrazione calcistica locale. Oltre al campo da calcio a 7 nel campionato CSI, raccontiamo ogni settimana il dietro le quinte, gli allenamenti e lo spogliatoio con contenuti video moderni per la nostra community."
  },
  prossimePartite: [
    {
      id: "match-1",
      date: "10 Ottobre 2026 - 21:15",
      location: "Centro Sportivo Tavernola, Via Adamello 18, Como",
      sqHOME: "",
      sqAWAY: "FC Gottro"
    },
    {
      id: "match-2",
      date: "1 Settembre 2026 - 21:15",
      location: "Centro Sportivo Tavernola, Via Adamello 18, Como",
      sqHOME: "",
      sqAWAY: "FC Gottro"
    },
    {
      id: "match-3",
      date: "17 Ottobre 2026 - 20:30",
      location: "Via Mantegna, Como",
      sqHOME: "Comense 1910",
      sqAWAY: ""
    }
  ],
  galleriaNova: {
    slots: [
      { id: "foto-1", file: "assets/gallery/foto-1.png", caption: "Prima Squadra" },
      { id: "foto-2", file: "assets/gallery/foto-2.png", caption: "Matchday" },
      { id: "foto-3", file: "assets/gallery/foto-3.png", caption: "Allenamento" },
      { id: "foto-4", file: "assets/gallery/foto-4.png", caption: "Spogliatoio" }
    ]
  },
  sponsorsNova: [
    { id: "sponsor-1", name: "Foeh Tattoo", logo: "assets/sponsors/sponsor-1.png", url: "#" },
    { id: "sponsor-2", name: "O.F. Baradello", logo: "assets/sponsors/sponsor-2.png", url: "#" },
    { id: "sponsor-3", name: "Guasta Road", logo: "assets/sponsors/sponsor-3.png", url: "#" },
    { id: "sponsor-4", name: "Giulietta al lago", logo: "assets/sponsors/sponsor-4.png", url: "#" },
    { id: "sponsor-5", name: "Zeus", logo: "assets/sponsors/sponsor-5.png", url: "#" }
  ],
  contattiNova: {
    email: "novacomensis@gmail.com",
    instagram: "https://www.instagram.com/nova.comensis/",
    youtube: "https://www.youtube.com/@nova.comensis",
    legalAddress: "Via Tommaso Malvito 3, 22100 Como (CO)",
    stadiumName: "Centro Sportivo del Tavernola",
    stadiumAddress: "Via Adamello 18, Como (CO)",
    mapsUrl: "https://maps.google.com/?q=Via+Adamello+18+Como"
  },
  // Storia / Fondatori / Notizie (modificabili dall'admin)
  storia: {
    intro: "L'A.S.D. Nova Comensis è nata dalla voglia di creare una comunità calcistica giovane e appassionata.",
    full: "Fondata da un gruppo di amici e appassionati, Nova Comensis unisce la tradizione sportiva locale con nuove idee digitali per raccontare il mondo del calcio amatoriale.",
    heroFoto: "assets/storia/storia-1.png"
  },
  fondatori: [
    { name: "Claudio Galli", role: "Presidente", photo: "assets/fondatori/fondatore-1.png", bio: "Co-fondatore e presidente." },
    { name: "Lorenzo Ferro", role: "Co-fondatore", photo: "assets/fondatori/fondatore-2.png", bio: "Responsabile comunicazione." }
  ],
  news: [
    { slug: "primavera-ritiro", title: "Inizio ritiro primaverile", date: "14 Agosto 2026", excerpt: "Comincia il ritiro estivo...", content: "Dettagli dell'evento e programma completo.", image: "assets/news/news-1.png" },
    { slug: "nuovo-giocatore", title: "Benvenuto al nuovo giocatore", date: "1 Luglio 2026", excerpt: "Accogliamo un nuovo talento nella rosa.", content: "Profilo del giocatore, statistiche e ruolo.", image: "assets/news/news-2.png" }
  ],
};

// Helper per ottenere il link a Google Fonts
sitoConfig.getGoogleFontsLink = function () {
  const families = [];
  if (this.design_e_colori?.fontTitoli) families.push(this.design_e_colori.fontTitoli.replace(/ /g, "+") + ":wght@400;700");
  if (this.design_e_colori?.fontTesto) families.push(this.design_e_colori.fontTesto.replace(/ /g, "+") + ":wght@300;400;600");
  if (families.length === 0) return "";
  return `https://fonts.googleapis.com/css2?family=${families.join("&family=")}&display=swap`;
};

export default sitoConfig;
