# Confronto tra vibe coding e programmazione tradizionale (2023–2025)

## Indice

- [Abstract](#abstract)
- [Metodologia](#metodologia)

## Abstract

Il vibe coding – ossia la programmazione guidata interamente dall’AI – si è diffuso tra il 2023 e il 2025 grazie a strumenti come GitHub Copilot, Cursor, Sourcegraph Cody, Tabnine, Codeium e assistenti AI integrati negli IDE. 

In questo primo articolo voglio confrontare il vibe coding con l’approccio tradizionale (“old coding”) sulla base di studi recenti, casi aziendali ed esperienze degli utenti. I dati mostrano un quadro sfumato: in **contesti controllati aziendali**, l’AI pair programming può accelerare lo sviluppo ([+26% task completati in media](https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-leaders-need-to-know/)) soprattutto per *sviluppatori junior*, senza apparenti cali immediati di qualità.
Questo penso sia quel dato che tutti raccontano e che anche tu che stai leggendo questo articolo conosci.

Tuttavia, ciò che probabilmente non conosci è che, in progetti complessi, sviluppatori esperti hanno riscontrato rallentamenti inattesi (si parla di addirittura [+19% del tempo usando l'AI](https://www.infoq.com/news/2025/07/ai-productivity/#:~:text=The%20central%20result%20was%20both,40)) nonostante la percezione di maggiore velocità. 

Sul fronte qualitativo, il codice generato dall’AI funziona ma tende ad avere mantenibilità inferiore, a causa di *duplicazioni*, *code churn
raddoppiato* e **potenziali falle di sicurezza** [se usato senza supervisione](https://visualstudiomagazine.com/articles/2024/01/25/copilot-research.aspx). Per ovviare a questo problema iniziano a nascere tool, come Code Mender di cui ho già parlato in un precedente podcast.

Culturalmente, gli assistenti AI aumentano la soddisfazione dei developer [riducendo i compiti ripetitivi](https://www.secondtalent.com/resources/github-copilot-statistics/#:~:text=Developer%20satisfaction%20metrics%20provide%20additional,searching%20for%20information%20or%20examples), ma emergono preoccupazioni: i programmatori meno esperti rischiano di non sviluppare quella [comprensione profonda del codice](https://nmn.gl/blog/ai-and-learning) che caratterizza uno sviluppatore degno di essere chiamato tale, e una fiducia cieca nell’AI (“accetto tutto e via”) può portare a **perdita del controllo** e ad un **codice opaco**. In sintesi, il vibe coding offre velocità e accessibilità senza precedenti, ma richiede **forte intervento** umano in fase di *architettura, revisione e test* per **garantire qualità, sicurezza e sostenibilità nel tempo**.

![Immagine](Assets/image_001.png)

## Metodologia
Per questa analisi sono state esaminate fonti pubblicate tra il 2023 e il 2025 in più lingue, privilegiando evidenze quantitative e riproducibili. In particolare: 

- 1) studi sperimentali peer-reviewed e white paper tecnici con metodologia chiara (RCT, benchmark). Questi sono stati considerati evidenza di grado A (alta solidità, basso rischio di bias); 

- 2) case study industriali con metriche reali su team (grado B se condotti internamente con  possibile  bias  di  contesto);

- 3) testimonianze  dirette  di  sviluppatori  (blog,  video,  forum)  che includono esperimenti concreti o codice verificabile (grado C in quanto aneddotiche, rischio bias medio/alto). Abbiamo estratto per ogni fonte dettagli su:  contesto e tool usati, tipo di attività svolta (es. nuovo sviluppo, refactoring, bugfix, testing), metriche oggettive (tempo impiegato, percentuale di bug o vulnerabilità, copertura di test, performance) e metriche soggettive (soddisfazione, carico cognitivo, apprendimento  percepito).

Durante  la  sintesi,  le  evidenze  sono  state  incrociate  per  evidenziare convergenze o discrepanze. Ad esempio, si confrontano i risultati di un ampio RCT aziendale (4.800 sviluppatori in Microsoft/Accenture, evidenza A) con quelli di un RCT su sviluppatori OSS esperti (16 maintainer open-source, evidenza A), nonché con case study come l’adozione interna di Copilot in un’azienda (ZoomInfo, 400 ingegneri, evidenza B).

Sono state incluse esperienze individuali (es.prototipo full-stack sviluppato interamente con AI) come evidenza  C per illuminare aspetti
pratici e culturali difficilmente rilevabili dai soli numeri. Tutte le fonti sono citate tramite link ai riferimenti originali.

## Risultati Tecnici
### Impatto su produttività e velocità di sviluppo
Dai dati emerge che gli assistenti AI  possono accelerare lo sviluppo software, ma con importanti distinzioni per contesto ed esperienza del programmatore. Un ampio studio sperimentale (3 trial RCT in
Microsoft, Accenture e un’altra multinazionale) ha rilevato un +26% di task completati in media dai developer  con  accesso  a  GitHub  Copilot (non sto a rilinkare l'articolo).  In  pratica,  gli  sviluppatori  con  AI  chiudono  ~26%  di funzionalità/bug in più rispetto al gruppo tradizionale, con anche un aumento del 13,5% nel numero di
commit  settimanali  e  del  [38%  nella  frequenza  di  compilazione](https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-leaders-need-to-know/#:~:text=Code%20Volume%20and%20Iteration%20Speed) (iterano  più  velocemente).

Importante, lo studio non ha riscontrato peggioramenti di qualità del codice o maggiori bug nel gruppo con AI. Questo si traduce così: “nessun impatto negativo osservato sulla qualità”.

Tutto questo ci suggerisce che la velocità extra non avviene a scapito del funzionamento corretto (evidenza A, bias basso). Un altro indicatore positivo viene da un trial controllato in Accenture: con Copilot si è osservato +8,7% di pull request per sviluppatore e +15% di merge rate (più PR accettate), unitamente a un [+84% di build riuscite al primo colpo](https://www.secondtalent.com/resources/github-copilot-statistics/#:~:text=Accenture%E2%80%99s%20randomized%20controlled%20trial%20with,in%20pull%20request%20merge%20rates).
