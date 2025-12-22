# Report AI 2025: cosa è cambiato davvero

## Abstract

Nel 2025 la GenAI ha smesso di essere solo ChatGPT e usato solo risponde a delle domande "semplici”, ma ha permesso di fare tante altre cose: dalle ricerche su centinaia di fonti browser "agentici", IDE che lavorano a fianco degli sviluppatori, e l’open/local si fa davvero competitivo. Questo articolo ricostruisce mese per mese i rilasci chiave, confronta i principali player e chiude con le lezioni pratiche e i trend più probabili per il 2026.

Questo report racconta il 2025 **in modo molto pratico** dal punto di vista di uno che fino a un anno fa era studente, e ora si occupa di portare la GenAI e le sue applicazioni nelle azinede: cosa è uscito, cosa ha davvero cambiato le abitudini, e quali aziende hanno “portato a casa” risultati concreti. 

---

## Timeline 2025 (completa e spiegata)

Una mini‑legenda che per alcuni sarà banale, ma non per altri no, penso sia necessaria. Di conseguenza ecco a te:
- **Modelli “Pro / top”**: li chiami quando devi risolvere task molto complesse (ragionamenti lunghi, decisioni difficili, codice delicato).
- **Modelli “Flash / fast”**: li chiami quando devi *assolvere compiti semplici* (riassunti, classificazioni con degli esempi, triage, customer care, piccole automazioni ripetute).
- **Modelli “open / locali”**: li scegli quando contano **controllo, costi, privacy**, e vuoi farli girare su server dedicati o addirittura sul tuo computer.
- **Agenti (ricerca, IDE, browser con pilota, creatori di app)**: l'AI agentica ha cambiato davvero le abitudini delle persone: quindi parlando con il chatbot, questo delega agli strumenti più adatti in base alle esigenze. Questo apre una marea di possibili scenari e applicazioni nella vita di tutti i giorni.

---

### Gennaio 2025
Gennaio ha dimostrato che non servono grandissimi budget per creare dei buoni modelli:

- **Codestral 25.01 (Mistral, coding)**
  - Quando: **13 gennaio 2025**
  - In breve: modello di Mistral specializzato in **generazione e completamento di codice**, pensato per IDE, refactor e assistenza allo sviluppo.
  - Fonte: **[F05]**

- **DeepSeek‑R1 (reasoning, open)**
  - Quando: **20 gennaio 2025**
  - In cosa consiste: modello open orientato al **ragionamento strutturato** (passi logici, catene di pensiero) e a task complessi, con focus su accessibilità e costi.
  - Perché è importante? il ragionamento non è più un'esclusiva di OpenAI diventa accessibile anche a team che non possono spendere come i big.
  - Fonte: **[F03]**

- **Stargate Project (OpenAI + SoftBank + Oracle + MGX, infrastruttura)**
  - Quando: **21 gennaio 2025**
  - In breve: maxi‑progetto di infrastruttura AI con partnership e investimenti congiunti per **costruire/garantire capacità di calcolo** (data center, energia, cloud) e renderla disponibile per l'addestramento e l'uso su larga scala dei modelli.
  - Perché conta: sposta l'attenzione su **supply chain del compute** (data center, energia, raffreddamento, chip) e su accordi industriali di lungo periodo. In pratica, il vantaggio competitivo si gioca anche su chi riesce a garantire **capacità stabile e scalabile** per mesi/anni, non solo su chi addestra il modello più forte.
  - Fonte: **[F01]** (supporto: [F02])


- **Operator (OpenAI)**:
  -Quando: **23 gennaio**
  In cosa consiste: un assistente che non si limita a rispondere, ma usa un browser (clic, scroll, moduli) per fare azioni al posto tuo. È l’inizio del “pilota automatico” sul web, poi confluito nella modalità agent di ChatGPT a luglio.

- **Humanity’s Last Exam (benchmark, “domande cattive”)**
  - Quando: **24 gennaio 2025** (pubblicazione paper)
  - In cosa consiste: benchmark di valutazione con **domande molto difficili** per misurare ragionamento, robustezza e generalizzazione.
  - In breve: sposta l’asticella da “quanto scrive bene” a “arriva davvero a risolvere task complesse”.
  - Fonte: **[F04]**

