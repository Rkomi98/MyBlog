# AI Ethics e Data Governance per GenAI enterprise, agenti e MCP
Prima di iniziare con questo lungo articolo, faccio un passo indietro e spiego perché è nato questo articolo. Sento sempre più persone preoccupate per i dati che forniscono su questi chatbot. Il problema non è tanto l'utilizzo di questi dati per il training (come molti pensano), ma ci sono molte altre cose da considerare!

## Executive synthesis

La tesi centrale che emerge dalle fonti più solide che ho consultato è controintuitiva ma di carattere operativo: nei sistemi di GenAI aziendali il rischio principale non è *“se il provider allena il modello coi nostri dati”* (importante ma spesso gestibile), bensì *“dove transitano e dove si sedimentano i dati lungo la catena modello → tool → integrazioni → log”*. 

In altre parole, la *data policy* del provider è solo il primo anello: la superficie di esposizione reale cresce quando introduciamo **workflows agentici, MCP server, tool call, memoria, retrieval, automazioni multi-componente e connettori verso SaaS/DB**. Questa catena crea un “data exhaust” distribuito: prompt e allegati, contesto recuperato (RAG), argomenti delle tool invocation, output dei tool, artefatti temporanei (cache, sandbox, file), audit log e telemetria.

> **Data exhaust** significa l’insieme dei dati generati come sottoprodotto delle attività digitali, anche quando non sono il dato “principale” che volevi raccogliere. Alcuni esempi sono i log di navigazione, click e tempi di permanenza, cronologia delle ricerche, dati di posizione, metadata di utilizzo di app o servizi

Molti provider dichiarano “no training by default” per le offerte business, ma **continuano a esistere retention tecniche e retention di sicurezza** (abuse monitoring, policy enforcement, incident response), con eccezioni e differenze tra endpoint/feature che un team tecnico deve conoscere per evitare sorprese in produzione. OpenAI, per esempio, distingue tra *abuse monitoring logs* (fino a 30 giorni di default) e *application state* che alcuni endpoint conservano fino a cancellazione esplicita; inoltre evidenzia che i dati inviati a MCP server remoti sono soggetti alle policy del terzo. citeturn1view0turn18view2

Da qui discendono quattro evidenze operative.

La prima: **API ≠ interfaccia consumer**. In più ecosistemi, l’uso via API (soprattutto “paid/enterprise”) è governato da termini e controlli più stringenti rispetto alle UI consumer. Google lo formalizza esplicitamente: nelle *Unpaid Services* (es. quota non pagata o AI Studio non legato a billing) i dati possono essere usati per “provide, improve, develop” con anche revisione umana; nelle *Paid Services* dichiara che prompt e risposte non sono usati per migliorare i prodotti e sono trattati sotto DPA. citeturn14view0 Anche OpenAI ribadisce che per i servizi business (ChatGPT Business/Enterprise/Edu e API) non allena sui dati “by default”, mentre sui servizi individual può farlo salvo opt-out. citeturn18view3turn18view2 Anthropic separa nettamente consumer vs commerciale: le modifiche 2025 su training/retention riguardano Free/Pro/Max, mentre non si applicano a Claude for Work (Team/Enterprise) e API sotto Commercial Terms. citeturn5search0turn9view0

La seconda: **“opt‑out” non significa “i dati non esistono più”**. In tutti gli stack seri, anche con opt-out dal training, rimangono motivazioni legittime per trattare e trattenere dati: sicurezza, anti-abuso, obblighi legali, debug affidabilità. OpenAI chiarisce che i *Temporary Chats* non addestrano e sono cancellati entro 30 giorni, ma possono essere revisionati per monitoraggio abusi. citeturn18view0turn18view3 Anthropic, per i prodotti commerciali, parla di cancellazione backend entro 30 giorni e di retention più lunga se contenuti sono flaggati come violazioni della Usage Policy (fino a 2 anni, punteggi fino a 7). citeturn9view0 Google Gemini Apps consumer segnala che la revisione umana può comportare retention fino a 3 anni di chat selezionate, anche se l’utente cancella attività. citeturn12view0

La terza: **gli agenti trasformano la governance da “policy documento” a “policy eseguibile”**. Quando un modello può fare tool call, la conversazione diventa un *programma* che muove credenziali e dati. Le fonti MCP e di sicurezza sono esplicite: MCP introduce rischi “classici” (SSRF, code execution, OAuth confusion) e “nuovi” (token passthrough, session hijacking prompt injection, compromissione di server locali) e prescrive mitigazioni come consent per-client, validazione redirect URI e minimizzazione degli scope. citeturn30view0 Non è teoria: nel 2025–2026 compaiono vulnerabilità con CVE legate a implementazioni MCP e tooling (es. RCE su mcp-remote; RCE su MCP Inspector; vulnerabilità Cursor/MCP con possibile command injection e RCE). citeturn31search6turn31search15turn31search0

