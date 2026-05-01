# LLM per GeoAI: applicazioni geospaziali, GIS e disaster response

<details class="post-warning">
<summary><strong>Articolo in revisione</strong> (clicca per aprire)</summary>

Questo articolo è ancora in lavorazione e sotto revisione editoriale. Alcuni paragrafi potrebbero risultare incompleti o cambiare in modo significativo nelle prossime settimane.

</details>

## Introduzione

Negli ultimi mesi si parla tantissimo di LLM, agenti, sistemi multimodali e strumenti di ragionamento. Molto spesso, però, il discorso resta sospeso in aria: si mostrano demo impressionanti, ma poi non è così chiaro dove queste tecnologie diventino davvero utili fuori da una chat generica (e generalista).

È proprio qui che, secondo me, il mondo geospaziale diventa interessante sul serio. Perché quando entriamo nel campo delle mappe, delle immagini satellitari, dei dati territoriali, del monitoraggio ambientale o della risposta alle emergenze, il linguaggio da solo non basta. Serve metterlo in relazione con coordinate, strati informativi, serie temporali, rilievi da satellite, banche dati geografiche e vincoli che provengono dal mondo comune. In altre parole, bisogna smettere di vedere l'LLM come un oggetto isolato e iniziare a trattarlo come un componente dentro un sistema più ampio.