---

### Febbraio 2025
A febbraio è nato lo strumento che più ha rivoluzionato la mia vita: Deep Research.

Deep Research ha accelerato e migliorato la qualità della ricerca. Studiare oggi è un piacere per chi, come me è super curioso e vuole avere sempre sotto controllo più fonti contemporaneamente.

- **Deep Research (OpenAI, ricerca guidata fino al report)**
  - Quando: **3 febbraio 2025**
  - In cosa consiste: workflow/feature per **ricerca assistita** che produce report strutturati con fonti e citazioni.
  - In breve: nasce l’abitudine “Voglio saperne di più su un argomento”: questo fa partire una pipeline composta da piano → raccolta fonti → sintesi con citazioni → conclusioni.
  - Fonte: **[F06]**

- **Le Chat (Mistral, prodotto consumer/enterprise)**
  - Quando: **6 febbraio 2025** (annuncio/launch pubblico riportato dalla stampa)
  - In cosa consiste: prodotto chat di Mistral con **app e interfaccia** pensate per uso consumer e aziendale.Mistral prova a competere sul terreno dell’esperienza d’uso (velocità, bassa latenza) con un posizionamento tutto europeo.
  - Fonte: **[F07]**

- **GPT‑4.5 (OpenAI, più tenuta e affidabilità)**
  - Quando: **27 febbraio 2025**
  - In cosa consiste: aggiornamento del modello di punta OpenAI con **migliore affidabilità** su task lunghi. Nasce uno dei modelli piùù economici e più usati per la scrittura.
  - Fonte: **[F08]**

- **“Vibe coding” entra nel vocabolario**
  - Quando: **2 febbraio 2025** (il termine esplode dopo un post/tweet di Andrej Karpathy)
  - In cosa consiste: modo di sviluppare in cui **l'AI scrive gran parte del codice** e l'umano guida iterazioni, test e qualità.
  - In breve: molte persone iniziano a lavorare così: *non scrivo ogni riga, ma guido  un sistema AI e ad ogni iterazione chiedo di cambiare alcune cose fino a quando l’app non sta in piedi*.
  - Fonte: **[F09]**

---

### Marzo 2025 — Google chiarisce la strategia: potenza, velocità, controllo

- **Gemini 2.5 Pro (Google, preview)**
  - Quando: **25 marzo 2025**
  - In cosa consiste: modello Google di fascia alta (preview) per **ragionamento profondo** e task complessi.
  - In breve: “scelta profonda” per ragionamenti lunghi, analisi tecniche, codice complesso.
  - Fonte: **[F10]**

- **Gemma 3 (Google, open)**
  - Quando: **10 marzo 2025**
  - In cosa consiste: famiglia di modelli **open** di Google, pensati per deployment locali e custom.
  - In breve: l’open non è più un hobby: diventa un’opzione reale per fare assistenti interni e automazioni vicino ai dati.
  - Fonte: **[F11]**

---

### Aprile 2025 — Il multimodale matura e l’open alza la posta

- **Llama 4 (Meta, open: Scout/Maverick)**
  - Quando: **5 aprile 2025**
  - In cosa consiste: nuova generazione di modelli open di Meta (Scout/Maverick) con **contesti lunghi** e uso locale.
  - In breve: spinge forte su contesti lunghi e su modelli “da tenere in casa”, utili per documenti e codice.
  - Fonte: **[F13]**

- **Pixtral Large 25.02 (Mistral, visione + testo)**
  - Quando: **8 aprile 2025** (rilascio su AWS Marketplace)
  - In cosa consiste: modello Mistral **multimodale** (testo + immagini) per analisi visive e documenti. Questo è un altro segnale della linea europea: multimodale, ma pensato per casi d’uso pratici.
  - Fonte: **[F14]**

- **o3 e o4‑mini (OpenAI, ragionamento “pronto al lavoro”)**
  - Quando: **16 aprile 2025**
  - In cosa consiste: coppia di modelli OpenAI orientati al **ragionamento operativo**, con varianti di potenza/costo. Questi modelli vengono usati soprattutto per debugging, code review, e analisi documenti.
  - Fonte: **[F12]**