La quarta: **la normativa (EU AI Act) è un acceleratore se la traduciamo in scelte architetturali e di processo**. Le fonti UE confermano entrata in vigore (1 agosto 2024) e applicazione “a scaglioni” fino al 2027; inoltre indicano che divieti (unacceptable risk) e obblighi per i modelli di AI “general-purpose” sono già applicabili, mentre molte regole high‑risk scattano 2026–2027. citeturn21search2turn22view0 In pratica: se un workflow agentico tocca domini Annex III (es. lavoro, istruzione, credito, accesso a servizi essenziali) o agisce come componente di un prodotto regolato, la strategia migliore non è “blocchiamo l’AI”, ma **costruiamo tracciabilità, human oversight reale, data governance e controllo delle dipendenze**.

**Rischi più rilevanti (priorità pratica)**: (1) *data exfiltration* via tool (prompt injection indiretta + tool con permessi eccessivi), (2) compromissione/supply chain di MCP server (locali o remoti) con esecuzione di comandi o accesso a sorgenti interne, (3) logging/retention non intenzionale (feature non ZDR-eligible, cache, conversation state), (4) responsabilità distribuita opaca tra provider-modello, piattaforma agentica, MCP server, SaaS target e team interno. citeturn30view0turn31search6turn1view0turn32search3

**Takeaway operativi per team tecnici e azienda**: mappare il *data path* end-to-end (non solo il provider), classificare i dati per “dove possono andare” (UI/API/tools), adottare *least privilege* e scope minimization come default, mettere *human‑in‑the‑loop* sulle azioni irreversibili, e rendere auditabili tool call e decisioni dell’agente. Questo è coerente con NIST AI RMF (Govern/Map/Measure/Manage) e con l’approccio “AI management system” di ISO/IEC 42001. citeturn23search4turn23search1

## Data policy dei principali provider e strumenti

Qui l’obiettivo è rispondere alla domanda che in azienda arriva sempre uguale ma con sottotesto diverso: **“dove finiscono davvero i dati?”**. La risposta utile è: finiscono **in più posti**, con differenze forti tra piani e superfici (consumer UI, workspace business, API, agentic tooling).

### Tabella comparativa sintetica

