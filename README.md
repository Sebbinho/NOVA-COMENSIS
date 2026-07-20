# RETRÒ Schiacciateria Triestina — Sito Web

Sito Next.js 15 (App Router) + TypeScript + TailwindCSS + Framer Motion + Lucide Icons.

## Deploy su Vercel

### Opzione A — Senza terminale (la più semplice)

1. Vai su [vercel.com](https://vercel.com) e crea un account (puoi usare GitHub, GitLab o email).
2. Carica questa cartella su GitHub:
   - Crea un nuovo repository su [github.com/new](https://github.com/new) (es. `retro-schiacciateria`)
   - Su GitHub clicca "uploading an existing file" e carica tutti i file/cartelle di questo progetto
     (oppure usa GitHub Desktop per fare il push della cartella)
3. Su Vercel: **Add New → Project**, seleziona il repository appena creato
4. Vercel rileva automaticamente Next.js — lascia le impostazioni di default
5. **Se vuoi le recensioni Google funzionanti**, prima di cliccare Deploy
   apri "Environment Variables" e aggiungi:
   - `GOOGLE_PLACES_API_KEY` = la tua chiave
   - `GOOGLE_PLACE_ID` = il tuo Place ID
   - `NEXT_PUBLIC_GOOGLE_PLACE_ID` = lo stesso Place ID
6. Clicca **Deploy**. In 1-2 minuti avrai un link pubblico tipo
   `https://retro-schiacciateria.vercel.app`

### Opzione B — Da terminale (CLI)

```bash
npm install -g vercel
cd retro-schiacciateria
vercel
```

Segui le istruzioni a schermo (login, nome progetto, ecc.). Per le
variabili d'ambiente:

```bash
vercel env add GOOGLE_PLACES_API_KEY
vercel env add GOOGLE_PLACE_ID
vercel env add NEXT_PUBLIC_GOOGLE_PLACE_ID
```

Poi per andare in produzione:

```bash
vercel --prod
```

### Dominio personalizzato

Una volta deployato, su Vercel vai su **Settings → Domains** e collega
il tuo dominio (es. `retroxxsettembre.it`), seguendo le istruzioni DNS
mostrate da Vercel.

---

## Come avviarlo in locale

1. Estrai questa cartella sul Desktop (es. `retro-schiacciateria`).
2. Apri il terminale dentro la cartella:
   ```bash
   cd retro-schiacciateria
   ```
3. Installa le dipendenze:
   ```bash
   npm install
   ```
4. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```
   Apri il browser su [http://localhost:3000](http://localhost:3000)

## Vedere il sito dal telefono (rete locale)

```bash
npm run dev:host
```

Il terminale mostrerà un indirizzo del tipo `http://192.168.x.x:3000` —
aprilo dal browser del telefono (stessa rete WiFi). Se non si connette,
verifica che il firewall di Windows non blocchi la porta 3000.

## Recensioni Google (carosello)

Le recensioni Google si trovano nella sezione "Recensioni Google" e sono
caricate da `/api/reviews` (Google Places API). Per attivarle:

1. Copia `.env.local.example` in un nuovo file chiamato `.env.local`
2. Vai su [Google Cloud Console](https://console.cloud.google.com/),
   crea/seleziona un progetto e abilita **Places API**
3. Crea una API key e incollala in `GOOGLE_PLACES_API_KEY`
4. Trova il **Place ID** della tua attività con il
   [Place ID Finder di Google](https://developers.google.com/maps/documentation/places/web-service/place-id)
   e incollalo sia in `GOOGLE_PLACE_ID` che in `NEXT_PUBLIC_GOOGLE_PLACE_ID`
5. Riavvia `npm run dev`

⚠️ Nota: l'API Google Places restituisce **massimo 5 recensioni** per
attività (limite imposto da Google, non modificabile). Se non configuri
le variabili, il sito mostra recensioni di esempio così il design resta
visibile.

## Instagram

La sezione "Seguici su Instagram" è un semplice pulsante che porta al
profilo @retroxxsettembre. Un embed automatico dell'ultimo post
richiederebbe un account Meta Developer con token da rinnovare
periodicamente — per ora è stato lasciato fuori per semplicità.

## Note

- Le immagini di hero/menu/galleria sono placeholder da Unsplash.
  Sostituiscile in `app/page.tsx` (variabili `MENU_CATEGORIES`,
  `GALLERY_IMAGES` e l'hero) con foto reali di RETRÒ.
- Il logo è in `public/logo.jpg`.
- Per la build di produzione:
  ```bash
  npm run build
  npm run start
  ```
