# Confronto tra vibe coding e programmazione tradizionale (2023–2025)

## Indice

- [Abstract](#abstract)
- [Metodologia](#metodologia)

## Abstract

Il vibe coding – ossia la programmazione guidata interamente dall’AI – si è diffuso tra il 2023 e il 2025 grazie a strumenti come GitHub Copilot, Cursor, Sourcegraph Cody, Tabnine, Codeium e assistenti AI integrati negli IDE. 

In questo primo articolo voglio confrontare il vibe coding con l’approccio tradizionale (“old coding”) sulla base di studi recenti, casi aziendali ed esperienze degli utenti. I dati mostrano un quadro sfumato: in **contesti controllati aziendali**, l’AI pair programming può accelerare lo sviluppo (+26% task completati in media) soprattutto per *sviluppatori junior*, senza apparenti cali immediati di qualità.
Questo penso sia quel dato che tutti raccontano e che anche tu che stai leggendo questo articolo sai.

Tuttavia, ciò che probabilmente non conosci è che, in progetti complessi, sviluppatori esperti hanno riscontrato rallentamenti inattesi (si parla di addirittura +19% del tempo usando l'AI) nonostante la percezione di maggiore velocità. 

Sul fronte qualitativo, il codice generato dall’AI funziona ma tende ad avere mantenibilità inferiore, a causa di *duplicazioni*, *code churn
raddoppiato* e **potenziali falle di sicurezza** se usato senza supervisione. Per ovviare a questo problema iniziano a nascere tool, come Code Mender di cui ho già parlato in un precedente podcast.

Culturalmente, gli assistenti AI aumentano la soddisfazione dei developer riducendo i compiti ripetitivi, ma emergono preoccupazioni: i programmatori meno esperti rischiano di non sviluppare quella comprensione profonda del codice che caratterizza uno sviluppatore degno di essere chiamato tale, e una fiducia cieca nell’AI (“accetto tutto e via”) può portare a **perdita del controllo** e ad un **codice opaco**. In sintesi, il vibe coding offre velocità e accessibilità senza precedenti, ma richiede **forte intervento** umano in fase di *architettura, revisione e test* per **garantire qualità, sicurezza e sostenibilità nel tempo**.

## Metodologia
Per questa analisi sono state esaminate fonti pubblicate tra il 2023 e il 2025 in più lingue, privilegiando evidenze quantitative e riproducibili. In particolare: 

- 1) studi sperimentali peer-reviewed e white paper tecnici con metodologia chiara (RCT, benchmark). Questi sono stati considerati evidenza di grado A (alta solidità, basso rischio di bias); 

- 2) case study industriali con metriche reali su team (grado B se condotti internamente con  possibile  bias  di  contesto);

- 3) testimonianze  dirette  di  sviluppatori  (blog,  video,  forum)  che includono esperimenti concreti o codice verificabile (grado C in quanto aneddotiche, rischio bias medio/alto). Abbiamo estratto per ogni fonte dettagli su:  contesto e tool usati, tipo di attività svolta (es. nuovo sviluppo, refactoring, bugfix, testing), metriche oggettive (tempo impiegato, percentuale di bug o vulnerabilità, copertura di test, performance) e metriche soggettive (soddisfazione, carico cognitivo, apprendimento  percepito).

Durante  la  sintesi,  le  evidenze  sono  state  incrociate  per  evidenziare convergenze o discrepanze. Ad esempio, si confrontano i risultati di un ampio RCT aziendale (4.800 sviluppatori in Microsoft/Accenture, evidenza A) con quelli di un RCT su sviluppatori OSS esperti (16 maintainer open-source, evidenza A), nonché con case study come l’adozione interna di Copilot in un’azienda (ZoomInfo, 400 ingegneri, evidenza B).

Sono state incluse esperienze individuali (es.prototipo full-stack sviluppato interamente con AI) come evidenza  C per illuminare aspetti
pratici e culturali difficilmente rilevabili dai soli numeri. Tutte le fonti sono citate in formato Harvard tra parentesi quadre (es.) con link ai riferimenti originali, e un elenco completo è fornito in fondo.

![Immagine](Assets/image_001.png)
