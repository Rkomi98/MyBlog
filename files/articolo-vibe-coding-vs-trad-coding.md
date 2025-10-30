# Confronto tra vibe coding e programmazione tradizionale (2023–2025)

## Indice

* [Abstract](#abstract)
* [Metodologia](#metodologia)
* [Risultati Tecnici](#risultati-tecnici)

  * [Impatto su produttività e velocità di sviluppo](#impatto-su-produttività-e-velocità-di-sviluppo)
  * [Qualità del codice e mantenibilità](#qualità-del-codice-e-mantenibilità)
  * [Errori e sicurezza](#errori-e-sicurezza)
  * [Performance e scalabilità](#performance-e-scalabilità)
* [Risultati Culturali](#risultati-culturali)
* [Sintesi e raccomandazioni](#sintesi-e-raccomandazioni)
* [Limiti e fonti (con link)](#limiti-e-fonti-con-link)

## Abstract

Il vibe coding – ossia la programmazione guidata interamente dall’AI – si è diffuso tra il 2023 e il 2025 grazie a strumenti come GitHub Copilot, Cursor, Sourcegraph Cody, Tabnine, Codeium e assistenti AI integrati negli IDE.

In questo primo articolo voglio confrontare il vibe coding con l’approccio tradizionale (“old coding”) sulla base di studi recenti, casi aziendali ed esperienze degli utenti. I dati mostrano un quadro sfumato: in **contesti controllati aziendali**, l’AI pair programming può accelerare lo sviluppo ([+26% task completati in media](https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-leaders-need-to-know/)) soprattutto per *sviluppatori junior*, senza apparenti cali immediati di qualità.
Questo penso sia quel dato che tutti raccontano e che anche tu che stai leggendo questo articolo conosci.

Tuttavia, ciò che probabilmente non conosci è che, in progetti complessi, sviluppatori esperti hanno riscontrato rallentamenti inattesi (si parla di addirittura [+19% del tempo usando l'AI](https://www.infoq.com/news/2025/07/ai-productivity/)) nonostante la percezione di maggiore velocità.

Sul fronte qualitativo, il codice generato dall’AI funziona ma tende ad avere mantenibilità inferiore, a causa di *duplicazioni*, *code churn
raddoppiato* e **potenziali falle di sicurezza** [se usato senza supervisione](https://visualstudiomagazine.com/articles/2024/01/25/copilot-research.aspx). Per ovviare a questo problema iniziano a nascere tool, come Code Mender di cui ho già parlato in un precedente podcast.

Culturalmente, gli assistenti AI aumentano la soddisfazione dei developer [riducendo i compiti ripetitivi](https://www.secondtalent.com/resources/github-copilot-statistics/), ma emergono preoccupazioni: i programmatori meno esperti rischiano di non sviluppare quella [comprensione profonda del codice](https://nmn.gl/blog/ai-and-learning) che caratterizza uno sviluppatore degno di essere chiamato tale, e una fiducia cieca nell’AI (“accetto tutto e via”) può portare a **perdita del controllo** e ad un **codice opaco**. In sintesi, il vibe coding offre velocità e accessibilità senza precedenti, ma richiede **forte intervento** umano in fase di *architettura, revisione e test* per **garantire qualità, sicurezza e sostenibilità nel tempo**.

## Metodologia

Per questa analisi sono state esaminate fonti pubblicate tra il 2023 e il 2025 in più lingue, privilegiando evidenze quantitative e riproducibili. In particolare:

1. studi sperimentali peer-reviewed e white paper tecnici con metodologia chiara (RCT, benchmark). Questi sono stati considerati evidenza di grado A (alta solidità, basso rischio di bias);
2. case study industriali con metriche reali su team (grado B se condotti internamente con  possibile  bias  di  contesto);
3. testimonianze  dirette  di  sviluppatori  (blog,  video,  forum)  che includono esperimenti concreti o codice verificabile (grado C in quanto aneddotiche, rischio bias medio/alto). Abbiamo estratto per ogni fonte dettagli su:  contesto e tool usati, tipo di attività svolta (es. nuovo sviluppo, refactoring, bugfix, testing), metriche oggettive (tempo impiegato, percentuale di bug o vulnerabilità, copertura di test, performance) e metriche soggettive (soddisfazione, carico cognitivo, apprendimento  percepito).

Durante  la  sintesi,  le  evidenze  sono  state  incrociate  per  evidenziare convergenze o discrepanze. Ad esempio, si confrontano i risultati di un ampio RCT aziendale (4.800 sviluppatori in Microsoft/Accenture, evidenza A) con quelli di un RCT su sviluppatori OSS esperti (16 maintainer open-source, evidenza A), nonché con case study come l’adozione interna di Copilot in un’azienda (ZoomInfo, 400 ingegneri, evidenza B).

Sono state incluse esperienze individuali (es.prototipo full-stack sviluppato interamente con AI) come evidenza  C per evidenziare aspetti
pratici e culturali difficilmente rilevabili dai soli numeri. Tutte le fonti sono citate tramite link ai riferimenti originali.

## Risultati Tecnici

### Impatto su produttività e velocità di sviluppo

Dai dati emerge che gli assistenti AI possono accelerare lo sviluppo software, ma con distinzioni importanti per **contesto** e **seniority** del programmatore.

* **RCT multi‑azienda (Microsoft, Accenture, altra multinazionale)**: con GitHub Copilot si osserva **+26% di task completati** in media, **+13,5%** di commit settimanali e **+38%** nella frequenza di compilazione. Lo studio **non rileva impatti negativi sulla qualità** (bug, review, build) → la velocità extra **non** avviene a scapito del funzionamento ([IT Revolution – sintesi dello studio](https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-leaders-need-to-know/)).
* **Trial controllato Accenture**: **+8,7%** di pull request per sviluppatore, **+15%** di *merge rate* e **+84%** di build riuscite al primo colpo (minor attrito iniziale) ([riepilogo metriche](https://www.secondtalent.com/resources/github-copilot-statistics/); vedi anche [GitHub × Accenture](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-in-the-enterprise-with-accenture/)).
* **Dove accelera di più**: compiti ripetitivi/boilerplate (CRUD, mapping, test scaffolding, integrazioni standard) e onboarding su codebase nuove; **meno effetto** su logiche di business complesse/inedite (necessaria guida e verifica umana) ([GitHub × Accenture](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-in-the-enterprise-with-accenture/)).
* **Junior vs Senior**: benefici **più marcati per profili junior** (adozione e accettazione suggerimenti maggiori); per i senior l’incremento è più contenuto e dipende dalla bontà dell’integrazione nel flusso di lavoro ([MIT working paper – RCT](https://economics.mit.edu/sites/default/files/inline-files/draft_copilot_experiments.pdf)).

> **Nota di contesto (OSS esperti)**: in un RCT indipendente su maintainer open‑source, l’uso di tool AI (Cursor/Claude) ha prodotto **uno **slowdown** medio del +19%** su 246 task reali, **nonostante** la percezione di *speed‑up* (~–20%). Tempo extra in prompting, revisione e adattamento all’architettura ha annullato i guadagni ([METR – blog](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/); [arXiv](https://arxiv.org/abs/2507.09089); [InfoQ](https://www.infoq.com/news/2025/07/ai-productivity/)).

**Tabella riassuntiva (produttività/velocità)**

| Metrica                     | Variazione con AI    | Contesto/Fonte                                                                                                                                                |
| --------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Task completati             | **+26%**             | [IT Revolution](https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-leaders-need-to-know/) |
| Commit settimanali          | **+13,5%**           | [IT Revolution](https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-leaders-need-to-know/) |
| Frequenza di compilazione   | **+38%**             | [IT Revolution](https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-leaders-need-to-know/) |
| PR per sviluppatore         | **+8,7%**            | [SecondTalent – Accenture](https://www.secondtalent.com/resources/github-copilot-statistics/)                                                                 |
| Merge rate                  | **+15%**             | [SecondTalent – Accenture](https://www.secondtalent.com/resources/github-copilot-statistics/)                                                                 |
| Build al primo tentativo    | **+84%**             | [SecondTalent – Accenture](https://www.secondtalent.com/resources/github-copilot-statistics/)                                                                 |
| Tempo su task OSS complessi | **+19%** (più lento) | [METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)                                                                              |

### Qualità del codice e mantenibilità

Se parliamo di qualità del codice prodotto, si apre un discorso un po' controverso: la funzionalità immediata del codice generato dall’AI è spesso buona, ma emergono problemi di **mantenibilità nel medio termine** senza un intervento disciplinato del programmatore. In termini di correttezza funzionale out-of-the-box, diversi studi indicano che il codice con AI può essere altrettanto valido di quello scritto a mano. Di seguito alcuni esempi emersi dalla ricerca:

* **Trend 2024–2025**: analisi longitudinali mostrano **aumento del *code churn*** (linee modificate/rimosse entro 2 settimane) **fino a ~2× vs 2021** e maggior peso di **“added/copied”** rispetto a **“updated/deleted/moved”** → più duplicazioni, minore riuso, mantenibilità a rischio ([GitClear report](https://www.gitclear.com/coding_on_copilot_data_shows_ais_downward_pressure_on_code_quality); [Visual Studio Magazine](https://visualstudiomagazine.com/articles/2024/01/25/copilot-research.aspx)).
* **Esperienze di team**: in **ZoomInfo** (400+ dev) l’adozione di Copilot porta **~20% risparmio tempo percepito**, con **acceptance ~33% (suggestions) / ~20% (LoC)**; tra i limiti: **logica di dominio assente** e **qualità variabile** → necessità di **review e refactoring** sistematici ([Bakal et al., 2025—arXiv](https://arxiv.org/abs/2501.13282)).
* **Lettura operativa**: il vibe coding **produce più codice più in fretta**, ma senza **guardrail** (DRY, linters, design guide) aumenta l’entropia. Misurare **churn/duplicazione**, inserire **slot di refactoring** e **code‑owner** per coerenza.

**Tabella riassuntiva (qualità/mantenibilità)**

| Indicatore              | Evidenza               | Impatto atteso                                     | Fonte                                                                                                   |
| ----------------------- | ---------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| *Code churn*            | Fino a **~2×** vs 2021 | Più rimaneggiamenti a breve; costi di manutenzione | [GitClear](https://www.gitclear.com/coding_on_copilot_data_shows_ais_downward_pressure_on_code_quality) |
| Duplicazioni            | **In aumento**         | Violazioni DRY, rischio bug speculari              | [GitClear](https://www.gitclear.com/coding_on_copilot_data_shows_ais_downward_pressure_on_code_quality) |
| Acceptance suggerimenti | **~33%** (suggestions) | Velocità ↑ ma richiede review                      | [ZoomInfo](https://arxiv.org/abs/2501.13282)                                                            |
| Acceptance LoC          | **~20%** (linee)       | Output parziale/boilerplate                        | [ZoomInfo](https://arxiv.org/abs/2501.13282)                                                            |
| Qualità percepita       | Variabile              | Richiede standard e refactor ciclici               | [ZoomInfo](https://arxiv.org/abs/2501.13282)                                                            |

### Errori e sicurezza

* **Vulnerabilità note**: su 89 scenari CWE, **~39–50%** degli snippet generati risultano **vulnerabili** a seconda del linguaggio ([Pearce et al., 2021/22](https://arxiv.org/abs/2108.09293)).
* **Stato 2025**: **45%** dei task di generazione presentano almeno **una falla**; performance **piatte** tra modelli nuovi/vecchi → i modelli **non diventano automaticamente più sicuri** ([Veracode 2025—PDF](https://www.veracode.com/wp-content/uploads/2025_GenAI_Code_Security_Report_Final.pdf)).
* **Effetto iterazioni**: dopo **5 iterazioni** di “migliorami il codice” senza supervisione, le **vulnerabilità critiche** crescono di **~37,6%** ([Shukla et al., 2025](https://arxiv.org/abs/2506.11022)).
* **Mitigazioni pratiche**: pipeline **AI → SAST/DAST → review umana**; checklist **OWASP**; policy su **segreti/IP** nei prompt; **gates** extra per componenti *security‑critical*.

**Tabella riassuntiva (sicurezza)**

| Tema                   | Dato chiave                       | Cosa fare subito           | Fonte                                                                                                  |
| ---------------------- | --------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------ |
| Tassi di vulnerabilità | **~39–50%** snippet vulnerabili   | Mai *commit* senza scanner | [Pearce et al.](https://arxiv.org/abs/2108.09293)                                                      |
| Stato dell’arte 2025   | **45%** task con almeno 1 falla   | SAST/DAST in CI/CD         | [Veracode 2025](https://www.veracode.com/wp-content/uploads/2025_GenAI_Code_Security_Report_Final.pdf) |
| Iterazioni AI          | **+37,6%** vulnerabilità critiche | Verifica ad ogni iter      | [Shukla 2025](https://arxiv.org/abs/2506.11022)                                                        |
| Secret handling        | Rischio *leak* nei prompt         | Segreti fuori dai prompt   | Best practice OWASP                                                                                    |

### Performance e scalabilità

* **Pattern ricorrenti** (report tecnici e *field notes*): prototipi AI‑only spesso **duplicano logiche**, **ignorano colli di bottiglia** (query non indicizzate, I/O sincrono), mancano di **scelte architetturali** (caching, asincronia, code/queue) → **fragilità sotto carico**.
* **Approccio consigliato**: usare l’AI per **scaffold/boilerplate**, poi **profilare presto** con dati realistici, fissare **SLO/SLI**, pianificare **refactoring di performance** a ogni sprint; ottimizzazioni guidate da **senior/architetti**.

**Tabella riassuntiva (performance/scalabilità)**

| Rischio tipico              | Effetto in prod            | Contromisura                          |
| --------------------------- | -------------------------- | ------------------------------------- |
| Query non indicizzate / N+1 | Latenze eccessive, costi ↑ | Profiling SQL, indici, caching        |
| Elaborazioni in memoria     | OOM / tempi lunghi         | Batch/stream, strutture dati adeguate |
| I/O sincrono bloccante      | Throughput basso           | Async I/O, code, *backpressure*       |
| Duplicazioni logiche        | Bug speculari, debito ↑    | DRY, refactor, modulazione servizi    |

## Risultati Culturali

* **Soddisfazione e DevEx**: studi GitHub×Accenture riportano **sentiment alto (90–95%)** e minore sforzo mentale con Copilot ([GitHub blog](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-in-the-enterprise-with-accenture/)).
* **Adozione e fiducia**: la **Stack Overflow Dev Survey 2024** mostra uso diffuso ma **fiducia limitata** nell’output “as‑is” → l’intervento umano resta centrale ([SO Survey 2024—AI](https://survey.stackoverflow.co/2024/ai)).
* **Percezione vs dati**: nel trial **METR** gli esperti **stimano speed‑up**, ma i dati mostrano **+19% tempo** con AI su codebase complesse; l’AI **fa percepire** produttività, ma prompting/review **consumano tempo** ([METR blog](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/); [InfoQ](https://www.infoq.com/news/2025/07/ai-productivity/)).
* **Junior vs senior; enterprise vs startup**: benefici **più marcati per junior** e task ripetitivi; in **enterprise** l’AI rende di più se **integrata nei processi** (policy, training, telemetria), in **startup** abilita **prototipazione lampo** ma va contenuto il *tech debt* ([MIT/Accenture—sintesi InfoQ](https://www.infoq.com/news/2024/09/copilot-developer-productivity/)).

## Sintesi e raccomandazioni

1. **Usa l’AI dove eccelle**: boilerplate, CRUD, mapping, test scaffolding, doc di base. Metti **guardrail** (linters, formatter, conventional commits).
2. **Tienila fuori dove sbaglia**: **core di sicurezza**, moduli **performance‑sensitive**, logiche di **dominio** complesse → design tradizionale, AI come supporto.
3. **Processi “trust but verify”**: **SAST/DAST** obbligatori in CI, **code review umana** su ogni contributo AI, policy su **segreti/IP** nei prompt.
4. **Architettura prima del *****vibe***: definisci **moduli/interfacce/pattern**; usa l’AI per riempire i “blocchi”, non per inventare l’architettura.
5. **Misura l’impatto**: piloti **A/B** con metriche dure (lead time, merge rate, churn, difetti post‑release) e morbide (soddisfazione). Framework: [Guida GitHub](https://resources.github.com/learn/pathways/copilot/essentials/measuring-the-impact-of-github-copilot/).
6. **Crescita delle persone**: per i junior alterna **kata senza AI** e sessioni **“spiegami perché”**, per i senior **direzione tecnica** (orchestrazione, prompt patterns, design review).
7. **Iterazioni sicure**: evita loop “rigenera‑rigenera”; **ogni iterazione AI ⇒ verifica** (occhio alla **degradazione di sicurezza**: [Shukla 2025](https://arxiv.org/abs/2506.11022)).

## Limiti e fonti (con link)

> Priorità: **A** studi/white paper; **B** case study; **C** esperienze replicabili.

* **Produttività (RCT multi‑azienda)** — *A*

  * MIT/Microsoft/Accenture: **+26% task** (4.8k dev) — [IT Revolution](https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-leaders-need-to-know/) · [InfoQ](https://www.infoq.com/news/2024/09/copilot-developer-productivity/)
* **Slowdown su maintainer OSS esperti** — *A*

  * METR **+19% tempo** con AI — [Blog](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) · [arXiv](https://arxiv.org/abs/2507.09089) · [InfoWorld](https://www.infoworld.com/article/4020931/ai-coding-tools-can-slow-down-seasoned-developers-by-19.html)
* **Adozione enterprise / soddisfazione** — *B*

  * GitHub×Accenture — [GitHub blog](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-in-the-enterprise-with-accenture/)
  * ZoomInfo (400+ dev) — [arXiv](https://arxiv.org/abs/2501.13282)
* **Qualità e mantenibilità (churn/duplicazioni)** — *B*

  * GitClear — [Report](https://www.gitclear.com/coding_on_copilot_data_shows_ais_downward_pressure_on_code_quality) · [Visual Studio Magazine](https://visualstudiomagazine.com/articles/2024/01/25/copilot-research.aspx)
* **Sicurezza** — *A*

  * Copilot & CWE — [Pearce et al.](https://arxiv.org/abs/2108.09293)
  * **Veracode 2025** — [PDF](https://www.veracode.com/wp-content/uploads/2025_GenAI_Code_Security_Report_Final.pdf)
  * Degradazione iterativa — [Shukla et al.](https://arxiv.org/abs/2506.11022)
* **Cultura e apprendimento** — *B/C*

  * Stack Overflow Dev Survey 2024 — [AI](https://survey.stackoverflow.co/2024/ai)
  * Comprensione profonda (junior) — [Namanyay Goel](https://nmn.gl/blog/ai-and-learning)

> **Limiti**: fenomeno recente; metriche eterogenee tra studi; parte dei dati enterprise proviene da vendor; evidenze su performance/scalabilità spesso **C** (aneddotiche) da confermare con benchmark indipendenti.
