# Guida Configurazione Google Analytics (GA4)

Questa guida ti aiuterà a configurare Google Analytics 4 (GA4) per il tuo blog.

## 1. Ottenere il Measurement ID (ID Misurazione)

1. Vai su [Google Analytics](https://analytics.google.com/) e accedi col tuo account Google.
2. Clicca su **Amministratore** (l'icona dell'ingranaggio in basso a sinistra).
3. Clicca su **Crea** -> **Account** (se non ne hai uno) oppure **Proprietà**.
4. Inserisci il nome del tuo blog e segui i passaggi.
5. Quando ti chiede la piattaforma, scegli **Web**.
6. Inserisci l'URL del tuo sito: `rkomi98.github.io/MyBlog` e dai un nome allo stream (es. "MyBlog").
7. Clicca su **Crea stream**.
8. Vedrai una schermata "Dettagli stream web". Copia il **ID MISURAZIONE** che inizia con **`G-`** (es. `G-ABC1234567`).

## 2. Inserire l'ID nel codice

Ho già preparato il codice nei file necessari, è attualmente commentato. Devi solo scommentarlo e inserire il tuo ID.

### A. Home Page (`index.html`)

1. Apri il file `index.html`.
2. Cerca questo blocco (intorno alla riga 14):

```html
<!-- Google Analytics (GA4) - Uncomment and replace G-XXXXXXXXXX with your Measurement ID
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XXXXXXXXXX');
</script>
-->
```

3. Rimuovi i commenti `<!--` all'inizio e `-->` alla fine.
4. Sostituisci **entrambe** le occorrenze di `G-XXXXXXXXXX` con il tuo ID (quello che hai copiato al punto 1).

### B. Pagine del Blog (`scripts/lib/templates.js`)

Poiché le pagine del blog sono generate automaticamente, devi modificare il template.

1. Apri `scripts/lib/templates.js`.
2. Troverai lo stesso blocco di codice in due punti diversi (uno per l'indice del blog, uno per i singoli articoli).
3. Cerca "Google Analytics" nel file.
4. Come prima, rimuovi i commenti e sostituisci `G-XXXXXXXXXX` con il tuo ID in entrambi i punti.

## 3. Applicare le modifiche

Dopo aver salvato i file:

1. Esegui il build del sito:
   ```bash
   npm run build
   ```
2. Carica le modifiche su GitHub:
   ```bash
   git add .
   git commit -m "Aggiunto Google Analytics"
   git push
   ```

## 4. Verifica

Dopo qualche minuto dal deploy:
1. Apri il tuo sito in una finestra anonima.
2. Vai su Google Analytics -> **Report** -> **Tempo reale**.
3. Dovresti vedere almeno "1 utente negli ultimi 30 minuti" (te stesso).

---
**Nota:** Google Analytics potrebbe impiegare 24-48 ore per iniziare a mostrare i dati completi nei report standard.

