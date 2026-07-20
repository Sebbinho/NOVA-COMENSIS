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
    nomeAttivita: "Love Street Food Trieste",
    logo: "/cartella-foto/logo.jpg",
    testoCopyright: "© Love Street Food Trieste — Sebastian Kreso.",
    sitoUrl: "https://www.lovestreetfoodts.it",
    linkMappe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2780.8256338423235!2d13.754876!3d45.6734123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477b6d9546ec2e55%3A0x35a7a9a8a1c6b014!2sLove%20Street%20Food%20Trieste!5e0!3m2!1sit!2sit!4v1700000000000!5m2!1sit!2sit",
    linkInstagram: "https://instagram.com/lovestreetfood.ts",
    linkFacebook: "",
    linkWhatsApp: "+393932985493",
    googlePlaceId: "ChIJVS7sRnVt-0cRFLDGoqippTU",
    contatti: {
      indirizzo: "Lungomare di Barcola, Trieste",
      telefono: "+39 393 298 5493",
      email: "",
      orari: [
        { giorno: "Lunedì", orario: "10-23 (Cucina: 12–22:30 )" },
        { giorno: "Martedì", orario: "10-23 (Cucina: 12–22:30 )" },
        { giorno: "Mercoledì", orario: "10-23 (Cucina: 12–22:30 )" },
        { giorno: "Giovedì", orario: "10-23 (Cucina: 12–22:30)" },
        { giorno: "Venerdì", orario: "10-23 (Cucina: 12–22:30)" },
        { giorno: "Sabato", orario: "10-23 (Cucina: 12–22:30)" },
        { giorno: "Domenica", orario: "10-23 (Cucina: 12–22:30)" },
      ],
    },
  },

  // Contatti (singoli valori per binding semplice)
  contatti: {
    indirizzo: "Lungomare di Barcola, Trieste",
    telefono: "+39 393 298 5493",
    email: "",
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
    preTitle: "Trieste · Vista Mare",
    riga1: "LA MIGLIORE FRITTURA",
    riga2: "E Street Food",
    riga3: "A BARCOLA",
    sottotitolo: "Frittura di pesce fresca, carne selezionata e cicchetti per l'aperitivo vista mare.",
    btnPrimario: "Scopri il Menu",
    btnPrimarioHref: "#menu",
    btnSecondario: "Contattaci",
    btnSecondarioHref: "#contatti",
  },

  // Sezione Chi Siamo
  sezioneChiSiamo: {
    preTitolo: "La Nostra Location",
    titoloPrincipale: "A Barcola Vista Mare...",
    testoEvidenziato: "",
    paragrafo1: "Situato all'inizio di Barcola, Love Street Food Trieste è il punto di riferimento per gustare frittura di pesce fresca e street food di qualità in una location unica.",
    paragrafo2: "Tutti i nostri prodotti di carne sono preparati con manzo 100% selezionato, macinato e condito direttamente nella nostra cucina. Le nostre fritture sono perfette da gustare al chiosco, al parco o da asporto.",
    paragrafo3: "Dalle fritture di pesce croccanti e freschissime gustate vista mare, ai nostri famosi hamburger, fino alle specialità alla griglia e le tartine per l'aperitivo: che tu sia a Udine o a Trieste, da noi trovi sempre gusto autentico, porzioni generose e un'accoglienza col sorriso.",
    titoloAsporto: "...Ma non solo!",
    testoLinkUdine: "Scoprici a Udine!",
    linkUdine: "https://lovestreetfoodud.netlify.app",
  },

  // Sezione Menu
  sezioneMenu: {
    preTitolo: "Il Nostro Menu",
    titoloGrande: "Specialità",
    evidenziato: "di Mare e di Terra",
    categorie: [
      { id: "panini", label: "Panini" },
      { id: "fritture", label: "Fritture & Contorni" },
      { id: "cicchetti_pesce", label: "Cicchetti di Pesce" },
      { id: "cicchetti_terra", label: "Cicchetti di Terra & Veg" },
    ],
    piatti: {
      panini: [
        { nome: "Panino Burger di manzo 100%", descrizione: "Manzo 100% selezionato e preparato da noi", prezzo: "10" },
        { nome: "Panino con sovracoscia di pollo", descrizione: "Pollo selezionato e condito in casa", prezzo: "12" },
        { nome: "Panino con salsiccia istriana", descrizione: "Gusto autentico della tradizione", prezzo: "14" },
        { nome: "Panino Cevapcici", descrizione: "5 o 10 pezzi nel tipico panino Lepinja", prezzo: "10/12" },
        { nome: "Panino Pljeskavica", descrizione: "Carne di manzo 100% selezionata e condita", prezzo: "10" },
        { nome: "Panino doppia Pljeskavica", descrizione: "Doppia porzione di manzo 100%", prezzo: "14" },
        { nome: "Tostone", descrizione: "Un tostone dalla t maiuscola", prezzo: "7" },
        { nome: "Panino con Polpo", descrizione: "Polpo in lepinja croccante, cosa aspetti a provarlo?!", prezzo: "16" },
        
      ],
      fritture: [
        { nome: "Calamari Fritti", descrizione: "Croccanti e preparati al momento", prezzo: "14" },
        { nome: "Sarde o Alici Fritte", descrizione: "Pesce fresco fritto al momento", prezzo: "13" },
        { nome: "Gamberoni Fritti", descrizione: "Gamberoni croccanti di alta qualità", prezzo: "15" },
        { nome: "Frittura Mista", descrizione: "Selezione di pesce fritto sul momento", prezzo: "14" },
        { nome: "Cala Gambero", descrizione: "Mix di calamari e gamberi fritti", prezzo: "14" },
        { nome: "Patate Fritte", descrizione: "Contorno croccante da passeggio", prezzo: "3" },
      ],
      cicchetti_pesce: [
        { nome: "Sarde in saor", descrizione: "Con cipolla bianca", prezzo: "4" },
        { nome: "Gamberoni in saor", descrizione: "Con cipolla bianca", prezzo: "4" },
        { nome: "Aringa in saor", descrizione: "Con cipolla bianca", prezzo: "4" },
        { nome: "Baccalà mantecato", descrizione: "Con fiore di cappero", prezzo: "4" },
        { nome: "Tentacoli di Polpo", descrizione: "Con burrata, olive taggiasche e fiore di cappero", prezzo: "4" },
        { nome: "Salmone affumicato", descrizione: "Con formaggio morbido", prezzo: "4" },
        { nome: "Alici del Mar Cantabrico", descrizione: "Con burro Beppino Occelli", prezzo: "4" },
        { nome: "Trota salmonata di San Daniele", descrizione: "Con burro Beppino Occelli", prezzo: "4" },
      ],
      cicchetti_terra: [
        { nome: "Burrata e Datterino Confit", descrizione: "Con pesto alla genovese", prezzo: "3.50" },
        { nome: "Stracciatella e Pomodori Secchi", descrizione: "Con olive taggiasche", prezzo: "3.50" },
        { nome: "Stracciatella e Friarielli", descrizione: "Con acciughe", prezzo: "3.50" },
        { nome: "Stracciatella e Datterini Freschi", descrizione: "Con basilico fresco", prezzo: "3.50" },
        { nome: "Crema di Avocado", descrizione: "Con pomodoro datterino confit", prezzo: "3.50" },
        { nome: "Gorgonzola Dolce", descrizione: "Con noci", prezzo: "3.50" },
        { nome: "Uova Sode", descrizione: "Con acciughe e maionese", prezzo: "3.50" },
        { nome: "Mortadella IGP Bologna", descrizione: "Con formaggio morbido e peperone sottaceto", prezzo: "3.50" },
        { nome: "Paninetto al Latte Praga", descrizione: "Con cotto affumicato Praga e Montasio DOP", prezzo: "3.50" },
        { nome: "Paninetto al Latte Mortadella", descrizione: "Con Mortadella IGP Bologna", prezzo: "3.50" },
      ],
    },
  },

  // Sezione Galleria
  sezioneGalleria: {
    preTitolo: "Vista Mare & Gusto",
    titoloGrande: "Love Street Food",
    evidenziato: "A Barcola",
    immaginiSlot: [
      "/cartella-foto/hero.jpg",
      "/cartella-foto/1.jpg",
      "/cartella-foto/2.jpg",
      "/cartella-foto/3.jpg",
      "/cartella-foto/4.jpg",
      "/cartella-foto/5.jpg",
      "/cartella-foto/6.jpg",
      "/cartella-foto/7.jpg",
      "/cartella-foto/8.jpg",
      "/cartella-foto/9.jpg",
      "/cartella-foto/10.jpg",
    ],
  },

  // Sezione Instagram / Social
  sezioneInstagram: {
    preTitolo: "",
    titoloGrande: "Seguici su Instagram",
    evidenziato: "Instagram",
    descrizione: "Fritture croccanti, aperitivi vista mare e convivialità a Barcola.",
    testoBottone: "Segui",
  },

  // Sezione Contatti
  sezioneContatti: {
    preTitolo: "Vieni a Trovarci",
    titoloGrande: "Contatti",
    titoloDove: "Dove Siamo",
    titoloTelefono: "Telefono / Asporto",
    titoloEmail: "Email",
    titoloOrari: "Orari",
    footerTitolo: "Love Street Food Trieste",
    footerIndirizzo: "Lungomare di Barcola, Trieste",
    footerEmail: "sebastiankreso@gmail.com - Sebastian Kreso",
    footerCopyright: "© 2026 Love Street Food Trieste — STREET FOOD S.R.L. ",
    footerCopyrightSecondaRiga: "P.IVA 04234567890 ",
  },

  // Sezione recensioni fake / Google
  sezioneRecensioni: {
    preTitolo: "Cosa Dicono di Noi",
    titoloGrande: "Recensioni",
    titoloEvidenziato: "Google",
    bottoneTesto: "Lascia una Recensione",
    descrizione: "Le recensioni di esempio qui sotto possono essere personalizzate da te in questo file.",
    mediaStelle: 4.4,
    numeroRecensioni: 89,
    fallbackReviews: [
      {
      author: "Samantha Miotti",
      rating: 5,
      text: "Cosa dirvi....panorama unico ...tavoli all aperto all' ombra degli alberi....personale cortese e veloce. Ma....il piatto forte 😁 è il cibo. Calamari fritti superbi! Leggeri e non unti....",
      relativeTime: "5 giorni fa",
    },
    {
      author: "Andrea Raimondi",
      rating: 5,
      text: "Io migliore di tutta Barcola. Senza alcun dubbio. Gamberi e calamari fritti da volare via! La cortesia e professionalità di Anna è encomiabile. La divertente attenzione di Mike non teme paragoni",
      relativeTime: "1 mese fa",
    },
    {
      author: "Matteo Miceli",
      rating: 5,
      text: "Frequento da anni il locale a Udine, ho provato questo a Trieste che ha in più una fantastica vista sul mare. Stessa qualità top di Udine e ottimo servizio, da provare assolutamente. Il migliore street food del Friuli sicuramente",
      relativeTime: "10 mesi fa",
    },
    {
      author: "Lorraine Gempesaw",
      rating: 5,
      text: "Conoscevo già il chiosco di Udine e ci vado spesso perché mi trovo sempre bene, ma questo fronte mare è stata una bellissima scoperta. La qualità è la stessa: frittura di pesce buona e croccante, hamburger succosi e cevapcici saporiti. Le porzioni sono abbondanti, i prezzi onesti e la vista sul mare rende tutto speciale. ",
      relativeTime: "9 mesi fa",
    },
    {
      author: "Boža Paunović",
      rating: 5,
      text: "Personale molto gentile, posto meraviglioso per mangiare bene. Birra perfetta!🍺",
      relativeTime: "11 mesi fa",
    },
    ],
  },

  // Design e colori (mantenuto)
  design_e_colori: {
    fontTitoli: "Bebas Neue",
    fontTesto: "Montserrat",

    // PALETTE UNIFICATA (uso questi 4 colori per tutto il sito)
    coloriGenerali: {
      rossoStreet: "#BC2D0E",
      beigeCartone: "#C4A77D",
      scuroPremium: "#0D0A08",
      cremaFresco: "#FDF9EF",
    },

    // Sezioni con i colori realmente usati dal layout
    sezioni: {
      navbar: {
        background: "#0D0A08",
        text: "#FDF9EF",
        title: "#FDF9EF",
        accent: "#BC2D0E",
        border: "#C4A77D",
        buttonBg: "#BC2D0E",
        buttonText: "#FDF9EF",
        mobileText: "#FDF9EF",
        mobileButtonBg: "#BC2D0E",
        mobileButtonText: "#FDF9EF",
        mobileBorder: "#7da2c4",
      },
      hero: {
        background: "#0D0A08",
        text: "#FDF9EF",
        title: "#FDF9EF",
        accent: "#C4A77D",
        border: "#7da2c4",
        buttonBg: "#BC2D0E",
        buttonText: "#FDF9EF",
      },
      chiSiamo: {
        background: "#FDF9EF",
        text: "#0D0A08",
        title: "#BC2D0E",
        accent: "#7da2c4",
        border: "#7da2c4",
      },
      menu: {
        background: "#0D0A08",
        text: "#000000",
        title: "#7da2c4",
        accent: "#BC2D0E",
        border: "#C4A77D",
        barBg: "#7da2c4",
        barText: "#FDF9EF",
        barBorder: "#7da2c4",
      },
      galleria: {
        background: "#FDF9EF",
        text: "#0D0A08",
        title: "#BC2D0E",
        accent: "#7da2c4",
        border: "#BC2D0E",
      },
      recensioni: {
        background: "#0D0A08",
        text: "#FDF9EF",
        title: "#C4A77D",
        accent: "#BC2D0E",
        border: "#C4A77D",
        buttonBg: "#7da2c4",
        buttonText: "#7da2c4",
      },
      instagram: {
        background: "#16110D",
        text: "#FDF9EF",
        title: "#C4A77D",
        accent: "#BC2D0E",
        border: "#BC2D0E",
        buttonBg: "#BC2D0E",
        buttonText: "#FDF9EF",
      },
      contatti: {
        background: "#FDF9EF",
        text: "#0D0A08",
        title: "#BC2D0E",
        accent: "#C4A77D",
        border: "#BC2D0E",
        buttonBg: "#BC2D0E",
        buttonText: "#FDF9EF",
        secondaryBg: "#0D0A08",
        secondaryText: "#FDF9EF",
      },
      footer: {
        background: "#0D0A08",
        text: "#000000",
        title: "#C4A77D",
        accent: "#BC2D0E",
        border: "#C4A77D",
      },
    },
  },

  // Slot immagini centralizzato (tutte le immagini provengono da public/cartella-foto)
  slotImmagini: {
    logo: "/cartella-foto/logo.jpg",
    heroBg: "/cartella-foto/hero.jpg",
    gallery: [
      "/cartella-foto/3.jpg",
      "/cartella-foto/2.jpg",
      "/cartella-foto/1.jpg",
      "/cartella-foto/4.jpg",
      "/cartella-foto/12.jpg",
      "/cartella-foto/6.jpg",
      "/cartella-foto/7.jpg",
      "/cartella-foto/8.jpg",
      "/cartella-foto/9.jpg",
      "/cartella-foto/10.jpg",
      "/cartella-foto/13.jpg",
      "/cartella-foto/14.jpg",
      "/cartella-foto/15.jpg",
    ],
    // array con tutte le immagini (inclusi logo e hero)
    all: [
      "/cartella-foto/logo.jpg",
      "/cartella-foto/hero.jpg",
      "/cartella-foto/1.jpg",
      "/cartella-foto/2.jpg",
      "/cartella-foto/3.jpg",
      "/cartella-foto/4.jpg",
      "/cartella-foto/5.jpg",
      "/cartella-foto/6.jpg",
      "/cartella-foto/7.jpg",
      "/cartella-foto/8.jpg",
      "/cartella-foto/9.jpg",
      "/cartella-foto/10.jpg",
      "/cartella-foto/11.jpg",
      "/cartella-foto/12.jpg",
      "/cartella-foto/13.jpg",
      "/cartella-foto/14.jpg",
      "/cartella-foto/15.jpg",
    ]
  },
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
