# Confronto tra _Vibe Coding_ e Programmazione Tradizionale (2023–2025)

## Indice

- [Pagina 1](#pagina-1)
- [Pagina 2](#pagina-2)
- [Pagina 3](#pagina-3)
- [Pagina 4](#pagina-4)
- [Pagina 5](#pagina-5)
- [Pagina 6](#pagina-6)
- [Pagina 7](#pagina-7)
- [Pagina 8](#pagina-8)
- [Pagina 9](#pagina-9)
- [Pagina 10](#pagina-10)
- [Pagina 11](#pagina-11)
- [Pagina 12](#pagina-12)
- [Pagina 13](#pagina-13)

---

## Pagina 1

Confronto tra Vibe Coding e Programmazione
Tradizionale (2023–2025)
Abstract
Il vibe coding – ossia la programmazione guidata interamente dall’AI – si è diffuso tra il 2023 e il 2025
grazie a strumenti come GitHub Copilot, Cursor, Sourcegraph Cody, Tabnine, Codeium e assistenti AI
integrati negli IDE. Questo report confronta il vibe coding con l’approccio tradizionale (“old coding”) sulla
base di  studi recenti, casi aziendali ed esperienze reali. I dati mostrano un quadro sfumato: in
contesti controllati aziendali, l’AI pair programming può accelerare lo sviluppo (+26% task completati in
media)  soprattutto  per  sviluppatori  junior
,  senza  apparenti  cali  immediati  di  qualità
.

Tuttavia, in progetti complessi, sviluppatori esperti hanno riscontrato  rallentamenti inattesi (+19%
tempo con AI) nonostante la percezione di maggiore velocità
. Sul fronte qualitativo, il codice
generato  dall’AI  funziona  ma  tende  ad  avere  mantenibilità  inferiore (duplicazioni,  code  churn
raddoppiato) e potenziali falle di sicurezza se usato senza supervisione
. Culturalmente, gli
assistenti AI aumentano la soddisfazione dei developer riducendo i compiti ripetitivi
, ma emergono
preoccupazioni: i programmatori meno esperti rischiano di non sviluppare comprensione profonda
del codice
, e una fiducia cieca nell’AI (“accetto tutto e via”) può portare a perdita del “craft” e
codice opaco. In sintesi, il vibe coding offre velocità e accessibilità senza precedenti, ma richiede forte
intervento umano in architettura, revisione e test per garantire qualità, sicurezza e sostenibilità nel
tempo.

Metodologia
Per questa analisi sono state esaminate fonti pubblicate tra il 2023 e il 2025 in più lingue, privilegiando
evidenze quantitative e riproducibili. In particolare: (1) studi sperimentali peer-reviewed e white paper
tecnici con metodologia chiara (RCT, benchmark) – considerati evidenza di grado A (alta solidità, basso
rischio di bias); (2) case study industriali con metriche reali su team (grado B se condotti internamente
con  possibile  bias  di  contesto);  (3) testimonianze  dirette  di  sviluppatori  (blog,  video,  forum)  che
includono esperimenti concreti o codice verificabile (grado C in quanto aneddotiche, rischio bias medio/
alto). Abbiamo estratto per ogni fonte dettagli su:  contesto e tool usati,  tipo di attività svolta (es.
nuovo sviluppo, refactoring, bugfix, testing), metriche oggettive (tempo impiegato, percentuale di bug
o vulnerabilità, copertura di test, performance) e metriche soggettive (soddisfazione, carico cognitivo,
apprendimento  percepito).  Durante  la  sintesi,  le  evidenze  sono  state  incrociate  per  evidenziare
convergenze o discrepanze. Ad esempio, si confrontano i risultati di un ampio RCT aziendale (4.800
sviluppatori in Microsoft/Accenture, evidenza A)
con quelli di un RCT su sviluppatori OSS esperti (16
maintainer open-source, evidenza A)
, nonché con case study come l’adozione interna di Copilot
in un’azienda (ZoomInfo, 400 ingegneri, evidenza B)
. Sono state incluse esperienze individuali (es.
prototipo full-stack sviluppato interamente con AI
) come evidenza  C per illuminare aspetti
pratici e culturali difficilmente rilevabili dai soli numeri. Tutte le fonti sono citate in formato Harvard tra
parentesi quadre (es.
) con link ai riferimenti originali, e un elenco completo è fornito in fondo.

![Immagine](Assets/image_001.png)



---

## Pagina 2

Risultati Tecnici
Impatto su produttività e velocità di sviluppo
Dai dati emerge che gli assistenti AI  possono accelerare lo sviluppo software, ma con importanti
distinzioni per contesto ed esperienza del programmatore. Un ampio studio sperimentale (3 trial RCT in
Microsoft, Accenture e un’altra multinazionale) ha rilevato un +26% di task completati in media dai
developer  con  accesso  a  GitHub  Copilot
.  In  pratica,  gli  sviluppatori  con  AI  chiudono  ~26%  di
funzionalità/bug in più rispetto al gruppo tradizionale, con anche un aumento del 13,5% nel numero di
commit  settimanali  e  del  38%  nella  frequenza  di  compilazione  (iterano  più  velocemente)
.

Importante, lo studio non ha riscontrato peggioramenti di qualità del codice o maggiori bug nel gruppo
con AI – “nessun impatto negativo osservato sulla qualità”
– suggerendo che la velocità extra non
avviene a scapito del funzionamento corretto (evidenza A, bias basso). Un altro indicatore positivo viene
da un trial controllato in Accenture: con Copilot si è osservato +8,7% di pull request per sviluppatore e
+15% di merge rate (più PR accettate), unitamente a un +84% di build riuscite al primo colpo
.

Quest’ultimo dato è particolarmente interessante: l’AI potrebbe aiutare a scrivere codice più consistente
che compila e passa i test iniziali, riducendo errori di sintassi o integrazione (forse perché l’assistente
suggerisce codice già corretto in molti dettagli)
. Inoltre, il tempo medio per aprire la prima PR su un
progetto è crollato da ~9,6 giorni a ~2,4 giorni (–75%) con AI secondo ricerche DevOps
, indicando un
avvio più rapido dei nuovi task.

Tuttavia, questi benefici non si distribuiscono uniformemente. Gli aumenti maggiori riguardano task
ripetitivi o boilerplate (es. scrivere codice standard CRUD, test unitari, generare codice di integrazione)
dove Copilot dà il meglio – in tali attività si è misurato fino a +34–38% di velocità
. Al contrario,
su compiti complessi o creativi (p.es. sviluppo di algoritmi non standard, logica di business delicata) il
guadagno è più modesto o nullo, dovendo comunque intervenire molto manualmente e verificare la
correttezza logica
. Un  esperimento sul campo con sviluppatori open-source esperti (16
maintainer di progetti maturi 1M+ LOC) ha addirittura capovolto il paradigma: in quel contesto l’uso di
un AI avanzato (Cursor con modelli Claude 3.5/3.7) ha rallentato i tempi del 19% in media rispetto al
coding manuale
. I partecipanti, con ~5 anni di esperienza sul proprio progetto, stimavano che
l’AI li avrebbe accelerati del ~24%, ma i dati hanno mostrato un effetto opposto (+19% durata)
. La
Figura 1 illustra questo divario: mentre sia esperti esterni sia i developer prevedevano sostanziali speed-
up (punti verdi negativi), il risultato effettivo è stato un  slowdown significativo (punto rosso a +19%
tempo)
. Le cause? I ricercatori hanno individuato vari fattori di attrito: tempo speso a scrivere
prompt,  a  leggere  e  correggere  i  suggerimenti,  ad  adattare  il  codice  generato al  complesso
contesto esistente
. In un grande progetto con standard rigorosi, l’AI finiva per produrre soluzioni
parziali o disallineate, obbligando lo sviluppatore a fare iterazioni aggiuntive per integrarle
. In
sostanza, i vantaggi iniziali di “digitare meno codice” venivano compensati (e superati) dal sovraccarico
cognitivo e temporale di guidare l’AI e verificare il suo output. Questo risultato (evidenza A, bias basso)
non indica che l’AI rallenti ovunque, ma evidenzia che il contesto è cruciale: su codebase grandi e
attività complesse, l’attuale generazione di tool richiede ancora molto intervento umano, al punto da
annullare i guadagni di velocità in alcuni casi
. I ricercatori notano che con tecniche migliori
(prompting, agent AI più evoluti) o per task diversi, in futuro la bilancia potrebbe spostarsi
.

![Immagine](Assets/image_001.png)



---

## Pagina 3

Figura 1: Risultati di uno studio RCT (METR 2025) con 16 sviluppatori open-source esperti, comparando le
previsioni di esperti e dev (verde = atteso speed-up) con l’effetto reale dell’AI (rosso = slowdown +19% tempo)
. L’AI in questo contesto ha reso i task più lenti, in contrasto con la percezione diffusa.

Un elemento chiave emerso in più studi è che i  programmatori meno esperti traggono maggior
beneficio  immediato dall’AI  rispetto  ai  colleghi  senior.  Nel  trial  aziendale  su  4.800  dev,  i  junior
developer e quelli con meno anni di esperienza hanno visto incrementi di produttività dal 21% fino
~40%, significativamente superiori alla media
. Ciò si spiega con una maggiore adozione: i junior
tendono ad affidarsi più facilmente all’AI (high adoption rate) e a  fidarsi dei suggerimenti, colmando
lacune tecniche con l’ausilio del modello
. Ad esempio, Copilot può suggerire immediatamente
soluzioni “già pronte” per problemi API o strutture che un novizio impiegherebbe molto tempo a trovare
da solo. I developer senior invece, già molto produttivi autonomamente, vedono meno miglioramenti
percentuali  e  spesso  usano  l’AI  in  modo  più  critico  (accettando  meno  suggerimenti:  ~15–30%
acceptance rate a seconda dell’uso)
. La percezione soggettiva resta comunque positiva quasi
per tutti: nel trial open-source nonostante il rallentamento misurato, gli sviluppatori  continuavano a
credere di aver lavorato più velocemente con AI (stimando un 20% di speed-up personale)
.

Questo  gap percettivo è attribuito al fatto che l’AI “fa sentire” produttivi – si scrive meno codice
manualmente – ma i micro-rallentamenti (es. attesa generazione, debug aggiuntivo) si accumulano
senza essere consciamente attribuiti allo strumento
. In generale comunque, la combinazione
uomo+AI tende a superare l’uomo da solo in molti scenari standard, specie col passare del tempo.

Ad esempio, una ricerca Microsoft mostra che occorrono ~11 settimane di uso continuativo perché un
team raggiunga il pieno beneficio da Copilot (all’inizio c’è una curva di apprendimento)
. Molte
aziende riportano che una volta integrato nel flusso di lavoro, l’AI coding diventa parte fondamentale
dello sviluppo quotidiano (il 67% degli sviluppatori con Copilot lo usa 5 giorni su 5
). Si può dunque
dire che il vibe coding accelera soprattutto le fasi di prototipazione e codifica di routine, mentre la
programmazione  tradizionale  resta  competitiva  (e  a  volte  più  efficiente)  nelle  fasi  di  design
architetturale, algoritmi complessi e integrazione profonda in sistemi su larga scala
.

Qualità del codice, mantenibilità e riusabilità
Sul fronte della  qualità del codice prodotto, il quadro è contrastante: la funzionalità immediata del
codice generato dall’AI è spesso buona, ma emergono problemi di mantenibilità nel medio termine
senza un intervento disciplinato del programmatore. In termini di correttezza funzionale out-of-the-box,
diversi studi indicano che il codice con AI può essere altrettanto valido di quello scritto a mano. Ad

![Immagine](Assets/image_001.png)



---

## Pagina 4

esempio, GitHub ha riportato che il codice creato con Copilot è “significativamente più funzionale,
leggibile e affidabile” di quello di controllo in un loro studio del 2022
. Nel grande RCT del 2025 citato
prima, non sono state osservate differenze significative in bug o malfunzionamenti: i team con AI
hanno mantenuto gli stessi standard di qualità apparente (test passati, review accettate) dei team
tradizionali
. Addirittura, come menzionato, in ambiente enterprise l’assistenza AI ha portato a
meno build  fallite  inizialmente
,  suggerendo  un  impatto  positivo  sulla  correttezza  sintattica/
compilativa del codice. Ciò riflette il fatto che l’AI è bravissima a produrre codice “funzionante” nei casi
tipici – ad esempio, scrive subito la funzione con la giusta sintassi e chiamate corrette all’API, evitando
errori di distrazione. Inoltre riduce il carico su attività come scrivere test: alcuni sviluppatori la usano per
generare battery di unit test, aumentando la copertura (non a caso Copilot ha aumentato del 38% la
velocità di scrivere test in un case study)
. Fin qui, quindi, la qualità “esterna” (funzionalità e short-
term quality) appare conservata o persino migliorata in termini di fewer initial errors.

Tuttavia, analizzando la qualità interna e la manutenibilità, emergono trend preoccupanti legati
all’uso massiccio dell’AI. Un white paper indipendente (Coding on Copilot, GitClear 2024) ha analizzato
milioni di righe di codice su GitHub per misurarne l’evoluzione dopo l’introduzione di Copilot. Il risultato:
il code churn – ossia la percentuale di codice che viene modificato o rimosso entro due settimane dalla
sua creazione – è  in forte aumento. In particolare, il churn era relativamente stabile fino al 2021,
mentre è stimato in raddoppio entro il 2024 rispetto al baseline pre-AI 2021
. Questo indica che
si butta via il doppio del codice poco dopo averlo scritto, segno che molta produzione rapida via AI
viene rimaneggiata o scartata successivamente (spesso per correzioni o refactor). Contestualmente,
GitClear rileva un aumento del codice “aggiunto” e “copiato/incollato” rispetto a quello riorganizzato
o cancellato
. In altre parole, gli sviluppatori con AI  tendono ad aggiungere nuove parti di
codice  (magari  suggerite)  invece  di  riutilizzare  o  modificare  quelle  esistenti,  generando
duplicazioni. Ciò si traduce in violazioni del principio DRY (“Don’t Repeat Yourself”) e frammentazione
della base di codice
. Proprio questo fenomeno è stato vissuto sul campo da chi ha provato il vibe
coding puro:  codice  “spaghetti”  o  inconsistente.  Un  programmatore  racconta  la  sua  esperienza
rivedendo un’app creata interamente via vibe coding: “sono rimasto scioccato da quanto fosse brutto il
codice in molti punti. Sembrava scritto da tanti sviluppatori junior, ognuno con pratiche diverse”
. In
quell’app c’erano funzioni duplicate in moltissimi file e nessuna coerenza nello stile, rendendo arduo
perfino tracciare i bug; alla fine lo sviluppatore ha deciso di gettare tutto e riprogettare l’architettura
a mano prima di riusare l’AI, per evitare tale caos
. Anche un esperimento aneddotico con Replit
e Cursor riporta problemi analoghi: un prototipo creato in 20 minuti (frontend React + backend Express
+ DB PostgreSQL/Pinecone) funzionava, ma  oltre un terzo del codice era duplicato, una singola
componente  era  cresciuta  9  volte  oltre  la  dimensione  raccomandata  causando  crash,  e  la  stessa
funzione di normalizzazione testo appariva in 15 file diversi
. Queste non sono bug singoli, ma
sintomi di come l’AI costruisce i sistemi
. Invece di progettare astrazioni riutilizzabili, il modello
genera blocchi isolati su richiesta: veloce, ma privo di visione d’insieme. Infatti “l’AI consegna velocità –
ma non modularità”, nota l’autore, spiegando che la AI opera per pattern matching locale, non ha la
comprensione globale dell’architettura
. Dunque può risolvere ogni micro-problema bene, ma
non si accorge di star introducendo ridondanze o disorganizzazione a livello di sistema. Un indicatore
interessante  è  la  diminuzione  di  codice  “spostato”  (moved)  identificata  dal  report  GitClear:  meno
refactoring  e  riorganizzazione  significa  che  il  codice  generato  rimane  così  com’è,  anche  se  forse
andrebbe  rifattorizzato  –  col  risultato  di  avere  tanti  pezzi  simili  in  posti  diversi
.  Tutto  ciò
accumula debito tecnico: “il codice generato dall’AI spesso manca di struttura, documentazione e chiarezza
necessarie per la manutenzione a lungo termine. […] La velocità del vibe coding si paga in un codicebase
difficile da leggere, correggere o estendere in futuro”
.

In sintesi, il vibe coding tende a produrre più codice, più velocemente, ma con minore propensione
al riuso e alla pulizia. Mentre un sviluppatore umano esperto, scrivendo a mano, spesso riflette su
come integrare la nuova funzionalità nel design esistente (magari refactoring parti di codice correlate),

![Immagine](Assets/image_001.png)



---

## Pagina 5

un AI su prompt genera una soluzione ex novo, ignaro di possibili duplicazioni o soluzioni analoghe già
nel progetto. Per questo vediamo applicazioni AI-driven che consumano 3–4 volte le risorse server
rispetto  a  equivalenti  scritte  a  mano
:  esse  includono  più  codice  ridondante,  meno
ottimizzazioni, chiamate ripetute dove si poteva unificare. È indicativo che in alcuni hackathon di vibe
coding si arrivi a build di decine di migliaia di linee in poche ore – codice che “gira” ma è ben lontano da
ciò  che  un  team  esperto  avrebbe  prodotto  in  termini  di  pulizia.  Pertanto,  la  programmazione
tradizionale mantiene un vantaggio su consistenza e mantenibilità, grazie a pattern architetturali
stabili, performance migliori e piena comprensione del codice da parte del team
. Nel lungo periodo,
queste  qualità  diventano  vitali:  un  sistema  creato  con  attenzione  progettuale  reggerà  meglio
l’evoluzione rispetto a uno messo insieme “a vibrazioni” in pochi giorni. Le migliori pratiche emergenti
suggeriscono un approccio ibrido: usare l’AI per prototipazione rapida, generazione di boilerplate e
test, ma affidarsi a coding tradizionale (o comunque a review umana approfondita) per definire
l’architettura modulare, ripulire le duplicazioni e imporre standard di stile coerenti
.

Errori e vulnerabilità di sicurezza
Un aspetto cruciale da confrontare è la incidenza di bug e vulnerabilità nel codice AI-driven rispetto al
codice tradizionale. La domanda chiave:  il coding con AI porta a più errori o problemi di sicurezza? Le
evidenze indicano che l’AI è abile nell’evitare errori sintattici/compilativi, ma può introdurre bug
logici o vulnerabilità di sicurezza sottili se non controllata attentamente. In termini di bug funzionali,
gli studi controllati finora non hanno segnalato tassi di bug significativamente più alti imputabili all’AI –
anzi, come visto, inizialmente i build error diminuiscono e i test passano più facilmente grazie all’AI
.

Tuttavia, diversi esperimenti mostrano che  affidarsi ciecamente all’AI può indurre errori che un
umano esperto eviterebbe. Ad esempio, modelli come GPT-4 tendono talvolta a “inventare” funzioni
o chiamate non esistenti se il prompt è ambiguo, oppure a fornire soluzioni plausibili ma scorrette su
edge case. Uno studio (Microsoft 2022) ha riscontrato casi in cui Copilot suggeriva soluzioni fuorvianti a
problemi  algoritmici,  risolvendo  il  caso  base  ma  sbagliando  in  situazioni  limite  –  errori  che  uno
sviluppatore attento avrebbe scoperto scrivendo i test. Per questo la letteratura raccomanda di non
lasciare mai “volare l’AI da sola”: “Copilot è uno strumento potente; tuttavia non dovrebbe pilotare l’aereo
da solo”
. Il programmatore deve restare nel loop per verificare la correttezza logica profonda. A
conferma,  uno  studio  sull’uso  di  ChatGPT  per  compiti  di  programmazione  universitaria  nota  che
studenti inesperti tendevano a fidarsi dell’output anche quando conteneva errori: se il programma
generato  “non  funzionava,  semplicemente  chiedevano  all’AI  di  aggiustarlo  di  nuovo”  senza
comprendere il vero motivo
. Questo può creare cicli dove un bug viene “corretto” dall’AI con
un altro patch potenzialmente sbagliato, portando a errori nascosti di difficile diagnosi.

Il fronte sicurezza software merita un’attenzione particolare. Ricerca iniziale suggerisce che il codice
generato  dall’AI  spesso  include  vulnerabilità  note  o  pratiche  insicure,  se  l’utente  non  guida
attivamente il modello verso soluzioni sicure. Uno dei primi studi in materia (Pearce et al., 2022) ha
valutato Copilot su 89 scenari di sicurezza noti (CWE). Il risultato fu che il 39% dei programmi generati
conteneva vulnerabilità
– per le top suggestion di Copilot il tasso era ~39% in Python e ~50%
in C
. In totale, su 1689 programmi generati con Copilot, oltre  40% presentava almeno un punto
debole (buffer overflow, injection SQL, hardcoded secrets, etc.). Questo dato (evidenza A, bias basso)
rivela che senza alcun filtraggio, l’AI tende a replicare pattern visti in training data anche se insicuri. Ad
esempio,  potrebbe  suggerire  una  query  SQL  costruita  tramite  string  concatenation  (vulnerabile  a
injection) perché ha visto spesso codice così su GitHub, non sapendo che è una pratica pericolosa. Un
industry report ha constatato in generale che il codice prodotto dai modelli è “pieno di falle di sicurezza e
facilmente attaccabile”, definendo il risultato “spaghetti insicuro” se usato senza controlli
. Un audit
citato  da  Trickle  AI  ha  rivelato  che  fino  al  19%  dei  frammenti  di  codice  suggeriti  dall’AI  presentava
vulnerabilità note o potenziali exploit
– evidenza B (dato aggregato aziendale). In aggiunta, l’approccio
disinvolto del vibe coding fa sì che  spesso vengano saltati passi essenziali di sicurezza: ad esempio

![Immagine](Assets/image_001.png)



---

## Pagina 6

validazione  degli  input,  sanitizzazione  di  dati  esterni,  gestione  robusta  degli  errori  e  controlli  di
autenticazione/permessi
. Il modello non “capisce” la necessità di questi controlli a meno che
non  sia  esplicitamente  richiesto  nel  prompt;  se  l’utente  umano  non  pensa  di  chiederlo,  il  codice
generato può risultare superficiale da questo punto di vista. Un caso comune: hard-coded credentials o
API key lasciate nel codice – l’AI potrebbe inserirle (magari attingendo da esempi pubblici) e il developer
inesperto potrebbe non rendersene conto. Va detto che gli assistenti AI stanno migliorando: Copilot
ora tenta di riconoscere e avvisare su pattern insicuri noti, e strumenti come CodeQL possono essere
integrati per scansioni automatiche post-generazione. Inoltre, studi successivi hanno testato l’uso di
Copilot Chat per risolvere problemi di sicurezza: fornendo a Copilot i warning di uno scanner statico, a
volte il modello è in grado di proporre fix riducendo le vulnerabilità
. Quindi, paradossalmente, l’AI
può introdurre falle ma può anche aiutare a individuarle e correggerle se opportunamente diretta.

Un  fenomeno  interessante  emerso  da  uno  studio  2025
è  la  “degradazione  iterativa”  della
sicurezza: quando uno sviluppatore fa iterare l’AI più volte su un pezzo di codice per migliorarlo, magari
alternando  prompt  di  efficienza  e  aggiunta  di  funzionalità,  possono  comparire  nuove  vulnerabilità
inattese. Nel test, dopo 5 iterazioni di miglioramenti richiesti a GPT, le vulnerabilità critiche nel codice
sono aumentate del +37,6%
. Ciò sfida l’assunto che iterare con l’AI affini automaticamente il codice:
senza supervisione umana attenta, ogni “miglioria” automatica può introdurre un nuovo problema di
sicurezza altrove. Questo rafforza la raccomandazione che l’expertise umana in sicurezza rimanga nel
loop.

In  definitiva,  rispetto  all’approccio  tradizionale,  l’AI-only  coding  presenta  maggiori  rischi  di
vulnerabilità latenti se utilizzato ingenuamente. Con il coding tradizionale, uno sviluppatore esperto
segue procedure di sicurezza (review del codice, checklist OWASP, test pen) e ha il contesto per sapere
dove possono annidarsi i rischi. Un AI generativo non ha la nozione morale o causale di “sicurezza”,
quindi può violare principi basilari senza allarme. D’altra parte, l’AI può fungere da  catalizzatore se
usata in sinergia: velocizzare l’implementazione di fix noti, suggerire pattern sicuri una volta che il team
li definisce, e alleggerire il carico sui dettagli lasciando ai dev la revisione critica. La  best practice
emersa è trattare l’AI come un junior developer molto veloce ma potenzialmente sprovveduto
.

Ovvero:  mai fidarsi ciecamente, fare sempre peer review del codice generato, passare scanner di
sicurezza (es. OWASP ZAP, Snyk)
, tenere le chiavi e dati sensibili fuori portata e fornire feedback all’AI
(via prompt o correzioni manuali) per mantenerla sulla giusta strada. In contesti critici (es. moduli
finanziari, sanità, sicurezza nazionale) molte aziende scelgono un approccio  ibrido o conservativo:
usare l’AI per parti non critiche o come suggeritore, ma scrivere a mano le parti core dove errori di
sicurezza  non  sono  un’opzione
.  Questa  prudenza  rispecchia  un  principio  fondamentale:  la
responsabilità  ultima  del  codice  è  umana.  Come  nota  un  manager,  quando  l’AI  genera  codice  la
“sensazione tradizionale di ownership si sfuma”
e c’è il rischio che gli ingegneri sorvolino su falle che
avrebbero notato se l’avessero scritto loro. Mantenere un alto senso di responsabilità e controllo umano
è essenziale per coniugare velocità AI e sicurezza.

Performance e scalabilità delle applicazioni
Un  ultimo  confronto  tecnico  riguarda  le  prestazioni  runtime  e  la  scalabilità  dei  sistemi  creati
principalmente via AI rispetto a quelli progettati tradizionalmente. Le evidenze indicano che il  vibe
coding spesso privilegia la soluzione funzionante più semplice, trascurando ottimizzazioni che invece
i developer esperti implementerebbero per scalare. Ad esempio, uno  scenario tipico: l’AI genera una
funzione che processa dati in memoria in modo sub-ottimale. Con dati di test piccoli “funziona”, ma in
produzione potrebbe diventare un collo di bottiglia. Come riportato, un assistente AI aveva creato logica
di accesso al DB che non scalava – query non indicizzate e ripetute – adatta al prototipo ma non a
carichi reali
. Un altro caso citato: generazione di un blob JSON da 39 MB lato client, che
ovviamente manda in crash il browser – l’AI non ha “capito” che quell’approccio non era scalabile,

![Immagine](Assets/image_001.png)



---

## Pagina 7

mentre lo sviluppatore umano l’ha riconosciuto immediatamente
. In generale,  architetture
create “improvvisando” con l’AI tendono a essere monolitiche e poco modulari
. Il modello non
impone separazione in servizi, non pensa a code asincrone, caching, streaming, etc., a meno che
l’utente  non  lo  istruisca  espressamente.  Ciò  significa  che  un  progetto  nato  via  vibe  coding  può
funzionare  bene  per  un  numero  limitato  di  utenti  o  request,  ma  sotto  carico  elevato  mostra
inefficienze  gravi,  richiedendo  spesso  una  riprogettazione.  Un  effetto  osservato  è  che  il  tempo
risparmiato inizialmente potrebbe essere perso dopo per scalare l’applicazione:  “il codice creato
‘winging it’ con AI va bene per una demo veloce, ma quello stesso codice potrebbe non reggere in produzione
sotto  carico,  richiedendo  refactoring  massiccio  a  posteriori”
.  Sviluppare  in  modo  tradizionale,
seppur più lento, consente di tenere conto dei requisiti di performance man mano (p.es. scegliendo
strutture  dati  efficienti,  evitando  computazioni  ridondanti).  Nel  vibe  coding puro  questi  aspetti
emergono  solo  quando  l’app  “scoppia”,  portando  ad  aggiustamenti  reattivi invece  di  un  design
proattivo.

Detto questo, va riconosciuto che l’AI può anche aiutare a  ottimizzare se usata bene: per es., può
suggerire vectorization di un loop o indicare la complessità di un algoritmo se interrogata. Inoltre, col
maturare  dei  modelli  e  il  fine-tuning  su  performance,  è  plausibile  che  in  futuro  gli  assistenti
evidenzieranno essi stessi i colli di bottiglia (es: “questa funzione ha complessità O(n^2), potresti usare
un indice per migliorare”). Ma nel periodo 2023-2025, l’AI non ha questa consapevolezza innata. Quindi,
progetti mission-critical o ad alta scala sono rimasti in gran parte dominati da approcci tradizionali o
comunque da forte intervento di ingegneri umani nella fase di hardening di performance. Ad esempio,
nei riscontri aziendali raccolti, si suggerisce di  non affidare all’AI le parti performance-sensitive
(algoritmi intensivi, gestione memoria, componenti real-time) senza un robusto tuning manuale
.

Anche qui il modello vincente è ibrido: l’AI crea rapidamente una base funzionante, poi sviluppatori
esperti profilano e ottimizzano dove serve, come farebbero su codice scritto da junior.

Riassumendo i risultati tecnici: il vibe coding rivoluziona la velocità di scrittura e la comodità (meno
effort manuale su molti compiti), ma non garantisce qualità “strutturale” del prodotto finale. Il codice
AI-driven tende ad essere più verboso e ridondante, richiedendo successivamente una fase di pulizia/
ottimizzazione maggiore rispetto al codice pensato dall’inizio con metodo tradizionale. Con le dovute
pratiche di controllo (review, refactoring, test intensivi), team ben organizzati possono mitigare questi
difetti e sfruttare il meglio dei due mondi – ma senza tali controlli il rischio è di ottenere “un castello
costruito  velocemente  su  fondamenta  deboli”.  Come  vedremo,  ciò  ha  anche  implicazioni  sull’aspetto
culturale e organizzativo dello sviluppo software.

Risultati Culturali e di Team
Soddisfazione degli sviluppatori e adozione degli strumenti AI
L’introduzione  degli  assistenti  di  coding  AI  ha  avuto  un  impatto  significativo  sul  morale  e  la
soddisfazione dei developer. Numerosi sondaggi e studi interni indicano che la maggioranza degli
sviluppatori apprezza l’AI come pair programmer e non vorrebbe tornare indietro. Ad esempio, nella
ricerca di Accenture il 90% dei developer si è dichiarato più soddisfatto del proprio lavoro usando
Copilot, e addirittura il 95% ha detto che  si diverte di più a codare con l’assistenza AI
. Questo
dipende dal fatto che l’AI toglie di mezzo molte parti noiose o frustranti: il 70% ha riportato  minore
sforzo mentale nei task ripetitivi, e oltre la metà ha ridotto il tempo passato a cercare informazioni su
Stack Overflow o documentazione
. In pratica, potendo delegare all’AI la scrittura di boilerplate o la
ricerca di sintassi, gli sviluppatori si concentrano su aspetti più creativi o interessanti – il che migliora
l’engagement. Un sondaggio Microsoft su utenti early adopters di Copilot (2023) ha trovato che 77% non
vuole più farne a meno dopo averlo provato, e ~70% riferisce un aumento di produttività percepita e

![Immagine](Assets/image_001.png)



---

## Pagina 8

qualità del proprio lavoro
. Questi dati mostrano un grande entusiasmo: molti vedono l’AI come un
power-up che li rende più efficaci e li libera dai compiti più banali.

Anche a livello di  adozione aziendale la tendenza è forte: entro il 2025 oltre l’80% dei developer
utilizza regolarmente assistenti AI
, e Copilot in particolare è stato adottato dal 90% delle aziende
Fortune 100
. Questo è avvenuto non solo per “moda”, ma spinto dal riscontro positivo sul
campo. Ad esempio, ZoomInfo – azienda tech con ~400 ingegneri – ha svolto un internal pilot: Copilot
ha contribuito a centinaia di migliaia di linee di codice nel loro codebase, con una stima di ~20% di
tempo risparmiato sulle attività di codifica
. Inoltre, i sondaggi interni a ZoomInfo mostravano
circa 72% di sentiment positivo verso l’AI
. Gli ingegneri hanno apprezzato in particolare la rapidità
nel generare funzioni di utilità e boilerplate, pur riconoscendo la necessità di dedicare tempo a rivedere
l’output per garantirne la correttezza e consistenza
. Questo evidenzia un punto: i developer
riconoscono i limiti dell’AI (mancanza di conoscenza del dominio specifico, qualità variabile), ma sono
contenti di usarla come fast helper. In generale, l’adozione in team enterprise è stata accompagnata da
training e onboarding per imparare a usare bene lo strumento: i team che integrano l’AI a fondo nei
workflow riportano i maggiori benefici e soddisfazione, creando un ciclo virtuoso (più lo usi, più ti piace
usarlo)
.

Detto ciò, esistono anche  voci critiche e resistenze culturali all’uso indiscriminato dell’AI. Alcuni
sviluppatori – specialmente i più senior o puristi – manifestano frustrazione verso l’eccessiva enfasi
sull’AI. Ad esempio, discussioni su forum indicano che parte della comunità teme che gli IDE stiano
diventando sovraccarichi di funzionalità AI a scapito della stabilità di base (“non voglio la tua AI, voglio
un IDE che funzioni bene” è un refrain apparso online). JetBrains ha affrontato critiche quando il suo AI
Assistant, lanciato nel 2023, ha ottenuto recensioni negative (rating 2.3/5) dovute a bug e intralci
percepiti nel flusso di lavoro tradizionale
. Ciò suggerisce che  non tutti gli sviluppatori trovano
utile l’AI allo stesso modo: chi lavora in maniera molto metodica e approfondita su problemi complessi
può vedere l’AI come un “distrattore” o addirittura nutrire sfiducia nelle sue soluzioni. Alcuni temono di
perdere il controllo sul codice: se l’AI scrive gran parte, lo sviluppatore sente di non “possedere” più la
comprensione completa. Questo può generare ansia professionale, specie negli ingegneri che tengono
alla qualità artigianale del proprio lavoro. Tuttavia, il trend generale sembra essere l’accettazione: man
mano che gli strumenti migliorano e i developer imparano a guidarli, anche i tradizionalisti iniziano a
integrarli nei propri processi, magari limitandosi alle feature che trovano più utili (es: completamenti
automatici brevi, riassunti di codice, etc.).

In ambito open-source, un dibattito culturale acceso riguarda l’uso di AI per contribuire ai progetti. Da
un lato, GitHub ha reso Copilot gratuito per i maintainer OS per incentivarne l’uso, convinta che aumenti
la produttività. E in effetti, uno studio (Bakal et al. 2025) su repository open source ha riscontrato un
aumento nel volume di contributi dopo l’introduzione di Copilot (sviluppatori che prima facevano
poche PR ora ne fanno di più)
. Dall’altro lato, alcuni maintainer hanno espresso preoccupazione per
PR generate dall’AI potenzialmente di bassa qualità: richieste di funzionalità o fix generati via
ChatGPT senza sufficiente riflessione. C’è stato persino un appello di maintainer per avere la possibilità
su GitHub di bloccare contributi generati da AI se non conformi
. Questo denota una tensione tra la
quantità (molti contributi rapidi via AI) e la  qualità/controllabilità in comunità collaborative. Alcuni
progetti hanno iniziato a richiedere che i contributor dichiarino se hanno usato AI per generare il
codice, un po’ come indicazione per i revisori di porre extra attenzione. Culturalmente, quindi, se in
azienda  l’AI  è  caldeggiata  dal  management  (anche  perché  vista  come  aumento  di  produttività  e
riduzione costi), nelle comunità open-source e in generale tra gli sviluppatori emerge la necessità di
nuove norme e linee guida su come utilizzare correttamente questi strumenti senza compromettere
gli standard.

![Immagine](Assets/image_001.png)



---

## Pagina 9

Formazione, competenze e impatto sui ruoli (junior vs senior)
Forse  la  questione  culturale  più  discussa  è:  come  influisce  il  vibe  coding  sull’apprendimento  e  sulle
competenze dei programmatori? Si rischia di avere sviluppatori che sanno solo “promptare” l’AI senza
capire davvero il codice? Dai vari resoconti, il rischio c’è, ma mitigabile. Un post diventato virale – “New
Junior Developers Can’t Actually Code” (Goel, 2025) – sostiene che sta emergendo una generazione di
nuovi dev che scrive codice più velocemente che mai grazie all’AI, ma senza capire davvero cosa
sta facendo
. L’autore, un tech lead, racconta di giovani assunti che hanno Copilot/ChatGPT
sempre attivi e che consegnano feature apparentemente funzionanti; ma alle domande “Perché il tuo
codice  fa  così?  Considerato  edge  cases?”  ottiene  “blank  stares”
.  Osserva  che  manca  quella
conoscenza di base che una volta si costruiva  “struggendo” sui problemi: molti non sanno spiegare
alternative possibili o il ragionamento dietro il codice, perché si sono limitati ad accettare la soluzione
suggerita dall’AI. Questo porta a  comprensione superficiale e dipendenza dall’AI per debug: se
qualcosa non va, invece di introspezione, chiedono di nuovo all’AI di risolvere. In contesti educativi,
docenti  universitari  confermano  fenomeni  simili:  studenti  che  con  ChatGPT  consegnano  compiti
apparentemente corretti ma non sanno rispondere a domande semplici sul perché del codice (sintomo
che non l’hanno scritto di proprio pugno né compreso a fondo). Una discussione su HackerNews
paragona questo ai “copiatori da StackOverflow” di qualche anno fa: è un problema noto, ma l’AI lo scala
a un livello nuovo
.

Va però notato che l’AI può anche essere uno strumento didattico potente se usato con criterio. Ad
esempio, un junior può chiedere all’AI di spiegare un pezzo di codice, di fornire esempi o di suggerire
come risolvere un bug, ottenendo risposte immediate e adattive (cosa che StackOverflow non faceva).

Alcuni sviluppatori raccontano di aver colmato lacune più velocemente grazie all’AI: invece di cercare su
Google, ottenevano  mentoring istantaneo. La differenza cruciale è  l’atteggiamento dell’utente: se il
programmatore usa l’AI in  modalità apprendimento – chiedendo “perché”, verificando attivamente le
risposte, provando varianti – può imparare molto in breve tempo
. Al contrario, se usa l’AI in
modalità pilota automatico, limitandosi a incollare soluzioni, imparerà pochissimo. Nella comunità sta
emergendo il consiglio per i junior:  “usate Copilot/ChatGPT, ma con disciplina: interrogate le soluzioni,
studiate i perché, cercate di ricostruire il ragionamento”
. Alcuni percorsi educativi iniziano a integrare
l’AI non come scorciatoia per fare meno, ma come strumento per fare di più e meglio: ad esempio
generare rapidamente diversi approcci a un problema e poi analizzarli con l’insegnante. In contesti
aziendali, i mentor senior sono chiamati a guidare i junior su come usare l’AI responsabilmente – per
evitare skill atrophy. Questo include fare pair review dove il senior chiede al junior di spiegare il codice
generato, oppure impostare policy in cui il junior deve provare a implementare qualcosa da sé prima di
chiedere all’AI, in modo da allenare il problem solving umano.

Un cambiamento di ruolo importante si osserva per gli sviluppatori senior e gli architetti. Con vibe
coding, la loro esperienza è più che mai necessaria, ma il focus cambia: meno codice scritto linea per
linea, più revisione, orchestrazione e big picture. Come evidenziato dal caso di Simon Greenman
,  usare  efficacemente  gli  strumenti  AI  richiede  ciò  che  l’AI  non  ha:  “visione  architetturale,
consapevolezza  della  scala,  istinto  di  debugging,  giudizio  percettivo”.  I  senior  devono  intervenire  nel
decidere le strutture di dati appropriate, anticipare colli di bottiglia, vedere oltre il “funziona in locale”
per capire se reggerà in produzione. In pratica il senior diventa un direttore d’orchestra: lascia che l’AI
suoni le parti facili, ma mantiene la bacchetta su tempi e armonia generale. Questo può aumentare la
leva del senior: uno sviluppatore esperto con AI può realizzare progetti più grandi o multipli, perché
delega il lavoro di bassa manovalanza alla macchina e interviene solo dove serve la sua competenza.

Alcuni team riportano proprio questo effetto:  i migliori risultati con l’AI si ottengono quando i
developer più esperti la abbracciano e la integrano nel proprio processo
. Al contrario, i meno
esperti senza guida rischiano di perdersi se qualcosa va storto: “AI abbassa le barriere d’ingresso ma alza
l’asticella per la padronanza”
. Chi ha poca esperienza può ora costruire un’app full-stack demo in

![Immagine](Assets/image_001.png)



---

## Pagina 10

pochi click – ma quando si rompe, spesso non ha le skill concettuali per ripararla senza aiuto. Questo
può portare a frustrazione o stalli.

Da qui nasce anche un cambiamento nel mentoring: i senior devono affiancare i junior non più solo
nel coding tradizionale, ma nel prompt engineering e nel controllo qualità del codice AI. Alcune imprese
stanno formalizzando linee guida, ad esempio: se un junior genera codice con Copilot, deve farlo
rivedere a un senior con occhio critico, come parte del code review standard. Invece di commentare
solo lo stile o la logica, il senior deve anche insegnare al junior perché magari una soluzione “troppo
facile” suggerita dall’AI non è ottimale. Ad esempio:  “Copilot ti ha duplicato questa logica in 3 punti –
dovresti estrarla in una funzione comune per facilitarne la manutenzione”. Oppure:  “Attento, ChatGPT ha
importato  questa  libreria  da  un  esempio  obsoleto,  ma  non  è  adatta  in  produzione  per  ragioni  di
performance”. Questo tipo di insegnamento meta-cognitivo diventa fondamentale per far crescere le
competenze nonostante la presenza dell’AI.

Infine, c’è l’aspetto della  dipendenza psicologica e identitaria. Scrivere codice “a mano” per molti
sviluppatori non è solo un lavoro, ma una passione e un’arte. L’arrivo di AI in grado di generare codice
ha scosso questa identità: alcuni sviluppatori hanno espresso il timore di “diventare solo operatori che
guidano  l’AI”  invece  che  craftsmen.  C’è  chi  parla  di  loss  of  craftsmanship,  paragonandolo  ad  altre
automazioni industriali dove il ruolo umano passa da artigiano a supervisore di macchine. Questo può
generare inizialmente una sorta di resistenza culturale (“il real programmer scrive il codice, non lo fa
scrivere a un robot”). Tuttavia, col passare del tempo, si assiste a una narrazione alternativa: l’AI è vista
come un  amplificatore delle capacità umane, non un sostituto. Un po’ come l’introduzione dei
computer stessi rispetto alla programmazione con schede perforate – all’inizio c’era chi storceva il naso,
poi nessuno tornerebbe indietro. La chiave per mantenere vivo l’aspetto craft è che gli sviluppatori si
concentrino sui livelli più alti di astrazione e design, lasciando all’AI i dettagli implementativi routinari. In
tal modo, il craft non muore, si sposta: dal scrivere ogni for loop manualmente, al plasmare un sistema
intero orchestrando AI e codice umano in modo coeso. Come scrive Greenman,  “AI esegue il codice
brillantemente.  Gli  umani  architettano  sistemi  che  funzionano”
.  In  altre  parole,  la  soddisfazione
professionale può ancora derivare dall’aver progettato bene un sistema, anche se molte linee di codice
le ha sputate l’AI.

In conclusione, a livello culturale il vibe coding sta ridisegnando i confini del ruolo dello sviluppatore:
meno manodopera ripetitiva, più controllo di qualità e progettazione; meno apprendistato lento su
errori, più necessità di imparare a imparare attivamente con l’AI; meno solisti, più collaborazione uomo-
AI. I team più efficaci sono quelli che sposano una mentalità di crescita: vedono l’AI come un collega
junior instancabile da far crescere e tenere d’occhio, non come un mago infallibile né come una
minaccia al proprio valore. I developer che rimangono  curiosi e critici verso l’AI continueranno a
migliorare il proprio skillset (magari spostandolo su abilità di validazione, data-driven development,
etc.), mentre chi si affida passivamente rischia di stagnare. Dal punto di vista organizzativo, emerge
l’importanza di formare linee guida etiche e di processo: ad es. policy su come evitare di introdurre IP
proprietaria nei prompt dell’AI, o su come documentare il codice generato (visto che l’AI non commenta
da sola in modo utile). Sono considerazioni nuove che stanno diventando parte integrante della cultura
di sviluppo software.

Sintesi e Raccomandazioni
Il confronto netto tra vibe coding e sviluppo tradizionale può essere riassunto così: il vibe coding
offre  velocità  ed  accessibilità  rivoluzionarie,  mentre  il  metodo  tradizionale  assicura  controllo,
robustezza e chiarezza. Invece di proclamare un vincitore assoluto, le evidenze suggeriscono che un

![Immagine](Assets/image_001.png)



---

## Pagina 11

approccio ibrido e strategico massimizza i benefici minimizzando i rischi. Di seguito, in punti, le
conclusioni principali e raccomandazioni operative:
Produttività: L’uso dell’AI-driven coding accelera lo sviluppo in molti scenari, specialmente per
compiti ripetitivi e per sviluppatori meno esperti. Si raccomanda di impiegare strumenti AI per
automatizzare  boilerplate,  generare  scheletri  di  codice,  test  e  documentazione  di  base.  Ciò
consente  di  risparmiare  dal  20%  al  30%  del  tempo  su  progetti  tipici
.  Tuttavia,  va
monitorato l’impatto reale: eseguire  pilot interni con metriche (es. durata task, velocità di
merge) per capire dove l’AI aiuta o rallenta. In progetti complessi con codebase vasti, prevedere
inizialmente un overhead di integrazione finché il team non affina il giusto equilibrio (ad es.,
limitare l’uso AI per task critici finché non c’è confidenza nell’output).

Qualità e mantenibilità: Il codice generato dall’AI deve essere trattato al pari di quello scritto
da  un  junior  dev:  richiede  revisione,  refactoring  e  testing  diligenti.  Si  consiglia  di  non
committare codice AI senza verifica: integrare obbligatoriamente un giro di code review umana
su tutto il codice generato
. Adottare strumenti di analisi statica e metriche di qualità (es.
code churn, duplicazione) per tenere d’occhio eventuali degenerazioni nella base di codice. Se
si osserva un aumento anomalo di duplicati o di modifica di codice fresco, potrebbe essere
sintomo di abuso di AI non integrato bene – intervenire con sessioni di refactoring e formazione
mirata agli sviluppatori sull’uso più attento dell’AI (es: prompt per riutilizzare moduli esistenti). In
pratica, mantenere alti standard di clean code: nominare un “AI code custodian” nel team che
monitori la coerenza stilistica e architetturale del codice prodotto con AI.

Sicurezza:  Mai  presupporre  che  il  codice  generato  sia  sicuro.  Implementare  pipeline  di
security review su tutto il codice, specialmente se generato automaticamente: scanning di
vulnerabilità (SAST/DAST), peer review focalizzate su validazione input, gestione errori, uso di
librerie aggiornate
. Formare i developer sui common pitfalls di sicurezza dell’AI (es: tendenza
a  usare  esempi  datati,  possibili  leakage  di  chiavi)  così  che  sappiano  dove  controllare.  Per
componenti critici (es. autenticazione, crittografia, gestione pagamenti) valutare di  non usare
affatto generazione AI oppure farla fare solo a membri senior con successiva verifica incrociata
manuale. Creare policy aziendali che vietino di inserire segreti o IP sensibili nei prompt ai tool
online
, per evitare leak involontari. L’AI può velocizzare l’implementazione, ma la sicurezza
by design deve essere reintrodotta dall’ingegnere umano.

Architettura e performance: Prima di lanciare un progetto con vibe coding allo sbaraglio,
investire tempo in una  progettazione di massima tradizionale: definire moduli, interfacce,
decisioni  architetturali  chiave.  Questo  può  prevenire  il  caos  eterogeneo  che  l’AI  altrimenti
genererebbe
. Adottare un approccio di scaffold: ad esempio, far sì che un senior scriva (o
faccia generare all’AI sotto sua direzione) un blueprint dell’app, che poi può essere dettagliato
con AI per le parti di implementazione. Questo mantiene un filo coerente nell’architettura. Dal
lato performance, testare presto con dati reali: spesso il codice AI va bene per prototipi ma non
scala – identificare subito query SQL, algoritmi o strutture potenzialmente problematiche e farle
ottimizzare  (manualmente  o  chiedendo  all’AI  soluzioni  migliori,  ma  verificandole).  Non
rimandare il refactoring: ogni sprint, includere user story di tech debt repayment per ripulire le
costruzioni generate un po’ “a caso” dall’AI prima che diventino buchi neri ingestibili.

Crescita  dei  developer:  Implementare  linee  guida  per  usare  l’AI  in  modo  formativo.  Ad
esempio, incentivare i junior a chiedere all’AI spiegazioni (“spiegami il codice che hai proposto”) e
non solo soluzioni, così da capire i concetti. Fare sessioni di coding congiunte dove un senior e
un junior usano l’AI insieme, discutendo i pro e contro dei suggerimenti – questo trasferisce
conoscenza tacita. Mantenere attività  kata di programmazione senza AI occasionalmente, per
•

•
•

•

•

![Immagine](Assets/image_001.png)



---

## Pagina 12

allenare le capacità fondamentali e far emergere lacune. In sede di code review, porre domande
ai coder (soprattutto se junior) per assicurarsi che abbiano compreso il codice AI che presentano.

L’obiettivo è prevenire la “calma apparente” di team che consegnano feature ma poi non sanno
correggere un bug perché nessuno capisce davvero il codice generato. Mentorship e pairing
rimangono cruciali: l’AI non sostituisce il bisogno di spiegare why e how dietro il codice.

Cultura e processi: Promuovere una cultura dove il vibe coding non sia “premere un bottone e via
in produzione”, ma piuttosto un processo collaborativo. Adottare il mantra:  “Trust, but verify” –
fidati dell’AI per velocizzare, ma verifica sempre il risultato. Sconsigliare attivamente la pratica di
“Accept  All” indiscriminatamente  (alla  Karpathy),  se  non  in  contesti  di  mero  prototyping
throwaway. I manager dovrebbero definire  aspettative chiare: velocità sì, ma  non a costo di
qualità. Misurare non solo le linee di codice prodotte o il tempo di sviluppo, ma anche metriche
di lungo termine come tasso di bug dopo release, effort di manutenzione, soddisfazione del
team. Se questi peggiorano, potrebbe voler dire che si sta spingendo troppo sul vibe coding
senza i giusti controlli.

In definitiva, la raccomandazione è di abbracciare gli strumenti di AI coding in modo strategico e
informato. I team che combinano l’efficienza dell’AI con la competenza ingegneristica umana stanno
riportando  i  risultati  migliori:  prototipi  in  ore  invece  che  settimane
,  iterazioni  rapide  con
feedback  del  cliente,  mantenendo  però  un  nucleo  di  qualità  solido.  “Lo  sviluppo  software  non
abbandonerà i metodi tradizionali ma li potenzierà con l’AI”
: i programmatori che padroneggeranno
entrambi gli approcci, sapendo quando vibrare con l’AI e quando invece tornare a codare manualmente,
saranno in pole position nella nuova era. In altre parole, il futuro appartiene ai developer che sanno
sia volare con il pilota automatico che tenere saldamente i comandi all’occorrenza.

Limiti dello studio e Fonti
Questa ricerca presenta alcuni limiti da tenere presenti. Primo, il fenomeno vibe coding è molto recente
e in rapidissima evoluzione: le capacità dei modelli AI nel 2025 potrebbero differire sensibilmente da
quelle del 2023, quindi alcuni trend (ad es. tassi di errore, performance) potrebbero migliorare col
progredire della tecnologia. I dati quantitativi disponibili coprono solo pochi anni e spesso scenari
specifici (ad es. contesti enterprise vs open-source), il che  limita la generalizzabilità universale. In
secondo luogo, alcune fonti presentano potenziali bias: ad esempio, report di aziende come GitHub o
vendor di tool AI possono enfatizzare gli aspetti positivi, mentre blog personali possono ingigantire
problemi aneddotici. Si è cercato di bilanciare diverse prospettive, ma va riconosciuto che la letteratura
indipendente sul tema è ancora esigua. Terzo, la misurazione di concetti come “qualità del codice” o
“produttività” varia tra studi – c’è chi guarda alle linee di codice, chi alle task completate, chi alla
soddisfazione  –  quindi  un  confronto  diretto  è  complesso.  Abbiamo  qui  integrato  tali  metriche
eterogenee in una narrativa coerente, ma le cifre vanno interpretate nel giusto contesto (per es. il
+26%  di  produttività  si  riferisce  a  un  certo  tipo  di  task  in  un  certo  ambiente
).  Infine,  molte
esperienze culturali sono basate su sondaggi o opinioni soggettive di developer, che pur significative,
non hanno la robustezza di un trial controllato.

Fonti principali consultate:
Field experiments 2024-2025 su AI coding – Cui et al. (MIT/Microsoft) – tre RCT con ~4.800
sviluppatori (Copilot vs controllo)
. Evidenza A.

Studio METR 2025 – McKenzie et al. – RCT su 16 maintainer open-source (AI vs no-AI su 246 task
reali)
. Evidenza A.
•

•

•

![Immagine](Assets/image_001.png)



---

## Pagina 13

White paper GitClear (Coding on Copilot 2024) – analisi quantitativa su repository GitHub (code
churn, duplicazione post-Copilot)
. Evidenza B (fonte industriale).

Case study ZoomInfo 2025 – Bakal et al., arXiv 2501.13282 – adozione di Copilot in un team di 400
ingegneri (metriche di tempo e survey)
. Evidenza B.

Report CyAN 2025 (Kelly) – sintesi di studi e survey sulla disputa vibe coding
. Evidenza B
(sommario multi-sorgente).

Esperienza vibe coding (Greenman 2025) – Medium blog – prototipazione AI-only e riflessioni su
fragilità architetturali
. Evidenza C (aneddotica esperta).

Blog Namanyay Goel 2025 – “AI e learning” – osservazioni sull’impatto sui junior dev
.

Evidenza C.

Paper sicurezza Pearce et al. 2022 – valutazione vulnerabilità in code generation (BlackHat’22)
. Evidenza A.

Paper Shukla et al. 2025 – “Security degradation in iterative AI code” – esperimento su
vulnerabilità introdotte in loop
. Evidenza A.

Oltre a queste, si sono consultate varie discussioni community (es. Reddit, Hacker News) e annunci di
tool specifici (JetBrains AI Assistant, Replit, Tabnine, etc.) per triangolare il sentiment generale e lo stato
di adozione. Tutte le citazioni 【】 nel testo rimandano alle fonti originali aperte per approfondimenti
puntuali. In conclusione, pur con i limiti evidenziati, l’insieme di evidenze raccolte offre un quadro
robusto delle differenze tra vibe coding e approccio tradizionale nel periodo considerato, aiutando a
guidare  decisioni  informate  su  come  “mixare”  al  meglio  innovazione  e  pratiche  consolidate  nello
sviluppo software.

New Research Reveals AI Coding Assistants Boost Developer Productivity by 26%: What IT
Leaders Need to Know - IT Revolution
https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-
leaders-need-to-know/
AI-Assisted Software
Development and the “Vibe Coding” Debate by Nick Kelly – Cybersecurity Advisors Network
https://cybersecurityadvisors.network/2025/08/06/ai-assisted-software-development-and-the-vibe-coding-debate-by-nick-
kelly/
AI Coding Tools Underperform in Field Study with Experienced
Developers - InfoQ
https://www.infoq.com/news/2025/07/ai-productivity/
New GitHub Copilot Research Finds 'Downward Pressure on Code Quality' -- Visual
Studio Magazine
https://visualstudiomagazine.com/articles/2024/01/25/copilot-research.aspx
GitHub Copilot Statistics & Adoption Trends
[2025] | Second Talent
https://www.secondtalent.com/resources/github-copilot-statistics/
New Junior Developers Can’t Actually Code | N’s Blog
https://nmn.gl/blog/ai-and-learning
The AI Vibe Coding Paradox: Why Experience Matters More Than
Ever | by Simon Greenman | Data Science Collective | Oct, 2025 | Medium
https://medium.com/data-science-collective/the-ai-vibe-coding-paradox-why-experience-matters-more-than-
ever-33c343bfc2e1
•

•

•

•

•

•

•

![Immagine](Assets/image_001.png)



## Bibliografia

1. Cui et al. (MIT/Microsoft)
2. [arXiv: 2506.11022v1](https://arxiv.org/html/2506.11022v1)
3. [https://www.infoq.com/news/2025/07/ai-productivity/](https://www.infoq.com/news/2025/07/ai-productivity/)
4. [https://www.secondtalent.com/resources/github-copilot-statistics/](https://www.secondtalent.com/resources/github-copilot-statistics/)
5. [https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
6. [https://medium.com/data-science-collective/the-ai-vibe-coding-paradox-why-experience-matters-more-than-](https://medium.com/data-science-collective/the-ai-vibe-coding-paradox-why-experience-matters-more-than-)
7. [https://devclass.com/2025/04/30/jetbrains-defends-removal-of-negative-reviews-for-unpopular-ai-assistant/](https://devclass.com/2025/04/30/jetbrains-defends-removal-of-negative-reviews-for-unpopular-ai-assistant/)
8. [https://www.future-processing.com/blog/github-copilot-speeding-up-developers-work/](https://www.future-processing.com/blog/github-copilot-speeding-up-developers-work/)
9. [https://news.ycombinator.com/item?id=43074852](https://news.ycombinator.com/item?id=43074852)
10. [https://cybersecurityadvisors.network/2025/08/06/ai-assisted-software-development-and-the-vibe-coding-debate-by-nick-](https://cybersecurityadvisors.network/2025/08/06/ai-assisted-software-development-and-the-vibe-coding-debate-by-nick-)
11. [https://trickle.so/blog/vibe-coding-vs-traditional-development](https://trickle.so/blog/vibe-coding-vs-traditional-development)
12. [arXiv: 2505.10494v1](https://arxiv.org/html/2505.10494v1)
13. [https://visualstudiomagazine.com/articles/2024/01/25/copilot-research.aspx](https://visualstudiomagazine.com/articles/2024/01/25/copilot-research.aspx)
14. [https://www.intercity.technology/resources/copilotintheworkplace](https://www.intercity.technology/resources/copilotintheworkplace)
15. [https://nmn.gl/blog/ai-and-learning](https://nmn.gl/blog/ai-and-learning)
16. [arXiv: 2510.10165v2](https://arxiv.org/html/2510.10165v2)
17. [https://blog.gitguardian.com/crappy-code-crappy-copilot/](https://blog.gitguardian.com/crappy-code-crappy-copilot/)
18. [https://socket.dev/blog/oss-maintainers-demand-ability-to-block-copilot-generated-issues-and-prs](https://socket.dev/blog/oss-maintainers-demand-ability-to-block-copilot-generated-issues-and-prs)
19. [https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4945566](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4945566)
20. [https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-](https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-)
