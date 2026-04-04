# Il tempo si ferma al bordo

Voglio fare un esperimento, sia a livello di argomento, sia a livello di forma, sia a livello grafico. Premetto che sto leggendo ["La teoria del tutto"](https://www.mondadoristore.it/la-teoria-del-tutto-origine-e-destino-dell-universo-libro-stephen-hawking/p/9788817079761) di Stephen Hawking e ammetto che questo concetto mi ha fatto riflettere parecchio perché facevo fatica a immaginarmelo. Ragion per cui ho deciso di costruire un piccolo artefatto e ho pensato che potesse essere d'aiuto a tutti per comprendere questi concetti. Buona lettura!

## Abstract

<!--Quando si parla di buchi neri, c'è una cosa che ho sempre fatto fatica a immaginare, ovvero il fatto che il tempo smetta di scorrere allo stesso modo per tutti gli osservatori. Questo deriva direttamente dalla teoria della relatività di Einstein. Ho visto e ascoltato vari esperimenti negli ultimi anni per comprendere al meglio questo concetto.-->

Prima di entrare nel merito, vale la pena fermarsi un momento sul perché questo scenario è così utile per capire i buchi neri. Non è un caso che Rovelli, Hawking e molti altri fisici ricorrano a *"esperimenti mentali"* con orologi e segnali: il punto è far vedere qualcosa che le equazioni dicono ma che l'intuizione quotidiana si rifiuta di accettare. **Il tempo non è uguale per tutti.** E una stella che collassa è il modo più spettacolare di rendersene conto.

## Da dove nasce questa storia

Einstein, già nel 1915 con la relatività generale, mostrava che la gravità non è una forza nel senso tradizionale: è la curvatura dello spaziotempo generata dalla massa. Più massa in poco spazio, più curvatura. E tra le cose che si curvano c'è anche il tempo.

Per capire meglio, spesso viene fatto questo esempio (che ho trovato nel libro di Hawking): gli orologi in fondo a una torre battono leggermente più lento di quelli in cima.

> Nel 1959, Pound e Rebka misurarono la dilatazione gravitazionale del tempo su una torre di 22 metri ad Harvard. La differenza fu di circa 2,5 parti su $10^{15}$: minuscola, ma perfettamente in linea con quanto predetto da Einstein.

Nella vita ordinaria, questa differenza è irrilevante. Vicino a un buco nero, invece, il quadro cambia radicalmente.

## Lo scenario: un astronauta, una stella, un orologio

Immagina una stella massiccia che sta collassando su sé stessa. Un astronauta abbastanza temerario si trova sulla superficie e invia un segnale ogni secondo verso la sua astronave in orbita.

Fino a un certo momento tutto funziona come previsto: i segnali arrivano, magari con un piccolo ritardo, ma arrivano. Poi la stella supera la soglia critica associata al proprio raggio di Schwarzschild. Da quel punto in poi, la luce non riesce più a sfuggire verso l'esterno. Tutto regolare fino alle `10:59:59`. A quella distanza, i segnali arrivano in orbita con qualche ritardo o distorsione, ma arrivano.

Poi, alle `11:00:00` sul suo orologio, la stella supera una soglia critica. Da quel momento, il campo gravitazionale è talmente intenso che nemmeno la luce riesce più a sfuggire verso l’esterno e raggiungere la navicella in orbita. Il segnale delle `11:00:00` viene emesso. L'astronauta lo invia, il suo orologio batte normalmente, ma non arriverà mai.

<!-- 
## La simulazione

>> 🎮 **Esperimento interattivo.** Qui sotto puoi seguire il collasso di una stella, osservare il redshift gravitazionale e vedere cosa succede ai segnali emessi dall'astronauta man mano che ci si avvicina all'orizzonte degli eventi. Se preferisci aprirla separatamente, trovi anche la [pagina dedicata](Assets/simulations/buchi-neri-dilatazione-tempo.html).-->

<iframe
  src="Assets/simulations/buchi-neri-dilatazione-tempo-embed.html"
  title="Simulazione della dilatazione gravitazionale del tempo vicino a un buco nero"
  loading="lazy"
  style="width: 100%; min-height: 640px; border: 1px solid #e5e7eb; border-radius: 18px; margin: 16px 0;"
></iframe>

## Cosa vede chi resta in orbita

Fin qui abbiamo visto quello che succede dal punto di vista dell'astronauta. Ma adesso spostiamo il punto di vista sull'astronave. I compagni in orbita notano qualcosa di strano già prima delle `11:00:00`: gli intervalli tra un segnale e il successivo si allungano. Non di colpo, ma progressivamente. Il segnale delle `10:59:58` arriva. Quello delle `10:59:59` arriva un po' dopo. Quello delle `11:00:00` non arriverà mai.

Il risultato è che l'astronauta non viene visto "cadere dentro" il buco nero nel senso intuitivo del termine. Per loro, è come guardare un film proiettato sempre più lentamente, fino a quando l'immagine si congela. L'astronauta non scompare in un lampo: la sua immagine rimane lì, immobile all'istante del collasso, sempre più fioca, sempre più rossa. Non perché lui stia diventando rosso, ma perché la luce che porta la sua immagine perde energia scalando il campo gravitazionale.

> Questo è il **redshift gravitazionale**: la luce che risale il pozzo gravitazionale perde energia, e perdere energia per la luce significa allungarsi verso le lunghezze d'onda più basse, verso il rosso appunto. Vale per qualsiasi campo gravitazionale, anche quello terrestre, solo che è impercettibile a scale umane.

## Il raggio di Schwarzschild

Il concetto centrale dietro tutto questo ha un nome preciso: **il raggio di Schwarzschild**. Karl Schwarzschild lo calcolò nel 1916, poche settimane dopo la pubblicazione della relatività generale di Einstein, mentre era al fronte durante la Prima Guerra Mondiale. È il raggio entro cui la velocità di fuga supera quella della luce: nessun segnale, nessuna particella, nessuna informazione può uscire da quella regione. La superficie che delimita questo confine si chiama orizzonte degli eventi.

Il confine che conta in questo ragionamento è l'orizzonte degli eventi, legato al raggio di Schwarzschild:

$$
r_s = \frac{2GM}{c^2}
$$

dove:

- $G$ è la costante gravitazionale $(6.674 \times 10^{-11} N\cdot m^2/kg^2)$
- $M$ è la massa dell'oggetto $(kg)$
- $c$ è la velocità della luce $(2,998 × 10^8 m/s)$

Se tutta la massa del Sole fosse compressa entro circa 3 km, il Sole diventerebbe un buco nero. Per la Terra, il raggio di Schwarzschild sarebbe di circa 9 millimetri.

Il punto importante è che l'orizzonte degli eventi **non è una parete materiale**. Non c'è un muro da urtare. È un confine geometrico nello spazio-tempo: oltre quella soglia, nessuna traiettoria può più riportare l'informazione verso l'esterno.

Questo è un punto che di solito genera molta confusione e quindi voglio ripeterlo per bene. L'orizzonte degli eventi **non è una barriera fisica**. Non c'è nessun muro, nessuna superficie solida. Un astronauta che cadesse verso un buco nero non sentirebbe nulla di speciale nel momento in cui lo attraversasse (almeno per buchi neri abbastanza grandi da rendere trascurabile la differenza di forze tra testa e piedi). Il fatto è che, una volta oltre quella soglia, non esiste nessuna traiettoria che riporti indietro.

## Due osservatori, due descrizioni corrette

Ed è qui che i nodi vengono al pettine, perché la cosa davvero disturbante non è il buco nero in sé. È che questo esperimento mentale mette in luce qualcosa che vale in generale: il tempo non è quella variabile indipendente su cui si basa la fisica. È una dimensione che si deforma insieme allo spazio sotto l'azione della gravità.

- **Per l'astronauta:** il tempo scorre normalmente e l'attraversamento dell'orizzonte non ha nulla di speciale dal punto di vista locale.
- **Per l'osservatore lontano:** il segnale finale non arriva mai, e l'immagine dell'astronauta resta congelata sempre più vicino al bordo.

Le due descrizioni non si contraddicono: appartengono a due sistemi di riferimento diversi e sono entrambe coerenti con la relatività generale.

## Perché la luce si fa rossa

 L'ultimo tassello è il **redshift**, e merita un paragrafo per sé. Quando si dice che la luce proveniente dalla stella diventa "sempre più rossa e sempre più debole", non è un'immagine poetica (anche se sapete che amo esserlo), è letterale.

La luce è un'onda elettromagnetica caratterizzata da una frequenza. Più alta la frequenza, più energetica la luce e più spostata verso il blu. Più bassa la frequenza, meno energetica e più spostata verso il rosso. Quando un fotone scala un campo gravitazionale intenso, perde energia. Perdere energia, per la luce, significa allungare la propria lunghezza d'onda. Il risultato visibile è uno spostamento verso il rosso dello spettro.

Nel caso della stella in collasso, man mano che ci avviciniamo all'orizzonte degli eventi, ogni fotone emesso deve scalare una buca di potenziale sempre più profonda. L'intervallo tra fotoni successivi si allunga (dilatazione del tempo), e ciascun fotone arriva con meno energia (redshift). La combinazione produce quella dissolvenza rossa che gli osservatori in orbita vedrebbero: la stella che piano piano si spegne, senza mai sparire del tutto, almeno in linea di principio.

> Nel mondo reale, un buco nero stellare non è osservabile in questo modo: il flusso di fotoni decresce esponenzialmente e diventa rapidamente inferiore a qualsiasi soglia di rilevamento. Ma il principio fisico è esatto, e buchi neri supermassicci al centro delle galassie sono stati osservati proprio attraverso gli effetti del redshift gravitazionale sulla luce che li circonda.

## Un ultimo pensiero

Il tempo che scorre diversamente non è una metafora che ho spesso usato nelle mie poesie ma è un fenomeno ben spiegato dalla fisica. E un buco nero non è altro che la dimostrazione più affascinante che la realtà stessa è strutturalmente diversa da come la immaginiamo quando usciamo di casa la mattina.

Mutatis mutandis, tutto quello che succede vicino a un buco nero ci dice qualcosa su dove siamo anche noi: in un campo gravitazionale, a scorrere leggermente più veloci di chi vive in pianura, e leggermente più lenti di chi orbita nello spazio. La differenza è irrilevante nella pratica. Ma il principio è lo stesso.