- **Qwen3 (Alibaba, hybrid reasoning)**
  - Quando: **29 aprile 2025**
  - In cosa consiste: nuova famiglia di modelli Alibaba con **ragionamento ibrido** e distribuzione cloud locale.
  - In breve: rafforza un ecosistema Asia‑first molto competitivo, soprattutto nel cloud locale.
  - Fonte: **[F15]**

- **Lovable 2.0 (creatore di app, no‑code/low‑code)**
  - Quando: **24 aprile 2025**
  - In cosa consiste: piattaforma per **creare app senza codice**, con assistenza AI e workflow guidati.
  - In breve: rende “normale” costruire prototipi e micro‑tool interni senza essere sviluppatori esperti.
  - Fonte: **[F29]**

---

### Maggio 2025 — L’AI entra nei prodotti di massa

- **AI Mode in Google Search (ricerca in stile “assistente”)**
  - Quando: **20 maggio 2025**
  - In cosa consiste: nuova esperienza Search con **risposte sintetiche e conversazionali** al posto della lista di link.
  - In breve: per molti la ricerca smette di essere una lista di risultati e diventa un dialogo con sintesi.
  - Fonte: **[F16]**

- **Veo 3 (Google/DeepMind, video con audio)**
  - Quando: **20 maggio 2025** (copertura stampa di lancio)
  - In cosa consiste: modello generativo per **video con audio sincronizzato**, pensato per produzione rapida.
  - In breve: impatto enorme su training, marketing, demo interne e didattica.
  - Fonte: **[F17]**

- **Claude 4 (Anthropic: Opus/Sonnet)**
  - Quando: **22 maggio 2025**
  - In cosa consiste: nuova famiglia di modelli Anthropic (Opus/Sonnet) con **focus su ragionamento e coding**.
  - In breve: cresce l’idea del “collega digitale” che regge lavori lunghi, soprattutto sul coding.
  - Fonte: **[F18]**

- **Perplexity Labs (modalità “a progetto”)**
  - Quando: **29 maggio 2025**
  - In cosa consiste: modalità che trasforma le richieste in **progetti con output** (report, piani, file). Diventa semplice fare dashboard interattive a partire dai dati presenti sul web.
  - In breve: rende più semplice il passaggio da “chiedere cose” a “commissionare risultati” (report, piani, file).
  - Fonte: **[F19]**

- **Gemma 3n (Google, on‑device)**
  - Quando: **20 maggio 2025**
  - In cosa consiste: versione **leggera on‑device** dei modelli Gemma per girare su hardware locale.
  - In breve: porta l’idea di sistemi AI on device.
  - Fonte: **[F20]**

---

### Giugno 2025 — L’Europa mette una bandierina sul ragionamento

- **Magistral (Mistral, reasoning)**
  - Quando: **10 giugno 2025**
  - In cosa consiste: modello Mistral orientato al **ragionamento per passaggi**, con target enterprise.
  - In breve: Mistral entra nel campo dei modelli che ragionano per passaggi, con un tono molto “da prodotto” e attento al contesto europeo.
  - Fonte: **[F21]**

---

### Luglio 2025 — Il browser con pilota si fa concreto

- **Comet (Perplexity, browser con pilota: beta pubblica a scaglioni)**
  - Quando: **9 luglio 2025**
  - In cosa consiste: browser con **agente integrato** per ricerca e azioni sul web, in beta progressiva.
  - In breve: “l’ufficio nel browser” diventa una cosa reale: ricerca, azioni sul web, piccoli flussi.
  - Fonte: **[F22]**

- **ChatGPT agent / “agent mode”**
  - Quando: 17 luglio:
  - In cosa consiste: dentro ChatGPT compare una modalità che unisce ricerca e azione. Non fa solo sintesi: naviga e usa un computer “virtuale”, esegue passi in sequenza e può arrivare a un risultato editabile (es. slide, fogli, report).

---

### Agosto 2025 — Il salto di generazione

- **GPT‑5 (OpenAI)**
  - Quando: **7 agosto 2025**
  - In cosa consiste: nuova generazione del modello OpenAI, pensata per **capabilities e contesti più ampi**.
  - In breve: aumenta la sensazione di continuità su lavori lunghi: non solo risposte, ma accompagnamento fino alla consegna.
  - Fonte: **[F23]**