| Provider / superficie | Training o model improvement (default) | Opt‑out: significato operativo | Retention e log (punti da sapere) | Data residency (realtà vs aspettative) | Caveat “da squadra tecnica” |
|---|---|---|---|---|---|
| **OpenAI ChatGPT (workspace personale: Free/Plus/Pro)** | Può usare contenuti per training; l’utente può disattivare “Improve the model for everyone”. citeturn18view1turn18view3 | Opt‑out vale **per le nuove conversazioni**: disattiva uso per training, non “annulla” trattamenti per sicurezza/abuso. citeturn18view1turn18view0 | *Temporary Chat* cancellata entro 30 giorni e non usata per training; possibile review per abusi. citeturn18view0turn18view3 | Non è un’offerta “residency-first” nella UI consumer; se serve controllo geografico serio si passa a offerte/business o API con controlli dedicati. citeturn1view0turn18view2 | Attenzione a: allegati, GPTs, connettori; l’opt‑out non elimina rischi di leakage via tool/integrations. citeturn0search8turn30view0 |
| **OpenAI ChatGPT Business / Enterprise / Edu** | “No training by default” su input/output. citeturn18view2turn18view3 | Opt‑out è di fatto lo standard; resta possibile opt‑in tramite meccanismi espliciti (feedback/Playground) per alcuni casi API. citeturn18view3turn0search9 | Enterprise privacy: controlli su retention (esplicitati per Enterprise/Healthcare/Edu). citeturn18view2 | Dipende dalle opzioni contrattuali e controlli di piattaforma; per API esistono anche “data residency controls” configurabili a progetto con limiti e “system data” fuori regione. citeturn1view0 | “No training” ≠ “no logging”: servono policy interne su cosa può entrare e come si logga lato vostro (SIEM/observability). |
| **OpenAI API Platform** | Dal 1 marzo 2023: dati API non usati per training **salvo opt‑in esplicito**. citeturn1view0turn18view3 | Opt‑in è un’azione **attiva**; default è opt‑out per organizzazioni. citeturn0search9turn18view3 | *Abuse monitoring logs* fino a 30 giorni di default; possibili opzioni “Modified Abuse Monitoring” / “Zero Data Retention” con approvazione. Alcuni endpoint conservano *application state* “until deleted”. citeturn1view0 | “Data residency controls” a livello progetto: customer content “stored at rest” in regione selezionata **solo dove serve persistenza**; “system data” può stare fuori. citeturn1view0 | Se usi tool esterni (es. MCP server remoto), i dati escono dal perimetro OpenAI e seguono la policy del terzo. citeturn1view0 |
| **OpenAI Codex (agente di coding, local + cloud)** | Per Business/Enterprise/Edu: stessa logica “no training by default”; per Plus/Pro: conversazioni possono essere usate salvo training off. citeturn20view1turn18view3 | Opt‑out dipende dal piano/workspace e dalle impostazioni ChatGPT (data controls). citeturn20view1turn18view1 | Differenza critica: attività “cloud” può entrare in canali di compliance (es. Compliance API), mentre uso locale no. citeturn20view1 | Per residenza/retention: riferimento a “Data Retention & Residency policies” e controlli workspace; verificare per superficie (web/cloud vs locale). citeturn20view1turn1view0 | Codex Security collega repo GitHub e lavora in sandbox isolata con patch per review umana: è già un pattern di governance (human review). citeturn20view0 |
| **Anthropic Claude consumer (Free/Pro/Max)** | Dal 2025 l’utente sceglie se abilitare uso dei dati per training/model improvement; se abilita, retention fino a 5 anni. citeturn5search0 | Opt‑out (o mancata scelta) incide su **nuove o “resumed”** chat/sessions; cancellare una conversazione la esclude dal training futuro. citeturn5search0 | Se non si abilita training: retention “esistente” 30 giorni (consumer). citeturn5search0 | Non descritta come residency configurabile nella consumer UI nelle fonti qui usate; per requisiti forti si passa a canali commerciali/API. citeturn9view0turn16view0 | La principale fonte di rischio in azienda è lo “shadow use” di account consumer per dati di lavoro. citeturn5search0turn9view0 |
| **Anthropic Claude for Work + API (Commercial)** | Per il commerciale: retention e uso dati descritti separatamente; per “Anthropic on Vertex” i termini indicano che non può addestrare su Customer Content. citeturn9view0turn8view0 | Opt‑out dal training è sostanzialmente incorporato nei termini commerciali (salvo accordi specifici); esistono accordi ZDR per endpoint idonei. citeturn10view0turn9view0 | API: input/output cancellati entro 30 giorni (con eccezioni: Files API, accordi ZDR, enforcement UP, legge). Violazioni UP: retention fino a 2 anni (e score fino a 7). citeturn9view0turn10view0 | Data residency su Claude API: controllo *inference_geo* (“global” o “us”) e vincoli workspace; *workspace geo* oggi solo “us”. citeturn16view0 | ZDR non copre tutto: console/workbench e varie feature no; anche in ZDR rimane possibilità di retention per violazioni UP/legge. citeturn10view0turn9view0 |
| **Google Gemini Apps (consumer)** | Dati usati per fornire e migliorare servizi; revisori umani possono vedere alcune chat; avvertenza: non inserire confidenziale. citeturn12view0 | Controlli (Keep Activity) influenzano personalizzazione e log, ma alcune elaborazioni per rispondere e proteggere Google restano anche con Keep Activity off. citeturn12view0 | Default auto-delete 18 mesi (configurabile); chat revisionate conservate fino a 3 anni anche se si elimina attività. citeturn12view0 | Non è pensata come soluzione di data residency enterprise. | Rischio tipico: dipendenti che usano Gemini consumer per lavoro → dati sotto regole consumer. |
| **Google Workspace with Gemini (business/edu/public sector)** | Dichiarazione esplicita: contenuti non usati per training “outside your domain” senza permesso; niente human review. citeturn13view0turn11search16 | La governance è in mano agli admin (abilitare/disabilitare, history, retention, audit). citeturn13view0turn11search14 | “Gemini in Workspace” prompt/response non trattenuti dopo sessione; Gemini app (come servizio Workspace) può essere trattenuta fino a 36 mesi (admin). Conversation history off: salvataggio fino a 72 ore. citeturn13view0 | Si appoggia a modello Google Workspace e CDPA; esistono controlli (es. client-side encryption) che possono limitare accesso a contenuti cifrati. citeturn13view0 | È un buon esempio di governance come abilitatore: audit log, Vault, controlli retention, firewall settings. citeturn13view0turn11search14 |
| **Google Gemini Developer API vs Vertex AI (Cloud)** | Gemini API: *Unpaid* può essere usato per miglioramento con human review; *Paid* non usa prompt/risposte per migliorare prodotti e opera sotto DPA. citeturn14view0turn14view1 | “Zero data retention” richiede evitare feature che impongono storage (es. grounding Search/Maps 30 giorni) e gestire store/cached content. citeturn14view1turn14view3 | Vertex AI: caching in-memory 24h (RAM) per performance; grounding Search/Maps conserva 30 giorni e non è disattivabile (salvo alternative enterprise). citeturn14view3turn11search6 | Vertex AI ha data residency per dati at-rest nella location selezionata e documentazione dedicata. citeturn11search6turn14view3 | La distinzione “developer quickstart” vs produzione è spesso qui: prototipo su Unpaid/AI Studio può violare policy dati interne. citeturn14view0 |
| **Cursor (IDE + agent, non provider)** | Con Privacy Mode/ZDR: code e prompt non sono memorizzati/usati per training dai provider; Cursor dichiara accordi ZDR con provider chiave per Enterprise (OpenAI, Anthropic, Google Vertex, xAI). citeturn17search1turn17search4 | Opt‑out “reale” dipende dalla modalità e dal flusso: alcune feature (memories/sync) possono richiedere storage su server Cursor (anche se non training). citeturn17search7turn17search13 | Cursor chiarisce due cose cruciali: (1) anche con BYOK le richieste passano dal backend Cursor per prompt building; (2) la ZDR Cursor **non si applica** quando usi la tua API key: vale la policy del provider scelto. citeturn17search6turn17search0 | Data residency dipende dall’infrastruttura Cursor e provider; la security page descrive hosting e terze parti (es. AWS, Baseten, Together) e condizioni di retention per “Share Data”. citeturn17search13turn17search0 | Cursor integra MCP e raccomanda cautela: “capire cosa fa un server prima di installarlo”. citeturn17search2turn17search5 |