In questo articolo voglio quindi ragionare in modo semplice ma concreto su **che cosa possono fare i modelli di linguaggio nel mondo geospaziale?** Immagino vari scenari possibili, come report post-evento, supporto decisionale, lettura di risultati da telerilevamento, collegamento tra fonti testuali e dati cartografici, [interfacce in linguaggio naturale sopra strumenti GIS già esistenti](https://www.mdpi.com/2220-9964/13/10/348).

Il messaggio di fondo è abbastanza netto. Nel mondo GEO gli LLM possono essere molto utili, ma raramente sono il cuore quantitativo dell'analisi. Non sono loro a dover segmentare con precisione un'immagine radar, stimare l'estensione di un'alluvione al metro o sostituire un algoritmo geospaziale specialistico: [nei compiti di object detection e image segmentation in Earth Observation il lavoro resta in mano a modelli di visione dedicati](https://www.mdpi.com/2072-4292/12/10/1667). Il loro valore, piuttosto, emerge quando devono **mettere in relazione informazioni diverse, sintetizzarle, spiegarle bene e renderle interrogabili in modo naturale**.

Per questo motivo, secondo me, ha senso parlare di **integrazione tra LLM e pipeline geospaziali**. Ed è proprio questo il filo che seguiremo nelle sezioni che vengono.

## I miei esempi preferiti

Veniamo ora al caso d'uso che mi interessa di più, ovvero applicare queste tecnologie in ambito geospaziale e di risposta a disastri, come terremoti, calamità naturali, ecc.

Questo settore combina dati _multi-modali_ (testi, mappe, immagini satellitari, sensori) e richiede sia **analisi quantitative precise** (es. rilevare danni da immagini) sia **capacità di sintesi e ragionamento** (es. redigere un rapporto di situazione, fare inferenze su rischi). Gli LLM possono giocare un ruolo prezioso, ma **devono essere integrati correttamente** con i flussi geospaziali esistenti. Vediamo alcuni scenari.

### LLM + RAG per report post-terremoto

Immagina dopo un forte terremoto di dover creare rapidamente un rapporto che riassuma i danni, le zone più colpite, lo stato delle infrastrutture e possibili azioni. Si dispone di varie fonti: relazioni dei vigili del fuoco, post sui social geolocalizzati, immagini satellitari con analisi dei crolli, database GIS con edifici e popolazione.

Un LLM da solo non _sa_ nulla del terremoto (a meno di aver addestrato su eventi passati, ma non sul nuovo). Però potremmo usarlo come **motore di generazione linguistica** alimentandolo con i dati specifici dell'evento. Con un approccio RAG, il sistema può recuperare ad esempio: _"rapporti testuali dei vigili del fuoco nelle ultime 12h"_, _"risultati di analisi automatica da immagini (X edifici crollati in area Y)"_, _"elenchi di strade bloccate da mappe live"_. La logica è coerente con il lavoro originale sul RAG, dove [il retrieval serve a dare al modello accesso a memoria esplicita, migliorare factuality e rendere possibile la provenance delle risposte](https://nlp.cs.ucl.ac.uk/publications/2020-05-retrieval-augmented-generation-for-knowledge-intensive-nlp-tasks/). Queste informazioni vengono inserite (magari in forma già riassunta) nel prompt, e l'LLM viene incaricato di redigere un **resoconto coerente e leggibile** per, ad esempio, le autorità. L'LLM eccelle nel **collegare i punti**: può prendere l'elenco di fatti e trasformarlo in una narrazione: "Nella zona nord della città (Quartiere XX), risultano crollati circa 30 edifici, con le maggiori concentrazioni di danni lungo Via Alfa e Via Beta. Le squadre di soccorso hanno tratto in salvo 12 persone dalle macerie e segnalano almeno 5 dispersi. Il ponte sul fiume è inagibile, isolando temporaneamente la frazione Gamma...".

Senza LLM, un operatore umano dovrebbe manualmente scrivere questo sommario integrando tante fonti; con l'LLM, l'operatore può concentrarsi su verificare e correggere, invece di scrivere da zero. 

> **Importante:** come visto, qui l'LLM va collegato (_grounded_) ai dati reali: non vogliamo che inventi numeri di dispersi! Dunque forniamo cifre e dettagli precisi via RAG, e magari chiediamo al modello di citare le fonti (se l'output è solo per uso interno). In tal modo l'LLM fa bene ciò che sa fare (linguaggio e ragionamento testuale) ma non agisce "in assenza di informazioni".

### LLM + agenti per supporto decisionale in emergenza

In situazioni di crisi, un responabile della protezione civile potrebbe interrogare un sistema AI con domande complesse, tipo _"Dove dovremmo concentrare le squadre USAR (Urban search and rescue) in base alle segnalazioni e ai dati di danno?"_. Rispondere richiede: capire la domanda (compito linguistico), avere dati (geospaziali e testuali), ragionare combinando _criteri_ (ad esempio: squadre USAR = ricerca e soccorso in macerie, quindi servono dove edifici crollati e popolazione intrappolata potenziale è maggiore). Un singolo modello statico farebbe fatica. Ma possiamo costruire un **agente LLM** dotato di strumenti: uno che scriva una query su un database GIS per numero di edifici crollati per zona, uno che legge gli ultimi messaggi SOS arrivati, uno che consulta il registro di squadre già dispiegate. È la stessa direzione mostrata da lavori come ReAct, dove [il modello alterna reasoning e azioni verso fonti esterne per raccogliere informazioni aggiuntive](https://iclr.cc/virtual/2023/poster/11003), o Toolformer, dove [il language model impara quando chiamare API esterne e come incorporarne i risultati](https://arxiv.org/abs/2302.04761).

L'agente può fare un piano tipo:

1) ottenere mappa di densità crolli;

2) ottenere elenco segnalazioni di persone intrappolate;

3) incrociare per zone;

4) proporre priorità.