---

### Settembre 2025 — Efficienza: fare scala senza bruciare budget

- **Gemini 2.5 Flash‑Lite (Google, preview)**
  - Quando: **settembre 2025** (indicato come “09‑2025” nei materiali di rilascio)
  - In cosa consiste: variante **veloce ed economica** di Gemini per automazioni ad alto volume.
  - In breve: benzina per automazioni ripetute (riassunti, classificazioni, triage) a costo più basso.
  - Fonte: **[F24]**

---

### Ottobre 2025 — Il web diventa “operativo”

- **ChatGPT Atlas (OpenAI, browser con pilota)**
  - Quando: **21 ottobre 2025**
  - In cosa consiste: esperienza ChatGPT con **navigazione e azioni sul web** gestite dall'agente.
  - In breve: l’assistente non si limita a spiegare: può navigare, compilare, seguire passaggi, raccogliere dati.
  - Fonte: **[F25]**

- **Cursor (Anysphere) e la stagione del coding “in compagnia”**
  - Quando: **Q4 2025 (rilasci e rollout a scaglioni)**
  - In cosa consiste: editor/IDE con **assistente AI integrato** per scrittura, refactor e review in tempo reale.
  - In breve: l’editor smette di essere un posto dove “scrivi” e diventa un posto dove **coordini** (scrivi, controlli, refactorizzi, testi).
  - Nota: qui la data precisa dipende da canali/rollout; in questa versione ho preferito non fissare un giorno unico senza una fonte primaria univoca.

---

### Novembre 2025 — Google rilancia sul “Pro”

- **GPT‑5.1 (OpenAI)**
  - Quando:12 novembre
  - In cosa consiste: aggiornamento della serie GPT‑5 con due modalità (più “istantanea” e più “ragionata”) e più controllo sul tono. In pratica: conversazioni più naturali, e meno attrito quando devi passare dall’idea al lavoro finito. Ho notato che lo switch automatico funzionava meglio e il grounding più affidabile

- **Gemini 3 Pro (Google)**
  - Quando: **18 novembre 2025**
  - In cosa consiste: modello Google di fascia alta per **task complessi multimodali** e contesti lunghi.
  - In breve: torna forte sul lavoro complesso (testo + immagini + contesti lunghi), con focus su scenari reali.
  - Fonte: **[F26]**

---

### Dicembre 2025 — Consolidamento e “costruttori di software”

- **GPT‑5.2 (OpenAI)**
  - Quando: **11 dicembre 2025**
  - In cosa consiste: aggiornamento incrementale del modello con **migliorie di stabilità** e ragionamento. Funziona meglio con le immagini, su chat lunghe e complesse. Migliora anche nel coding.
  - In breve: spinge su lavoro professionale e progetti multi‑passo (più stabilità operativa).
  - Fonte: **[F27]**

- **Gemini 3 Flash (Google)**
  - Quando: **17 dicembre 2025**
  - In cosa consiste: versione **più veloce** di Gemini 3 per task rapidi e throughput elevato.
  - In breve: “veloce ma intelligente” come impostazione predefinita; riduce ancora i tempi morti.
  - Fonte: **[F28]**

---

## Focus: AI nello spazio (2025)

Nel 2025 la parola chiave nello spazio non è “fantascienza”, è **autonomia**. Il motivo è semplice: quando sei in orbita (o oltre), comunicare costa e arriva in ritardo. Quindi: più software capace di decidere e adattarsi a bordo, più missione efficiente.

### USA — più autonomia operativa e più disciplina sui dati

- **U.S. Space Force: piano Data & AI FY2025**
  - Quando: **19 marzo 2025**
  - Cosa segnala: l’AI non è solo “modello”, è **organizzazione**: dati condivisi, alfabetizzazione, strumenti, governance.
  - Fonte: **[F31]**

- **Satelliti che decidono “se ha senso scattare”**
  - Quando: **25 luglio 2025** (racconto di una demo/test pubblico)
  - Cosa segnala: parte dell’intelligenza si sposta a bordo: meno “scarico tutto a terra”, più “scelgo e filtro prima”.
  - Fonte: **[F32]**