### Differenze API vs consumer vs “stack agentico” (il cambio operativo che conta)

| Aspetto | Consumer UI (chat app) | Business workspace (suite enterprise) | API (build) | Stack agentico (tools/MCP/automazioni) |
|---|---|---|---|---|
| Controllo “training” | Spesso opt‑out a livello utente (toggle) con comportamento non retroattivo. citeturn18view1turn5search0 | Tipicamente “no training by default” con garanzie contrattuali e controlli admin. citeturn18view2turn13view0 | Tipicamente no training di default e opt‑in esplicito (ma dipende da “paid/unpaid” e contratti). citeturn1view0turn14view0 | Il problema non è solo training: tool call può inviare dati a terzi; la governance deve coprire *routing* e *permissions*. citeturn1view0turn30view0 |
| Retention | Può essere lunga e influenzata da activity settings / feedback / human review. citeturn12view0turn18view0 | Admin decide retention/histories/audit; spesso più trasparente. citeturn13view0turn18view2 | Log e state sono granulari per endpoint/feature; ZDR spesso “parziale” (alcune feature non eleggibili). citeturn1view0turn14view1 | Tool e MCP aggiungono nuove retention: log tool, audit trail, stored credentials, sandbox artifacts, caches. citeturn30view0turn31search6 |
| Data residency | Raramente personalizzabile. | Più probabile via offerte enterprise (Workspace/Cloud). citeturn11search6turn13view0 | Possibile ma con limiti (es. “system data” fuori regione; feature che forzano storage). citeturn1view0turn14view3 | MCP server può stare ovunque: la residency “vera” diventa un problema di supply chain e rete. citeturn30view0turn31search6 |

**Consenso e ambiguità tra provider (da esplicitare in articolo)**: c’è un forte consenso sul “no training by default” per le offerte business/API *pagate/contrattuali* (OpenAI Enterprise privacy; Google Paid Services; Anthropic commerciale). citeturn18view2turn14view0turn9view0 L’ambiguità sta nei dettagli: differenze tra endpoint/feature, definizioni (training vs abuse monitoring vs model improvement), eccezioni (policy violations, grounding Search/Maps, human review su consumer), e soprattutto nel fatto che **integrazioni e MCP spostano il problema fuori dal perimetro del provider**. citeturn1view0turn30view0

## MCP e superficie di esposizione nei workflow multi-componente

MCP nasce per un obiettivo legittimo: **connettere gli assistenti ai sistemi “dove vivono i dati”** (repository, tool aziendali, ambienti di sviluppo) con un protocollo standard. citeturn25view1turn29search7 Architetturalmente, MCP introduce un pattern *client–host–server* e scambi di contesto e tool su sessioni stateful (basate su JSON‑RPC). citeturn29search4turn29search8

### Il flusso “dato → modello → tool call/MCP → risposta → azione” e cosa vede chi

Un modo concreto per descriverlo in azienda è ragionare per “punti di transito”:

1) **Input** (prompt utente + contesto): può includere dati aziendali, segreti, personal data, frammenti di file. Questo materiale finisce nel provider LLM, ma spesso anche in caching, log di abuso o conversation state a seconda dell’endpoint/feature. citeturn1view0turn14view3  
2) **Decisione del modello**: il modello decide di chiamare un tool; qui il rischio è che istruzioni malevole siano interpretate come comandi (prompt injection, soprattutto indiretta). Microsoft descrive l’indirect prompt injection come input “non fidato” che il modello scambia per istruzioni, con impatti da esfiltrazione a azioni non volute con le credenziali dell’utente. citeturn32search3turn32search11  
3) **Tool invocation**: payload verso MCP server (argomenti, query, filtri, ID, eventualmente pezzi di contesto). Qui **il server MCP vede ciò che invii**; se è remoto o di terze parti, stai letteralmente esportando dati fuori perimetro. OpenAI lo esplicita: i server MCP (remote MCP server tool) sono terze parti e i dati seguono la loro retention. citeturn1view0  
4) **Tool response**: può contenere dati sensibili (query result, file content, token, error stack). Se inserita nel contesto del modello, rientra nel perimetro del provider e nei suoi log. citeturn1view0turn14view1  
5) **Azione**: se il tool scrive (update DB, crea ticket, invia messaggi, merge PR), il rischio passa da “leakage” a “impatti operativi” (integrità, disponibilità, frodi).

### Rischi reali vs timori generici (con prove)

**Prompt injection e indirect prompt injection** non sono un rischio ipotetico: esistono benchmark e misurazioni che mostrano vulnerabilità diffuse in agenti tool‑integrated (InjecAgent; BIPIA; Agent Security Bench). citeturn32search0turn32search8turn32search2 OWASP continua a classificare prompt injection come rischio primario per LLM apps e descrive scenari di data exfiltration quando output non è validato. citeturn24search15turn24search3

