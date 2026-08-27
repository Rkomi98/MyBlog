# Progettare sistemi multiagentici nel 2026

Ho sentito sviluppatori vantarsi di aver progettato sistemi multiagentici solo per farsi figo davanti ai colleghi o per vendere la propria soluzione con "temi di moda". Ecco, in questo articolo voglio andare deep su questo e non fermarmi al come costruirli. Perché prima di progettare un sistema così complesso, ha senso chiedersi se ha senso definirlo!

Per questo motivo, prima di parlare di swarm, supervisor e handoff, conviene fare un passo indietro.

Un sistema multiagentico non nasce quando metti due modelli uno accanto all'altro. Non nasce nemmeno quando un agente chiama un secondo agente come se fosse un tool. Nasce quando decidi di **distribuire responsabilità, contesto e controllo** fra componenti che possono prendere decisioni parzialmente autonome.

La parola importante, qui, è *decidi*. Perché aggiungere agenti non è un obiettivo. È una **scelta architetturale** che deve ripagare il proprio costo.

Per tenere insieme il discorso useremo un esempio che mi è arrivato direttamente da un percorso che sto costruendo con Datapizza. Un sistema multiagentico in grado di intercettare il mood dell'utente e di proporre una playlist di conseguenza (a tal proposito ora sto ascoltando [radio Suno](https://suno.com/labs/live-radio)). Partiamo da una richiesta molto semplice e vaga di un possibile utente:

> **«Sono stanco, ma voglio ballare.»**

È una frase piccola, ma contiene in poche parole una tensione fra due stati e una decisione da prendere.

Questo articolo può essere condensato in cinque domande:

1. **Chi decide?**
2. **Chi sa cosa?**
3. **Chi fa cosa?**
4. **Chi controlla che il lavoro sia stato svolto bene?**
5. **Chi tiene in piedi il sistema quando ci sono problemi?**

Nel 2024 Anthropic descriveva soprattutto routing, chaining, parallelizzazione, orchestrator-workers ed evaluator-optimizer ([Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)). Lungi da me dire che sono obsoleti quei pattern, anzi restano assolutamente validi.