*(Nota: molte attività NASA/DoD sono continue e non sempre hanno una singola data “di lancio”. In questa sezione ho incluso solo i punti dove una data pubblica è esplicita.)*

### Cina — computing in orbita e costellazioni che elaborano dati a bordo

- **Avvio di una “space computing constellation” (iniziativa guidata da Zhejiang Lab)**
  - Quando: **15 maggio 2025**
  - Cosa segnala: spinta verso rete di satelliti che **processano dati direttamente in orbita**, riducendo trasferimenti a terra.
  - Fonte: **[F33]**

### Europa — affidabilità, interoperabilità, Earth Observation “serio”

Nel 2025 l’Europa tende a muoversi con un approccio più “ingegneristico”: meno show, più verificabilità.

- **ESA Φ‑lab / AI4EO (AI for Earth Observation)**
  - Quando: **iniziativa continuativa (attiva nel 2025)**
  - Cosa segnala: focus su AI applicata a osservazione della Terra (clima, ghiacci, agricoltura, rischi).
  - Fonte: **[F34]**

---

## Una nota importante: chi ha investito tanto ma ha raccolto poco

Nel 2025 si è visto un pattern ricorrente (vale in tutti i settori):
1) **Pilot eterno**: PoC belli, ma nessuno li porta in produzione. I PoC devono essere in primis fattibili e utili a chi poi li userà. Ultimo ma non meno importante deve essere chiaro il come utilizzarli. L'adoption diventa chiave in tal senso.
2) **Dati disordinati**: un problema vecchio come il cucco. I dati non possono essere duplicati, o confusi, e i processi devono essere standardizzati per essere adatti a trasformarli con l'AI.
3) **Qualità non misurata**: senza metriche (errori, tempi, risparmi, rischi) l’adozione resta emotiva e poi si spegne. Resta fondamentale un monitoraggio nel tempo per capire l'impatto e non tutti lo stanno facendo
4) **Governance vaga**: chi può usare cosa? con quali dati? chi firma l’output? se nessuno decide, nessuno scala.

La differenza tra chi ha vinto e chi ha perso nel 2025 è stata quasi sempre qui: **processi + dati + responsabilità**, più che “il modello più nuovo”.

---

## Azienda per azienda: cosa hanno fatto bene, cosa no, e voto finale

> **Come leggo il voto (0–10):** utilità concreta, qualità, velocità di miglioramento, distribuzione, chiarezza di prodotto.

### OpenAI — **9+/10**
**La storia dell’anno:** prima della classe, ma ha toppato l’esame in cui tutti la guardavano: GPT‑5, annuncio lungo e un po’ fuffoso. Codex le ha permesso di recuperare sul coding; Google la raggiunge e OpenAI scatta in avanti in zona Cesarini.
- Punti forti: Agent e Deep Research come perle dell’anno; Codex sul coding.
- Rischi: Sora ancora non disponibile in Europa. Modelli di immagini ancora non affidabili al 100%.

### Google / DeepMind — **9.5/10**
**La storia dell’anno:** recupera tantissimo terreno, supera OpenAI a inizio dicembre, poi a fine anno vince ancora OpenAI ma di poco. Con l’ecosistema alle spalle e NotebookLM, vince a mani basse.
- Punti forti: ecosistema e distribuzione; NotebookLM fa la differenza.
- Rischi: alcune cose tolte (es. controllo schermo su AI Studio); AI Mode non troppo affidabile e soggetto ad allucinazioni. Capiamo.

### Anthropic — **9/10**
**La storia dell’anno:** il modello di coding. Fa poco ma lo fa bene, e lo fa via codice.
- Punti forti: se vuoi presentazioni, documenti, tabelle o vettoriali, scrive codice per farlo; quando ho un problema di coding scelgo lui.
- Rischi: molto, molto caro.

### Cursor / Anysphere — **10/10**
**La storia dell’anno:** progetto di sviluppo pazzesco. Mi ha fatto ridere quando GPT‑5 è uscito prima lì che su ChatGPT.
- Punti forti: IDE di riferimento per il coding, crescita enorme nell’ultimo anno. Figo avere più modelli gratuiti, come anche quello di Grok
- Rischi: Per ora nessuno, ma se ne avete ditemelo.