**Tool poisoning / supply chain MCP** è già entrato nel mondo “CVE e advisory”. Esempi ad alto segnale:
- **mcp-remote**: advisory GitHub per CVE‑2025‑6514 su OS command injection quando ci si connette a MCP server non fidato (RCE). citeturn31search6  
- **MCP Inspector**: CVE‑2025‑49596 (NVD) per RCE dovuta a mancanza di autenticazione tra client e proxy. citeturn31search15  
- **Cursor**: NVD descrive CVE‑2025‑61591 (versioni 1.7 e sotto) con impersonazione di MCP server e command injection/possibile RCE nel contesto MCP+OAuth. citeturn31search0  
- **GitHub MCP server**: write‑up tecnico (Invariant Labs) e issue GitHub che descrivono possibilità di accesso a dati di repo privati sfruttando flussi MCP/OAuth/token scope. citeturn31search1turn31search4  

**Il punto chiave per l’articolo**: l’ansia generica “l’AI ci ruba i dati” è troppo vaga. Il rischio concreto è più meccanico: *un agente con un tool può essere indotto a fare richieste sbagliate con i tuoi privilegi*.

### Differenza di rischio: read‑only vs write vs “manda dati fuori”

MCP stesso insiste su *scope minimization* e su anti‑pattern come *token passthrough*, perché rompono accountability e confini di fiducia. citeturn30view0 Operativamente:

- **Solo lettura (read)**: rischio primario = data leakage/esfiltrazione (soprattutto se il tool può leggere molto e il modello decide cosa estrarre).  
- **Scrittura (write)**: rischio primario = manipolazione e danni (integrità), escalation e azioni irreversibili.  
- **Egress verso servizi esterni**: rischio primario = uscita dal perimetro legale/contrattuale (DPA, residency) e difficoltà di audit.

Queste non sono categorie astratte: sono la base per decidere *quando* serve approvazione umana e *quali* scope concedere.

## Classificazione del rischio e gestione dei dati nei workflow AI

La classificazione dati “tradizionale” (pubblico / interno / riservato / sensibile) funziona ancora, ma va adattata: non basta più stabilire *chi può leggere*, bisogna stabilire **quale superficie AI può trattare quel dato** (consumer UI, business workspace, API, agenti con tool, agenti con MCP remoto).

### Tassonomia pragmatica e impatto sulle scelte

Una versione enterprise-friendly (minima ma utile) può essere:

**Pubblico** (open web, comunicati), **Interno** (processi, KPI non pubblici), **Riservato** (IP, contratti, dati clienti), **Sensibile** (PII, dati particolari, segreti, credenziali). Questo si collega direttamente a scelte di piano e superficie:

- Se il dato è **Riservato/Sensibile**, l’uso di superfici consumer dove i dati possono essere usati per miglioramento e con revisione umana è in genere incompatibile con policy interne: Google Gemini Apps consumer avverte esplicitamente di non inserire confidenziale se non lo si vuole esposto a revisori e miglioramento. citeturn12view0  
- Per la stessa categoria, le offerte business/API pagate tipicamente offrono impegni più solidi: OpenAI “no training by default” per Business/Enterprise/API; Google “Paid Services” Gemini API; Workspace privacy hub; Anthropic retention commerciale. citeturn18view2turn14view0turn13view0turn9view0  

### Livelli di rischio per tipologia di workflow

| Workflow | Dati che tipicamente transitano | Rischi dominanti | Livello rischio (indicativo) | Note operative |
|---|---|---|---|---|
| Chat “stateless”, senza tool | Prompt e output; eventuali allegati | Leakage nel provider/log/retention; errori/hallucinations | Medio (dipende dal dato) | Riduci contesto, usa workspace business/API pagata per dati non pubblici. citeturn18view3turn14view0 |
| RAG read‑only (retrieval controllato) | Query, chunk recuperati, output | Data exfiltration via prompt injection indiretta; over‑retrieval | Medio–Alto | Benchmark su IPI mostra che tool‑integrated agents sono vulnerabili; serve retrieval minimization e confini. citeturn32search0turn32search3 |
| Agente con tool read‑only (ticketing, repo, doc) | Argomenti tool call, risultati, metadati | Indirect prompt injection + leakage; token misuse | Alto | MCP security doc: token passthrough e SSRF come rischi concreti. citeturn30view0 |
| Agente con tool write | Come sopra + modifiche a sistemi | Integrity attacks, azioni non volute | Molto alto | Richiede human approval su azioni irreversibili e kill switch. |
| Agente con egress verso terzi (email/SMS/webhook) | Dati e contenuti inviati fuori | Violazioni perimetro legale/contrattuale, data exfil | Critico | Approccio “deny by default” su egress; allowlist domini e payload. citeturn30view0turn33search4 |
| Multi‑agent / workflow orchestrato | Stato condiviso, memory, code exec artifacts | Amplificazione: più superfici, più segreti, più opportunità poisoning | Critico | ASB e lavori su memory poisoning (AgentPoison) mostrano una classe di attacchi su memoria/RAG. citeturn32search14turn32search2 |

### Tecniche difensive che “spostano l’ago” (non cosmetiche)

Qui è utile collegare controlli a standard “seri” e non a check-list di marketing. NIST AI RMF struttura le attività in Govern/Map/Measure/Manage; è una buona cornice per rendere la data governance ripetibile e auditabile. citeturn23search4turn23search0 ISO/IEC 42001 esplicita l’idea di un AI management system per stabilire e migliorare governance e gestione rischio nel tempo. citeturn23search1turn23search5

