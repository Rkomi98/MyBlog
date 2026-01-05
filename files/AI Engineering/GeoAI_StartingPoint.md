# GeoAI Stack: Una guida per il 2025

<details class="post-warning">
<summary><strong>Articolo in revisione</strong> (clicca per aprire)</summary>

Questo articolo è ancora in fase di scrittura e sotto revisione tecnica. Alcuni contenuti potrebbero risultare incompleti oppure essere modificati con breve preavviso.

</details>

Seconda puntata del nostro lungo cammino diventare GeoAI engineer. La scorsa volta abbiamo descritto molto in generale cosa fa un AI engineer e cosa lo differenzia. 

Ora capiamo cosa serve ad un aspirante GeoAI engineer per iniziare, ovvero gli strumenti, i dataset e il setup necessario.

## 1\. Panoramica architetturale dello Stack AI Geospaziale

Partiamo dall'obiettivo principale e teniamolo a mente.

> **Obiettivo:** Integrare modelli di **Linguaggio (LLM)** e pipeline di **Visione Geospaziale** in un ambiente riproducibile, dal development locale alla produzione. 

L'architettura tipica combina:

- **Ingestione dati geospaziali:** accesso a immagini satellitari ottiche (come per es. Sentinel-2) e radar SAR (come Sentinel-1) tramite cataloghi **STAC/COG** (Planetary Computer, Earth Data, ecc.). Ne parleremo bene dopo.
- **Pre-processing e analisi remote sensing:** pipeline Python per leggere, allineare e processare grandi raster (con _rasterio_/_GDAL_, _rioxarray_/_dask_ per dati voluminosi) e vettori (con _geopandas_/_shapely_). Si producono _features_ come mappe di danno, estensione di alluvioni, edifici estratti, ecc.
- **Modelli di visione e geospaziali:** applicazione di modelli di deep learning specializzati sui dati pre-processati. Per esempio [IBM ha usato **U-Net**](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=Our%20main%20algorithm%20of%20choice,algorithm%20for%20semantic%20image%20segmentation) in una delle sue attività di ricerca per segmentazione di danni a post disastro naturale. Oppure, modelli derivati da [**SegFormer**](https://arxiv.org/abs/2105.15203) per fare change detection, come [Open-CD](https://arxiv.org/abs/2407.15317v1).\
Librerie come [**TorchGeo**](https://github.com/torchgeo/torchgeo) forniscono dataset e modelli pre-addestrati specifici geospaziali.

![Immagine](../Assets/Unet.png)
_Figura 1 – Architettura U-Net con encoder/decoder e skip connection per segmentare danni e classi in immagini satellitari._

![Immagine](../Assets/TorchGeo.png)
_Figura 2 – TorchGeo raccoglie dataset pronti all'uso e modelli pre-addestrati pensati per scenari di computer vision geospaziale._
- **Integrazione LLM/RAG:** un modulo di **Retrieval-Augmented Generation (RAG)** collega i risultati geospaziali con un **LLM** (es. GPT-5 o Mistral Large) per consentire Q&A e reportistica. L'LLM può attingere a knowledge base aggiornate (documenti, descrizioni di luoghi) oltre che ai dati estratti. Ciò riduce il problema delle allucinazioni fornendo contesto verificabile. Ad esempio, un utente può chiedere _"Quanti edifici sono stati distrutti dal terremoto in Turchia?"_ e il sistema usa i dati estratti dal modello CV + descrizioni testuali per generare una risposta citando fonti.
- **Agenti e automazione:** componenti agent-based (costruiti con framework come **LangChain**, **Haystack** o Datapizza-AI) orchestrano i passi e le chiamate a determinati strumenti. \
In particolare un _agent_ può: 
    1. interrogare un *database geospaziale* per trovare immagini post-disastro rilevanti;
    2. eseguire il modello di computer vision per ottenere le metriche (numero edifici danneggiati, area alluvionata, ecc.);
    3. chiamare l'LLM per spiegare i risultati. 
    
    Questo consente workflow complessi "domanda -> azioni -> risposta" in modo modulare.
- **Servizi e deploy:** il tutto viene containerizzato (Docker) e può essere esposto tramite API REST (ad es. con [**FastAPI**](https://fastapi.tiangolo.com/)) o interfacce grafiche leggere. Ad esempio, una dashboard _Streamlit_ può mostrare mappe interattive con i layer di danno e offrire una chat LLM per domande sul disastro.

### Architettura locale vs produzione
Quando si sviluppa la soluzione, è buona prassi lavorare su dataset di test (per esempio su poche scene satellitari rappresentative) usando notebook (come Jupyter Lab, Colab, ecc.) oppure script modulari (in src/). 

In produzione invece, i singoli **componenti** vengono orchestrati in **microservizi**: può esserci un servizio per l'analisi geospaziale (es. calcolo di mappe di rischio) e un servizio per l'LLM (es. generazione risposte), con logging e monitoring. I dati grezzi in questo caso, come le immagini, risiedono in uno storage (o file system locale o bucket cloud), mentre i risultati intermedi, come i COG (Cloud Optimized GeoTIFF) generati, shapefile, embedding vettoriali,  possono essere inseriti in cache per velocizzare le richieste ripetute. 

Vorrei far notare che i modelli di linguaggio sono tipicamente usati via API esterne (OpenAI, etc.) o, nel caso di modelli open source ottimizzati (es. gemma3n 4B), l'inferenza avviene on-premise.

Come leggevo in [questo paper](https://arxiv.org/html/2502.18470v5#:~:text=On%20the%20other%20hand%2C%20large,zhang2024bb%20%2C%20but%20the%20resulting), questa architettura **ibrida AI + GIS** supera i limiti dei singoli sistemi: quelli GIS classici faticano con input in linguaggio naturale, mentre _"i Large Language Model mostrano forti capacità linguistiche ma faticano nel ragionamento spaziale e nel ground truth geospaziale"_. Combinandoli, otteniamo un sistema in cui i modelli visivi forniscono "occhi" e dati strutturati, e gli LLM forniscono "ragionamento linguistico" su tali dati, con la possibilità di consultare basi conoscitive real-time. In sintesi, lo stack abbraccia il ciclo completo: **Data (Geo) → AI Vision → Knowledge → LLM**. La figura seguente illustra i componenti chiave e il flusso di dati nel sistema (dalla raccolta dati alla risposta all'utente):

![Immagine](../Assets/framework.png)

_Figura 3 – Schema riassuntivo dello stack GeoAI che collega ingestion e analisi geospaziale, modelli CV, componenti RAG/LLM e servizi di deployment orchestrati da agenti._ 

## 2\. Mappa di Strumenti e Risorse (2025)

In questo capitolo vediamo insieme le principali opzioni per ciascun aspetto dello stack: dalla gestione ambiente Python, agli strumenti di sviluppo, passando per le basi sui container, i dataset geospaziali open e le librerie chiave. L'obiettivo non sarà solo conoscere tutto questo, ma anche avere in mente un confronto delle caratteristiche, esponendo i vantaggi di ciascun metodo.

### 2.1 Gestione Ambiente Python (venv, conda, poetry, ecc.)

Una cosa su cui siamo tutti d'accordo: per avere una base solida è necessario un **ambiente Python riproducibile** con tutte le dipendenze inclusi pacchetti per GPU e le librerie geospaziali. 

La tabella seguente confronta gli approcci più diffusi oggi (nel 2025):

| Approccio | Tipo | Vantaggi (pro) | Svantaggi (contro) | Aggiornamento |
| --- | --- | --- | --- | --- |
| **pip + venv** | Installer + env isolato | Semplice e nativo; velocità nell'installazione diretta | Risolutore [**non più greedy**](https://debuglab.net/2024/01/26/resolving-new-pip-backtracking-runtime-issue/) ma comunque meno potente di solver SAT; no lockfile nativo; richiede [rimozione manuale sub-deps non usati](https://dublog.net/blog/so-many-python-package-managers/#:~:text=The%20OG%20of%20Python%20package,be%20completely%20decoupled%20from%20a) | pip 25.3 (2025) |
| **conda / mamba** | Gestore pacchetti con solver SAT C++ | [Gestisce librerie **non-Python**](https://www.geosynopsis.com/posts/docker-image-for-geospatial-application#:~:text=Python%20GDAL%20requires%20,while%20using%20Conda%20package%20manager) (es. GDAL, PROJ) in env isolati; risoluzione completa e veloce grazie al solver _libmamba_ | Ambiente base pesante (hundreds MB); manca lockfile out-of-the-box; a volte necessità di mix pip→ possibili conflitti | Conda 25.9.1 (2025) |
| **Poetry** | Gestore PyPI con lockfile | Usa standard _pyproject.toml_ unificato; genera **lockfile** multi-piattaforma per riproducibilità; gestisce env virtuale automaticamente | Risolutore in Python relativamente lento su grandi req. (DFS backtracking); lockfile voluminoso; attenzione a vincoli eccessivi (^version) che possono causare conflitti in team ampi. | Poetry 2.1 (2025) |
| **PDM / Hatch** | Gestori moderni PyPI | **PDM** supporta PEP 582 (ambiente locale senza activate); **Hatch** funge anche da build system completo e consente test multi-versione Python | Meno diffusi della triade pip/conda/poetry; Hatch ha curva apprendimento più alta e focus packaging (non solo env) | PDM 2.26 (2025), Hatch 1.15 (2025) |
| **uv (Astral)** | Tool unificato all-in-one (Rust) | [**Estremamente veloce**](https://docs.astral.sh/uv/) (10-100× pip) grazie a core in Rust; rimpiazza pip, pipx, poetry, pyenv con un solo strumento; supporto lockfile universale e workspace multi-progetto; integrazione trasparente con venv esistenti (puoi attivare uv, poi usare pip normale se vuoi) | API e CLI ancora instabili (progetto giovane); community emergente | uv 0.9.9 (2025) |
| **pixi (prefix.dev)** | Package manager conda-like (Rust) | [**Velocità**](https://prefix.dev/blog/pixi_a_fast_conda_alternative#:~:text=benchmarks%20show%20that%20pixi%20is,on%20a%20M2%20MacBook%20Pro) ~4× micromamba, >10× conda (risoluzione + install); supporta lockfile cross-platform proprio (risolve uno dei limiti di conda); integra pacchetti PyPI nel solver con unificati ([usa librerie di uv](https://prefix.dev/blog/pixi_a_fast_conda_alternative)); niente base env conda da installare ([eseguibile standalone](https://prefix.dev/blog/pixi_a_fast_conda_alternative#:~:text=Reason%203%3A%20No%20more%20Miniconda,base%20environment)) | Ecosistema nuovo (rilasci <1 anno); meno pacchetti precompilati rispetto a conda-forge; alcuni comandi sono ancora in evoluzione | pixi 0.59 (2025) |
| **pyenv** | Gestore versioni Python | Permette installare e switchare versioni Python diverse facilmente per progetto (utile per test multi-versione o legacy) | Non gestisce i pacchetti; usato in combinazione con venv/poetry; se usato global può creare confusione su versioni attive | pyenv 2.6.12 (2025) |

_Tabelle note:_ **mamba** è l'implementazione in C++ di conda. Oggi _conda_ stesso incorpora _libmamba_ di default, quindi i due convergono in velocità. In ambienti data science, conda/mamba rimane popolare per facilità con pacchetti scientifici complicati, mentre in produzione spesso si [preferisce pip/poetry](https://dublog.net/blog/so-many-python-package-managers/#:~:text=Verdict) per evitare dipendenze extra e avere più controllo. Strumenti emergenti come uv e pixi mirano a unificare il meglio dei due mondi (velocità e completezza). Ad esempio, **uv** è sviluppato in Rust dai creatori di Ruff e punta a diventare il "Cargo per Python" (un unico tool per gestire versioni Python, dipendenze, virtualenv, publishing). **Pixi**, creato dal team di mamba, è un sostituto drop-in di conda scritto in Rust: utilizza _uv_ per risolvere pacchetti pip, genera lockfile e rimuove la necessità di un base environment conda, migliorando drasticamente la velocità e l'ergonomia per portare env conda in produzione.

#### Reproducibilità GPU/Geo

Per un progetto AI/RS su GPU in locale, conda offre spesso la via più semplice (es. `conda install pytorch cudatoolkit gdal rasterio` in un env) perché gestisce i "binary" compatibili (CUDA, GDAL). In alternativa, in ambienti containerizzati, si può optare per **pip + Docker** usando immagini base con driver appropriati (ne parleremo tra un attimo). 

In tutti i casi, è consigliato **fissare le versioni** in un lockfile (per esempio usando poetry.lock) o file requirements con hash, e documentare il setup (ad es. fornendo un environment.yml conda + requirements.txt pip per sicurezza).

Un layout ideale del progetto prevede una struttura simile a:

```bash
proj-root/  
├── src/ # codice applicativo (package principale)  
├── notebooks/ # Jupyter notebook di esplorazione  
├── data/ # dati grezzi o di esempio (gitignored se grandi)  
├── models/ # modelli salvati o pesi  
├── tests/ # test unità/integrati  
├── configs/ # config per Hydra/pydantic (es. dev.yaml, prod.yaml)  
├── Dockerfile # definizione container  
├── pyproject.toml # specifiche package/dep (poetry/pdm)  
├── requirements.txt # dipendenze (se pip)  
├── Makefile # comandi utili (setup, run, lint, test, deploy)  
└── README.md # documentazione progetto
```

Questa organizzazione segue in parte il modello [_Cookiecutter Data Science_](https://cookiecutter-data-science.drivendata.org/#directory-structure) (per separare chiaramente code, data, docs) e facilita il passaggio **dallo sviluppo locale alla produzione**: il codice è impacchettato (in src/ con eventuale \__init_\_.py), i test assicurano funzionamento, e config/secrets separati per ambiente permettono deploy consistenti.

Diciamo che è una buona prassi, non costa nulla e ti fornisce un ordine che è utile sia a te che a chi lavora con te.

### 2.2 Tooling Essenziale da AI Engineer

Per garantire **qualità del codice e velocità di sviluppo**, ogni sviluppatore adotta una serie di strumenti DevOps/MLOps leggeri che vediamo tra un attimo. 

Prima di dare dei consigli a riguardo do delle definizioni che per alcuni sono scontate ma per altri magari no.

> Il linting è un controllo automatico del codice sorgente alla ricerca di:
> - errori potenziali: variabili non usate, sintassi sospetta, bug comuni
> - problemi di stile: formattazione, nomi incoerenti, convenzioni non rispettate.
> “code smell”: pattern che non sono errori, ma possono creare problemi dopo
> In pratica vengono analizzati i file senza eseguirli e segnalati i punti da sistemare, spesso con suggerimenti o correzioni automatiche.

- **Linting & Format:** _Black_ per il formato automatico del codice (opinionated, PEP8) e **Ruff** per il linting ultrarapido in Rust. Ruff include centinaia di regole (rimpiazza flake8, isort, ecc.) ed esegue fix di molti problemi in automatico. Ha praticamente soppiantato i linters tradizionali in poco tempo grazie alla velocità e copertura. 
    > **Consiglio** di configurare Black e Ruff per non sovrapporre regole (es. disattivare in Ruff le regole che Black già sistema, come lunghezza riga) - ciò si può fare [centralizzando la configurazione](https://medium.com/@sparknp1/10-mypy-ruff-black-isort-combos-for-zero-friction-quality-770a0fde94ac) in pyproject.toml.
- **Type Checking:** utilizzare la **tipizzazione statica** per prevenire bug. _Mypy_ è lo standard per type-checking in Python; in alternativa _Pyright_ (integrato in VSCode/Pylance) offre analisi incrementale molto veloce durante la scrittura. Impostare un livello "strict" (es. `warn_unused_configs`, `disallow_untyped_defs` in mypy) aiuta a mantenere il codice robusto.
- **Testing:** _Pytest_ è de facto per test unitari e funzionali in Python. Organizzare i test in tests/ e magari usare plugin utili: ad es. **pytest-snapshot** (o [**Syrupy**](https://github.com/syrupy-project/syrupy)) per _snapshot testing_ di output complessi (confronta automaticamente output attuale con uno salvato in precedenza). Questo può essere comodo per validare ad es. JSON di risposta API o risultati di analisi raster. Per pipeline geospaziali, potrebbe essere utile generare piccoli dataset sintetici per testare le funzioni (es. creare un raster 100x100 e una geometria nota e verificare che l'overlay produca risultati attesi).
- **Pre-commit hooks:** configurare _pre-commit_ (file `.pre-commit-config.yaml`) per eseguire automaticamente tool di qualità prima di ogni commit. Un set raccomandato di hook: **black**, **ruff**, **mypy**, _isort_ (se non uso ruff per sorting import), _end-of-file-fixer_ e _trailing-whitespace_ (semplici pulizie), eventualmente **nbstripout** o **nbqa** per normalizzare i notebook. Questo garantisce che ogni commit aderisca agli standard di code style e passa i test statici. Ad esempio, un hook ruff/black combinato rende il codice consistente - uno sviluppatore nota _"Ruff + Black + isort configurati insieme forniscono qualità senza frizioni"_ in CI e editor.
- **CI/CD minimo:** impostare una GitHub Action semplice che su ogni push esegue: lint (ruff/black), type-check (mypy) e test (pytest) su una matrice di ambienti (almeno Python 3.x). Ciò automatizza il controllo qualità. Per progetti di ML, si può includere un test su sample data (es. eseguire inferenza su un'immagine piccola) per assicurare che pipeline e modelli funzionino. Un workflow YAML minimo includerebbe step per installare dipendenze (usando poetry/mamba per velocità in CI) e poi `pre-commit run --all-files` seguito da `pytest`.
- **Notebook e collaborazione:** usare **JupyterLab 4** (moderno, supporta plugin e realtime collaboration) o l'**interfaccia notebook di VSCode** per prototipazione. In contesti condivisi o cloud: _Deepnote_, _Google Colab_ o JupyterHub offrono ambienti pronti (Colab ad esempio fornisce GPU free limitate). È buona prassi mantenere sincronizzati notebook e codice: si può usare _Jupytext_ (notebook come script paired) per versionarli facilmente. Per visualizzare dati geospaziali nei notebook, strumenti come **folium** (mappe interattive Leaflet) o **ipyleaflet/leafmap** permettono di visualizzare tiles, shapefile e risultati di modelli direttamente (questo verrà approfondito tra un paio di sezioni).

> **Consiglio:** configurare tutti questi strumenti fin dall'inizio. Ad esempio, aggiungere al pyproject.toml: black, ruff, isort, mypy con config coerente (stessa line-length, ecc.). Installare pre-commit e attivarlo (pre-commit install) in modo che ogni git commit lanci i controlli. Queste automazioni rendono lo sviluppo **"no drama"**: il dev può concentrarsi sulla logica AI/Geo, mentre gli strumenti mantengono il codice pulito e funzionante.

#### Ha senso tutto questo oggi con l'AI?

Negli ultimi anni l'introduzione dell'AI negli strumenti di sviluppo ha rivoluzionato il modo in cui scriviamo, manteniamo e versioniamo il codice. Eppure, questa rivoluzione non ha eliminato la necessità di buone pratiche: ha semplicemente spostato il baricentro di ciò che conta davvero. L'AI accelera, suggerisce, genera, ma non garantisce qualità e coerenza strutturale. Per questo, molti degli strumenti classici non solo restano rilevanti, ma in alcuni casi diventano più importanti di prima.

Iniziamo da linting e formattazione. Non è più una questione di estetica, ma di avere più sostanza.

Formatter come **Black** rimangono imprescindibili. Anche se l'AI produce codice già leggibile, un formato coerente è essenziale per avere diff puliti e review senza frizioni. 

Quanto ai linters, strumenti come **Ruff** diventano fondamentali non per la parte estetica (che l'AI già gestisce bene), ma per intercettare errori, import inutilizzati, codice morto o pattern rischiosi. L'obiettivo non è rendere il codice "più bello", ma evitare bug introdotti da generazioni un po' troppo ottimistiche.

Passiamo ai guardrails introdotti dal type checking.

Con l'AI che propone codice complesso o funzioni plausibili ma non sempre corrette, strumenti come **Mypy** o **Pyright** diventano essenziali come rete di sicurezza. La tipizzazione statica non è solo una misura di qualità, ma una guida strutturale che l'AI stessa utilizza per generare soluzioni più precise. In particolare, nei moduli core di un progetto, un profilo di type checking semi-strict riduce enormemente il rischio di errori silenziosi (intendo errori che non si vedono per ora, ma emergono poi).

Ora analizziamo il punto, secondo me più importante, il **testing**.

Con test ben strutturati e snapshot test per output complessi, è possibile controllare che ottimizzazioni o refactor guidati dall’AI non modifichino comportamenti, diciamo, delicati. 

Siamo quasi arrivati in fondo, ora tocca al precommit, quello che io definisco la sentinella tra noi e git.

Gli hook di **pre-commit** continuano a essere utili come ultimo filtro prima di far entrare codice su Git (con Git qui unifico Github e Gitlab). 

Black, Ruff e alcune pulizie leggere come rimozione di whitespace sono spesso sufficienti. Altri tool più pesanti, come Mypy, possono rimanere in CI per evitare rallentamenti locali. In progetti personali si può anche farne a meno, ma in team resta un meccanismo che evita piccoli errori inutili.

Infine per indipendenza e riproducibilità resta il classico CI/CD

Con l’AI che facilita generazioni di blocchi di codice interi, cresce la probabilità di modifiche involontariamente distruttive. Una pipeline CI minima, quindi linting, type checking e test, garantisce che ogni push sia valido in un ambiente pulito e controllato. 

Questo è un passaggio fondamentale per evitare che il codice generato dall'AI rompa funzioni a distanza o introduca regressioni difficili da individuare.

In conclusione, in un mondo in cui l’AI supporta lo sviluppo, gli strumenti di "safety del codice" non spariscono: si riposizionano. Black standardizza, Ruff protegge, Mypy o Pyright guidano, Pytest garantisce stabilità, la CI assicura riproducibilità. 

Quindi l’AI non elimina la necessità di queste pratiche. Anzi, le rende ancora più rilevanti perché aumenta il volume e la velocità del codice prodotto.

La qualità non è più solo questione di scrittura, ma di ecosistema. E in questo ecosistema, l’AI è un acceleratore potente, ma non un sostituto!


### 2.3 Docker e Containerizzazione AI+GEO

Questa è una parte che mi sta molto a cuore (tanto da voler spendere una serie intera su Docker).

Containerizzare l'app consente di uniformare l'ambiente di sviluppo (specialmente per librerie native e driver GPU) e facilitare quindi la fase di deploy. Presentiamo due esempi di **Dockerfile** ottimizzati, uno per un servizio LLM/RAG leggero, l'altro per una pipeline geospaziale pesante, e una tabella di immagini base consigliate.

#### Esempio 1: Dockerfile per servizio LLM/RAG + FastAPI (CPU)

```Docker
# Usiamo la versione di Python leggera con Debian 12 "bookworm"
FROM python:3.12-slim-bookworm as base

# Aggiorniamo e installiamo solo git, senza raccomandati, quindi puliamo la cache
RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

# Creiamo un utente non‑root per eseguire il servizio
RUN useradd -m appuser

# Impostiamo la cartella di lavoro
WORKDIR /app

# Installiamo una versione stabile di Poetry e configuriamo l’installazione dei pacchetti
RUN pip install --no-cache-dir poetry==1.8.2

# Copiamo i file di progetto e sfruttiamo la cache Docker per velocizzare gli aggiornamenti
COPY pyproject.toml poetry.lock ./
# Installiamo le dipendenze (solo di produzione) direttamente nel global site‑packages
RUN poetry config virtualenvs.create false \
    && poetry install --no-dev

# Copiamo il codice applicativo
COPY src/ ./src/
COPY main.py ./

# Eseguiamo come utente non root
USER appuser

# Avviamo Uvicorn esponendo la FastAPI all’esterno
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

```

**Note:** Qui usiamo python:3.12-slim (~50MB) perché è un buon compromesso tra dimensione e funzionalità, dato che evita i problemi derivanti dall’uso di Alpine. 
Ho deciso di proporvi la versione 3.12 per la massima compatibilità con le altre librerie.

L'installazione delle dipendenze è fatta in un layer separato copiando solo `pyproject/lock` (per sfruttare la cache Docker: se solo il codice cambia e non le deps, non si reinstallano tutti i pacchetti). 

Uvicorn serve l'app FastAPI. Questo container è CPU-only (adatto a LLM via API esterna o modelli piccoli). Se volessimo includere un modello locale (es. Transformers), basterebbe aggiungere `RUN pip install transformers` o includerlo direttamente in poetry.

#### Esempio 2: Dockerfile per pipeline geospaziale (con GDAL, opzionale GPU)
Vediamo ora un esempio più comlesso ma anche più adeguato ad un GeoAI engineer.

Per pipeline geospaziali complesse (analisi raster, fotogrammetria, deep
learning su immagini satellitari) è necessario un ambiente con molte
librerie native (GDAL, PROJ, Rasterio) e spesso il supporto GPU.
```Docker
# Stage 1 – builder con Miniconda e mamba
FROM continuumio/miniconda3:latest as builder

# L'ultima versione di mamba è la 2.3.3. Poi eliminiamo i file temporanei
RUN conda install -n base -c conda-forge mamba==2.3.3 \
    && conda clean -afy

# Copiamo l’environment che elenchiamo i pacchetti geospaziali (Python 3.12, GDAL,
# Rasterio, Geopandas, ecc.)
COPY environment.yaml /tmp/environment.yaml

# Aggiorniamo l’ambiente base con le librerie specificate in environment.yaml
RUN mamba env update -n base -f /tmp/environment.yaml \
    && conda clean -afy

# Installiamo pacchetti aggiuntivi con pip (ad esempio Raster Vision)
RUN pip install --no-cache-dir rastervision==0.31.2

# Stage 2 – immagine di produzione con supporto CUDA 13.0.2
FROM nvidia/cuda:13.0.2-runtime-ubuntu22.04 AS production

# Copiamo l’installazione conda dal builder
COPY --from=builder /opt/conda /opt/conda

# Aggiorniamo la variabile PATH per includere conda
ENV PATH="/opt/conda/bin:$PATH"

# Impostiamo la directory di lavoro
WORKDIR /app

# Copiamo il codice sorgente
COPY src/ ./src/
COPY entrypoint.py ./

# Comando di avvio della pipeline
CMD ["python", "entrypoint.py"]

```

Come file di `environment.yaml` si può usare:
```yaml
name: geoenv
channels:
  - conda-forge
dependencies:
  - python=3.12
  - gdal=3.12       # GDAL 3.12 è disponibile tramite i container OSGeo
  - rasterio
  - geopandas
  - numpy
  - pandas
  - pyproj
  - pip
  - pip:
      - rastervision==0.31.2
      - torch==2.7.0
```

Abbiamo considerato qui un esempio preso da una [fonte](https://www.geosynopsis.com/posts/docker-image-for-geospatial-application) da cui, ai tempi, anche io ho studiato. L'ho cercata di aggiornare in base alle versioni delle librerie aggiornate alla data di questo articolo.

In questo Dockerfile multi-stage, usiamo come builder l'immagine **Miniconda** con mamba per risolvere le dipendenze (in `environment.yaml` specifichiamo ad es: gdal, rasterio, geopandas, pytorch, ecc. con canale conda-forge). Questo approccio gestisce automaticamente librerie native (GEOS, PROJ, etc.) evitando errori di pip (es. pip install gdal fallirebbe senza GDAL dev installato). 

Nella seconda parte, partiamo da un runtime **CUDA** nvidia molto sottile, che include solo i driver necessari per PyTorch Tensor GPU. 

Copiamo l'installazione conda dal builder, evitando di portarsi dietro i layer di compilazione. Il risultato è un'immagine pronta con supporto GPU e libs geospaziali. 

Di seguito una tabella di **immagini base** comuni per vari scenari:

| Immagine base | Contenuto | Uso consigliato |
| --- | --- | --- |
| [**python:3.12-slim**](https://hub.docker.com/layers/library/python/3.12-slim/images/) | Debian slim + Python 3.x | Servizi Python leggeri (API, agent) - minima (<50MB) |
| [**continuumio/miniconda3**](https://hub.docker.com/r/continuumio/miniconda3) | Miniconda + conda (base env) | Data science/[Geo completo](https://www.geosynopsis.com/posts/docker-image-for-geospatial-application#:~:text=Unlike%20pip%2C%20Conda%20package%20manager,python%2C%20we%20get%20following%20error); facile installare pacchetti complessi (es. GDAL) |
| [**mambaorg/micromamba**](https://micromamba-docker.readthedocs.io/en/latest/) | Micromamba in Alpine/CentOS | Costruire immagini con env conda in maniera snella; ideale in multi-stage (scarica solo i pacchetti richiesti) |
| [**nvidia/cuda:13.0.2-runtime-ubuntu22.04**](https://hub.docker.com/r/nvidia/cuda) | Librerie CUDA + runtime base | Aggiungere supporto GPU. Da usare con pip/conda per installare PyTorch/TF con CUDA compatibile. Considerate che siamo alla versione 13.0.2 ora|
| [**pytorch/pytorch:2.7.0-cuda12.8-cudnn8-devel-ubuntu20.04**](https://hub.docker.com/r/pytorch/pytorch) | Python + PyTorch 2.0 + CUDA preinstallati | Lavori di training/inference DL su GPU - evita configurazioni manuali di CUDA/cuDNN. Include però anche varie libs (immagine ~>10GB). |
| [**ghcr.io/osgeo/gdal:ubuntu-full-3.12.0**](https://github.com/OSGeo/gdal/pkgs/container/gdal) | Ubuntu + GDAL precompilato (full drivers) | Pipeline GIS/RS intensive. |
| [**jupyter/scipy-notebook**](https://hub.docker.com/r/jupyter/scipy-notebook) | Python con Jupyter Notebook + stack SciPy | Ambienti notebook pronti all'uso (CPU). Include numpy, pandas, matplotlib, etc. Utile per sviluppo interattivo, anche su cloud (ad es. Docker Stacks di JupyterHub). |

Non escludo che ci siano 

#### Gestione GPU

In deployment on-prem, abilitare runtime GPU con `--gpus all` su `Docker run` (usando i runtime NVIDIA). In Kubernetes, usare device plugins NVIDIA. Se l'host non ha GPU, basterà che l'immagine contenga comunque le librerie giuste e potremo eseguire in CPU senza errori, o delegare a Colab per esecuzione GPU.

### 2.4 Gestione di "password" e configurazioni

La parola AI oggi, spesso chiama la parola **API**, e di cnseguenza anche **credenziali (o config)** per servizi (es. token Mapbox, key OpenAI, URL database). È fondamentale **non inserire** questi valori **nel codice sorgente**, ma **usare sistemi di config**.

#### Approccio .env (locale)
L'approccio più semplice e funzionale è sicuramente passare per il classico file `.env`, ovvero mettere le chiavi in un file `.env` escluso dai comandi git, e caricarlo poi con [python-dotenv](https://pypi.org/project/python-dotenv/). 

Ad [esempio](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration) il file `config.py` potrebbe essere scritto come:

```python
from pydantic import BaseSettings  

class Settings(BaseSettings):  
    openai_api_key: str  
    db_url: str  
    debug: bool = False  
class Config:  
    env_file = ".env" # legge le variabili da .env  
    env_prefix = "MYAPP_" # opzionale: prefisso richiesto nelle env var  
settings = Settings()
```

Questo codice usa **Pydantic BaseSettings**. Usando questo codice, ad ogni avvio, l'applicazione leggerebbe le variabili d'ambiente (o dal file .env) e costruirebbe un oggetto settings. 

Questo offre il vantaggio della **validazione dei tipi** (ad es. se db_url deve essere una URL, Pydantic può validarla). Si possono definire default e Pydantic converte automaticamente tipi (int, bool ecc) e gestisce configurazioni innestate. Pydantic è ottimo quando _"la struttura di configurazione è relativamente semplice e basata su env var/.env"_, ovvero con pochi parametri principali. 

Inoltre, integrandolo con FastAPI, le impostazioni possono essere utilizzate come dipendenze.

#### Approccio file YAML/INI + altre classi

In progetti più grandi o con molte configurazioni, usare file YAML o TOML per ambienti diversi può risultare organizzato. Ad esempio, uno schema:
```
config/
|_default.yaml  
|_dev.yaml  
|_prod.yaml
```
Librerie come **Dynaconf** supportano la *configurazione multi layer* caricando più file e unendoli in base ad una chiave di ambiente. 

[Dynaconf](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration) permette definire config in diversi formati (YAML, TOML, Python) e distingue contesti _development_ vs _production_, oltre a supportare secrets criptati. È indicato quando _"servono configurazioni complesse, multi-sorgente e con separazione netta tra ambienti"_.

 Alternativamente, **Hydra** (di Facebook) permette di comporre configurazioni da file modulari e sovrascriverle via CLI. Hydra è comune in contesti di ricerca per gestire molti parametri (es. architettura modelli, hyperparam) e variare esperimenti semplicemente lanciando. Hydra crea automaticamente directory di output versionate con la config usata.

**Consigli pratici config:** Se l'app è relativamente semplice (pochi parametri e segreti), **Pydantic BaseSettings** offre semplicità e robustezza (type-safe). Se cresce in complessità (es. decine di voci, più file), **Dynaconf** potrebbe essere utile per evitare boilerplate e gestire più sorgenti. **Hydra** è ottima se prevedi di fare molte variazioni di run (tipico nel training di modelli ML), ma per un servizio web forse è overkill.

#### Gestione secret in produzione

Mai fare il commit delle credenziali. In ambienti cloud, utilizzare servizi dedicati: AWS Secrets Manager, GCP Secret Manager, Hashicorp Vault. 

Ad esempio, su AWS si può memorizzare la OPENAI_API_KEY e recuperarla dinamicamente nel container ECS oppure inserirla come variabile d'ambiente tramite il sistema di configurazione (come Terraform). 

Molti servizi CI/CD (GitHub Actions, GitLab CI) offrono un vault integrato per salvare secret e renderli disponibili come env var durante il deploy. Quindi, il pattern consigliato è: **in locale .env**, in CI/prod **env var** o config criptata.

In sintesi, investire tempo in una solida gestione di config/secret garantisce che l'app possa passare da dev a prod senza modifiche manuali al codice, minimizzando rischi di leak (niente chiavi in repository mi raccomando).

### 2.5 Dataset Open e Cataloghi STAC/COG per Disastri
Prima di far vedere i dataset vorrei chiarire alcuni punti e dare un paio di definizioni:
> “Chip” = ritaglio/tessera (“patch/tile”) estratta da una scena satellitare grande. In pratica: invece di usare un’intera immagine satellitare, la si spezza in tanti quadrati più piccoli, ognuno usato come esempio di training.
Poi per maggiori info sui satelliti, ti rimando all'articolo [Che dati registrano i satelliti?](../blog/it/geodata/), in cui ho fatto un bell'approfondimento sulle tipologie di dati satellitari.

Per progetti di **Disaster Intelligence**, attingere a dataset open aggiornati è cruciale. Fortunatamente tra 2022-2025 sono aumentati i cataloghi **STAC** (SpatioTemporal Asset Catalog) e dataset specializzati. Ecco una selezione dei dataset e risorse _state-of-the-art_:

| Dataset / Catalog | Dati (tipo e risoluzione) | Copertura/Dimensione | Task / Utilizzo | Fonte (link) |
| --- | --- | --- | --- | --- |
| **[xBD](https://arxiv.org/abs/1911.09296) / [xView2](https://xview2.org/)** (2019) | Immagini satellitari Maxar pre- e post-evento (RGB, ~0.3 m/px, tile 1024×1024); annotazioni edifici + classe danno | [19 eventi di 5 tipi diversi](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=The%20images%20capture%2019%20natural,from%20all%20over%20the%20world) (terremoti, uragani, incendi); [850k edifici annotati su ~45k km²](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=The%20data%20used%20for%20the,resolution%20color%20images); 9k coppie immagine pre/post per training | **Building Damage Assessment** - segmentazione edifici e classificazione danno (nessuno, leggero, moderato, pesante, distrutto) | [DIU xView2](https://xview2.org/) - [Paper xBD](https://arxiv.org/abs/1911.09296)) |
| **[C2SMS Floods](https://cmr.earthdata.nasa.gov/search/concepts/C2781412798-MLHUB.html)** (fine nel 2023) | Sentinel-1 (SAR) + Sentinel-2 (Ottico) co-registrati, 512×512 px; maschere binarie con acqua (inondazione vs acqua permanente) | ~900 coppie chip da 18 eventi alluvionali globali | **[Flood segmentation (multimodale)](https://github.com/microsoft/PlanetaryComputerExamples/blob/main/competitions/s1floods/benchmark_tutorial.ipynb)**: addestramento modelli per rilevare acqua alluvionale combinando SAR e ottico | [Microsoft/Cloud to Street](https://radiantearth.blob.core.windows.net/mlhub/c2smsfloods/Documentation.pdf#:~:text=The%20C2S,oz32gz) |
| [**Sen1Floods11**](https://www.researchgate.net/publication/343275667_Sen1Floods11_a_georeferenced_dataset_to_train_and_test_deep_learning_flood_algorithms_for_Sentinel-1) (2020) | Chip Sentinel-1 GRD (SAR) 512×512 px; maschera acqua binaria | 4.831 chip da 11 eventi alluvionali in 5 continenti (inclusi Tsunami Giappone 2011, Harvey 2017, etc.) | **Flood segmentation (SAR)** - benchmarking su solo radar (quindi robusto anche se ci sono nubi) | Cloud to Street - [Paper IEEE](https://www.researchgate.net/publication/343275667_Sen1Floods11_a_georeferenced_dataset_to_train_and_test_deep_learning_flood_algorithms_for_Sentinel-1) o [Github](https://github.com/cloudtostreet/Sen1Floods11) |
| **UN Flood Extents** (2023) | Raster Sentinel-1 ($\sigma_0$ backscatter, ~10 m) con poligoni vettoriali flood delineation | Eventi recenti globali - dati rilasciati via [UNOSAT](https://unosat.org/). Il numero di rasters varia | **Flood mapping rapido** - segmentazione acqua tramite pipeline automatizzate (Google, UN) | UNOSAT|
| [**Maxar Open Data**](https://xpress.maxar.com/?lat=0&lon=0&zoom=3.0) (2017-today) | Immagini satellitari ottiche ad alta risoluzione (30-50 cm) pre e post-disastro (GeoTIFF) | $>100$ eventi globali (Terremoto Nepal 2015, Explosion Beirut 2020, Alluvione Libia 2023, ecc.) - copertura varia per evento (decine di immagini ciascuno) | **Damage mapping visivo** - fornisce rapidamente immagini post-evento CC BY 4.0 per usi umanitari, ad es. mappatura edifici crollati | Maxar Open Data Program (AWS OpenData) (include index STAC su registry.opendata.aws) |
| [**Copernicus EMS**](https://emergency.copernicus.eu/) (2015-today) | Prodotti _analyst-derived_ da immagini (GeoTIFF e shapefile): es. poligoni di edifici distrutti, estensione alluvioni, mappe grado di danno (EMS-98) | Attivazioni emergenza non solo in Europa ma in tutto il mondo (migliaia di mappe per terremoti, inondazioni, incendi) - risoluzione dipende da immagini (Sentinel-2 10 m, Pléiades 0.5 m, etc.) | **Rapid Mapping** - risultati ufficiali da analisti in poche ore/giorni (ground truth utile per training o verifica modelli) | [Copernicus Emergency Mgt Service](https://mapping.emergency.copernicus.eu/) (public downloads per attivazione) |
| [**Landslide4Sense / GDCLD**](https://essd.copernicus.org/articles/16/4817/2024/#:~:text=globally%20distributed%2C%20event,art%20semantic%20segmentation%20algorithms.%20These) (2024) | Immagini multi-sorgente HR (PlanetScope ~3 m, Gaofen-6 2 m, UAV ~0.1 m) con maschere frane (poligoni pixel) | 9 eventi sismici globali (Nepal 2015, Amatrice 2016, ecc.) con contesti geologici vari; ~60.000 frane etichettate. + Test su 1 evento da piogge. | **Landslide detection** - segmentazione frane in contesti montuosi. Consente addestrare modelli robusti a dataset globali. | _Globally Distributed Coseismic Landslide Dataset_ - \[DOI Zenodo\] [(Fang et al, ESSD 2024)](https://essd.copernicus.org/articles/16/4817/2024/#:~:text=globally%20distributed%2C%20event,art%20semantic%20segmentation%20algorithms.%20These) |
| [**Planetary Computer STAC**](https://github.com/microsoft/PlanetaryComputerExamples) (ongoing) | Catalogo cloud di ~100 dataset ambientali/EO: collezioni Sentinel-1, Sentinel-2, Landsat, MODIS, NAIP, ecc., con API STAC e azure storage per tile on-demand | Copertura globale o nazionale a seconda del dataset. Esempi: Sentinel-2 L2A global (2017-2025), NAIP USA (aerea 60 cm). | **Base data hub** - accedere in modo standardizzato a imagery e dati geo open per analytics personalizzate (subset, mosaico, ecc.). Consente query spaziali e temporali via API. | Microsoft Planetary Computer - [[Docs](https://github.com/microsoft/PlanetaryComputerExamples#:~:text=If%20you%27re%20viewing%20this%20repository,quickstarts%2C%20dataset%20examples%2C%20and%20tutorials)](chiave API gratuita richiesta per throughput elevato) |
| **NOAA NGS Aerial** (varie) | Immagini aeree nadir oblique post-evento (~10-20 cm/px) | USA (coste e aree colpite da uragani, tornado, incendi). [Esempio](https://storms.ngs.noaa.gov/storms/ian/index.html#:~:text=Hurricane%20IAN%20Imagery%20Hurricane%20IAN,by%20the%20NOAA%20Remote): ~15k foto aeree dopo uragano Ian 2022 Florida. | **Damage inspection** - utilizzate per valutazione visuale danni subito dopo eventi (anche input per CV - es. rilevamento tetti danneggiati). | [NOAA NGS Emergency Response Imagery](https://storms.ngs.noaa.gov/storms/ian/index.html#:~:text=Hurricane%20IAN%20Imagery%20Hurricane%20IAN,by%20the%20NOAA%20Remote) (dati scaricabili via API) |
| [**Planet Disaster Data**](https://esri-disasterresponse.hub.arcgis.com/pages/imagery) (ongoing) | Immagini PlanetScope (~3 m) e SkySat (~0.5 m) con accesso temporaneo per enti idonei (su richiesta/approvazione) | Globale, selettiva. Copertura variabile: può includere più acquisizioni nei giorni/settimane post-evento, a seconda dell’evento e della disponibilità. | **Rapid Monitoring** - immagini ottiche ad alta frequenza (quotidiane) per monitoraggio evoluzione disastri. Utili per time series prima/dopo non disponibili altrove. | Planet Disaster Data: accesso per enti idonei tramite richiesta/programma DRP/partner |

Questi dataset consentono di allenare e validare modelli per _damage assessment_, _flood mapping_, _change detection_, ecc., sfruttando dati reali di eventi passati. Notiamo la tendenza a dataset multi-modali (SAR+ottico insieme), multi-evento e con **etichettatura ricca** (non solo binaria, ma gradi di danno, tipologia land cover, ecc.). 

Ad esempio, xBD rimane il riferimento per damage detection con la sua [qualità](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=The%20data%20used%20for%20the,resolution%20color%20images) e [copertura](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=The%20images%20capture%2019%20natural,from%20all%20over%20the%20world) senza precedenti.

#### Cataloghi STAC attivi
Planetary Computer e Radiant MLHub citati offrono API uniformi per cercare dati per area e data. Ad esempio, con **pystac-client** possiamo interrogare Planetary Computer:
```python
from pystac_client import Client  
catalog = Client.open("https://planetarycomputer.microsoft.com/api/stac/v1")  
search = catalog.search(
    collections=["sentinel-2-l2a"],
    intersects={"type": "Point", "coordinates": [30.5,50.5]},  
    datetime="2023-06-01/2023-06-30"
    )  
items = list(search.get_items())
print(f"Trovate {len(items)} immagini Sentinel-2 in giugno 2023 nel AOI.")  
for item in items[:5]:  
  print(item.id, item.assets["B04"].href) # stampa link alla banda 4 (rosso)
```
_Snippet 01: Esempio di utilizzo pystac-client per cercare immagini Sentinel-2 in un AOI e periodo dati. Ci consente di ottenere URL (spesso firmati) a cui accedere il file COG direttamente, oppure scaricare i subset._

Analogamente, Radiant MLHub fornisce SDK e API per scaricare dataset ML. Ad esempio, con il pacchetto radiant_mlhub possiamo fare query di collezioni per nome e scaricare le annotazioni.

#### Altri dataset degni di nota 2025
SpaceNet Challenges (1-8) hanno prodotto dataset open su building footprints, road network extraction, change detection di edifici su tempi multi-annuali (SpaceNet 7), ecc. Anche se un po' datati, rimangono preziosi per benchmark. Ad esempio, SpaceNet8 (2022) fornisce immagini PlanetScope pre/post alluvione + mask flood e building footprints, utile per approcci multimodali (simile a xBD ma per inondazioni). Inoltre, dataset come [**CAS Landslide**](https://www.nature.com/articles/s41597-023-02847-z) e [**DMLD**](https://www.mdpi.com/2072-4292/16/11/1886) (China) offrono migliaia di esempi di frane mappate in diverse regioni. 

La comunità open si sta muovendo anche verso **foundation models geospaziali**: ad es. [_BigEarthNet_](https://bigearth.net/) (520k patch Sentinel-2 etichettate land cover) viene usato per pre-addestrare modelli tipo ResNet/ViT su dati satellitari ed è disponibile direttamente su [Tensorflow](https://www.tensorflow.org/datasets/catalog/bigearthnet?hl=it).

### 2.6 Librerie Geospaziali e per Remote Sensing

L'ecosistema Python geospaziale presenta parecchi strumenti e librerie. Si seguito le principali:

- **GDAL (osgeo)**: la libreria _base_ per raster e vettori GIS. In Python si usa indirettamente via binding (osgeo.gdal) ma più spesso tramite wrapper più pitonici:
- **rasterio** (per raster) e **fiona** (per shapefile) sono _wrapper_ pythonic di GDAL/OGR. _Rasterio_ offre lettura/scrittura di GeoTIFF, cropping, reproiezione, e funzioni numpy-friendly.
- **Geopandas** (per vettori) combina Fiona + Shapely: permette di leggere shapefile/GeoJSON in DataFrame e usare operazioni geografiche (buffer, intersection) via Shapely in modo vectorizzato. Ottimo per layer vettoriali non enormi (fino a ~100k entità).
- **Shapely 2.0** - libreria geometrica (in C) usata da geopandas; con la v2 supporta nativamente _array_ (grazie a PyGEOS), quindi molto efficiente su grandi insiemi di geometrie.
- **pyproj** - gestisce sistemi di coordinate e trasformazioni (usa PROJ sotto).
- **rasterio vs rioxarray vs xarray**: _rasterio_ è ideale per operazioni raster file-per-file ad alte prestazioni e batch processing (script); _xarray_ è preferibile per analisi su stack di dati come cubi temporali o mosaici grandi, grazie a _dask_ per la parallelizzazione. _rioxarray_ è un'estensione di xarray che aggiunge consapevolezza geospaziale (CRS, trasformate) usando rasterio sotto il cofano. **Ruff** - _"Rasterio is for speed, batch processing of many files, Rioxarray shines for interactive analytical work in notebooks"_ notano gli utenti[\[73\]](https://www.reddit.com/r/remotesensing/comments/1k4wuf5/rasterio_vs_rioxarray/#:~:text=%E2%80%A2%20%207mo%20ago). Attenzione però: rioxarray/xarray possono consumare molta memoria se non ben chunk-ati, e su dataset grandi a volte crashano, dove rasterio a basse prestazioni esegue comunque ("quando dataset grandi rallentano o crashano con rioxarray, passo a GDAL/rasterio che risolve in pochi secondi" cit.)[\[74\]](https://www.reddit.com/r/remotesensing/comments/1k4wuf5/rasterio_vs_rioxarray/#:~:text=%E2%80%A2%20%206mo%20ago)[\[75\]](https://www.reddit.com/r/remotesensing/comments/1k4wuf5/rasterio_vs_rioxarray/#:~:text=This,to). **Consiglio:** usare _xarray + dask_ per elaborazioni distribuite (es. calcolare NDVI su 1000 scene) - dask creerà grafo ed eseguirà in parallelo (anche su cluster).
- **rio-tiler**: libreria per lavorare con COG (Cloud Optimized GeoTIFF) e generare tile (es. 256x256) per visualizzazione web. Permette di estrarre rapidamente porzioni di immagine via HTTP range requests e creare tile XYZ o WMTS. Indispensabile se si costruisce un servizio di mappe (tipo fornire una mappa interattiva delle predizioni modello). Esempio: con rio-tiler puoi ottenere il tile PNG di zoom 15, x=17342,y=11945 da un COG in S3 con una chiamata, includendo magari applicazione di color mapping.
- **folium / ipyleaflet / leafmap**: per visualizzare i risultati su mappe interattive in Jupyter. _Folium_ è semplice: produce una mappa Leaflet HTML con marker, layer raster/vettoriali (puoi addirittura aggiungere l'URL di un tile server o di un COG). _ipyleaflet_ è più avanzato (bidirezionale, reagisce a Python in real-time) - ad es. permette di disegnare un poligono sulla mappa e averlo in Python per analisi. _Leafmap_ fornisce un'API di alto livello e supporta anche interfacce come Google Earth Engine. Integrare queste librerie aiuta a **validare visualmente** le output del modello (es. mostrare in rosso gli edifici danneggiati su una mappa).
- **TorchGeo**: merita menzione di nuovo qui - è un _PyTorch Domain Library_ ufficiale[\[76\]](https://pytorch.org/blog/geospatial-deep-learning-with-torchgeo/#:~:text=Geospatial%20deep%20learning%20with%20TorchGeo,models%20specific%20to%20geospatial%20data) che fornisce dataset loader per molti dataset geospaziali (come quelli sopra), samplers per estrarre patch geolocalizzate bilanciando classi, e modelli pre-addestrati (es. una ResNet50 pre-addestrata su BigEarthNet). Semplifica la creazione di pipeline di training con PyTorch Lightning per compiti come segmentazione di edifici, classificazione uso suolo, ecc., riducendo il codice custom da scrivere. Ad esempio, TorchGeo include il datamodule per xView2, così puoi ottenere facilmente coppie pre/post e mask danno con un semplice API[\[77\]](https://github.com/torchgeo/torchgeo#:~:text=from%20torchgeo,trainers%20import%20SemanticSegmentationTask)[\[78\]](https://github.com/torchgeo/torchgeo#:~:text=datasets%20can%20be%20challenging%20to,reprojected%20into%20a%20matching%20CRS).
- **Altre**: _scikit-image_ per filtri su raster (es. filtro mediano per rimuovere speckle SAR), _OpenCV_ se servono trasformazioni veloci, _pySAR_ (o _Gamma_) per processare SAR (ad es. generare interferogrammi - ambito specialistico). **SNAP** (di ESA) ha API Java che si possono chiamare in Python (non triviale, ma utile per pre-processing Sentinel-1).
- **Database geospaziali**: se i dati vettoriali diventano grandi, considerare _PostGIS_ (PostgreSQL + estensione GIS) per memorizzare e interrogare efficacemente. Ad esempio, i risultati di building detection per una città (milioni di punti) possono essere messi in PostGIS e interrogati con indici spaziali (es. trovare edifici danneggiati in un raggio di 1 km da coordinate X). O ancora, in retrieval geospaziale per agenti LLM (vedi Spatial RAG), un database spaziale può filtrare rapidamente candidati (come suggerito da Yu et al. 2024[\[79\]](https://arxiv.org/html/2502.18470v5#:~:text=Answering%20real,the%20answering%20process%20as%20a)[\[80\]](https://arxiv.org/html/2502.18470v5#:~:text=geographic%20relationships%20and%20semantic%20user,retriever%20that%20combines%20sparse%20spatial)). Con Python, si interagisce via SQLAlchemy/GeoAlchemy o direttamente con geopandas (che può leggere da PostGIS con read_postgis).

**Quando usare cosa:** - Se devi solo leggere qualche immagine, fare calcoli pixel-wise o maschere => _rasterio_ + numpy è semplice e sufficiente. - Se hai bisogno di gestire un grande stack di dati (time series, data cube su area vasta) => _xarray + dask_ è più appropriato (ma richiede riflettere su chunking e memoria). - Per pipeline a streaming (molte immagini indipendenti) => sfrutta _concurrent.futures_ o _dask.bag_ con rasterio (che rilascia GIL nelle operazioni I/O). - Per vettori, se &lt;100k features =&gt; _geopandas_ va bene; >100k considerare PostGIS o usare _spatialindex_/Rtree per query spaziali in-memory. - Per _serving tile maps_ => _rio-tiler_ per il backend (taglia immagini) e _folium/ipyleaflet_ per frontend map. - Per _analisi raster-vector miste_ (zonal stats, clip raster con maschera) => _rasterstats_ è un pacchetto utile (costruito su rasterio). - Se stai lavorando con _dati 3D o LiDAR_ => _PDAL_ (Point Data Abstraction Lib) con binding Python o _pylas_ per LAS.

**Pipeline esempio (ottico + SAR):** supponiamo di voler individuare aree alluvionate combinando Sentinel-1 e Sentinel-2: 1. **Data loading:** scarichiamo un'immagine Sentinel-2 post-evento (es. banda infrarosso e rosso) e una Sentinel-1 coeva. Possiamo usare pystac-client per ottenere gli asset URL e scaricarli. Carichiamo con rasterio: s2 = rasterio.open('sentinel2.tif'), s1 = rasterio.open('sentinel1.tif'). 2. **Pre-process:** allineiamo risoluzione e CRS - ad es. portiamo Sentinel-1 (10 m, polarizzazione VV) nella grid di Sentinel-2 (10 m). Con rasterio: rasterio.warp.reproject(source=s1.read(1), src_transform=s1.transform, src_crs=s1.crs, destination=arr, dst_transform=s2.transform, dst_crs=s2.crs, dst_shape=s2.shape). Otteniamo arr SAR registrato. 3. **Stack & filter:** normalizziamo le bande (es. Sentinel-1 in dB, applicando soglia per rimuovere rumore) e impiliamo: costruiamo un array 3-canali: NIR, Red, SAR. Possiamo farlo con numpy su piccole immagini, o con xarray (un DataArray multi-band). Applichiamo magari un filtro mediano sul SAR per ridurre speckle. 4. **Inferenza modello:** passiamo il tensor \[H,W,3\] al modello di segmentazione (es. U-Net addestrata su dataset di flood). Otteniamo una mask binaria predetta. 5. **Post-process & vectorize:** usando _rasterio.features_, trasformiamo la mask in shapefile (poligoni allagati). shapes = rasterio.features.shapes(mask_pred, transform=s2.transform) fornisce geometrie; filtriamo quelle con area minima e le scriviamo con geopandas in un GeoJSON. 6. **Visualizza/valida:** apriamo la mappa con folium: folium.Map(...). Add layer Sentinel-2 RGB, poi add i poligoni alluvione semi-trasparenti in blu.

Questa pipeline combina **rasterio** per I/O e warp, **numpy/scikit-image** per filtri, **deep learning (PyTorch)** per inferenza, **rasterio.features/geopandas** per output vettoriale. Se la scala cresce (immagini molto grandi o tante), possiamo distribuire su dask: ad es. leggere le immagini come dask array via rioxarray (rioxarray.open_rasterio(..., chunks=...)), fare calcoli in lazy, usare map_blocks per inferenza modello (se il modello è deployato in modo che dask possa chiamarlo - non banale, ma possibile con dask.delayed). Oppure processare a tile (es. 512x512) iterativamente.

**Integrazione con LLM:** i risultati geospaziali finali (es. shapefile di aree allagate con attributi) possono essere inseriti in un _knowledge base_ testuale: ad esempio, generare un breve riassunto in JSON o CSV (50 km² allagati in regione X). Un agente LLM può poi fare query geospaziali semplici tramite codice Python (es. usando _shapely_ per controllare se un punto è dentro area allagata) - come visto in approcci _Spatial-QA_ di ricerca recente.

In breve, **librerie geospaziali Python offrono potenza simile a GIS desktop** ma programmabile: da semplici buffer a complessi join spaziali o reproiezioni in massa. La chiave è scegliere lo strumento giusto in base a **scalabilità e complessità**: un mix di rasterio/geopandas per task mirati, xarray/dask per big data, database/servizi dedicati se necessario. Fortunatamente, la compatibilità reciproca è buona (geopandas può usare shapely/dask-geopandas per parallelismo, rasterio interagisce con numpy/xarray facilmente). Il tutto integrato con il mondo PyData (numpy, pandas) e ora PyTorch/TensorFlow per modelli ML crea un **ecosistema potente per l'AI geospaziale**.

### 2.7 Template Progetti, Repos di Riferimento e Best Practice

Per costruire uno stack **production-ready** è utile studiare progetti open-source esistenti che affrontano problemi simili. Ecco **10 repository e template di riferimento (2025)** da cui trarre insegnamenti, con motivazione:

- **LangChain** - 【67†repo】 (framework per agenti e LLM apps). **Perché:** È lo standard de facto per orchestrare LLM con memory, tool e data augmentation. Studiare come struttura il codice modulare (chains, agents), il suo **pyproject.toml** con _uv_ (lo mantengono con uv e rilasciano frequente, ~14k commit) e come gestiscono integrazioni (es. vectorstores). _Aggiornamento:_ v1.0 rilasciata 2025, repo attivissimo (commits daily)[\[81\]](https://github.com/hwchase17/langchain/commits#:~:text=Commits%20%C2%B7%20langchain,%C2%B7%20fix%28infra%29%3A).
- **LlamaIndex (GPT Index)** - [\[82\]](https://github.com/run-llama/llama_index/releases#:~:text=Release%20Notes.%20%5B2025,core%20%5B0.14.0%5D.%20breaking%3A%20bumped) (framework RAG centrato sui dati). **Perché:** Fornisce pattern per indicizzare documenti e immagini e far retrieval efficiente per LLM. Ha componenti per query spaziali (es. potresti indicizzare coordinate e fare filtraggio). Vedere come implementa i vari Storage e i **reader per dati eterogenei**. Repo Python attivo (rilasci 0.14.x nel 2025).
- **Haystack** (deepset.ai) - [GitHub](https://github.com/deepset-ai/haystack). **Perché:** End-to-end QA pipeline open-source, con supporto a document retrieval, generazione e persino agenti. Hanno un design orientato a **produrre API** (es. GraphQL) e pipeline componibili YAML. Studiare come definiscono i componenti (Reader, Retriever, Generator) e gestione config. Molto production-friendly (usato in aziende). Aggiornato regolarmente (v1.x in 2025).
- **TorchGeo** - 【49†repo】 (PyTorch GeoAI library). **Perché:** Esempio di libreria _domain-specific_ ben progettata: vedere struttura (modularità in datasets, samplers, models), test approfonditi, e uso di CI (hanno integrazione con OSGeo, ecc.). Attivamente mantenuta da Microsoft Research (recenti commit 2025). Utile per capire best practice nel _packaging_ di modelli geospaziali (in HuggingFace Hub ad esempio).
- **Segment Anything (Meta AI)** - [GitHub](https://github.com/facebookresearch/segment-anything). **Perché:** Anche se non geospaziale, _SAM_ ha avuto impatto anche in RS (usato per segmentare oggetti generici in immagini satellitari). Il repo mostra come distribuire un modello foundation con annotazioni interattive. Da studiare la parte di **inference pipeline ottimizzata** (batched mask generation su immagini grandi) e il design del demo notebook/web. Ultimo update: 2023-11 (Meta ha rilasciato SAM-1).
- **xView2 First Place Solution** - [\[83\]](https://github.com/DIUx-xView/xView2_first_place#:~:text=DIUx,idea%20will%20be%20improved%20further) (DIUx-xView GitHub). **Perché:** Codice di un team vincitore per building damage. Permette di vedere un progetto completo: data preprocessing da xBD, modello (U-Net ensemble), inferenza e post-processing, e come packaging finale (hanno script per inferenza su directory di immagini). Sebbene del 2019, molti principi restano validi. Struttura in PyTorch con config JSON, training e inferenza separati. Utile per capire _tricks_ per migliorare performance (es. split model in due stadi per localization vs classification[\[84\]](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=The%20U,sampler%20or%20the%20decoder)).
- **SpaceNet 8 Baseline (Flood Detection)** - [\[85\]](https://github.com/SpaceNetChallenge/SpaceNet8#:~:text=Algorithmic%20baseline%20for%20SpaceNet%208,%C2%B7%20Finetune%20the) (spacenet8 repo). **Perché:** Un esempio di **pipeline multimodale**: legge Sentinel-2 e -1, usa modelli per estrarre strade, edifici e alluvioni. Contiene notebook e script, e mostra come valutare risultati con metriche custom. Insegna come organizzare un progetto di challenge e applicare augmentations specifiche. Ultimo update 2023.
- **Raster Vision** - [\[86\]](https://nocomplexity.com/documents/fossml/generatedfiles/rastervision.html#:~:text=Complexity%20nocomplexity,metric%21%20Stars%20count%20are) (Azavea). **Perché:** Framework generale per CV su immagini geospaziali, scritto con architettura plugin. Consente definire pipeline di training con config JSON. Studiarne il _design config-driven_, l'uso di Docker per isolare ambienti, e le componenti (scenario, dataset, backend). Dimostra come un tool può astrarre common tasks (clip, retiling, train, predict) per vari problemi. Aggiornato all'ultima versione 0.31 nel 2025[\[86\]](https://nocomplexity.com/documents/fossml/generatedfiles/rastervision.html#:~:text=Complexity%20nocomplexity,metric%21%20Stars%20count%20are).
- **Lightning + Hydra Template** - _Lightning-Hydra-Template_ (ashleve) - [GitHub](https://github.com/ashleve/lightning-hydra-template). **Perché:** Un repository scaffolding molto popolare per progetti di deep learning. Unisce PyTorch Lightning per training modulare e Hydra per gestire config di esperimenti. Offre struttura pulita (src con pl_modules, data_module, configs separati per dataset/model/training). Anche se generale, è utile per vedere best practice di _organizzazione del codice ML_, logging (neptune/mlflow integrato), e automazione train/val. Continuamente aggiornato con nuove best practice (v2024).
- **Cookiecutter MLOps** - (DrivenData Cookiecutter Data Science 2.0) - [GitHub](https://github.com/drivendata/cookiecutter-data-science). **Perché:** Un template di progetto che enfatizza il ciclo completo: data, modeling, deployment. Anche se più data-science oriented, fornisce un riferimento su come strutturare repository con cartelle per dati grezzi, intermedi, modelli salvati, report, ecc., e su come documentare le decisioni. Utile per non dimenticare nulla (ad es. include anche setup di CI e docs scaffolding).

Oltre a questi, monitorare repository di aziende tech su _disaster response_ - es: **Google's flood forecasting** (codice proprietario, ma pubblicazioni dettagliate), **UNOSAT open products** (script GIS). E community come **OSGeo** e **OMEN (Open Mapping)** per tool di mappatura automatica.

**Repository structure ideale (AI+Geo):** combinando ispirazione dai sopra, consigliamo: - **Modularizzare** per componenti: es. src/models/ per modelli ML, src/data/ per utilità di caricamento, src/utils/geo.py per funzioni geospaziali (buffer, reproject, etc.), src/api/ per il codice FastAPI. - **Configs fuori dal codice**: usare Hydra o Pydantic come discusso. Fornire config esempio per dataset (specie se open) cosicché nuovi contributori possano replicare risultati facilmente puntando ai path giusti. - **Makefile/CLI**: prevedere comandi rapidi: make data (scarica dataset open), make train (avvia training se previsto), make infer (esegue inferenza su input di esempio), make serve (lancia API). Questo riduce la frizione nell'eseguire parti del progetto. - **README** completo: spiegare architettura, come settare env, lanciare test, ecc. Vedere README di LangChain[\[6\]](https://github.com/langchain-ai/langchain#:~:text=LangChain%20is%20a%20framework%20for,as%20the%20underlying%20technology%20evolves) o TorchGeo per esempio di documentazione chiara e badge di build. - **Test & CI**: includere qualche test anche per funzioni geospaziali (es. un test che crea un geometria, applica buffer e confronta area attesa). O test che il modello caricato produce output con dimensioni corrette su un dummy input.

Infine, **best practice** generali: versionare i modelli (usare semver o data per sapere con quali dati sono stati addestrati), mantenere traccia dei _cron job_ se ci sono (es. aggiornamento dati quotidiano), e includere strumenti di monitoring se in produzione (prometheus exporter per risorse e magari contatore di quante volte è chiamata una certa funzione di inferenza).

### 2.8 Piano Pratico: Setup Completo in 7-10 giorni

Proponiamo ora una roadmap _day-by-day_ (circa 2-3 ore al giorno per una settimana) per costruire lo stack locale e portarlo verso produzione minima.

**Giorno 1: Ambiente e Struttura Iniziale**  
**Obiettivo:** Impostare l'ambiente Python e la struttura base del progetto.  
\- _Attività:_ Installare pyenv e creare una nuova versione Python 3.11 se necessario. Inizializzare un repository git (git init). Scegliere l'**environment manager** (es. Poetry vs Conda): per iniziare, puoi usare Poetry per semplicità. Eseguire poetry init e aggiungere subito dipendenze principali: poetry add rasterio geopandas shapely torch torchvision fastapi uvicorn.  
\- _Comandi:_ pyenv install 3.11.5 && pyenv local 3.11.5 (oppure usare l'interprete di sistema/conda), poetry init, poetry add .... Creare la struttura cartelle come in §2.1 (puoi usare cookiecutter data science come riferimento).  
\- _Risultato:_ Progetto con layout directory, env Python attivo con pacchetti core installati. Verificare import cruciali (aprire REPL: import rasterio, torch, geopandas per confermare funzionano - se geopandas lamenta gdal, potrebbe servire apt-get install libgdal-dev o installare via conda invece). In caso di problemi di dipendenze (es. GDAL), aggiustare usando conda: e.g. creare env con mamba create -n myenv python=3.11 gdal rasterio geopandas.

**Giorno 2: Tooling e Qualità del Codice**  
**Obiettivo:** Configurare pre-commit, lint, formatter, test scaffolding.  
\- _Attività:_ Aggiungere _Black, Ruff, Mypy_ al progetto (poetry add --dev black ruff mypy pre-commit pytest). Creare .pre-commit-config.yaml con hook:  

repos:  
\- repo: <https://github.com/astral-sh/ruff-pre-commit>  
rev: v0.5.4  
hooks:  
\- id: ruff  
args: \["--fix"\] # lascia che ruff applichi fix semplici  
\- repo: <https://github.com/psf/black>  
rev: 23.9.1  
hooks:  
\- id: black  
\- repo: <https://github.com/pre-commit/mirrors-mypy>  
rev: v1.5.1  
hooks:  
\- id: mypy  
\- repo: local  
hooks:  
\- id: pytest  
name: pytest  
entry: pytest  
language: system  
files: "^tests/"

Installare i pre-commit hook (pre-commit install). Creare file di configurazione in pyproject.toml per black/ruff (line-length, etc. come in Medium combos[\[41\]](https://medium.com/@sparknp1/10-mypy-ruff-black-isort-combos-for-zero-friction-quality-770a0fde94ac#:~:text=%23%20pyproject.toml%20%5Btool.black%5D%20line,version%20%3D%20%5B%22py311)). Creare uno stub di test in tests/test_basic.py con una asserzione banale (es. assert 2+2==4).  
\- _Comandi:_ pre-commit run --all-files per testare i hook subito. pytest per vedere che la suite (con 1 test banale) passi.  
\- _Risultato:_ Ogni commit ora formatterà automaticamente il codice e segnalerà problemi. La base di test è impostata (anche se triviale). L'introduzione di errori di lint o type-check verrà bloccata dal hook, garantendo standard dal primo codice scritto.

**Giorno 3: Ingestione Dati di Esempio**  
**Obiettivo:** Scaricare un piccolo dataset di esempio (es. 1 evento) e implementare script di lettura.  
\- _Attività:_ Scegli un dataset target - p.es. immagini e label dell'uragano Harvey 2017 (flood). Utilizza l'API STAC planetario o direttamente link noti (Maxar Open Data, ecc.) per scaricare 1-2 immagini pre e post e qualche label vettoriale. Scrivi uno script Python in src/data/download_data.py che scarica questi file (puoi usare requests o pystac-client + urllib). Implementa una funzione per caricare in memoria una coppia di raster (usa rasterio).  
\- _Comandi:_ Esempio: poetry add requests pystac-client. Esegui lo script: python src/data/download_data.py --event harvey (parametrizza in base all'evento). Questo dovrebbe salvare file in data/raw/harvey/.  
\- _Risultato:_ Disponi di un sottoinsieme di dati locali. Verifica aprendo con rasterio che i file siano leggibili e controlla dimensioni. Questo ti prepara terreno per sviluppare pipeline senza scaricare ogni volta (metti in .gitignore i dati). - _Extra:_ Potresti scrivere un test per la funzione di load (es. assert img.shape == (….) atteso). Oppure generare un'immagine sintetica per testare (utile per CI: non vorrai scaricare 100MB di dati in CI, ma puoi creare un GeoTIFF 10x10 in memory e passarlo alle funzioni per testare flusso).

**Giorno 4: Modello e Pipeline Geospaziale**  
**Obiettivo:** Implementare la pipeline ottico+SAR -> predizione -> vettorializzazione su un caso di test.  
\- _Attività:_ Se hai un modello pre-addestrato (ad es. potresti usare segnaposto come: se pixel SAR > X e NDVI &lt; Y =&gt; flood), implementalo ora in src/models/model.py come funzione predict_flood(mask, arr_s2, arr_s1). Altrimenti, se hai tempo/dati, puoi addestrare un piccolo modello: installa Lightning (poetry add lightning) e scrivi un LightningModule di segmentazione. Ma date le tempistiche, assumiamo di usare un euristico semplice o un modello pre-addestrato caricato (es. utilizzare weights di torchvision segmentation e adattarlo).  
\- _Comandi:_ Esegui la pipeline completa su un tile di test: leggi le immagini (Day3), passa al modello, ottieni mask. Usa geopandas per convertire in vettore e salva shapefile in data/predictions/. Visualizza il risultato (puoi creare un piccolo script con folium che carica immagine e overlay shapefile - aprilo in browser).  
\- _Risultato:_ Pipeline locale funzionale su almeno un input. Validazione qualitativa: se modello non addestrato, va bene anche vedere che produce _qualcosa_. Questo step consolida l'integrazione tra componenti geospaziali e ML. - _Extra:_ Aggiungi log oppure stampa dei risultati (es. % pixel flood: 12%). Puoi anche calcolare una metrica se hai la verità a terra per quell'immagine (se nel dataset c'è mask manuale, confronta con predetta).

**Giorno 5: API di Servizio e LLM Integration**  
**Obiettivo:** Creare un microservizio FastAPI che esponga la funzionalità e integri un LLM per Q&A.  
\- _Attività:_ Scrivere in src/api/app.py una FastAPI app con endpoint: /predict che accetta magari coordinate o id evento e restituisce quanti edifici/allagamenti trovati; /ask che accetta una domanda utente e usa un LLM chain per rispondere. Per quest'ultimo, serve integrare l'LLM: puoi usare OpenAI API (se hai key) o un modello open locale (installare pip install openai o transformers + un modello HF). Implementa semplice: ricevi domanda, in backend richiami la funzione interna (che eventualmente consulta i risultati geospaziali - se la domanda è tipo "quanti edifici danneggiati a X", fai una query su geopandas data). Infine componi la risposta - se hai OpenAI, mandala con prompt contenente i dati come context.  
\- _Comandi:_ Avvia il server locale: uvicorn src.api.app:app --reload e prova query con curl o nel browser (FastAPI doc UI). Esempio: GET /predict?event=harvey -> ritorna JSON {"flooded_area_km2": ..., "buildings_damaged": ...}. Poi POST /ask con body {"question": "Quanti edifici danneggiati dall'uragano Harvey?"} -> il codice prende buildings_damaged dal precedente output e formula "Sono stati danneggiati circa XYZ edifici". (In futuro questo sarebbe fatto via agent).  
\- _Risultato:_ Un prototipo di servizio **disaster API**. Non ancora robusto o con sicurezza, ma dimostra l'idea. - _Extra:_ Integrare l'LLM vero e proprio - se OpenAI, aggiungi chiave in .env e usa openai.Completion.create(prompt=...). Oppure se locale, carica un piccolo modello (ex: pip install sentence-transformers e usa un modello Q/A come "deepset/roberta-base-squad2" con Transformers QA pipeline).

**Giorno 6: Dockerizzazione e Portability**  
**Obiettivo:** Creare l'immagine Docker dell'app e testarla (CPU).  
\- _Attività:_ Scrivere il Dockerfile basandoti sugli esempi (§2.3). Poiché il focus è leggero (no training pesante), potresti usare Python slim + pip. Attento alle dip geospaziali: aggiungi nel Dockerfile apt-get per geos/gdal. Esempio:  

FROM python:3.11-slim  
RUN apt-get update && apt-get install -y libgdal-dev libgeos-dev  
...  
RUN pip install -r requirements.txt

(Oppure usa miniconda image e conda install). Copia l'app ed entrypoint.  
\- _Comandi:_ docker build -t myapp:dev . (dalla root) e poi docker run --rm -p 8000:8000 myapp:dev. Verifica che facendo le stesse richieste di Day5 ottieni risposte. Se funziona in Docker, hai risolto eventuali gap di dipendenze nativi. Se fallisce (es. errori Import GDAL), sperimenta con base image differente (conda).  
\- _Risultato:_ Container local funzionante. Ciò simula l'ambiente di produzione. Dimensione immagine attuale? Forse ~1-2 GB con tutte le libs (geopandas e Torch gonfiano un po'). Considera di ottimizzare multi-stage se tempo. - _Extra:_ Testa multi-arch: se hai solo CPU local, almeno hai test su linux/amd64.

**Giorno 7: Deploy su Cloud o Documentazione**  
_(Opzionale, se volessi proseguire oltre)_  
**Obiettivo:** Preparare il terreno per deployment e scrivere doc finale.  
\- _Attività:_ Scrivi documentazione utente: come usare API, come replicare i risultati (magari in README). Crea magari uno script di _smoke test_ in tests/test_api.py che avvia test client FastAPI e chiama /predict su sample e verifica formato risposta.  
\- Considera dove deployare: potresti provare su **Heroku** (semplice per FastAPI, ma senza GPU) o **Railway**. Configura il Dockerfile per prod (es. usare gunicorn).  
\- Imposta eventuale CI/CD: ad esempio workflow GitHub Actions che su push su main builda l'immagine e la pubblica su Docker Hub.  
\- _Risultato:_ Progetto pronto per essere condiviso: codice, docker, doc e magari un link live (anche se performance limitate in free tier).

Naturalmente, ogni fase può richiedere aggiustamenti. Ad esempio, potresti scoprire che un pacchetto manca - risolto aggiungendolo e rifacendo poetry.lock o environment.yml (un motivo per fissare environment presto).

Il piano prevede ~7 giorni, ma potrebbe estendersi a 10 se dedichi tempo ad addestramento modello custom o a refine dell'agente LLM. In tal caso: Giorno 8-9 potrebbe essere dedicato a fine-tuning di un modello (usando dataset open, e salvando i pesi), e Giorno 10 a integrazione di quell'output nel servizio (es. endpoint /retrain se vuoi fare MLOps continuo).

### 2.9 Azioni Immediate (prime 24h)

Per partire subito, ecco una checklist rapida delle prime azioni da compiere:

- **1\. Preparare l'ambiente di sviluppo:** Installare Anaconda/Miniconda o Poetry sul tuo sistema Linux. Aggiornare driver NVIDIA se prevedi test su GPU remota (Colab). Creare un nuovo env Python 3.11 pulito.
- **2\. Inizializzare il progetto:** Strutturare le cartelle come descritto e iniziare un git repo. Creare un repository remoto (GitHub) e fare il primo commit con README.md e pyproject.toml/requirements.txt.
- **3\. Configurare i tool Dev:** Impostare subito pre-commit e Black/Ruff. Eseguire pre-commit install così ogni file che creerai verrà già formattato e lintato su commit. Questo ti evita di accumulare debito tecnico di stile.
- **4\. Recuperare dataset di esempio:** Identificare un piccolo evento (anche solo un'immagine pre/post dal Maxar Open Data o dal Copernicus EMS). Scaricali manualmente intanto (via browser o AWS CLI) e mettili in data/raw/. In parallelo, richiedi eventuali API key (es. OpenAI API se intendi usarla).
- **5\. Studiare riferimenti:** Dedica qualche ora a leggere documentazione di 1-2 strumenti chiave che userai per primi. Ad esempio: sintassi base di rasterio (leggi il tutorial ufficiale), uso base di FastAPI (come definire un endpoint e far girare uvicorn), e se non hai familiarità, la guida di pystac-client per capire come query i dati STAC[\[87\]](https://pystac-client.readthedocs.io/en/stable/usage.html#:~:text=The%20following%20code%20creates%20an,Microsoft%20Planetary%20Computer%20root%20catalog)[\[88\]](https://pystac-client.readthedocs.io/en/stable/usage.html#:~:text=,Microsoft%20Planetary%20Computer%20STAC%20API). Questo investimento iniziale ti farà risparmiare grattacapi dopo.
- **6\. Impostare variabili config:** Creare un file .env.example con dentro chiavi attese (es. OPENAI_API_KEY=) e aggiungerlo a git. Copiarlo in .env e valorizzare per dev. Includere nel README come ottenere e settare queste variabili (es. link alla pagina OpenAI per crear key).
- **7\. Pianificare risorse computazionali:** Dato che non hai GPU locale, decidere come testare parti pesanti. Esempio: configurare un notebook su Colab con repo GitHub collegato, così potrai eseguire inferenza su GPU li se serve. Oppure assicurati che il codice sia parametrizzato per usare .to('cpu') come default e funzioni comunque.
- **8\. Comunicare e documentare:** anche se sei solo sviluppatore, abituati a mantenere changelog o commit message chiari. Ad esempio, dopo Day1, scrivi un commit "setup environment, add base deps (rasterio, torch, etc.) - verify imports OK". Questo ti aiuterà a tracciare progressi e facilitare eventuale coinvolgimento di altri collaboratori in futuro.

Seguendo queste azioni nelle prime 24 ore, metterai basi solide: ambiente pronto, repo configurato con quality gate, e dati a disposizione per iniziare a sviluppare la **funzionalità core**. Da lì in poi, potrai iterare costruendo man mano la pipeline, sapendo di avere un _scaffolding_ professionale attorno (test, lint, container) che ti supporta nel produrre codice affidabile e riproducibile.

[\[1\]](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=Our%20main%20algorithm%20of%20choice,algorithm%20for%20semantic%20image%20segmentation) [\[54\]](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=The%20data%20used%20for%20the,resolution%20color%20images) [\[55\]](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=The%20images%20capture%2019%20natural,from%20all%20over%20the%20world) [\[84\]](https://www.ibm.com/think/insights/the-xview2-ai-challenge#:~:text=The%20U,sampler%20or%20the%20decoder) The xView2 AI Challenge | IBM

<https://www.ibm.com/think/insights/the-xview2-ai-challenge>

[\[2\]](https://github.com/torchgeo/torchgeo#:~:text=Image%3A%20TorchGeo%20logo) [\[3\]](https://github.com/torchgeo/torchgeo#:~:text=First%20we%27ll%20import%20various%20classes,used%20in%20the%20following%20sections) [\[77\]](https://github.com/torchgeo/torchgeo#:~:text=from%20torchgeo,trainers%20import%20SemanticSegmentationTask) [\[78\]](https://github.com/torchgeo/torchgeo#:~:text=datasets%20can%20be%20challenging%20to,reprojected%20into%20a%20matching%20CRS) GitHub - torchgeo/torchgeo: TorchGeo: datasets, samplers, transforms, and pre-trained models for geospatial data

<https://github.com/torchgeo/torchgeo>

[\[4\]](https://www.meilisearch.com/blog/how-to-build-a-rag-pipepline#:~:text=search%20engines%20with%20LLMs%20to,more%20accurate%20and%20reliable%20answers) [\[5\]](https://www.meilisearch.com/blog/how-to-build-a-rag-pipepline#:~:text=This%20teamwork%20reduces%20the%20chance,existent%20street) [\[9\]](https://www.meilisearch.com/blog/how-to-build-a-rag-pipepline#:~:text=A%20RAG%20pipeline%20works%20like,The%20team%20includes) [\[10\]](https://www.meilisearch.com/blog/how-to-build-a-rag-pipepline#:~:text=capture%20the%20essence%20of%20each,or%20another%20LLM%2C%20the%20model%E2%80%99s) [\[11\]](https://www.meilisearch.com/blog/how-to-build-a-rag-pipepline#:~:text=Image%3A%20rag%20pipeline%20architecture%20diagram) [\[12\]](https://www.meilisearch.com/blog/how-to-build-a-rag-pipepline#:~:text=find%20documents%20discussing%20%E2%80%9Creturns%2C%E2%80%9D%20%E2%80%9Cdownloads%2C%E2%80%9D,of%20the%20context%20it%20receives) How to Build a RAG Pipeline: A Step-by-Step Guide

<https://www.meilisearch.com/blog/how-to-build-a-rag-pipepline>

[\[6\]](https://github.com/langchain-ai/langchain#:~:text=LangChain%20is%20a%20framework%20for,as%20the%20underlying%20technology%20evolves) [\[7\]](https://github.com/langchain-ai/langchain#:~:text=Why%20use%20LangChain%3F) GitHub - langchain-ai/langchain: The platform for reliable agents.

<https://github.com/langchain-ai/langchain>

[\[8\]](https://arxiv.org/html/2502.18470v5#:~:text=On%20the%20other%20hand%2C%20large,zhang2024bb%20%2C%20but%20the%20resulting) [\[79\]](https://arxiv.org/html/2502.18470v5#:~:text=Answering%20real,the%20answering%20process%20as%20a) [\[80\]](https://arxiv.org/html/2502.18470v5#:~:text=geographic%20relationships%20and%20semantic%20user,retriever%20that%20combines%20sparse%20spatial) Spatial-RAG: Spatial Retrieval Augmented Generation for Real-World Geospatial Reasoning Questions

<https://arxiv.org/html/2502.18470v5>

[\[13\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=The%20OG%20of%20Python%20package,be%20completely%20decoupled%20from%20a) [\[14\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=One%20of%20the%20key%20faults,that%20are%20no%20longer%20useful) [\[17\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=Furthermore%2C%20as%20of%202024%2C%20the,actual%20conflict%20in%20the%20DAG) [\[18\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=) [\[19\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=The%20core%20tradeoff%20with%20,possible%20leading%20to%20a%20potentially) [\[20\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=tools%20like%20,to%20build%20and%20publish%20Python) [\[21\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=specify%20upper%20and%20lower%20bounds,intended%20to%20be%20used%20widely) [\[22\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=pdm) [\[23\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=Unlike%20the%20other%20tools%20on,on%20multiple%20versions%20of%20python) [\[24\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=The%20downside%20to%20,%E2%80%9Cidiomatic%E2%80%9D%20in%20the%20long%20run%E2%80%A6) [\[27\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=,it%20was%20released%20in%202022) [\[28\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=written%20in%20Rust%20and%20is,rye) [\[30\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=dependencies.%20In%20mid%202024%2C%20,for%20reproducibility) [\[33\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=One%20thing%20to%20note%20about,were%20using%20for%20different%20projects) [\[34\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=Verdict) [\[39\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=drop,it%20was%20released%20in%202022) [\[40\]](https://dublog.net/blog/so-many-python-package-managers/#:~:text=linter%20notes,it%20was%20released%20in%202022) Python has too many package managers

<https://dublog.net/blog/so-many-python-package-managers/>

[\[15\]](https://www.geosynopsis.com/posts/docker-image-for-geospatial-application#:~:text=Unlike%20pip%2C%20Conda%20package%20manager,python%2C%20we%20get%20following%20error) [\[16\]](https://www.geosynopsis.com/posts/docker-image-for-geospatial-application#:~:text=Python%20GDAL%20requires%20,while%20using%20Conda%20package%20manager) [\[45\]](https://www.geosynopsis.com/posts/docker-image-for-geospatial-application#:~:text=We%20are%20starting%20from%20Miniconda,of%20dockerfile%20are%20as%20follows) Docker image for geospatial python application

<https://www.geosynopsis.com/posts/docker-image-for-geospatial-application>

[\[25\]](https://docs.astral.sh/uv/#:~:text=,boost%20with%20a%20familiar%20CLI) uv

<https://docs.astral.sh/uv/>

[\[26\]](https://www.reddit.com/r/learnpython/comments/1fyvk0v/poetry_conda_pipenv_or_just_pip_what_are_you_using/#:~:text=updoot%20for%20,Here%20is%20their%20site) Poetry, Conda, Pipenv or just Pip. What are you using? : r/learnpython

<https://www.reddit.com/r/learnpython/comments/1fyvk0v/poetry_conda_pipenv_or_just_pip_what_are_you_using/>

[\[29\]](https://prefix.dev/blog/pixi_a_fast_conda_alternative#:~:text=benchmarks%20show%20that%20pixi%20is,on%20a%20M2%20MacBook%20Pro) [\[31\]](https://prefix.dev/blog/pixi_a_fast_conda_alternative#:~:text=In%20comparison%20with%20conda%2C%20pixi,conda%20packages%20for%20real%20reproducibility) [\[32\]](https://prefix.dev/blog/pixi_a_fast_conda_alternative#:~:text=Reason%203%3A%20No%20more%20Miniconda,base%20environment) [\[35\]](https://prefix.dev/blog/pixi_a_fast_conda_alternative#:~:text=At%20prefix%2C%20we%E2%80%99re%20solving%20conda,tasks%20for%20collaboration%2C%20and%20more) [\[36\]](https://prefix.dev/blog/pixi_a_fast_conda_alternative#:~:text=Image) 7 Reasons to Switch from Conda to Pixi | prefix.dev

<https://prefix.dev/blog/pixi_a_fast_conda_alternative>

[\[37\]](https://medium.com/@sparknp1/10-mypy-ruff-black-isort-combos-for-zero-friction-quality-770a0fde94ac#:~:text=%5Btool.ruff%5D%20target,by%20Black%20fix%20%3D%20true) [\[38\]](https://medium.com/@sparknp1/10-mypy-ruff-black-isort-combos-for-zero-friction-quality-770a0fde94ac#:~:text=line,by%20Black%20fix%20%3D%20true) [\[41\]](https://medium.com/@sparknp1/10-mypy-ruff-black-isort-combos-for-zero-friction-quality-770a0fde94ac#:~:text=%23%20pyproject.toml%20%5Btool.black%5D%20line,version%20%3D%20%5B%22py311) [\[42\]](https://medium.com/@sparknp1/10-mypy-ruff-black-isort-combos-for-zero-friction-quality-770a0fde94ac#:~:text=%5Btool.mypy%5D%20python_version%20%3D%20,true%20plugins%20%3D) [\[44\]](https://medium.com/@sparknp1/10-mypy-ruff-black-isort-combos-for-zero-friction-quality-770a0fde94ac#:~:text=friction%20Python%20code%20quality%20with,commit%2C%20CI%2C%20and%20editor%20tips) 10 mypy/ruff/black/isort Combos for Zero-Friction Quality | by Syntal | Oct, 2025 | Medium

<https://medium.com/@sparknp1/10-mypy-ruff-black-isort-combos-for-zero-friction-quality-770a0fde94ac>

[\[43\]](https://github.com/syrupy-project/syrupy#:~:text=syrupy,assert%20immutability%20of%20computed%20results) syrupy-project/syrupy: :pancakes: The sweeter pytest snapshot plugin

<https://github.com/syrupy-project/syrupy>

[\[46\]](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration#:~:text=) [\[47\]](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration#:~:text=%5Bproduction%5D%20DATABASE_URL%20%3D%20,Dynaconf%20can%20handle%20encrypted%20secrets) [\[48\]](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration#:~:text=API_KEY%20%3D%20%22%40STRONGLY_ENCRYPTED%3Aprod_api_key_encrypted_value%22%20,can%20handle%20encrypted%20secrets) [\[49\]](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration#:~:text=) [\[50\]](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration#:~:text=%5Bdevelopment%5D%20DATABASE_URL%20%3D%20) [\[51\]](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration#:~:text=DATABASE_URL%20%3D%20) [\[52\]](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration#:~:text=) [\[53\]](https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration#:~:text=print%28f,Debug%20Mode%3A%20%7Bsettings.get%28%27DEBUG_MODE) Pydantic BaseSettings vs. Dynaconf A Modern Guide to Application Configuration | Leapcell

<https://leapcell.io/blog/pydantic-basesettings-vs-dynaconf-a-modern-guide-to-application-configuration>

[\[56\]](https://openaccess.thecvf.com/content_CVPRW_2019/papers/cv4gc/Gupta_Creating_xBD_A_Dataset_for_Assessing_Building_Damage_from_Satellite_CVPRW_2019_paper.pdf#:~:text=Imagery%20openaccess,of%20imagery%20from%2015%20countries) \[PDF\] A Dataset for Assessing Building Damage from Satellite Imagery

<https://openaccess.thecvf.com/content_CVPRW_2019/papers/cv4gc/Gupta_Creating_xBD_A_Dataset_for_Assessing_Building_Damage_from_Satellite_CVPRW_2019_paper.pdf>

[\[57\]](https://cmr.earthdata.nasa.gov/search/concepts/C2781412798-MLHUB.html#:~:text=The%20C2S,of%20chips%2C%20and%20water%20labels) Cloud to Street - Microsoft flood dataset - CMR Search

<https://cmr.earthdata.nasa.gov/search/concepts/C2781412798-MLHUB.html>

[\[58\]](https://radiantearth.blob.core.windows.net/mlhub/c2smsfloods/Documentation.pdf#:~:text=The%20C2S,oz32gz) \[PDF\] C2SMS Floods - NET

<https://radiantearth.blob.core.windows.net/mlhub/c2smsfloods/Documentation.pdf>

[\[59\]](https://www.researchgate.net/publication/343275667_Sen1Floods11_a_georeferenced_dataset_to_train_and_test_deep_learning_flood_algorithms_for_Sentinel-1#:~:text=,to%20train%20and%20evaluate) (PDF) Sen1Floods11: a georeferenced dataset to train and test deep ...

<https://www.researchgate.net/publication/343275667_Sen1Floods11_a_georeferenced_dataset_to_train_and_test_deep_learning_flood_algorithms_for_Sentinel-1>

[\[60\]](https://eod-grss-ieee.com/dataset-detail/ekFTRmNnWmtGOE52LzgrVUE4Ykd4dz09#:~:text=Sen1Floods11%20is%20a%20surface%20water,consists%20of%204%2C831%20512) Sen1Floods11 - Earth Observation Database

<https://eod-grss-ieee.com/dataset-detail/ekFTRmNnWmtGOE52LzgrVUE4Ykd4dz09>

[\[61\]](https://openaccess.thecvf.com/content_CVPRW_2020/papers/w11/Bonafilia_Sen1Floods11_A_Georeferenced_Dataset_to_Train_and_Test_Deep_Learning_CVPRW_2020_paper.pdf#:~:text=,ter%20data%20set) \[PDF\] Sen1Floods11: A Georeferenced Dataset to Train and Test Deep ...

<https://openaccess.thecvf.com/content_CVPRW_2020/papers/w11/Bonafilia_Sen1Floods11_A_Georeferenced_Dataset_to_Train_and_Test_Deep_Learning_CVPRW_2020_paper.pdf>

[\[62\]](https://gee-community-catalog.org/projects/maxar_opendata/#:~:text=MAXAR%20Open%20Data%20Events%20,events%20like%20earthquakes%20and) MAXAR Open Data Events - awesome-gee-community-catalog

<https://gee-community-catalog.org/projects/maxar_opendata/>

[\[63\]](https://www.reddit.com/r/AirlinerAbduction2014/comments/17190ge/maxar_technologies_open_data_list_of_the_last/#:~:text=Maxar%20Technologies%20Open%20Data%20List,some%20of%20these%20datasets) Maxar Technologies Open Data List of the Last Decade of Global ...

<https://www.reddit.com/r/AirlinerAbduction2014/comments/17190ge/maxar_technologies_open_data_list_of_the_last/>

[\[64\]](https://essd.copernicus.org/articles/16/4817/2024/#:~:text=globally%20distributed%2C%20event,art%20semantic%20segmentation%20algorithms.%20These) ESSD - A globally distributed dataset of coseismic landslide mapping via multi-source high-resolution remote sensing images

<https://essd.copernicus.org/articles/16/4817/2024/>

[\[65\]](https://github.com/microsoft/PlanetaryComputerExamples#:~:text=quickstarts%2C%20dataset%20examples%2C%20and%20tutorials) [\[66\]](https://github.com/microsoft/PlanetaryComputerExamples#:~:text=If%20you%27re%20viewing%20this%20repository,quickstarts%2C%20dataset%20examples%2C%20and%20tutorials) GitHub - microsoft/PlanetaryComputerExamples: Examples of using the Planetary Computer

<https://github.com/microsoft/PlanetaryComputerExamples>

[\[67\]](https://registry.opendata.aws/radiant-mlhub/#:~:text=Radiant%20MLHub%20,as%20other%20training%20data) Radiant MLHub - Registry of Open Data on AWS

<https://registry.opendata.aws/radiant-mlhub/>

[\[68\]](https://medium.com/radiant-earth-insights/geospatial-models-now-available-in-radiant-mlhub-a41eb795d7d7#:~:text=Radiant%20MLHub%20has%20been%20the,ML%29%20algorithms%20since%202019) Geospatial Models Now Available in Radiant MLHub - Medium

<https://medium.com/radiant-earth-insights/geospatial-models-now-available-in-radiant-mlhub-a41eb795d7d7>

[\[69\]](https://storms.ngs.noaa.gov/storms/ian/index.html#:~:text=Hurricane%20IAN%20Imagery%20Hurricane%20IAN,by%20the%20NOAA%20Remote) Hurricane IAN Imagery

<https://storms.ngs.noaa.gov/storms/ian/index.html>

[\[70\]](https://esri-disasterresponse.hub.arcgis.com/pages/imagery#:~:text=disasterresponse,major%20earthquakes%2C%20floods%2C%20storms) Imagery - Esri Disaster Response Program - ArcGIS Online

<https://esri-disasterresponse.hub.arcgis.com/pages/imagery>

[\[71\]](https://www.mdpi.com/2072-4292/16/11/1886#:~:text=The%20Diverse%20Mountainous%20Landslide%20Dataset,across%20different%20terrain%20in) The Diverse Mountainous Landslide Dataset (DMLD) - MDPI

<https://www.mdpi.com/2072-4292/16/11/1886>

[\[72\]](https://www.sciencedirect.com/science/article/pii/S2666592124000568#:~:text=Landslide%20detection%20based%20on%20deep,detect%20landslides%20in%20Linzhi%20City) Landslide detection based on deep learning and remote sensing ...

<https://www.sciencedirect.com/science/article/pii/S2666592124000568>

[\[73\]](https://www.reddit.com/r/remotesensing/comments/1k4wuf5/rasterio_vs_rioxarray/#:~:text=%E2%80%A2%20%207mo%20ago) [\[74\]](https://www.reddit.com/r/remotesensing/comments/1k4wuf5/rasterio_vs_rioxarray/#:~:text=%E2%80%A2%20%206mo%20ago) [\[75\]](https://www.reddit.com/r/remotesensing/comments/1k4wuf5/rasterio_vs_rioxarray/#:~:text=This,to) Rasterio vs Rioxarray : r/remotesensing

<https://www.reddit.com/r/remotesensing/comments/1k4wuf5/rasterio_vs_rioxarray/>

[\[76\]](https://pytorch.org/blog/geospatial-deep-learning-with-torchgeo/#:~:text=Geospatial%20deep%20learning%20with%20TorchGeo,models%20specific%20to%20geospatial%20data) Geospatial deep learning with TorchGeo - PyTorch

<https://pytorch.org/blog/geospatial-deep-learning-with-torchgeo/>

[\[81\]](https://github.com/hwchase17/langchain/commits#:~:text=Commits%20%C2%B7%20langchain,%C2%B7%20fix%28infra%29%3A) Commits · langchain-ai/langchain - GitHub

<https://github.com/hwchase17/langchain/commits>

[\[82\]](https://github.com/run-llama/llama_index/releases#:~:text=Release%20Notes.%20%5B2025,core%20%5B0.14.0%5D.%20breaking%3A%20bumped) Releases · run-llama/llama_index - GitHub

<https://github.com/run-llama/llama_index/releases>

[\[83\]](https://github.com/DIUx-xView/xView2_first_place#:~:text=DIUx,idea%20will%20be%20improved%20further) DIUx-xView/xView2_first_place: 1st place solution for "xView2 - GitHub

<https://github.com/DIUx-xView/xView2_first_place>

[\[85\]](https://github.com/SpaceNetChallenge/SpaceNet8#:~:text=Algorithmic%20baseline%20for%20SpaceNet%208,%C2%B7%20Finetune%20the) Algorithmic baseline for SpaceNet 8 Challenge - GitHub

<https://github.com/SpaceNetChallenge/SpaceNet8>

[\[86\]](https://nocomplexity.com/documents/fossml/generatedfiles/rastervision.html#:~:text=Complexity%20nocomplexity,metric%21%20Stars%20count%20are) Raster Vision - Free and Open Machine Learning - NO Complexity

<https://nocomplexity.com/documents/fossml/generatedfiles/rastervision.html>

[\[87\]](https://pystac-client.readthedocs.io/en/stable/usage.html#:~:text=The%20following%20code%20creates%20an,Microsoft%20Planetary%20Computer%20root%20catalog) [\[88\]](https://pystac-client.readthedocs.io/en/stable/usage.html#:~:text=,Microsoft%20Planetary%20Computer%20STAC%20API) Usage - pystac-client 0.8.5 documentation

<https://pystac-client.readthedocs.io/en/stable/usage.html>
