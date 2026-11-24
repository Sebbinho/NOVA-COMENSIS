# Un dicembre per noi

Calendario dell'Avvento interattivo realizzato con Next.js e TypeScript.

## Avvio in locale

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000). Il pannello admin è disponibile su
[http://localhost:3000/adminseba4825/](http://localhost:3000/adminseba4825/).

Senza credenziali Supabase, in locale i contenuti vengono salvati in `sitoConfig.json`,
le foto in `public/uploads/` e le risposte in `data/memory-book.json` (escluso da Git).
Con Supabase configurato, configurazione, risposte e nuove foto vengono salvate nel cloud.

## Collegare Supabase

1. Crea un progetto Supabase e apri il suo **SQL Editor**.
2. Esegui lo script contenuto in [`supabase/schema.sql`](./supabase/schema.sql).
3. Copia `.env.example` in `.env.local` e inserisci l'URL del progetto e la chiave
   **service role** nelle variabili `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`.
4. Riavvia il server locale. Il pannello Admin mostrerà **Supabase collegato**.
5. Per Vercel, aggiungi le stesse due variabili in **Project Settings → Environment
   Variables** e fai un nuovo deploy.

La service role key è segreta: usala solo lato server, non inserirla in variabili
`NEXT_PUBLIC_*` e non committare `.env.local`. Configurazione e ricordi sono protetti
da Row Level Security e letti/scritti dalle API server-side. Il bucket delle foto è
pubblico, come lo erano già le foto condivise del calendario.

Al primo avvio con Supabase, la configurazione e gli eventuali ricordi esistenti vengono
importati dall'archivio locale o da Vercel Blob. I vecchi URL delle foto restano validi;
le nuove foto vengono caricate nel bucket Supabase. Se le variabili non sono presenti,
il sito continua a usare lo storage locale o Vercel Blob.

## Pubblicazione su Vercel

Supabase è lo storage consigliato per mantenere configurazione, ricordi e foto.
In alternativa, importa il progetto su Vercel, crea uno storage **Blob** e collegalo:
Vercel aggiungerà `BLOB_READ_WRITE_TOKEN`. Esegui quindi un nuovo deploy.

Se Supabase non è configurato, su Vercel calendario, ricordi e foto usano Blob. Se
Supabase è configurato, i dati persistenti usano Supabase; Blob può restare collegato
per importare i contenuti precedenti. I contenuti e le foto pubbliche sono visibili a
chiunque abbia il link. `sitoConfig.json` rimane il valore iniziale del progetto; il
pannello aggiorna l'archivio selezionato senza tentare di modificare i file del deploy.

## Calendario e libro dei ricordi

La pagina pubblica offre le schede **Avvento** e **Il Nostro Libro**. Le giornate si
sbloccano dal 1 al 25 dicembre; da una scheda sbloccata è possibile leggere storia e
indizio, completare le missioni e salvare testi o foto. Le foto delle missioni vengono
ridimensionate e compresse nel browser prima del caricamento.

Dal 25 dicembre il pulsante nel libro genera un PDF direttamente nel browser, con una
pagina per ciascun giorno. Se i testi o le immagini di un giorno sono troppo lunghi per
una pagina, il download segnala quale giornata va accorciata invece di scartare contenuti.

## Uso del pannello

- Modifica la dedica e il testo introduttivo.
- Apri **Altri testi della pagina pubblica** nelle impostazioni generali per modificare
  le etichette, i simboli/emoji delle schede e delle caselle, i messaggi delle caselle
  bloccate, la frase finale e i testi del libro PDF.
- In **Aspetto e colori del sito** puoi cambiare la palette e il percorso dello sfondo
  (`/sfondo%20sito.png` per l'immagine inclusa in `public/`); la palette viene usata
  anche nelle pagine del libro PDF. Il campo **Colore delle scritte (testo principale)**
  corrisponde a `theme.text` in `sitoConfig.json`. I campioni quadrati mostrano il colore
  attuale accanto a ogni impostazione; l'immagine configurata come sfondo viene mostrata
  senza filtri cromatici.
- Attiva **Modalità prova** per aprire tutte le giornate prima di dicembre. In questa
  modalità i contenuti programmati e i regali già pubblicati sono visibili dal sito:
  disattivala quando hai finito i test.
- Seleziona un giorno, aggiungi titolo, messaggio e foto (JPG, PNG, WebP, AVIF o GIF,
  massimo 10 MB). Carica direttamente la foto già scontornata; per conservare la
  trasparenza, usa un PNG.
- Salva per preparare o aggiornare una sorpresa senza mostrarla.
- Programma tipo, storia, indizio ed eventuali missioni per ogni giorno dall'1 al 25.
- Per i sondaggi, aggiungi le opzioni una alla volta con **Aggiungi un'opzione**.
- Quando il regalo è stato ricevuto, premi **Segna come regalo ricevuto**. La foto e il
  messaggio appariranno nel calendario pubblico quando quel giorno sarà sbloccato.

Le sorprese non ancora pubblicate non vengono incluse nella risposta pubblica del
calendario. L'indirizzo `/adminseba4825/` non è collegato dalla pagina e viene escluso
dall'indicizzazione, ma non equivale a una password: chi conosce o indovina il link
può accedere al pannello.

## Nota sul badge di sviluppo

L'indicatore `N` di Next.js è disattivato. Next.js e Node.js restano necessari per
servire il sito e le API su Vercel; non vengono mostrati come schermata o contenuto
del calendario.