In pratica, le difese che più cambiano outcome sono:
- **Context minimization**: portare nel prompt solo ciò che serve “adesso”; è coerente con pratiche di *context engineering* orientate a non caricare interi dataset in contesto. citeturn3search25  
- **Redazione/pseudonimizzazione** per dati sensibili prima del passaggio nel modello (riduce blast radius se qualcosa esce).  
- **Retrieval controllato**: query policy-aware, chunking con filtri per classificazione, e “top‑k” limitato.  
- **Separazione per ambienti/tenant**: dev/stage/prod con credenziali e dataset diversi; è una difesa organizzativa e tecnica compatibile con ISO 27001 (ISMS) e ISO 27701 (PIMS). citeturn24search0turn24search1  
- **ZDR dove serve, ma con realismo**: sia OpenAI sia Google sia Anthropic chiariscono che “ZDR” è condizionale e feature-dependent (Search grounding, code execution, batch, cached content). citeturn1view0turn14view1turn10view0

## Governance pratica per agenti AI e integrazioni MCP

La governance “che abilita” non è un PDF che dice “non usare dati sensibili”. È un insieme di **vincoli eseguibili** e strumenti che rendono *facile fare la cosa giusta*.

### Controlli chiave e perché funzionano davvero

Il principio del **minimo privilegio** non è solo IAM: negli agenti significa *tool design* e *scope design*. MCP insiste su scope minimization e su proibire token passthrough perché rompe security controls e audit trail. citeturn30view0 In modo simmetrico, anche quando usi IDE agentici (es. Cursor) devi governare **quali modelli** e **quali integrazioni** sono disponibili al team (model/integration management), altrimenti la variabilità individuale diventa rischio sistemico. citeturn17search8turn17search5

Il pattern più efficace in ambienti enterprise è: **tool “narrow”, composabili, con policy per azione**:
- tool read‑only granulari (es. “read_ticket(id)” invece di “search_all_tickets(query)” senza limiti);
- tool write separati e protetti (es. “create_pr” con approvazione o run in sandbox);
- tool egress (email/webhook) dietro allowlist e policy di payload.

Questo riduce sia prompt injection sia danni da allucinazione: l’agente può sbagliare, ma in un recinto più piccolo.

### Human‑in‑the‑loop dove conta

La fonte MCP elenca scenari di attacco che bypassano consenso (confused deputy) e prescrive consent e validazioni; ma nel mondo agentico il “consenso” non è una schermata una tantum: è **approvazione per azione** quando l’impatto è alto. citeturn30view0 È la stessa logica che OpenAI Codex Security applica: propone patch e PR ma richiede review umana e non modifica codice automaticamente. citeturn20view0

### Logging e audit trail: cosa loggare (e cosa no)

È un equilibrio: loggare troppo può creare un nuovo data lake sensibile; loggare troppo poco distrugge accountability. MCP sottolinea che pratiche scorrette sui token danneggiano proprio audit e investigazione. citeturn30view0

Un criterio pragmatico: loggare **metadati e decisioni**, e minimizzare contenuti:
- log dei tool invocati, timestamp, identità, scope, outcome, ma non per forza la risposta completa se contiene dati sensibili;
- hashing/ID per correlazione;
- vaulting dei segreti e rotazione.

Sui segreti, le “incident class” MCP è ormai chiara: token exposure e secret mismanagement sono rischi strutturali negli ambienti MCP/agentici (esiste persino un progetto OWASP “MCP Top 10” focalizzato su token/secret exposure). citeturn31search8

### Tabella controlli raccomandati per criticità

| Criticità del workflow | Controlli minimi | Controlli raccomandati | Controlli “hard mode” (per ambienti critici) |
|---|---|---|---|
| Bassa (dati pubblici, no tool) | Policy uso, training opt‑out dove disponibile | Workspace business o API pagata; prompt minimization | DLP su input/output; monitoring anomalo |
| Media (interno, RAG read‑only) | Retrieval minimization, separazione ambienti | Redazione/pseudonimizzazione; allowlist fonti; eval su leakage | “Untrusted content” sandbox; guardrail contro IPI (es. pattern Microsoft) citeturn32search3turn32search11 |
| Alta (tool read‑only su sistemi aziendali) | Least privilege su tool; token scoping | Policy engine su tool call; auditing; rate limit; blocco token passthrough citeturn30view0 | Isolation rete; attestation MCP server; scanning supply chain (CVE) citeturn31search6turn31search15 |
| Critica (tool write/egress/multi‑agent) | Human approval per azioni irreversibili; kill switch | Segregazione prod; break‑glass; rollback; incident playbook | Formal change management; “two‑person rule” su azioni ad alto impatto; continuous red teaming (ASB/bench) citeturn32search2turn23search3 |

## EU AI Act e accountability nei sistemi generativi e agentici

### Stato e milestone (utile per pianificazione 2026–2027)

Fonti UE: AI Act entrato in vigore il 1 agosto 2024. citeturn21search2turn21search5 L’entrata in applicazione è graduale fino al 2 agosto 2027; una fonte EUR‑Lex (documento 2025) ribadisce che divieti e obblighi per i modelli general‑purpose sono già applicabili, mentre molte prescrizioni high‑risk scattano 2026–2027. citeturn22view0