Nel 2026, le documentazioni e i case study che cito tra poco dedicano invece molta attenzione a context lifecycle, contratti, artefatti, checkpoint, eval di traiettoria, sandbox, containment e harness ([Anthropic — Managed Agents](https://www.anthropic.com/engineering/managed-agents), [OpenAI — Agents SDK](https://openai.com/index/the-next-evolution-of-the-agents-sdk/), [Microsoft — Workflows](https://learn.microsoft.com/en-us/agent-framework/workflows/)). 

> Sia chiaro, questa è una sintesi generale di quanto ho letto finora sui vari substack e blog ufficiali delle fonti, non è una tassonomia ufficiale condivisa.



## Il sistema più semplice che può funzionare

Partiamo dalla prima domanda (probabillmente la più scomoda):

> **Perché un singolo agente non basta?**

Se il percorso è noto in anticipo, spesso basta un **workflow**. Se una trasformazione è deterministica, basta magari solo una funzione. Se un solo agente può mantenere il contesto e usare bene gli strumenti, dividere il lavoro crea soltanto nuovi punti di rottura.

```mermaid
flowchart LR
    F[Funzione] --> W[Workflow deterministico]
    W --> A[Singolo agente]
    A --> S[Agente + specialisti]
    S --> M[Sistema multiagentico]

    classDef base fill:#ECEFF2,stroke:#818282,color:#0D1F2E;
    classDef hot fill:#D7342B,stroke:#D7342B,color:#fff;
    class F,W,A,S base;
    class M hot;
```

Andare verso destra significa guadagnare flessibilità, ma anche pagare in latenza, costo, non determinismo, coordinamento e osservabilità.

Una regola di partenza può essere scritta così:

```python
# [PSEUDOCODICE]

def choose_architecture(problem):
    if problem.is_deterministic:
        return "function_or_workflow"

    if problem.path_is_known:
        return "graph_workflow"

    if problem.fits_one_context and problem.needs_one_owner:
        return "single_agent"

    return "consider_multi_agent"
```

Chiaramente non è una formula universale, non sono un oracolo dell'AI. Però è quanto basta per evitare l'errore di scambiare la complessità di un sistema per maturità. Fidatevi che non è così

Mi metto nei panni di un lettore che arrivato a questo punto si chiede:

> Ok Mirko ma quindi questi sistemi quando mi servono? Quando ha senso definire dei sottoagenti?

Simon Willison cerca di rispondere a questa domanda nel suo blog: i subagent sono preziosi soprattutto perché preservano il contesto principale e assorbono operazioni pesanti in token. Dall'altra parte avverte però che è facile frammentare inutilmente un task in molti specialisti ([Willison — Subagents](https://simonwillison.net/guides/agentic-engineering-patterns/subagents/)).

### Un agente deve guadagnarsi il posto

Prima di complicare la tua soluzione in una agentica, prova a completare questa frase:

> «Ora introduco un agente perché questa componente deve ____________.»

Le risposte plausibili riguardano giudizio, pianificazione aperta, uso dinamico di strumenti, esplorazione o interazione. Se la risposta è «deve ordinare una lista», «deve verificare i duplicati» o «deve scegliere un ramo leggendo un booleano», probabilmente stai esagerando.

Avete presente quando andate al supermercato e comprate più cose rispetto a quello di cui avete realmente bisogno? Ecco è esattamente quello che sto notando nel mondo agentico!

Sia chiaro non voglio dire che i sistemi multiagentici non hanno senso, sto solo mettendo gli svlippatori sull'attenti perché non è una soluzione a tutto. Però ora vediamo un caso d'uso interessante.



## Il monolite Spotify

Torniamo al nostro esempio di Spotify. Partiamo dal sistema più naturale. Un agente riceve la richiesta e possiede cinque strumenti:

- interpretare il mood;
- cercare generi;
- cercare canzoni;
- ordinare i risultati;
- generare la playlist.

> Nella lezione che ho proposto questo si è tradotto in un codice vero e proprio

```python
# Ecco un bell'agente monolite

return Agent(
    name="playlist_monolith",
    client=client,
    system_prompt=SYSTEM_PROMPT,
    tools=[
        interpreta_umore,
        cerca_generi_per_mood,
        cerca_canzoni_per_genere,
        ordina_canzoni,
        genera_playlist,
    ],
    max_steps=8,
)
```

Vediamo con uno schemino cosa fa questo agente:

```mermaid
flowchart LR
    U[Utente] --> A[Playlist Agent]

    A --> T1[Interpreta mood]
    A --> T2[Cerca generi]
    A --> T3[Cerca canzoni]
    A --> T4[Ordina]
    A --> T5[Crea playlist]

    T1 --> A
    T2 --> A
    T3 --> A
    T4 --> A
    T5 --> A

    classDef agent fill:#1B64F5,stroke:#1B64F5,color:#fff;
    classDef tool fill:#ECEFF2,stroke:#818282,color:#0D1F2E;
    class A agent;
    class T1,T2,T3,T4,T5 tool;
```

A prima vista sembra tutto a posto. Il modello legge «stanco» e «ballare», trova due famiglie di generi compatibili, recupera i brani e costruisce una playlist.

Poi sposti il focus e compare la crepa.

In alcuni run l'agente tratta i due segnali come due ricerche indipendenti, unisce i risultati e consegna una playlist che contiene brani da festa e brani rilassanti senza aver deciso quale relazione esista fra lo stato attuale e quello desiderato.

Il problema non è che il modello non abbia interpretato bene le parole. Le ha capite entrambe. E non ha nemmeno scelto un tool palesemente sbagliato. Il fallimento sta altrove: **una decisione importante è rimasta implicita**! O meglio non si è fermato a chiedere all'utente "Ok bro ma quindi che vuoi? Scegli una via altrimenti viene un mezzo pasticcio!"

```mermaid
flowchart LR
    P["Sono stanco,<br/>ma voglio ballare"] --> I[Interpreta]
    I --> S1[stanco → energia bassa]
    I --> S2[ballare → energia alta]
    S1 --> C[Unione implicita]
    S2 --> C
    C --> O[Playlist formalmente valida,<br/>semanticamente incoerente]

    classDef ok fill:#D9EEE3,stroke:#2E8B6B,color:#164B36;
    classDef bad fill:#F6D9D6,stroke:#C64336,color:#7A2A22;
    class S1,S2 ok;
    class C,O bad;
```

Ok focalizziamoci meglio su queste due ambiguità diverse che non sono state viste dall'agente.

### Decision ambiguity

Chi stabilisce se la richiesta descrive:

- una contraddizione da chiarire;
- una transizione da energia bassa a energia alta;
- una combinazione volutamente ibrida?

### Acceptance ambiguity

Chi stabilisce che la playlist prodotta sia abbastanza coerente da poter essere consegnata?

L'agente monolite (ovvero con solo tool a disposizione) possiede una condizione di arresto tecnica: `max_steps=8` e un tool finale. Quello che gli manca è una **definition of done esterna**.

Ed è qui che iniziano a valutare i sistemi multiagentici. Non perché cinque tool siano troppi in assoluto (o troppo pochi, potrebbero comunque fare confusione), ma perché l'azione di comprendere, di decidere, di eseguire e valutare convivono nello stesso centro decisionale, che è "la testa" di un singolo agente!

## Divide et impera

Chiudi gli occhi e dimmi a che soluzione stai pensando. Ok riapri gli occhi. Penso che la tentazione naturale sia, a questo punto, creare quattro agenti:

```text
Mood Agent
Decision Agent
Search Agent
Evaluation Agent
```

Sembra ordinato. Ma come gestiamo l'architettura, che ordine diamo? Prima bisogna scomporre il **lavoro**!

```mermaid
flowchart LR
    A[Comprendere la richiesta] --> B[Costruire un piano di ricerca]
    B --> C[Raccogliere candidati]
    C --> D[Comporre la playlist]
    D --> E[Verificare i vincoli]
    E --> F[Consegnare]
```

Poi, per ogni passaggio, chiediamo:

```python
# [PSEUDOCODICE]

Task(
    goal=...,
    inputs=...,
    outputs=...,
    tools=...,
    context=...,
    side_effects=...,
    failure_policy=...,
    verification=...,
)
```

Soltanto dopo decidiamo quale componente debba svolgerlo.

```text
Interpretare l'intento       → LLM / agente
Leggere un booleano          → codice
Cercare nel catalogo         → tool o worker
Ordinare per energia         → funzione
Comporre una playlist        → agente, se serve giudizio
Controllare duplicati        → funzione
Giudicare la coerenza        → evaluator, se resta soggettività
```

Questa distinzione vale la pena di fissarla:

> **Task decomposition e agent decomposition non sono la stessa cosa!!**

Microsoft Agent Framework presenta gli agenti come possibili partecipanti ed esecutori di workflow funzionali o basati su un grafo ([Microsoft — Workflows](https://learn.microsoft.com/en-us/agent-framework/workflows/)). 

Una volta che abbiamo capito cosa vogliamo, vediamo a chi assegnare cosa ogni compito. Penso sia fondamentale che **ogni nodo abbia una responsabilità chiara**.

## Chi decide?

Una volta rappresentato il lavoro, dobbiamo assegnare il controllo.

Nella mia esperienza ho visto che ci sono tre pattern che vengono confusi, o meglio pensati come equivalenti: routing, supervisor e handoff. In realtà rispondono a domande differenti!

### Routing: la decisione è già nello stato

> **Quando usarlo.** Usa il routing quando la scelta del prossimo passo può essere ridotta a uno stato o a una classificazione esplicita e verificabile: un campo tipizzato, una soglia, una policy o un booleano. Il modello può estrarre o classificare quell'informazione e il codice deve decidere il ramo.
> **Quando usare altro?** Se la scelta dipende invece dall'evoluzione del compito, da risultati intermedi o da un compromesso non rappresentato nello stato, serve un supervisor.

Vediamo con il running example quale dovrebbe essere il primo passo. Ecco esso consiste nel chiedere al modello di produrre uno stato semantico tipizzato.

```python
class MoodProfile(BaseModel):
    current_energy: float
    desired_energy: float
    intent: Literal["maintain", "shift", "explore"]
    needs_clarification: bool
```

A quel punto il ramo non richiede un'altra inferenza. È puro codice sincrono. Il modello non fa nessuna chiamata a un LLM, nessuna latenza di rete, nessun costo di inferenza. Abbiamo un bel risultato deterministico e testabile con un normale unit test

```python
def route(profile: MoodProfile) -> Literal["clarification", "search"]:
    return "clarification" if profile.needs_clarification else "search"
```

```mermaid
flowchart LR
    P[Prompt] --> M[MoodProfile]
    M --> G{needs_clarification?}
    G -->|sì| C[Clarifier]
    G -->|no| S[Search]

    classDef model fill:#1B64F5,stroke:#1B64F5,color:#fff;
    classDef code fill:#F4E3B2,stroke:#C8902B,color:#5A4405;
    class M model;
    class G code;
```

La mossa importante qui è **rendere la decisione rappresentabile**. Finché la differenza fra «sono stanco» e «voglio ballare» restano testo libero, decidere il prossimo passo significa richiedere ogni volta un nuovo giudizio al modello. Quando diventa `current_energy != desired_energy` e `intent="shift"`, una parte del controllo può uscire dal prompt ed entrare nel codice.

### Supervisor: la decisione richiede ancora giudizio

> **Quando usarlo.** Usa un supervisor quando il prossimo passo non è deducibile da una regola stabile e si deve scegliere fra specialisti in base all'obiettivo, allo stato, agli output intermedi e a trade-off che cambiano durante l'esecuzione. Il supervisor conserva l'ownership della conversazione e ricompone i risultati.
> **Quando NON usarlo.** Se basta leggere un campo o applicare una policy deterministica, è routing: un supervisor aggiungerebbe inferenza, latenza e non-determinismo senza produrre giudizio utile.

Un supervisor serve quando non basta leggere un campo.

```mermaid
flowchart TD
    U[Utente] --> S[Supervisor]
    S --> M[Mood Interpreter]
    S --> SC[Music Scout]
    S --> C[Curator]
    M --> S
    SC --> S
    C --> S
    S --> O[Output]

    classDef key fill:#1B64F5,stroke:#1B64F5,color:#fff;
    class S key;
```

Il supervisor conserva il filo della conversazione, decide quale specialista chiamare, riceve il risultato e può delegare di nuovo.

```python
# [PSEUDOCODICE]

while not state.done:
    decision = supervisor.decide(
        goal=state.goal,
        current_state=state.summary,
        pending=state.pending,
        available_workers=registry,
    )

    result = await registry[decision.worker].run(decision.task)
    state.record(result)
```

Il costo è evidente: un'altra inferenza, un altro punto di non determinismo, più latenza. Perciò la domanda corretta non è «posso usare un supervisor?», ma:

> **C'è ancora qualcosa da negoziare?**

Se la risposta è già dentro uno schema, il supervisor è un modo costoso per leggere un campo.

### Handoff: cambia il proprietario del prossimo turno

> **Quando usarlo.** Usa un handoff quando, oltre al lavoro da svolgere, deve cambiare chi possiede il dialogo nel turno successivo. Se un agente deve solo eseguire un sotto-compito e restituirne l'esito, mantieni il controllo nell'orchestratore e usa una delegation o un agente come tool.

Nella delegation il manager resta l'interlocutore. Nell'handoff il controllo passa allo specialista.

```mermaid
flowchart LR
    subgraph Delegation
        S1[Supervisor] --> A1[Specialista]
        A1 --> S1
        S1 --> U1[Utente]
    end

    subgraph Handoff
        T[Triage] --> A2[Specialista]
        A2 --> U2[Utente]
    end
```

OpenAI Agents SDK distingue esplicitamente queste due topologie: *agents as tools* quando il manager mantiene il controllo; *handoffs* quando lo specialista prende in carico la parte successiva dell'interazione ([OpenAI Agents SDK — orchestrazione](https://openai.github.io/openai-agents-python/multi_agent/), [handoff](https://openai.github.io/openai-agents-python/handoffs/)).

La differenza si può ricordare così:

```text
Delegation → cambia chi lavora.
Handoff    → cambia chi possiede il controllo.
```



## Un handoff è un contratto

Nei diagrammi l'handoff è una freccia. Nei sistemi veri è un confine.

Il passaggio ingenuo è questo:

```python
# [ANTI-PATTERN]
await specialist.run(full_history)
```

Il passaggio progettato assomiglia di più a questo:

```python
# [REFERENCE DESIGN]

class HandoffContract(BaseModel):
    goal: str
    reason: str
    relevant_state: dict
    constraints: list[str]
    artifact_refs: list[str]
    expected_output: str
    return_policy: Literal["return_to_supervisor", "own_conversation"]
```

```mermaid
flowchart LR
    A[Triage] --> H["Handoff contract<br/>goal<br/>relevant state<br/>constraints<br/>artifact refs<br/>expected output"]
    H --> B[Specialista]

    classDef contract fill:#F4E3B2,stroke:#C8902B,color:#5A4405;
    class H contract;
```

Qui diventano visibili due decisioni che spesso vengono confuse:

1. **chi possiede il controllo;**
2. **quale informazione attraversa il confine.**

LangChain documenta gli handoff come transizioni guidate dallo stato. LangGraph mostra inoltre che parent graph e subgraph possono avere schemi di stato distinti, mappando esplicitamente l'input verso il subgraph e il suo output di ritorno ([LangChain — handoff](https://docs.langchain.com/oss/python/langchain/multi-agent/handoffs), [LangGraph — subgraph](https://docs.langchain.com/oss/python/langgraph/use-subgraphs)).

La conseguenza è importante: un handoff non dovrebbe passare «tutto, per sicurezza». Dovrebbe passare ciò che serve a lavorare senza costringere lo specialista a ricostruire il mondo.



## Chi fa cosa?

A questo punto sappiamo chi prende le decisioni. Resta da distribuire il lavoro.

### Tool, worker, subagent

Sono tre cose diverse.

Un **tool** espone una capacità. Non possiede un obiettivo e non decide il passo successivo.

Un **worker** riceve un compito circoscritto e restituisce un risultato.

Un **subagent** è un worker con un proprio ciclo di ragionamento, un contesto locale e, spesso, strumenti propri.

```mermaid
flowchart TB
    S[Supervisor]
    S --> T[Tool<br/>search_catalog(query)]
    S --> W[Worker<br/>esegui task definito]
    S --> A[Subagent<br/>goal + context + tools + loop]
```

La distinzione serve perché un tool non ha bisogno di una personalità. E un subagent non dovrebbe essere usato per mascherare una funzione che non abbiamo voglia di scrivere.

### Parallelismo: prima le dipendenze

Tre ricerche possono lavorare in parallelo soltanto se non dipendono l'una dall'altra.

```mermaid
flowchart LR
    P[Search Plan] --> S1[Scout: electronic]
    P --> S2[Scout: indie dance]
    P --> S3[Scout: funk]
    S1 --> A[Aggregator]
    S2 --> A
    S3 --> A
```

```python
# [REFERENCE DESIGN]

results = await asyncio.gather(
    scout.run(SearchTask(genre="electronic", ...)),
    scout.run(SearchTask(genre="indie-dance", ...)),
    scout.run(SearchTask(genre="funk", ...)),
)

candidates = aggregate(results)
```

Se invece B richiede l'output di A, il fan-out è soltanto un disegno piacevole.

```text
A → B → C        dipendenza: sequenza

A → {B, C, D}    indipendenza: parallelismo possibile
```

Nel febbraio 2026 Anthropic ha raccontato un esperimento con sedici agenti Claude che lavoravano in parallelo su un compilatore C. È un caso concreto in cui task lock, repository condiviso e test hanno permesso di dividere il lavoro; lo stesso resoconto documenta merge conflict frequenti, circa 2.000 sessioni e quasi 20.000 dollari di costo ([Anthropic — C compiler](https://www.anthropic.com/engineering/building-c-compiler)).

La lettura giusta non è «sedici agenti funzionano». È:

> **Quale struttura del problema ha reso possibile farli lavorare senza calpestarsi?**

Simon Willison propone una cautela simile: il parallelismo aiuta quando i file o i sottocompiti sono indipendenti; i subagent restano soprattutto un meccanismo per proteggere il contesto principale e confinare operazioni verbose ([Willison — Subagents](https://simonwillison.net/guides/agentic-engineering-patterns/subagents/)).



## Chi sa cosa?

Qui arriviamo al nodo che nel 2026 pesa quasi quanto l'orchestrazione stessa: il **context engineering**.

L'errore più comodo consiste nel dare a ogni agente l'intera conversazione, l'intero stato e tutti gli strumenti. Sembra prudente. In realtà sposta il problema: invece di rischiare che manchi un'informazione, costringiamo ogni componente a distinguere ciò che conta da una massa di dettagli che non gli appartengono.

```mermaid
flowchart TD
    GS[(Global State)] --> S[Supervisor context]
    S -->|subset| A[Scout context]
    S -->|subset| B[Curator context]
    S -->|subset| C[Verifier context]

    A -->|summary + artifact ref| S
    B -->|playlist artifact| S
    C -->|verdict| S

    classDef root fill:#1B64F5,stroke:#1B64F5,color:#fff;
    class GS,S root;
```

Nel nostro esempio:

```text
SUPERVISOR
──────────
richiesta utente
MoodProfile
piano corrente
riepiloghi dei worker
failure globali

SCOUT
──────────
SearchTask
range energetico
generi esclusi
catalog tools

CURATOR
──────────
PlaylistRequest
CandidateSet
criteri di composizione

VERIFIER
──────────
playlist prodotta
vincoli
rubrica di valutazione
```

La regola «contesto minimo sufficiente» non significa amputare informazione a caso. Significa riconoscere che il contesto è una forma di **memoria di lavoro**: limitata, costosa e sensibile al rumore.

Anthropic ha formalizzato questa idea nel 2025 parlando di context engineering: selezionare, mantenere e aggiornare l'insieme di token che massimizza la probabilità del comportamento desiderato ([Anthropic — Context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)). Nel resto dell'articolo applicheremo questo principio a subagent, sessioni persistenti, artefatti e harness long-running.

### Il paradosso del contesto condiviso

Passare poco contesto produce omissioni. Passarne troppo produce interferenza.

Jason Liu, raccontando la posizione di Cognition sui multi-agent per il coding, usa l'immagine del telefono senza fili: ogni passaggio può perdere decisioni implicite e produrre componenti incompatibili. È una fonte del 2025, quindi non la userei per descrivere da sola lo stato dell'arte; rimane però una delle formulazioni più nitide del rischio di context loss fra agenti ([Jason Liu — Cognition e multi-agent](https://jxnl.co/writing/2025/09/11/why-cognition-does-not-use-multi-agent-systems/)).

Il punto non si risolve con «passiamo tutto a tutti». I worker paralleli possono comunque prendere decisioni incompatibili, e il contesto globale può diventare troppo grande. La soluzione matura consiste nel rendere espliciti:

- lo stato che deve essere condiviso;
- le decisioni che devono diventare contratti;
- le informazioni che possono restare locali;
- il formato con cui i risultati risalgono.



## Stato, memoria e artefatti

Nel linguaggio degli agenti, *memory* viene usato per indicare troppe cose. Conviene rimetterle in fila.

### Conversation state

È ciò che serve a mantenere continuità nell'interazione: messaggi, turni, identità dell'agente attivo, richieste pendenti.

### Task state

È lo stato operativo del lavoro:

```python
# [REFERENCE DESIGN]

class WorkflowState(BaseModel):
    request: PlaylistRequest
    search_plan: SearchPlan | None = None
    candidate_artifacts: list[str] = []
    playlist_artifact: str | None = None
    verification: VerificationResult | None = None
    retries: dict[str, int] = {}
    status: Literal["running", "waiting", "failed", "done"] = "running"
```

### Local state

È ciò che appartiene a uno specialista e non deve per forza risalire:

```python
class ScoutLocalState(BaseModel):
    attempted_queries: list[str]
    visited_track_ids: set[str]
    raw_tool_outputs: list[str]
```

### Artifact

È un prodotto persistente del lavoro: file, report, patch, tabella, playlist, dataset, piano.

Quando l'output è grande, passare un riferimento è spesso più sano che reiniettare tutto nel prompt.

```python
# [REFERENCE DESIGN]

return WorkerResult(
    summary="Trovati 84 candidati, 61 dopo i filtri.",
    artifact_ref="artifacts/run-284/candidate_set.json",
    warnings=["catalogo funk poco coperto"],
)
```

```mermaid
flowchart LR
    S[Scout] --> A[(candidate_set.json)]
    S --> R[Summary]
    A --> C[Curator]
    R --> SUP[Supervisor]
    SUP --> C
```

L'artefatto conserva fedeltà. Il riepilogo conserva spazio nel contesto.

È un equilibrio molto più solido del tentativo di trasformare ogni passaggio in un messaggio sempre più lungo.



## Chi controlla?

Fin qui abbiamo distribuito il lavoro. Ora dobbiamo evitare che il sistema confonda «ho prodotto qualcosa» con «ho finito».

La verifica moderna ha almeno tre strati.

```mermaid
flowchart TD
    A[Artifact] --> D[Deterministic checks]
    D -->|pass| E[Environmental verification]
    E -->|pass| J[Semantic evaluator]
    J -->|pass| O[Accepted]

    D -->|fail| F[Feedback]
    E -->|fail| F
    J -->|fail| F
    F --> G[Generator / Curator]

    classDef hard fill:#D9EEE3,stroke:#2E8B6B,color:#164B36;
    classDef soft fill:#F4E3B2,stroke:#C8902B,color:#5A4405;
    class D,E hard;
    class J soft;
```

### Controlli deterministici

Se una proprietà si può verificare in Python, non serve chiedere a un LLM.

```python
# [REFERENCE DESIGN]

def hard_checks(playlist: Playlist, request: PlaylistRequest) -> CheckResult:
    errors = []

    if len(playlist.track_ids) != len(set(playlist.track_ids)):
        errors.append("duplicate_tracks")

    forbidden = set(request.excluded_genres)
    if any(track.genre in forbidden for track in playlist.tracks):
        errors.append("excluded_genre")

    if not energy_curve_matches(
        playlist.tracks,
        start=request.current_energy,
        target=request.desired_energy,
    ):
        errors.append("energy_curve")

    return CheckResult(passed=not errors, errors=errors)
```

### Verifica nell'ambiente

Un agente può dire di aver creato una playlist. La domanda è se la playlist esista davvero nel sistema esterno.

```python
# [PSEUDOCODICE]

playlist_id = spotify.create_playlist(payload)

assert spotify.get_playlist(playlist_id).track_ids == payload.track_ids
```

Anthropic distingue con precisione transcript e outcome: il primo è ciò che l'agente ha detto e fatto; il secondo è lo stato finale dell'ambiente. Un eval robusto tende a preferire l'outcome quando è osservabile ([Anthropic — Evals per agenti](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)).

### Valutazione semantica

Rimane poi ciò che non si lascia ridurre a un'asserzione netta:

- la playlist racconta una transizione coerente?
- la selezione è varia senza sembrare casuale?
- il risultato interpreta bene la tensione fra stanchezza e desiderio di ballare?

Qui un evaluator separato può aggiungere valore.

```python
# [REFERENCE DESIGN]

class SemanticEvaluation(BaseModel):
    mood_coherence: float
    transition_quality: float
    rationale: str
    passed: bool
```

Il principio non è «servono sempre due agenti». Nel suo case study del marzo 2026, Anthropic propone di separare generator ed evaluator perché è più facile rendere un valutatore autonomo severo che convincere un generatore a criticare il proprio output. Lo stesso case study mostra però che il beneficio dipende dal compito e dal modello, mentre costo e latenza possono crescere di un ordine di grandezza ([Anthropic — Harness long-running](https://www.anthropic.com/engineering/harness-design-long-running-apps)).

In uno degli esperimenti descritti, il sistema completo ha lavorato per circa sei ore e consumato circa 200 dollari, contro venti minuti e 9 dollari del singolo agente. La qualità era superiore, ma il conto ci ricorda che un evaluator deve guadagnarsi il proprio posto esattamente come gli altri agenti ([Anthropic — Harness long-running](https://www.anthropic.com/engineering/harness-design-long-running-apps)).

### Un ciclo ha bisogno di un freno

```python
# [REFERENCE DESIGN]

for revision in range(MAX_REVISIONS + 1):
    playlist = await curator.run(request, feedback=feedback)

    hard = hard_checks(playlist, request)
    if not hard.passed:
        feedback = hard.to_feedback()
        continue

    semantic = await evaluator.run(playlist, request)
    if semantic.passed:
        return playlist

    feedback = semantic.rationale

raise VerificationFailed("revision budget exhausted")
```

Senza criteri, budget e stop condition, evaluator-optimizer è soltanto una conversazione circolare fra modelli.



## Evals: il sistema va misurato intero

Gli eval per agenti non possono limitarsi alla risposta finale.

Anthropic propone una terminologia utile:

- **task**: il singolo caso di test;
- **trial**: un tentativo, da ripetere perché il sistema è stocastico;
- **grader**: la logica che assegna un giudizio;
- **transcript / trace / trajectory**: la storia completa del trial;
- **outcome**: lo stato finale dell'ambiente;
- **evaluation harness**: l'infrastruttura che esegue, registra e valuta ([Anthropic — Evals per agenti](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)).

Nel running example, una suite sensata non dovrebbe chiedere soltanto «ha prodotto una playlist?». Dovrebbe definire una semantica diversa per ogni richiesta.

```yaml
# [REFERENCE DESIGN]

tasks:
  - id: E01
    prompt: "Sono stanco, ma voglio ballare."
    expected:
      - coherent_shift_or_clarification

  - id: E02
    prompt: "Sorprendimi."
    expected:
      - exploration_branch

  - id: E03
    prompt: "Fammi allenare, ma niente techno."
    expected:
      - no_excluded_genres

  - id: E04
    prompt: "Voglio una playlist energica per la palestra."
    expected:
      - valid_high_energy_playlist

  - id: E05
    prompt: "Che ore sono?"
    expected:
      - out_of_domain
```

Poi si osservano dimensioni differenti:

```text
OUTCOME
playlist creata?
vincoli rispettati?
side effect corretto?

TRAJECTORY
router corretto?
handoff necessario?
tool ridondanti?
loop terminato?

EFFICIENZA
latenza
costo
token
tool call
retry

AFFIDABILITÀ
pass@1
pass^k
tasso di recovery
fallimenti silenziosi
```

Hamel Husain insiste su una distinzione che vale la pena portarsi dietro: errori differenti richiedono tassonomie differenti. Chiamare tutto «hallucination» rende invisibili i guasti che contano. La pratica utile parte dalla lettura dei trace, costruisce un vocabolario degli errori e calibra gli evaluator contro giudizi umani ([Hamel Husain — Evals skills](https://hamelhusain.substack.com/p/evals-skills-for-coding-agents)).

### Non premiare un percorso rigido

Un eval troppo prescrittivo rischia di bocciare una soluzione valida soltanto perché il modello ha trovato una strada diversa. Quando possibile, verifica l'outcome e usa la traiettoria per individuare comportamenti rischiosi, sprechi o violazioni di policy, senza trasformare ogni tool call in un copione obbligatorio.



## Il mondo va storto

Un sistema multiagentico non è definito soltanto dal percorso felice. È definito da ciò che succede quando un nodo non fa il proprio dovere.

```mermaid
stateDiagram-v2
    [*] --> Running
    Running --> Success: outcome verificato
    Running --> Retry: errore transitorio
    Running --> Fallback: errore recuperabile
    Running --> Replan: evidenza insufficiente
    Running --> Human: azione rischiosa o ambigua
    Running --> Failed: errore fatale
    Retry --> Running
    Fallback --> Running
    Replan --> Running
    Human --> Running: approvazione / nuovo input
```

Conviene distinguere almeno queste famiglie.

### Output formalmente invalido

```python
# [PSEUDOCODICE]

try:
    profile = await mood_interpreter.run(prompt)
except ValidationError:
    if retry_budget.consume("mood_interpreter"):
        profile = await mood_interpreter.run(prompt, repair=True)
    else:
        return clarification_fallback()
```

### Output valido ma semanticamente incerto

Non è un'eccezione. È uno stato.

```python
if profile.needs_clarification:
    return transition_to("clarifier")
```

### Tool esterno non disponibile

```python
try:
    tracks = await remote_catalog.search(query)
except TransientToolError:
    tracks = local_catalog.search(query)
    state.warnings.append("remote_catalog_unavailable")
```

### Successo parziale

```text
Scout A ✓
Scout B timeout
Scout C ✓
```

Le opzioni non sono soltanto «tutto fallisce» o «facciamo finta di niente».

```python
# [REFERENCE DESIGN]

if successful_workers >= minimum_required:
    continue_with_partial_results(warnings=failed_workers)
elif retry_budget.available:
    retry(failed_workers)
else:
    escalate_or_abort()
```

### Idempotenza e side effect

Un retry innocuo su una ricerca read-only è diverso da un retry sulla creazione della playlist.

```python
# [REFERENCE DESIGN]

spotify.create_playlist(
    payload,
    idempotency_key=state.run_id,
)
```

Senza idempotenza, un errore di rete dopo il side effect può produrre due playlist identiche. Nei sistemi multiagentici il problema peggiora, perché più worker possono credere di essere autorizzati a scrivere.

Una policy semplice è il **single writer**: molti agenti possono proporre, uno soltanto può modificare lo stato esterno.



## Blast radius e human-in-the-loop

Quando un agente può soltanto leggere un catalogo musicale, il danno massimo è contenuto. Quando un agente può effettuare un rollback in produzione, la stessa architettura diventa un'altra faccenda.

Il rischio operativo può essere letto come:

```text
rischio ≈ probabilità di errore × danno massimo possibile
```

Migliorare il modello riduce, forse, il primo termine. Le permission e l'isolamento limitano il secondo.

```mermaid
flowchart LR
    A[Agent] --> R[Read metrics]
    A --> L[Read logs]
    A --> P[Propose remediation]
    A -. approval .-> H[Human]
    H --> X[Execute production change]

    classDef safe fill:#D9EEE3,stroke:#2E8B6B,color:#164B36;
    classDef risky fill:#F6D9D6,stroke:#C64336,color:#7A2A22;
    class R,L,P safe;
    class X risky;
```

Anthropic, nel maggio 2026, ha descritto il containment come un problema di limitazione del blast radius: non soltanto sorvegliare ciò che il modello tende a fare, ma restringere ciò che l'ambiente gli permette materialmente di fare. L'articolo segnala anche l'approvazione automatica o distratta come limite del semplice human-in-the-loop: troppi prompt di permesso producono approval fatigue ([Anthropic — Containment](https://www.anthropic.com/engineering/how-we-contain-claude)).

Microsoft Agent Framework tratta le richieste di approvazione e informazione come eventi sospendibili del workflow; lo stato pendente può essere incluso nei checkpoint e riemesso dopo il ripristino ([Microsoft — HITL nei workflow](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop)).

Da qui una regola pratica:

> **Il controllo umano va collocato nei punti di rischio, non distribuito come una pioggia di finestre modali.**



## Quando il lavoro dura più della conversazione

I task brevi possono vivere in una singola context window. I task lunghi no.

```mermaid
flowchart LR
    S1[Sessione 1] --> C1[Checkpoint]
    C1 --> M[(Durable state)]
    C1 --> A[(Artifacts)]
    M --> S2[Sessione 2]
    A --> S2
    S2 --> C2[Checkpoint]
```

Qui entrano quattro tecniche differenti.

### Compaction

La storia precedente viene riassunta e la stessa sessione continua. Conserva continuità, ma il riepilogo può perdere dettagli e il contesto resta una stratificazione di decisioni vecchie.

### Context reset

Si avvia un contesto pulito e si passa uno structured handoff. Costa di più, ma elimina residui e «ansia da contesto» osservata in alcuni modelli.

### Checkpoint

Si salva lo stato operativo in modo da poter riprendere dopo crash, pausa umana o manutenzione.

### Artifact persistence

Il lavoro non viene affidato soltanto alla memoria conversazionale. File, test, piani e risultati restano disponibili fuori dal prompt.

```python
# [REFERENCE DESIGN]

checkpoint = Checkpoint(
    goal=state.goal,
    completed=state.completed_tasks,
    pending=state.pending_tasks,
    decisions=state.key_decisions,
    artifact_refs=state.artifact_refs,
    failures=state.failure_log,
    active_requests=state.pending_human_requests,
)

checkpoint_store.save(checkpoint)
```

Anthropic ha mostrato nel marzo 2026 un harness a tre agenti per applicazioni long-running: planner, generator ed evaluator, con contratti e file usati come artefatti di comunicazione. Un dettaglio istruttivo è che, con modelli successivi, alcune parti del vecchio harness sono diventate zavorra e sono state rimosse. L'harness non è una cattedrale: è un'ipotesi sui limiti del modello corrente ([Anthropic — Harness long-running](https://www.anthropic.com/engineering/harness-design-long-running-apps)).



## Dal sistema di agenti all'harness

Nel 2026 la parola più interessante non è forse *multi-agent*. È *harness*.

L'harness è ciò che circonda il modello e trasforma un'inferenza in un sistema operativo:

```mermaid
flowchart TB
    U[Goal] --> H[Harness]
    H --> M[Model / Agents]
    H --> T[Tool dispatch]
    H --> C[Context lifecycle]
    H --> R[Recovery policy]
    H --> E[Tracing + eval hooks]
    H --> S[Session store]
    H --> X[Sandbox / execution environments]
```

OpenAI, nel proprio lavoro sull'harness engineering, racconta un prodotto costruito con agenti Codex, test automatizzati, osservabilità leggibile dal modello e ambienti isolati per task. Il punto interessante non è il numero di righe prodotte; è il cambio di mestiere: gli esseri umani progettano ambiente, intenti e feedback loop, mentre gli agenti eseguono ([OpenAI — Harness engineering](https://openai.com/index/harness-engineering/)).

Ad aprile 2026 OpenAI ha esteso Agents SDK con un harness più capace per lavori su file e tool, sandbox native e separazione fra harness e compute per sicurezza, durabilità e scala ([OpenAI — Evoluzione dell’Agents SDK](https://openai.com/index/the-next-evolution-of-the-agents-sdk/)).

Anthropic, con Managed Agents, propone una separazione molto nitida:

```text
SESSION
append-only log di ciò che è accaduto

HARNESS
loop che chiama il modello e instrada i tool

SANDBOX
ambiente in cui il lavoro viene eseguito
```

La separazione consente a ciascun elemento di fallire, cambiare o scalare indipendentemente. È la versione infrastrutturale della stessa domanda che ci accompagna dall'inizio: chi possiede quale responsabilità? ([Anthropic — Managed Agents](https://www.anthropic.com/engineering/managed-agents))

### Molti cervelli, molte mani

La metafora usata da Anthropic è efficace. Il «cervello» è modello più harness; le «mani» sono sandbox e strumenti. Disaccoppiarli consente a più harness di usare ambienti diversi, o allo stesso harness di inviare lavoro a più execution environment, senza trasformare ogni sessione in un server indivisibile ([Anthropic — Managed Agents](https://www.anthropic.com/engineering/managed-agents)).

Questo non implica che ogni applicazione debba costruire un meta-harness. Significa che, appena il lavoro diventa lungo e operativo, il confine fra ragionamento, stato ed esecuzione smette di essere un dettaglio.



## MCP e A2A: due problemi differenti

Nel rumore dei protocolli è facile confondere le sigle.

### MCP

Model Context Protocol collega un modello o un agente a strumenti, dati e risorse ([specifica MCP](https://modelcontextprotocol.io/specification/2026-07-28)). La relazione tipica è:

```text
agent ↔ tool / data source
```

### A2A

Agent2Agent riguarda l'interoperabilità e la comunicazione fra agenti o servizi agentici separati ([documentazione ufficiale A2A](https://a2a-protocol.org/latest/)).

```text
agent service ↔ agent service
```

```mermaid
flowchart LR
    A[Agent] -->|MCP| T[Tool / Data]
    A -->|A2A| B[Remote Agent Service]
```

A2A è un livello di comunicazione tra agenti, non un agent development kit né un protocollo per i subagent interni o per le tool call. Serve a far collaborare agenti indipendenti, anche costruiti con framework diversi, senza imporre la condivisione di memoria, strumenti o logica proprietaria ([specifica A2A](https://a2a-protocol.org/latest/)).

Nel running example Spotify, introdurlo ora sarebbe complessità pagata in anticipo. Diventerebbe pertinente se il catalogo, il curator e il sistema di creazione playlist fossero servizi autonomi gestiti da team o vendor differenti.



## Quando una decisione diventa un edge

A un certo punto il sistema contiene:

- stato tipizzato;
- nodi;
- transizioni condizionali;
- fan-out e fan-in;
- loop di revisione;
- checkpoint;
- richieste umane;
- condizioni di arresto.

Non serve più cercare una metafora. Abbiamo costruito un grafo.

```mermaid
flowchart TD
    U[User] --> M[Mood Interpreter]
    M --> G{needs_clarification?}
    G -->|sì| C[Clarifier]
    C --> U
    G -->|no| P[Search Planner]
    P --> S1[Scout 1]
    P --> S2[Scout 2]
    P --> S3[Scout 3]
    S1 --> A[Aggregate]
    S2 --> A
    S3 --> A
    A --> CU[Curator]
    CU --> H[Hard Checks]
    H -->|fail| CU
    H -->|pass| E[Semantic Evaluator]
    E -->|revise| CU
    E -->|pass| O[Create Playlist]
    O --> END([Done])
```

La transizione concettuale è questa:

```text
Agent thinking:
«Quale strumento dovrei chiamare?»

Graph thinking:
«Quale nodo è eseguibile, dato lo stato corrente?»
```

Le due cose convivono. Un nodo del grafo può contenere un agente, una funzione, un tool wrapper o una richiesta umana.

Microsoft Agent Framework documenta workflow funzionali o graph-based, agenti come executor, orchestrazioni sequenziali o concorrenti, checkpoint e HITL. LangGraph documenta state, subgraph, interrupt e persistence. Le API cambiano; la grammatica resta ([Microsoft — Workflows](https://learn.microsoft.com/en-us/agent-framework/workflows/), [LangGraph — subgraphs](https://docs.langchain.com/oss/python/langgraph/use-subgraphs), [LangGraph — persistence](https://docs.langchain.com/oss/python/langgraph/persistence), [LangGraph — interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts)).



## La reference architecture Spotify

Ora possiamo rimettere insieme i pezzi.

```mermaid
flowchart TD
    U[User request] --> MI[Mood Interpreter<br/>AGENT]

    MI --> G{needs_clarification?<br/>CODE}
    G -->|yes| CL[Clarifier<br/>AGENT]
    CL --> U

    G -->|no| SP[Search Planner<br/>AGENT]

    SP --> S1[Scout<br/>AGENT · read-only]
    SP --> S2[Scout<br/>AGENT · read-only]
    SP --> S3[Scout<br/>AGENT · read-only]

    S1 --> ART[(CandidateSet artifact)]
    S2 --> ART
    S3 --> ART

    ART --> CU[Curator<br/>AGENT · single writer]
    CU --> HC[Hard Checks<br/>CODE]

    HC -->|fail| CU
    HC -->|pass| SE[Semantic Evaluator<br/>AGENT]

    SE -->|revise ≤ 1| CU
    SE -->|pass| API[Playlist API<br/>idempotent side effect]
    API --> OUT([Done])

    classDef agent fill:#1B64F5,stroke:#1B64F5,color:#fff;
    classDef code fill:#F4E3B2,stroke:#C8902B,color:#5A4405;
    classDef artifact fill:#ECEFF2,stroke:#818282,color:#0D1F2E;
    classDef risk fill:#D7342B,stroke:#D7342B,color:#fff;
    class MI,CL,SP,S1,S2,S3,CU,SE agent;
    class G,HC code;
    class ART artifact;
    class API risk;
```

La cosa più importante del diagramma non è il numero di agenti.

È che **non tutti i riquadri sono agenti**.

Il gate è codice. I controlli duri sono codice. L'artefatto è stato persistente. Gli scout sono read-only. Il curator è l'unico writer. Il side effect ha un confine e una policy di idempotenza.

Ogni componente si è guadagnato il proprio posto perché risolve un problema che avevamo già incontrato.

### Il runtime, in pseudocodice

```python
# [REFERENCE DESIGN - PSEUDOCODICE]

async def build_playlist(user_request: str) -> Playlist:
    profile = await mood_interpreter.run(user_request)

    if profile.needs_clarification:
        return await clarifier.run(profile)

    request = PlaylistRequest.from_profile(profile)
    plan = await search_planner.run(request)

    worker_results = await gather_with_policy(
        tasks=[scout.run(task) for task in plan.independent_tasks],
        minimum_successes=2,
        retry_budget=1,
    )

    candidate_artifact = persist(
        aggregate(worker_results)
    )

    feedback = None
    for revision in range(2):
        playlist = await curator.run(
            request=request,
            candidates=candidate_artifact,
            feedback=feedback,
        )

        hard = hard_checks(playlist, request)
        if not hard.passed:
            feedback = hard.to_feedback()
            continue

        semantic = await evaluator.run(playlist, request)
        if semantic.passed:
            return await create_playlist_idempotently(playlist)

        feedback = semantic.rationale

    raise VerificationFailed()
```

Questa implementazione completa **non è ancora presente nel repository della lezione**. Il repository verificato copre il monolite e lo structured routing; il resto è una reference architecture coerente con il percorso didattico.



## Cosa sta convergendo nel 2026

Fonti e framework non concordano su un'unica architettura vincente. Sarebbe sospetto il contrario. Stanno però convergendo su alcuni principi.

### La semplicità viene prima della decomposizione

Il multi-agent non è un premio di complessità. Anthropic raccomanda di partire dalla soluzione più semplice e aumentare la complessità solo quando serve; nel case study del 2026 l'autore rimuove poi una struttura a sprint quando un modello più capace la rende superflua ([Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), [Anthropic — Harness long-running](https://www.anthropic.com/engineering/harness-design-long-running-apps)).

### Il contesto è un oggetto di progetto

Subagent, state schema, artifact e handoff non sono decorazioni. Sono modi per controllare ciò che ogni componente vede e ciò che viene perso nei passaggi ([Anthropic — Context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), [Willison — Subagents](https://simonwillison.net/guides/agentic-engineering-patterns/subagents/)).

### Il controllo deve essere localizzato

Router, supervisor e handoff non sono sinonimi. Il primo legge uno stato, il secondo ragiona e conserva ownership, il terzo trasferisce ownership.

### La verifica deve toccare l'ambiente

Runtime evidence, unit test, stato del database, browser, metriche e log valgono più di una dichiarazione del modello. OpenAI descrive agenti che interrogano trace e metriche per verificare il proprio lavoro; Anthropic distingue nettamente transcript e outcome ([OpenAI — Harness engineering](https://openai.com/index/harness-engineering/), [Anthropic — Evals per agenti](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)).

### Lo stato deve sopravvivere al prompt

Checkpoint, sessioni append-only e artefatti persistenti rendono possibile riprendere, ispezionare e correggere il lavoro long-running ([Anthropic — Managed Agents](https://www.anthropic.com/engineering/managed-agents), [Microsoft — HITL nei workflow](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop)).

### Il rischio si gestisce con confini deterministici

Permission, read-only worker, single writer, sandbox ed egress control limitano il danno anche quando il modello sbaglia o viene ingannato ([Anthropic — Containment](https://www.anthropic.com/engineering/how-we-contain-claude)).

### Il modello e l'harness vanno valutati insieme

Quando diciamo «l'agente ha ottenuto questo risultato», stiamo misurando modello, prompt, tool, memoria, orchestrazione e ambiente. Cambiare il modello senza riesaminare l'harness è tanto ingenuo quanto cambiare l'harness senza rieseguire gli eval ([Anthropic — Evals per agenti](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), [Anthropic — Managed Agents](https://www.anthropic.com/engineering/managed-agents)).



## Una grammatica per progettare

Alla fine, i pattern servono meno delle domande.

### Chi decide?

- La decisione è già rappresentata nello stato? Usa codice o routing deterministico.
- Richiede giudizio sul contesto? Valuta un supervisor.
- Deve cambiare l'interlocutore? Usa un handoff.

### Chi sa cosa?

- Qual è il contesto minimo sufficiente?
- Quali decisioni devono diventare campi tipizzati?
- Quali dettagli possono restare locali?
- Quali risultati devono risalire come summary e quali come artifact?

### Chi fa cosa?

- Questa responsabilità richiede autonomia?
- Può essere una funzione?
- Può essere un tool?
- I sottocompiti sono indipendenti?
- Esiste un solo writer per i side effect?

### Chi controlla?

- Quali proprietà sono verificabili in codice?
- Quale stato dell'ambiente prova il successo?
- Dove serve un giudizio semantico?
- Il ciclo di revisione ha un budget?

### Chi tiene in piedi il sistema?

- Come si salva lo stato?
- Come si riprende dopo un crash o un'approvazione umana?
- Quali retry sono idempotenti?
- Qual è il blast radius di ogni agente?
- Posso ricostruire l'intera traiettoria?

Una checklist minimale può stare in poche righe:

```text
[ ] Ogni agente ha una responsabilità che richiede autonomia.
[ ] Le decisioni deterministiche sono fuori dal prompt.
[ ] Gli handoff hanno un contratto.
[ ] Lo stato globale e quello locale sono separati.
[ ] Il parallelismo segue le dipendenze, non l'entusiasmo.
[ ] I side effect hanno ownership e idempotenza.
[ ] Gli outcome sono verificati nell'ambiente.
[ ] Retry, fallback, escalation e stop sono espliciti.
[ ] Trace ed eval misurano il sistema, non solo l'ultima risposta.
[ ] L'harness viene semplificato ogni volta che il modello cambia.
```



## Un laboratorio interattivo

Il simulatore didattico interattivo arriverà in un aggiornamento successivo. Intanto questo diagramma statico rende visibile la decisione architetturale di base:

```mermaid
flowchart LR
    P[Problema] --> Q1{Percorso noto?}
    Q1 -->|sì| W[Workflow]
    Q1 -->|no| Q2{Decisione rappresentabile?}
    Q2 -->|sì| R[Router + graph]
    Q2 -->|no| S[Supervisor]
    S --> Q3{Ownership cambia?}
    Q3 -->|sì| H[Handoff]
    Q3 -->|no| D[Delegation]
```



## Conclusione

Siamo partiti da un agente con cinque tool. Non era una cattiva architettura. Era semplicemente un'architettura nella quale troppe decisioni rimanevano implicite.

Abbiamo separato lo stato dal testo, il controllo dal lavoro, la verifica dalla generazione e l'esecuzione dalla sessione. Ogni volta abbiamo aggiunto struttura soltanto quando il sistema precedente mostrava una crepa.

Questo, secondo me, è il modo più sano di pensare ai sistemi multiagentici nel 2026.

La domanda non è «quanti agenti posso far collaborare?». È:

> **Dove deve stare l'intelligenza, e dove invece serve struttura?**

Quando la decisione è nota, scrivila. Quando il risultato è verificabile, testalo. Quando il lavoro è indipendente, parallelizzalo. Quando il contesto deve attraversare un confine, dagli una forma. Quando un agente può fare danni, restringi ciò che gli è concesso. E quando un componente non aggiunge più valore, toglilo.

Il resto è orchestrazione. E, come spesso accade, i nodi vengono al pettine proprio nei passaggi fra una scatola e l'altra.



## Fonti e note di lettura

Le fonti sono ordinate per funzione, non per prestigio. Gli engineering post e la documentazione ufficiale sostengono le descrizioni dei sistemi; i practitioner aggiungono esperienza sul campo; i lavori 2025 vengono usati quando introducono concetti ancora centrali nel 2026.

- [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents): guida del 2024 ai pattern routing, chaining, parallelizzazione, orchestrator-workers ed evaluator-optimizer, con la raccomandazione di partire dalla soluzione più semplice.
- [Anthropic — Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents): definizioni di task, trial, grader, transcript, outcome ed evaluation harness.
- [Anthropic — Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps): planner, generator, evaluator e trade-off di costo e durata per task lunghi.
- [Anthropic — Scaling Managed Agents](https://www.anthropic.com/engineering/managed-agents): separazione fra sessione, harness, sandbox e ambienti di esecuzione.
- [Anthropic — How we contain Claude across products](https://www.anthropic.com/engineering/how-we-contain-claude): containment, permission e riduzione del blast radius.
- [Anthropic — Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler): esperimento con sedici agenti, ambiente condiviso e coordinamento del parallelismo.
- [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents): gestione del contesto, compaction, memoria e subagent.
- [OpenAI — Harness engineering](https://openai.com/index/harness-engineering/): harness, test, osservabilità e ambienti isolati per agenti Codex.
- [OpenAI — The next evolution of the Agents SDK](https://openai.com/index/the-next-evolution-of-the-agents-sdk/): evoluzione dell’SDK, sandbox e separazione fra harness e compute.
- [OpenAI Agents SDK — Agent orchestration](https://openai.github.io/openai-agents-python/multi_agent/): differenza fra orchestrazione via LLM e via codice, agents as tools e handoff.
- [OpenAI Agents SDK — Handoffs](https://openai.github.io/openai-agents-python/handoffs/): configurazione, input e filtri degli handoff.
- [Microsoft Agent Framework — Workflows](https://learn.microsoft.com/en-us/agent-framework/workflows/): workflow funzionali o graph-based, agenti come executor, orchestrazioni sequenziali/concorrenti, checkpoint e HITL.
- [Microsoft Agent Framework — Human in the loop](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop): richieste sospendibili, approvazioni e ripristino del workflow.
- [LangChain — Handoffs](https://docs.langchain.com/oss/python/langchain/multi-agent/handoffs): transizioni guidate dallo stato; nei subgraph il contesto trasferito va scelto esplicitamente.
- [LangGraph — Use subgraphs](https://docs.langchain.com/oss/python/langgraph/use-subgraphs): input, output e stato dei subgraph.
- [LangGraph — Persistence](https://docs.langchain.com/oss/python/langgraph/persistence): persistenza dello stato e checkpoint.
- [LangGraph — Interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts): interruzioni controllate e ripresa dei grafi.
- [Model Context Protocol — specifica](https://modelcontextprotocol.io/specification/2026-07-28): protocollo per collegare agenti a tool, dati e risorse.
- [A2A Protocol — specifica](https://a2a-protocol.org/latest/): interoperabilità e comunicazione fra agenti indipendenti, senza imporre la condivisione di memoria, strumenti o logica proprietaria.
- [Simon Willison — Subagents](https://simonwillison.net/guides/agentic-engineering-patterns/subagents/): esperienza pratica su isolamento del contesto e parallelismo.
- [Hamel Husain — Evals Skills for Coding Agents](https://hamelhusain.substack.com/p/evals-skills-for-coding-agents): tassonomie di errore, trace ed evaluator calibrati con giudizi umani.
- [Jason Liu — Why Cognition does not use multi-agent systems](https://jxnl.co/writing/2025/09/11/why-cognition-does-not-use-multi-agent-systems/): critica pratica al context loss nei sistemi multi-agent.

### Altre letture utili

- [OpenAI — Symphony](https://openai.com/index/open-source-codex-orchestration-symphony/): specifica open source per l’orchestrazione di Codex.
- [Anthropic — AI Organizations](https://alignment.anthropic.com/2026/ai-organizations/): ricerca su efficacia e allineamento delle organizzazioni di agenti.
- [OpenAI Agents SDK — Tracing](https://openai.github.io/openai-agents-python/tracing/): trace e osservabilità dell’esecuzione.
- [LangChain — Multi-agent patterns](https://docs.langchain.com/oss/python/langchain/multi-agent/index): panoramica dei pattern multi-agent supportati dal framework.