Ad Maiora.

### Lovable e “creatori di app” — **8.5/10**
**La storia dell’anno:** il sito per fare vibe coding online per eccellenza.
- Punti forti: mock collegati a un piccolo DB su Supabase sono molto fighi.
- Rischi: c’è ancora da lavorare, soprattutto a livello di backend per creare soluzioni solide in produzione. Sono sulla strada giusta. 

### DeepSeek — **8.3/10**
**La storia dell’anno:** qualità alta a costi più bassi cambia l’economia dell’adozione.

### Meta — **8.2/10**
**La storia dell’anno:** l’open diventa un’opzione concreta per aziende con vincoli.
- Punti forti: controllo dei dati.
- Rischi: meno “prodotto finito”, più mattoni.

### Perplexity — **8.1/10**
**La storia dell’anno:** il browser con pilota diventa un prodotto reale.
- Punti forti: Comet e modalità progetto.
- Rischi: competizione diretta con Google/OpenAI.

### Alibaba — **8.0/10**
**La storia dell’anno:** accelerazione forte in Asia e nel cloud locale.

### Mistral — **7.9/10**
**La storia dell’anno:** l’Europa prova a essere protagonista con soluzioni pratiche.
- Punti forti: posizionamento EU‑friendly.
- Rischi: scala e distribuzione globali.

### Microsoft — **7.6/10**
**La storia dell’anno:** la forza è la distribuzione, la sfida è la percezione di innovazione di punta.

### Spazio e difesa (settore) — **7.4/10**
**La storia dell’anno:** meno hype, più piani reali e sperimentazioni.

### xAI — **7.2/10**
**La storia dell’anno:** forte sul tempo reale, meno sui processi completi da lavoro.

---

## Conclusione: le scoperte del 2025 e cosa aspettarsi nel 2026

### Le 5 scoperte principali del 2025
1) La ricerca è diventata un lavoro completo: non chiedi “un link”, chiedi “un report”.
2) L’ufficio si sposta nel browser: se il browser sa agire, tante attività diventano più veloci.
3) Il coding cambia ritmo: più iterazioni rapide, meno tempo sui compiti ripetitivi.
4) L’hype non basta: servono processo, dati puliti e misure di qualità.
5) Efficienza e responsabilità contano quanto la potenza: costi, energia, controllo degli errori.

### Trend probabili per il 2026
- Strumenti che lavorano a blocchi di **30–120 minuti**, non a colpi di singola risposta.
- Più piloti automatici dentro software esistenti (browser, suite d’ufficio, IDE).
- Prezzi e metriche legati al risultato (e al costo operativo), non solo ai token.
- Più attenzione a qualità e sicurezza, soprattutto in aziende e PA.
- Più esecuzione “in locale” dove possibile, per costi e privacy.

---

## Appendice — Fonti (selezione, ordinate per codice)