### Quando un workflow con agenti rischia di diventare “high‑risk” (lettura operativa)

Per un’azienda che usa GenAI, la domanda non è “il modello è potente?”, ma **“in quale processo decisionale lo metto?”**. L’AI Act è basato sul rischio e (nelle sintesi EUR‑Lex) evidenzia requisiti e obblighi più pesanti per gli high‑risk, oltre a trasparenza e documentazione per general‑purpose AI. citeturn21search1turn21search9

Una regola pratica per i decision maker: un sistema agentico tende verso high‑risk quando:
- supporta o automatizza decisioni in aree sensibili (HR, credito, istruzione, accesso a servizi essenziali);
- produce output che diventa *input vincolante* (non solo “assistivo”) per una decisione che impatta diritti o opportunità;
- è integrato in prodotti o servizi soggetti a obblighi di sicurezza/conformità.

**Implicazione architetturale**: se sei in queste aree, devi progettare *human oversight* come componente, non come “bottone in UI”.

### Obblighi di trasparenza, tracciabilità e human oversight: come si traducono in scelte

Il compromesso vincente è trattare la conformità come “design constraints”:
- **tracciabilità** = audit log delle tool invocation, versione dei prompt/policy, dataset e retrieval source, e capability del modello (modello/versione). MCP evidenzia che audit trail si rompe con token passthrough e confini di fiducia confusi. citeturn30view0  
- **documentazione** = non un documento statico, ma un “bill of materials” dell’agente: quali MCP server, quali scope, quali dati, quali ambienti, quali controlli e fallback.  
- **human oversight** = gating su azioni high‑impact (approvazione, limite di spend, kill switch).

### Accountability lungo la catena (developer → data team → management → fornitori)

Nella pratica enterprise, la responsabilità è *stratificata*:
- **Team tecnici (dev/ML/data)**: implementano controlli, scoping, logging; scelgono endpoint/feature che determinano retention (es. feature non ZDR‑eligible; grounding con storage 30 giorni). citeturn1view0turn14view1  
- **Product/innovation/management**: decidono “dove” l’agente è usato e quanto è autonomo (quindi rischio).  
- **Fornitori e terze parti**: introducono superficie supply chain; esistono CVE reali su componenti MCP e strumenti (mcp-remote, MCP Inspector, Cursor). citeturn31search6turn31search15turn31search0  

Il *takeaway legale‑operativo* più utile per l’articolo: **l’audit trail è una protezione legale tanto quanto tecnica**. Se non puoi dimostrare “quale agente ha fatto cosa, con quali permessi e perché”, non hai governance: hai speranza.

## Bias e fairness in advertising automation e adtech

Qui la ricerca evidenzia un punto che spesso sorprende i team: **anche con targeting “neutrale”, la delivery può diventare non neutrale** perché ottimizza obiettivi economici (costo, conversioni) e usa segnali correlati a caratteristiche protette.

### Evidenze empiriche e casi documentati

- **Discriminazione “through optimization”**: Ali et al. (2019) mostrano che la delivery su Facebook può essere “skewed” lungo linee di genere e razza per annunci di lavoro e housing *anche quando i parametri di targeting sono inclusivi*, a causa di dinamiche di ottimizzazione e predizioni di “relevance”. citeturn33search2turn33search10  
- **Bias per crowding‑out**: Lambrecht & Tucker (2019) trovano che un algoritmo che ottimizza cost‑effectiveness può consegnare annunci STEM “gender‑neutral” in modo apparentemente discriminatorio perché alcune audience (es. donne più giovani) sono più costose e quindi vengono “crowded out”. citeturn33search5turn33search9  
- **Enforcement e regolazione**: il DOJ (USA) nel 2022 ha ottenuto un settlement con Meta su pratiche di advertising housing: la descrizione del caso include l’uso di sistemi che trovano utenti “simili” basandosi su caratteristiche protette e impegni a cambiare sistemi di delivery per affrontare disparità. citeturn33search8turn33search0  
- **Guida istituzionale**: HUD ha pubblicato guidance su applicazione del Fair Housing Act alla pubblicità su piattaforme digitali, includendo l’uso di sistemi automatizzati e AI per targeting/delivery. citeturn33search4  

### Distinzione utile (bias nei dati vs bias osservato vs bias nell’ottimizzazione)

In adtech conviene separare tre livelli:
- **Bias nei dati di training** (es. modelli che apprendono correlazioni storiche).
- **Bias nei dati osservati dal sistema** (feedback loop: chi vede l’annuncio genera conversioni che rinforzano la delivery).
- **Bias nella funzione obiettivo** (ottimizzazione di CPA/ROAS che implicitamente privilegia audience meno costose o più “predette” convertire).

Le evidenze sopra (Ali et al.; Lambrecht & Tucker) sostengono soprattutto il terzo punto: **il bias può emergere come proprietà dell’ottimizzazione**, non come “intenzione” dell’inserzionista. citeturn33search2turn33search5

### Metriche e governance pratica per advertising automation