I passi 1) e 2) li fa tramite tool (ad esempio chiamando un'API geospatiale che ritorna dati, o eseguendo una query su un knowledge graph di emergenza). Poi l'LLM stesso può generare una risposta tipo: 

_"Le zone con maggior bisogno di USAR sembrano A e B. Nel quartiere A ci sono 20 edifici crollati, a cui corrispondono circa 50 persone sotto macerie segnalate e al momento c'è solo una squadra operativa, suggerisco di inviarne almeno altre due. Nel quartiere B (15 crolli, 30 persone segnalate) la situazione è simile. Le zone C e D hanno meno crolli o ha già copertura sufficiente."_.

Questo è puro **supporto decisionale**: l'LLM non prende la decisione, ma fornisce un'analisi ragionata e leggibile rapidamente, integrando dati disparati (GIS + segnalazioni + stato risorse). Ciò permette al responsabile di confermare e agire molto più velocemente. Ancora, l'LLM qui funge da **collettore intelligente**: manipola i dati con ragionamenti e li presenta efficacemente a chi poi dovrà decidere.

### LLM + modelli di Remote Sensing (RS)

Quando si analizzano immagini satellitari o telerilevamento, spesso otteniamo risultati tecnici, come mappe di classificazione, matrici di confusione, percentuali di danno per cella, ecc. Un LLM può aiutare a tradurre questi output grezzi in **insight fruibili** a tutti* (metto un asterisco perché possiamo adattare gli output in base a chi leggerà questi report).

Per esempio, un modello di visione computazionale elabora immagini post-disastro e produce come output shapefile con poligoni delle aree allagate, e un indicatore di gravità per area. Un LLM potrebbe prendere questi risultati (convertiti in testo strutturato) e generare un **briefing**:

_"Le analisi satellitari indicano estese inondazioni lungo il fiume Delta: circa 45 km² di territorio risultano allagati. Particolarmente colpiti i comuni di X e Y, dove l'acqua ha coperto rispettivamente ~30% e ~45% dell'area urbana. L'area industriale di Y è interamente sommersa con possibile rilascio di sostanze in acqua. Le infrastrutture principali interessate includono la SP123 e la ferrovia Z, entrambe interrotte."_.

Osserva quante deduzioni e aggregazioni sono incluse: l'LLM può descrivere l'area totale (sommando poligoni), convertire quell'informazione in frase di impatto, identificare comuni dentro i poligoni (incrociando coordinate con nomi via un tool GIS nel backend), menzionare infrastrutture toccate (se ha dati vettoriali su strade ferrovie, può incrociarli). Insomma, lo usiamo come un _report generator intelligente_ che sta sopra ai modelli numerici.

**Cosa non deve fare l'LLM?** Non deve fare _lui_ la segmentazione sull'immagine! Per riconoscere pixel allagati c'è un modello di visione specialistico che lavora su raster e magari utilizza reti convoluzionali o altre architetture: [nella letteratura EO/RS image segmentation e object detection vengono infatti trattate come problemi specifici di deep learning visivo](https://www.mdpi.com/2072-4292/12/10/1667). L'LLM non ha la percezione visiva diretta (a meno di usare un modello multimodale, ma attualmente per compiti di precisione i modelli dedicati sono migliori). Quindi la regola è: lasciare ai modelli RS il lavoro "pixel-wise" quantitativo (sono addestrati per alta accuratezza su quello), e usare l'LLM per **collegare quei risultati con la conoscenza e presentarli**. Un LLM può ad esempio spiegare perché un certo pattern di allagamento è pericoloso ("quest'area era già franosa, l'alluvione la rende instabile"), cosa che un modello RS puro non fa.

**Multimodalità (testo ↔ immagini ↔ geospaziale):** Vale la pena notare che la tendenza attuale è verso modelli in grado di ingerire più forme di dati. Ad esempio [GPT-4 è stato presentato come un large multimodal model che accetta input di testo e immagini](https://openai.com/research/gpt-4). Ci sono modelli come [CLIP che apprende rappresentazioni visive a partire da testo naturale](https://proceedings.mlr.press/v139/radford21a.html) e [BLIP che unifica vision-language understanding e generation](https://proceedings.mlr.press/v162/li22n.html). Quindi in un futuro non lontano potresti avere un _LLM multimodale_ che prende direttamente sia mappe che testi. Già oggi modelli come [PaLM-E integrano input multimodali per grounding e reasoning](https://arxiv.org/abs/2303.03378), mentre [Kosmos-1 esplora esplicitamente la convergenza tra linguaggio e percezione](https://arxiv.org/abs/2302.14045). Nel contesto disastri, immagina di dare al modello sia la mappa del danno sia i tweet localizzati: un modello multimodale potrebbe combinare direttamente e spiegarti la situazione. Siamo agli inizi in questo - per ora, l'approccio modulare (modello visivo + LLM) è più pratico.

**Cosa un LLM _non deve fare_ nel geospaziale/DR:** come già accennato, non affidare a un LLM la **precisione tecnica** che richiede algoritmi dedicati. Se devi ottenere la latitudine/longitudine di un indirizzo, usa un geocoding API, non chiedere al modello di inventarsela! Se devi calcolare la magnitudo di un terremoto dai dati sismografici, servono formule fisiche, non il "parere" di un LLM. Gli LLM non hanno garanzie di accuratezza numerica né rigore scientifico. Quindi le parti _core_ di analisi (rilevare danno, calcolare estensioni, contare esatti) vanno fatte con metodi deterministici o modelli ML specialistici. LLM eccelle invece in: **sintesi, correlazione di alto livello, comunicazione, Q&A**. Inoltre è bravissimo a colmare gap di knowledge generale: se in un rapporto devi anche spiegare concetti (es: cos'è una faglia sismica, o quali sono gli effetti del liquefacimento del suolo) l'LLM può generare quei paragrafi attingendo alla sua conoscenza addestrata.

**Integrazione con pipeline GEO esistenti:** Potresti immaginare il tuo sistema come: pipeline di data ingestion (satelliti, sensor, open data) → modelli analitici (CV per immagini, GIS computations, ecc.) → **layer LLM** per l'output all'utente. È anche la logica mostrata nei lavori che usano l'LLM come [ponte tra linguaggio naturale e codice GIS eseguibile](https://www.mdpi.com/2220-9964/13/10/348) oppure come [interfaccia per generare query SQL spaziali a partire da domande in linguaggio naturale](https://www.mdpi.com/2220-9964/13/1/26). In fase di design, definisci bene l'API tra il layer analitico e l'LLM. Spesso conviene strutturare i dati in un formato testuale comprensibile al modello (es. bullet point o JSON), includendo anche spiegazioni. Ad esempio, invece di buttare raw numbers, potresti dire: "Strada X: interrotta (ponte crollato)". Così l'LLM sa già che la strada X è interrotta e perché, e può facilmente includerlo nel suo racconto, magari ragionando "ponte crollato → isolato quel comune a nord". Se dessi solo "strada X status: 0" dovrebbe inferire il significato di 0, molto più difficile. Quindi fare un po' di **data preprocessing per LLM** è utile: convertire i risultati tecnici in frasi o dichiarazioni semplici.

**Validazione incrociata:** in ambiti safety-critical (disastri lo sono), un LLM non deve essere l'unica voce. Si possono usare _ensemble_ di approcci: far generare il rapporto all'LLM, poi farlo rileggere a un altro LLM chiedendo di evidenziare contraddizioni o possibili errori, e infine avere un human-in-the-loop (un operatore) che verifica punti chiave. Questa impostazione è molto in linea con le raccomandazioni del NIST, che insiste su [human oversight roles, valutazioni indipendenti e politiche di supervisione per sistemi generativi usati in contesti a rischio](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence). Oppure generare due versioni (magari con temperature diverse o prompt diversi) e confrontare. Insomma, usare l'LLM come assistente, non come oracolo.

In conclusione su GEO & Disaster Response: un LLM può fungere da **collettore intelligente e comunicatore** sopra i dati geospaziali. Pensalo come un **analista virtuale** che conosce un po' di tutto (grazie al training generale) e che può essere istruito a usare i tuoi dati specifici per produrre analisi e report. Ti libera dal dover manualmente interpretare ogni mappa e ogni tabella, proponendoti un quadro integrato. Ma tu come ingegnere predisponi l'ecosistema: modelli specialistici per estrarre info dai dati grezzi, database ben organizzati, e poi l'LLM opportunamente imbrigliato (prompt mirati, RAG, tool) per cucire il tutto. Così sfrutti il meglio dei due mondi - accuratezza quantitativa dei modelli geo e _intelligenza linguistica_ degli LLM.