* **[F01]** OpenAI — [“Announcing The Stargate Project”](https://openai.com/index/announcing-the-stargate-project/) — 21 Jan 2025
* **[F03]** DeepSeek — [“DeepSeek‑R1 Release Notes”](https://api-docs.deepseek.com/news/news250120) (weights: [Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-R1)) — 20 Jan 2025
* **[F04]** arXiv — [“Humanity’s Last Exam”](https://arxiv.org/abs/2501.14249) — 24 Jan 2025
* **[F05]** Mistral AI — [“Codestral 25.01”](https://mistral.ai/it/news/codestral-2501) — 13 Jan 2025
* **[F06]** OpenAI — [“Introducing deep research”](https://openai.com/index/introducing-deep-research/) — 3 Feb 2025
* **[F07]** Mistral AI — [“The all new le Chat: Your AI assistant for life and work”](https://mistral.ai/en/news/all-new-le-chat) — 6 Feb 2025
* **[F08]** OpenAI — [“Introducing GPT‑4.5”](https://openai.com/index/introducing-gpt-4-5/) — 27 Feb 2025
* **[F09]** Ars Technica — [“Will the future of software development run on vibes?”](https://arstechnica.com/ai/2025/03/is-vibe-coding-with-ai-gnarly-or-reckless-maybe-some-of-both/) — 5 Mar 2025
* **[F10]** Google — [“Gemini 2.5: Our newest Gemini model with thinking”](https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/) — 25 Mar 2025
* **[F11]** Google — [“Gemma 3: Google’s new open model based on Gemini 2.0”](https://blog.google/technology/developers/gemma-3/) — 10 Mar 2025
* **[F12]** OpenAI — [“OpenAI o3 and o4‑mini System Card”](https://openai.com/index/o3-o4-mini-system-card/) — 16 Apr 2025
* **[F13]** Meta — [“Llama 4”](https://ai.meta.com/blog/llama-4/) (alt: [https://www.llama.com/llama4/](https://www.llama.com/llama4/)) — 5 Apr 2025
* **[F14]** AWS — [“Amazon Bedrock adds Mistral AI Pixtral Large 25.02”](https://aws.amazon.com/about-aws/whats-new/2025/04/amazon-bedrock-mistral-ai-pixtral-large-25-02/) — 8 Apr 2025
* **[F15]** Qwen Team (Alibaba) — [“Qwen3”](https://qwenlm.github.io/blog/qwen3/) — 29 Apr 2025
* **[F16]** Google — [“AI Mode in Google Search: Updates from Google I/O 2025”](https://blog.google/products/search/google-search-ai-mode-update/) — 20 May 2025
* **[F17]** Google DeepMind — [“Veo”](https://deepmind.google/models/veo/) — 20 May 2025
* **[F18]** Anthropic — [“Introducing Claude 4”](https://www.anthropic.com/news/claude-4) — 22 May 2025
* **[F19]** Perplexity — [“Introducing Perplexity Labs”](https://www.perplexity.ai/hub/blog/introducing-perplexity-labs) — 29 May 2025
* **[F20]** Google — [“Build transformative AI applications with Google AI”](https://blog.google/technology/developers/google-ai-developer-updates-io-2025/) — 20 May 2025
* **[F21]** Mistral AI — [“Magistral”](https://mistral.ai/en/news/magistral) — 10 Jun 2025
* **[F22]** Perplexity — [“Introducing Comet”](https://www.perplexity.ai/hub/blog/introducing-comet) — 9 Jul 2025
* **[F23]** OpenAI — [“Introducing GPT‑5”](https://openai.com/index/introducing-gpt-5/) — 7 Aug 2025
* **[F24]** Google — [“Gemini 2.5 Flash‑Lite” (models docs)](https://ai.google.dev/gemini-api/docs/models/gemini#gemini-2.5-flash-lite) — Sep 2025
* **[F25]** OpenAI — [“Introducing ChatGPT Atlas”](https://openai.com/index/introducing-chatgpt-atlas/) — 21 Oct 2025
* **[F26]** Google Workspace Updates — [“Gemini 3 Pro”](https://workspaceupdates.googleblog.com/2025/11/gemini-3-pro.html) — 18 Nov 2025
* **[F27]** OpenAI — [“Introducing GPT‑5.2”](https://openai.com/index/introducing-gpt-5-2/) — 11 Dec 2025
* **[F28]** Google — [“Gemini 3 Flash”](https://blog.google/products/gemini/gemini-3-flash/) — 17 Dec 2025
* **[F29]** Lovable — [“Lovable 2.0”](https://lovable.dev/blog/lovable-2-0) — 24 Apr 2025
* **[F30]** Lovable — [“Series B”](https://lovable.dev/blog/series-b) — 18 Dec 2025
* **[F31]** U.S. Space Force — [“Data & AI FY2025 Strategic Action Plan”](https://www.spaceforce.mil/Portals/1/Documents/Data%20and%20AI%20FY25%20Strategic%20Action%20Plan.pdf) — 19 Mar 2025
* **[F32]** NASA — [dynamic targeting / onboard decision‑making for Earth observation](https://www.nasa.gov/) — 25 Jul 2025
* **[F33]** Gov.cn — [news on “space‑based computing constellation”](https://english.www.gov.cn/) — 15 May 2025
* **[F34]** ESA Φ‑lab — [AI4EO / challenges](https://ai4eo.esa.int/) — 2025 (ongoing)