Non esiste una metrica unica, ma in pratica serve misurare:
- *delivery skew* (distribuzione per gruppi) e *outcome skew* (conversioni/allocazione budget),
- drift e feedback loop (cambiamenti nel tempo),
- vincoli di fairness come requirement di prodotto (non come afterthought).

**Governance operativa**: fissare “guardrail di equity” come constraint di ottimizzazione, introdurre audit periodici (anche con sampling), e documentare razionalmente tradeoff (performance vs fairness) invece di negarli.

## Governance come vantaggio competitivo e angoli narrativi per il blog

Le fonti mostrano un trend: i vendor stanno spostando la conversazione da “fidati” a “controlla”: controlli admin, retention configurabile, audit log, data residency, ZDR condizionale. Questo è già posizionamento competitivo:
- OpenAI enfatizza ownership e controllo (no training by default, retention controls, SOC2, encryption). citeturn18view2turn1view0  
- Google Workspace with Gemini mette al centro controlli enterprise (Vault, audit logs, retention per admin, niente human review, no training fuori dominio). citeturn13view0turn11search14  
- Anthropic introduce controlli come ZDR e data residency per inference (anche se limitata a US al momento) e documenta retention commerciale con eccezioni chiare. citeturn10view0turn16view0turn9view0  
- Cursor, lato IDE agentico, si muove verso “hooks” e integrazione con tooling di sicurezza e compliance per governance nel loop dell’agente. citeturn17search19  

Questo supporta una tesi forte per il blog: **la governance non è il freno dell’adozione; è il motivo per cui l’adozione può essere scalata senza paura**. È coerente con NIST AI RMF (gestione rischio come parte del valore) citeturn23search0turn23search4 e con best practice di governance in framework enterprise (es. Microsoft Cloud Adoption Framework che esplicita integrazione tra AI risk, cybersecurity e privacy governance). citeturn33search3turn33search7

### Tre possibili angoli narrativi per l’articolo

**Angolo “Il mito del training: il rischio vero è la toolchain”**  
Messaggio: molte aziende litigano su opt‑out e training, ma gli incidenti più pericolosi arrivano dalla *tool surface*: MCP server non fidati, OAuth confusion, SSRF, RCE in componenti agentici. Supporto: MCP Security Best Practices + CVE reali (mcp-remote, MCP Inspector, Cursor) + benchmark IPI. citeturn30view0turn31search6turn31search15turn32search0  
Posizione: l’articolo può sostenere che la governance deve spostarsi “a valle” del modello, verso tool permissions e data egress.

**Angolo “Dove finiscono davvero i dati: una mappa per team tecnici”**  
Messaggio: i dati finiscono in log di abuso, conversation state, cache, sandbox, storage del tool, audit trail interno, e nelle policy di terzi. Supporto: OpenAI “your data” (abuse monitoring vs application state; nota su MCP server terzi; data residency con limiti), Google ZDR (grounding obbliga 30 giorni), Anthropic retention (30 giorni + eccezioni). citeturn1view0turn14view1turn9view0  
Posizione: offrire una checklist non come elenco, ma come “data plane diagram” che ogni team dovrebbe disegnare prima di andare live.

**Angolo “Governance come acceleratore: trasformare compliance in self‑service”**  
Messaggio: enterprise adoption accelera quando dai ai team confini chiari (quali strumenti sì/no, quali modelli sì/no, quali dati dove), e automatizzi controlli (policy enforcement, hooks, audit). Supporto: Workspace privacy hub (controlli, audit), OpenAI enterprise privacy (fine‑grained access, retention controls), Cursor hooks, Microsoft guidance per governance e agent policies. citeturn13view0turn18view2turn17search19turn33search7  
Posizione: sostenere che “compliance reattiva” crea shadow AI; “governance proattiva” crea adozione tracciabile.

### Idee controintuitive emerse dalla ricerca

La prima: **ZDR non è “un interruttore”, è un insieme di compatibilità per feature**. Se attivi grounding Search/Maps, alcune piattaforme dichiarano storage 30 giorni non disattivabile; se usi code execution/sandbox, spesso non è ZDR-eligible. citeturn14view1turn10view0turn1view0  
La seconda: **data residency spesso non copre “system data” o flussi causati da terzi** (es. tool esterni, MCP server, endpoint globali). citeturn1view0turn14view3turn30view0  
La terza: **il rischio di discriminazione in advertising può emergere “per ottimizzazione”, non per targeting**. citeturn33search2turn33search5

### Domande aperte su cui vale prendere posizione

- Se prompt injection è (parzialmente) “architetturale”, la strategia giusta è: **accettare rischio residuo e ridurre privilegi**, non cercare una “patch finale”? (Microsoft e la letteratura su IPI indicano che la mitigazione è multi‑layer). citeturn32search3turn32search0turn30view0  
- Nel 2026, con AI Act che matura verso 2027, come definire in modo non burocratico “provider” e “deployer” quando l’azienda compone LLM + orchestratore + MCP server + SaaS? (La Commissione stessa segnala la necessità di linee guida su responsabilità lungo la value chain). citeturn22view0turn21search9  
- Qual è il *minimo set* di evidenze (log, policy, test) che rende un agente “difendibile” davanti a audit e incident response, senza costruire un data lake di conversazioni sensibili? citeturn30view0turn31search8