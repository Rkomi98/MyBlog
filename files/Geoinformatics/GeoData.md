# Che dati registrano i satelliti?

<details class="post-warning">
<summary><strong>Articolo in revisione</strong> (clicca per aprire)</summary>

Questo articolo è ancora in lavorazione e sta subendo una revisione completa. Alcune sezioni potrebbero essere incomplete o cambiare significativamente nelle prossime versioni.

</details>

## Introduzione

Negli ultimi decenni i satelliti sono diventati una delle infrastrutture più strategiche per comprendere, monitorare e gestire il nostro pianeta. Ogni giorno, centinaia di missioni in orbita raccolgono una quantità impressionante di informazioni: immagini ad altissima risoluzione, dati atmosferici, misurazioni sulle superfici terrestri e marine, segnali di navigazione, profili verticali dell’atmosfera, variazioni del campo gravitazionale e magnetico. Non si tratta più soltanto di “foto dallo spazio”, ma di un ecosistema complesso di tecnologie complementari che, insieme, costruiscono la più completa rappresentazione operativa della Terra mai ottenuta nella storia dell’umanità.

In questo articolo analizzeremo tutte le principali fonti di dati satellitari, ordinandole dal più noto al meno conosciuto. Per ogni categoria vedremo cosa misura, a cosa serve, quali applicazioni reali abilita, quali sono le missioni più rappresentative e infine come funziona il sensore che la rende possibile. L’obiettivo è offrire una panoramica chiara ma approfondita, utile sia ai professionisti del settore che a chi desidera comprendere meglio le tecnologie che stanno rivoluzionando il modo in cui osserviamo la Terra.

In questo rapporto analizziamo in dettaglio diciannove categorie distinte di strumentazione satellitare. Per ciascuna, vedremo nel dettaglio il principio fisico di funzionamento, supportato dal formalismo matematico che governa l'interazione tra la radiazione e la materia, ed esamineremo le applicazioni operative che trasformano il dato grezzo in informazione geofisica critica. 

In quest'analisi parleremo dei sensori passivi che misurano la radiazione solare riflessa o l'emissione termica terrestre, dei sensori attivi che illuminano la superficie con impulsi propri, come anche dei sensori di opportunità che sfruttano segnali esistenti per inferire proprietà ambientali.

***

## 1. GNSS – Sistemi Globali di Navigazione Satellitare
I dati GNSS sono nati in ambito bellico, ma si sono rivelati fondamentali in molti campi quoditiani. Consentono posizionamento e navigazione autonoma su scala globale e forniscono un riferimento temporale standard. 

I sistemi GNSS (come GPS, Galileo, GLONASS, BeiDou) trasmettono segnali a radiofrequenza contenenti informazioni orbitale e temporale dagli orologi atomici a bordo. Misurando il tempo impiegato dal segnale a raggiungere un ricevitore a Terra, si calcola la distanza e quindi la posizione dell’utente tramite trilaterazione con almeno 4 satelliti visibili. GNSS fornisce quindi misure di posizionamento (latitudine, longitudine, quota) e tempo assoluto estremamente precise.

Sono usati in **geodesia** (reti di stazioni GNSS monitorano il movimento tettonico e definiscono i riferimenti globali), in **agricoltura di precisione**, **mappatura** e **GIS**, **trasporti** terrestri, aerei e navali, e sincronizzazione di reti elettriche e telecomunicazioni. Ad esempio, l’uso combinato dei vari sistemi GNSS consente oggi ricevitori multi-costellazione con copertura globale e maggiore affidabilità.

### 1.1 Radio occultazione GNSS (GNSS-RO): sondaggio atmosferico di precisione

La Radio Occultazione GNSS (GNSS-RO) rappresenta una delle tecniche di telerilevamento più eleganti e robuste, trasformando i segnali di navigazione, originariamente concepiti per il posizionamento, in strumenti di alta precisione per la meteorologia e la climatologia.

#### Principio fisico e formulazione matematica

Un ricevitore GNSS capta i segnali codificati trasmessi dai satelliti, che includono il tempo di trasmissione. 

Dal confronto con il tempo locale (dopo sincronizzazione) si ottiene la distanza satellitare (pseudo-range). Intersecando le sfere di distanza di 4 o più satelliti si risolve la posizione tridimensionale e la differenza di tempo del ricevitore. Il principio fisico è la misura del tempo di volo del segnale ($t$) e la relazione 
$$d = c \cdot t,$$ 
dove $c$ è la velocità della luce. 

**Correzioni relativistiche** e **atmosferiche** (ionosfera e troposfera) vanno applicate per ottenere accuratezze al livello del metro o inferiori. 

Sistemi differenziali e tecniche come **RTK (Real-Time Kinematic)** consentono di raggiungere precisione al centimetro correggendo gli errori residui tramite stazioni di riferimento. In sintesi, GNSS misura con precisione posizione e tempo su scala globale, costituendo un’infrastruttura invisibile ma cruciale per la moderna società.

> Ti avverto, ora mi tolgo il cappello da divulgatore e indosso quello da matematico :)

Il parametro fondamentale misurato è il ritardo di fase in eccesso, da cui si deriva l'angolo di curvatura ($\alpha$) in funzione del parametro d'impatto ($a$). In un'atmosfera a simmetria sferica locale, la relazione tra l'angolo di curvatura e l'indice di rifrazione $n(r)$ è governata dalla legge di Snell generalizzata e può essere invertita tramite la trasformata di Abel inversa <sup>3</sup>:

$$n(r) = \exp \left( \frac{1}{\pi} \int_x^\infty \frac{\alpha(x)}{\sqrt{x^2 - a^2}} \\, dx \right)$$

Dove $x = n(r) \cdot r$ è il raggio rifrattivo e $\alpha(x)$ è il Bending angle corretto. Una volta ottenuto il profilo dell'indice di rifrazione, si calcola la rifrattività $N$, definita come $N = (n-1) \times 10^6$. La relazione tra la rifrattività e le variabili termodinamiche atmosferiche è descritta dall'equazione di [Smith-Weintraub](https://nvlpubs.nist.gov/nistpubs/jres/50/jresv50n1p39_A1b.pdf):

$$N = 77.6 \frac{P}{T} + 3.73 \times 10^5 \frac{e}{T^2} - 40.3 \frac{n\_e}{f^2}$$

In questa equazione:

- $P$ è la pressione atmosferica totale (hPa).

- $T$ è la temperatura (K).

- $e$ è la pressione parziale del vapore acqueo (hPa).

- $n\_e$ è la densità elettronica, che domina il termine ionosferico (significativo sopra i 60-80 km).

- $f$ è la frequenza del segnale.


#### Utilità e applicazioni critiche

La forza della GNSS-RO risiede nella sua natura di misura "autocalibrante": poiché si basa su misurazioni di tempo e frequenza (garantite da orologi atomici), non soffre di deriva strumentale, rendendola ideale per il monitoraggio climatico a lungo termine.<sup>6</sup>

- **Meteorologia Operativa (NWP):** I profili RO sono essenziali per ancorare i modelli meteorologici nella troposfera superiore e nella stratosfera, dove altri dati sono scarsi, correggendo i bias di temperatura.<sup>7</sup>

- **Climatologia:** Monitoraggio dei trend di temperatura globale e della tropopausa con precisione assoluta.

- **Space Weather:** Misurazione del Contenuto Totale di Elettroni (TEC) e delle scintillazioni ionosferiche, cruciali per la sicurezza delle comunicazioni satellitari.<sup>8</sup>


#### Missioni di riferimento

La tecnica è stata pionierizzata dalla missione **GPS/MET** e resa operativa dalla costellazione **COSMIC-1** (Taiwan/USA). Attualmente, **COSMIC-2** fornisce una copertura densa nelle latitudini equatoriali, ottimizzata per lo studio degli uragani e della ionosfera.<sup>6</sup> Parallelamente, il settore commerciale "NewSpace" ha rivoluzionato questo campo: **Spire Global**, con la sua costellazione di oltre 100 CubeSat LEMUR, e **PlanetIQ**, forniscono migliaia di misurazioni giornaliere, integrando i dati istituzionali.<sup>9</sup>

***

### 1.2. Riflettometria GNSS (GNSS-R): il radar bistatico di opportunità

Mentre la Radio Occultazione sfrutta i segnali trasmessi attraverso l'atmosfera, la Riflettometria GNSS (GNSS-R) analizza i segnali riflessi dalla superficie terrestre, operando come un radar bistatico multi-statico.


#### Cosa misura?

La GNSS-R permette di estrarre proprietà geofisiche dalla superficie riflettente:

- **Oceani:** Velocità del vento superficiale e rugosità media (Mean Square Slope).

- **Suolo:** Umidità del suolo (Soil Moisture) e biomassa vegetale.

- **Criosfera:** Estensione e spessore del ghiaccio marino.


#### Funzionamento fisico e formule

Il ricevitore misura la potenza del segnale riflesso in funzione del ritardo temporale (delay) e dello spostamento Doppler, generando una _Delay Doppler Map_ (DDM). La potenza ricevuta $P_r$ è descritta dall'equazione radar bistatica <sup>9</sup>:

$$ P_r(\tau, f_D) = \frac{P_t G_t \lambda^2}{(4\pi)^3} \iint_A \frac{G_r(\vec{r}) \sigma^0(\vec{r}) \chi^2(\tau, f_D)}{R_t^2(\vec{r}) R_r^2(\vec{r})} d\vec{r} $$

Dove:

- $\sigma^0$ è il coefficiente di scattering bistatico della superficie.

- $\chi^2$ è la funzione di ambiguità (Woodward Ambiguity Function) che descrive la risposta del sistema.

- $R_t$ e $R_r$ sono le distanze dal trasmettitore e dal ricevitore al punto di riflessione speculare.

Su superfici calme (speculari), l'energia è concentrata in un punto della DDM. Su superfici rugose (oceano agitato dal vento), l'energia si disperde a formare un "ferro di cavallo" nella mappa DDM; l'ampiezza di questa dispersione è direttamente correlata alla velocità del vento.

> 🎮 **Simulazione interattiva.** Vuoi vedere come cambiano le Delay Doppler Map al variare di vento, quota e angolo di incidenza? Prova la [simulazione DDM GNSS-R](Assets/simulations/ddm/index.html) basata sul modello qui descritto.

<iframe
  src="../../../Assets/simulations/ddm/index.html"
  title="Simulazione Delay Doppler Map GNSS-R"
  loading="lazy"
  style="width: 100%; min-height: 720px; border: 1px solid #e5e7eb; border-radius: 18px; margin: 16px 0;"
></iframe>

> Il grafico mostra la distribuzione di potenza del segnale riflesso nello spazio delay-Doppler. In condizioni di mare mosso (vento ~10-15 m/s), l'energia si disperde dalla posizione speculare (delay=0, Doppler=0) formando la caratteristica "horseshoe shape" (ferro di cavallo) in un grafico 2D. In questo caso abbiamo
> - **Asse X** (Doppler): Spostamento in frequenza dovuto al moto relativo satellite-superficie
> - **Asse Y** (Delay): Ritardo temporale rispetto al percorso speculare diretto
> - **Asse Z** (Power): Intensità del segnale riflesso

I picchi multipli lungo l'asse Doppler indicano che la rugosità superficiale (onde) genera scattering da un'ampia glistening zone, con contributi da punti a diverse velocità relative. Più il mare è agitato, più la DDM si "apre" lateralmente e il picco centrale si attenua.

##### Alcune note sull'integrale di superficie

Nel GNSS-R, il segnale non si riflette da un singolo punto (come in un radar monostatico con un obiettivo puntiforme), ma si diffonde (scattera) su un'ampia area ellittica sulla superficie del mare, nota come zona di Fresnel o area di diffusione illuminata.

Ogni piccolo elemento di superficie all'interno di quest'area contribuisce alla potenza totale ricevuta dal satellite.

Per trovare la potenza totale ($P_r$​) che arriva al ricevitore, dobbiamo sommare (integrare) i contributi di potenza di tutti questi piccoli elementi di superficie.

La superficie di diffusione ($A$) è definita da due coordinate ortogonali (che possono essere spaziali o legate al segnale) che giacciono sul piano di diffusione.

L'elemento differenziale $\mathrm{d} \vec{r}$ in questo contesto rappresenta $\mathrm{d} S$ o $\mathrm{d} A$ (elemento differenziale di superficie).


#### Utilità e applicazioni

L'applicazione "killer" della GNSS-R è il monitoraggio dei cicloni tropicali<sup>65</sup>. A differenza dei radiometri ottici (bloccati dalle nubi) o degli scatterometri in banda Ku (attenuati dalla pioggia intensa), i segnali GNSS in banda L penetrano le precipitazioni intense<sup>66</sup>, permettendo di misurare la velocità del vento nell'occhio del ciclone.

In ambito terrestre, la tecnica fornisce mappe di umidità del suolo ad alta risoluzione temporale, essenziali per la previsione delle piene e l'agricoltura.


#### Missioni
Ovviamente tra le missioni non posso non citare quella da cui ho preso gran parte di queste informazioni, ovvero CYGNSS della Nasa, ma non è l'unica.

- **CYGNSS (NASA):** Una costellazione di 8 microsatelliti lanciata per studiare l'intensificazione degli uragani, che ha dimostrato capacità sorprendenti anche nel monitoraggio delle zone umide tropicali.

- **FSSCat (ESA):** Missione basata su due CubeSat 6U che combinava GNSS-R con un sensore iperspettrale ottico, vincitrice del Copernicus Masters. La missione è durata circa un anno. <sup>12</sup>

- **Spire Global:** Offre prodotti commerciali di riflettometria per il monitoraggio marittimo e del ghiaccio marino, ma non solo.<sup>9</sup>

***


## 2. Synthetic Aperture Radar: SAR

### 2.1 Radar ad apertura sintetica (SAR): imaging a microonde ognitempo

SAR rappresenta lo strumento principale per l'osservazione della superficie solida in ogni condizione meteorologica e di illuminazione, grazie alla sua natura attiva e alla lunghezza d'onda delle microonde.


#### Cosa misura?

I radar ad apertura sintetica inviano attivamente onde elettromagnetiche (microonde) verso la superficie terrestre e ne misurano l’eco retrodiffusa, registrandone l’intensità e la fase al ritorno. A differenza dei sensori ottici, un SAR illumina la scena con impulsi propri (tipicamente nelle bande centimetriche: L, C, X, ecc.) e cattura le microonde riflesse dagli oggetti al suolo. Ciò fornisce immagini in cui la “luminosità” di ogni pixel è legata al coefficiente di retro-diffusione radar (**backscatter**), che dipende dalla rugosità, dalla struttura e dal contenuto d’acqua del bersaglio. Ad esempio, superfici lisce (acque calme) riflettono poca energia verso il radar apparendo scure, mentre aree rugose o con spigoli (come edifici, rocce fratturate, vegetazione fitta) appaiono brillanti.

Misurando anche la fase della microonda retrodiffusa, i sistemi SAR possono rilevare con estrema sensibilità differenze di distanza nell’ordine dei millimetri, aprendo la strada all’interferometria (InSAR, vedi sezione successiva). I radar SAR operano in varie polarizzazioni (HH, VV, HV, VH), misurando componenti diverse del vettore campo elettromagnetico, il che aggiunge informazioni sulla geometria dei bersagli e sulla presenza di vegetazione.

Il SAR restituisce immagini complesse (nel senso matematico del termine) dove ogni pixel contiene:

- **Ampiezza:** Correlata alla rugosità superficiale, alla costante dielettrica (umidità) e alla geometria locale.

- **Fase:** Correlata alla distanza geometrica sensore-bersaglio, fondamentale per le applicazioni interferometriche.


#### Funzionamento fisico e formule

Per ottenere un'alta risoluzione spaziale in direzione azimutale (lungo la traccia) senza impiegare antenne chilometriche, il SAR sfrutta il movimento del satellite per sintetizzare un'apertura virtuale<sup>14</sup>. 

Elaborando coerentemente la storia di fase degli echi di ritorno (**effetto Doppler**), la risoluzione azimutale teorica $\delta_a$ diventa indipendente dalla distanza ed è pari a metà della lunghezza dell'antenna reale $L_a$<sup>15</sup>:

$$\delta_a = \frac{L_a}{2}$$

La risoluzione in range (perpendicolare alla traccia) è determinata dalla larghezza di banda $B$ dell'impulso trasmesso (spesso un _chirp_ modulato in frequenza, dove il _chirp_ è un segnale la cui frequenza varia nel tempo):

$$\delta_r = \frac{c}{2B \sin(\theta)}$$

Dove $\theta$ è l'angolo di incidenza. L'equazione di fase $\phi$ per un pixel a distanza $R$ è data da:

$$\phi = -\frac{4\pi R}{\lambda} + \phi_{scatt}$$

La frazione $4\pi R / \lambda$ indica che la fase compie un ciclo completo ogni volta che la distanza cambia di mezza lunghezza d'onda ($\lambda/2$).


#### Utilità e applicazioni

Il vantaggio principale del SAR è la sua capacità di osservare la Terra **con ogni condizione di illuminazione** e **meteorologica**: essendo attivo, non dipende dal Sole né è ostacolato dalle nubi (le microonde attraversano la copertura nuvolosa). Questo rende i SAR ideali per monitorare regioni frequentemente coperte da nubi (zone tropicali) o per sorvegliare aree polari durante la lunga notte invernale. 

Le immagini SAR trovano impiego in cartografia di suoli umidi e alluvionati (il segnale penetra un po’ la vegetazione e riflette fortemente da terreni saturi d’acqua, utilissimo in caso di inondazioni), in agricoltura (stima dell’umidità del suolo e fase fenologica delle colture: la dispersione del segnale varia con la struttura del fogliame), nella sorveglianza marittima (rilevazione di navi e di chiazze di petrolio: il petrolio calma il mare e appare scuro sul SAR, facilitando l’individuazione di sversamenti). 

In geologia e gestione del territorio, i SAR mappano deformazioni del terreno e frane tramite InSAR (si veda oltre), mentre in forestry la polarimetria SAR aiuta a stimare la biomassa forestale (missioni P-band come BIOMASS). Inoltre, i SAR permettono di rilevare cambiamenti improvvisi: grazie a passaggi frequenti, individuano il disboscamento illegale, il movimento di ghiacciai, i nuovi edifici o i danni da disastri confrontando immagini prima/dopo (change detection). In ambito militare e di intelligence, l’osservazione radar è cruciale perché fornisce immagini giorno/notte e all-weather, rivelando installazioni camuffate e movimenti.

In conclusione la versatilità dei sistemi SAR è immensa<sup>16</sup>:

- **Monitoraggio Marittimo:** Rilevamento di navi, _oil spills_ (che appaiono scuri per soppressione delle onde capillari) e classificazione del ghiaccio marino.

- **Agricoltura:** Monitoraggio della crescita delle colture (sensibilità alla biomassa e struttura) e dell'umidità del suolo.

- **Gestione Emergenze:** Mappatura rapida delle inondazioni (l'acqua calma appare nera per riflessione speculare lontano dal sensore).


#### Missioni

Le principali missioni sono:

- **Sentinel-1 (ESA/Copernicus):** La missione di riferimento in banda C, che fornisce dati globali con politica open access, cruciale per l'interferometria operativa.<sup>16</sup>

- **COSMO-SkyMed (ASI/Italia) & TerraSAR-X (DLR/Germania):** Sistemi in banda X ad altissima risoluzione per usi duali civili/militari.

- **NISAR (NASA/ISRO):** Missione futura in banda L ed S, focalizzata sulla biomassa e sulla deformazione crostale globale.

***


### 2.2 Interferometria SAR (InSAR): la geodesia dallo spazio

L'InSAR è una tecnica derivata dal SAR che sfrutta la differenza di fase tra due acquisizioni per misurare la topografia o le deformazioni millimetriche della superficie.


#### Cosa misura

L’Interferometria SAR sfrutta la fase del segnale radar registrato da due immagini SAR acquisite da orbite leggermente diverse (Interferometria spaziale) o a tempi diversi (Interferometria differenziale temporale) per misurare minime differenze di distanza e quindi variazioni di quota o di spostamento della superficie terrestre. 

In pratica, combinando due immagini SAR della stessa area, la differenza di fase tra i pixel genera frange d’interferenza proporzionali alla differenza di percorso ottico dell’onda radar.

Nel caso di InSAR topografica (es. missione SRTM o TanDEM-X), due antenne (o satelliti in formazione) osservano simultaneamente la superficie: la fase differenziale dipende dall’altitudine del suolo e consente di derivare modelli digitali di elevazione (DEM) ad alta risoluzione. 

Nell’InSAR differenziale (DInSAR), si usano due passaggi successivi a distanza di tempo $\Delta t$: se la superficie nel frattempo è deformata (abbassata o sollevata) di pochi millimetri o centimetri, tale differenza appare come variazione di fase tra le due immagini.

Si generano così **interferogrammi a falsi colori** con frange concentriche, ognuna corrispondente tipicamente a uno spostamento line-of-sight di mezza lunghezza d’onda ($≈2.8$ cm per Sentinel-1 in banda C). 

Misurando il numero e spaziatura delle frange, si ottiene il campo di deformazione 2D della superficie proiettato sulla linea di vista del radar. L’InSAR è quindi in grado di misurare microscopici movimenti del terreno (ordine mm) su ampie aree, rilevando fenomeni lenti e progressivi invisibili ad occhio nudo. Anche spostamenti co-sismici repentini (terremoti) o rapide deformazioni vulcaniche generano pattern interferometrici caratteristici (frange circolari attorno all’epicentro o al cratere).

#### Funzionamento fisico e formule

La differenza di fase interferometrica $\Delta \phi$ tra due immagini è composta da diversi contributi:

$$ \Delta \phi = \Delta \phi_{geom} + \Delta \phi_{topo} + \Delta \phi_{def} + \Delta \phi_{atm} + \Delta \phi_{noise} $$

- $\Delta \phi_{def}$ è la fase dovuta allo spostamento del suolo.

- $\Delta \phi_{topo}$ è legata alla topografia residua.

- $\Delta \phi_{atm}$ è il ritardo atmosferico (spesso il principale termine di errore).

La relazione tra la deformazione $d$ e la fase "srotolata" (unwrapped) è <sup>18</sup>:

$$d = \frac{\lambda}{4\pi} \Delta \phi\_{unwrapped}$$

Per un satellite in banda C come Sentinel-1 ($\lambda \approx 5.6$ cm), una frangia di interferenza ($2\pi$) corrisponde a uno spostamento di circa 2.8 cm.<sup>20</sup>

<img src="../../../Assets/phase_diff.png" alt="Frange interferometriche e deformazione misurata" title="Esempio di interferogramma: le frange di fase colorate rappresentano spostamenti millimetrici della superficie rispetto alla linea di vista del radar.">
_Figura 01: Frange interferometriche e deformazione misurata: esempio di interferogramma. Le frange di fase colorate rappresentano spostamenti millimetrici della superficie rispetto alla linea di vista del radar_


#### Applicazioni
Le principali sono:
- **Tettonica e Vulcanologia:** Misurazione dei campi di deformazione post-sismica e del "respiro" dei vulcani (inflazione/deflazione delle camere magmatiche).<sup>21</sup>

- **Subsidenza Urbana:** Monitoraggio della stabilità di edifici e infrastrutture critiche con tecniche avanzate come i Persistent Scatterers (PS-InSAR).<sup>16</sup>

<figure>
  <video controls src="https://sentiwiki.copernicus.eu/__attachments/1680568/1302_001_AR_EN%20(1).mp4?inst-v=edeeb585-a079-43c5-850b-337320319499" style="max-width: 100%; height: auto;"></video>
  <figcaption>Video 01: Monitoraggio di Venezia (Italia) con Sentinel-1 che consente il monitoraggio continuo dei movimenti del suolo con un'accuratezza dell'ordine di pochi millimetri all'anno.</figcaption>
</figure>


***


### 2.3. Radar altimetria: topografia degli oceani e dei ghiacci

I radar altimetri misurano con precisione la distanza verticale tra il satellite e la superficie sottostante, calcolata dal tempo di andata e ritorno di impulsi radar inviati perpendicolarmente al suolo (nadir).

L'altimetria radar nadirale è la tecnica fondamentale per quantificare l'innalzamento del livello del mare e la circolazione oceanica.


#### Cosa misura?

Come ho già accennato prima, misura la distanza verticale (range) tra il satellite e la superficie al nadir. Combinando questa misura con l'orbita precisa e le correzioni geofisiche, si ottiene:

- **Livello del Mare (Sea Surface Height - SSH).**

- **Altezza Significativa delle Onde (SWH).**

- **Velocità del vento** (dall'intensità del backscatter).

L'obiettivo da misurare è la quota della superficie (oceano, terra, ghiaccio) rispetto ad un ellissoide di riferimento. In ambito oceanografico, questa misura, sottratta dell’orbita del satellite nota in un sistema geodetico, fornisce l’altezza della superficie del mare (Sea Surface Height, SSH) rispetto al geoide. Sull’oceano aperto, variazioni di SSH di pochi centimetri riflettono correnti marine, maree e l’innalzamento medio del livello del mare. 

Gli altimetri misurano anche parametri secondari: analizzando la forma e potenza dell’eco radar (lo waveform), si ricava la rugosità della superficie e quindi l’altezza significativa delle onde e la velocità del vento sul mare.

Su superfici continentali, l’altimetro può misurare l’altezza dei laghi e dei grandi fiumi, nonché la topografia media dei terreni (anche se con risoluzione spaziale limitata dall’ampio footprint radar, tipicamente è di qualche km). 

Sulle calotte glaciali, radar altimetri specializzati (es. CryoSat-2) misurano la quota della neve/ghiaccio e rilevano variazioni nel tempo dello spessore dei ghiacci. Nei nuovi altimetri “a apertura sintetica” (SAR altimetry) l’uso di elaborazione Doppler migliora la risoluzione spaziale lungo traccia (∼300 m) permettendo misure più accurate in prossimità di coste e su corpi idrici più piccoli.


#### Funzionamento fisico e formule

L'altimetro emette un impulso radar e registra l'eco di ritorno. 

La forma d'onda dell'eco (waveform) è modellata analiticamente dal Modello di Brown, che descrive la convoluzione tra la risposta del sistema, la densità di probabilità delle altezze delle onde e la risposta impulsiva della superficie piatta.<sup>22</sup>

La tecnica SAR Altimetry (o Delay-Doppler), introdotta da CryoSat-2 e Sentinel-3, migliora la risoluzione lungo traccia (\~300m) focalizzando l'energia in celle Doppler, permettendo di misurare con precisione anche tra i ghiacci marini e nelle acque costiere.<sup>24</sup>


#### Missioni

- **Sentinel-3 (SRAL):** Altimetro SAR operativo per oceano e ghiacci.

- **Jason-3 / Sentinel-6 Michael Freilich:** La serie di riferimento per la continuità climatica del livello medio del mare (GMSL).

- **SWOT (Surface Water and Ocean Topography):** Interferometria radar ad ampio swath (Ka-band) per estendere l'altimetria dal profilo 1D alla mappa 2D.

***

## 3. Sensori passivi e ottici 
Ora cambiamo radicalmente argomento, parliamo di sensori passivi, quelli più simili alle classiche macchinette fotografiche o alle fotocamere dei nostri smartphone.

I sensori ottici passivi a bordo dei satelliti catturano la radiazione elettromagnetica solare riflessa dalla superficie terrestre (nelle bande del visibile, infrarosso vicino e infrarosso a onde corte) e, in alcuni casi, l’emissione termica nell’infrarosso termico. 

Essi forniscono dunque misure di radianza riflessa o riflettanza della superficie per ciascuna banda spettrale. Nel caso di bande termiche (tipicamente presenti su satelliti come Landsat o Sentinel-3), misurano la radianza termica emessa legata alla temperatura superficiale.

### 3.1 Immagini pancromatiche: risoluzione geometrica estrema


Le immagini ottiche sono intuitive e ricche di informazioni, trovando impiego in mappatura ambientale, gestione del territorio, agricoltura e monitoraggio forestale, pianificazione urbana e sorveglianza di emergenze.

#### Cosa misura

In modalità pancromatica viene registrata l’intensità integrata su un ampio intervallo spettrale (ad es. 0,5–0,8 μm, come WorldView-3), producendo immagini in bianco e nero ad alta risoluzione spaziale. 

In pratica, viene registrata la **radianza integrata** su un'unica banda spettrale molto ampia (tipicamente visibile + vicino infrarosso, 0.4 - 0.9 $\mu m$ Landsat 7).

> Landsat 8 ha un range ristretto 0.50-0.68 $\mu m$ per evitare lo scattering atmosferico.


#### Funzionamento fisico

L'ampia larghezza di banda permette di raccogliere un elevato numero di fotoni, garantendo un alto Rapporto Segnale-Rumore (SNR). Questo consente di ridurre la dimensione del pixel (IFOV) mantenendo tempi di integrazione brevi, necessari per evitare il _motion blur_ orbitale. La risoluzione spaziale può scendere sotto i 30 cm nelle piattaforme commerciali moderne, come Superview Neo-1.<sup>27</sup>


#### Applicazioni e pansharpening

La banda pancromatica è spesso usata in sinergia con bande multispettrali a bassa risoluzione tramite tecniche di _Pansharpening_. L'immagine risultante combina l'alta fedeltà geometrica del pancromatico con l'informazione cromatica del multispettrale. Una relazione semplificata per la fusione è <sup>28</sup>:

$$I_{Pan} \approx \sum_i \alpha_i \cdot I_{MS, i}$$

Questa è la condizione fisica di partenza ed esprime il fatto che l'energia registrata dal sensore pancromatico (a banda larga) dovrebbe idealmente corrispondere alla somma pesata delle energie registrate dalle bande multispettrali (a banda stretta) che ricadono nel suo intervallo spettrale.

I  coefficienti $\alpha_i$  rappresentano i pesi spettrali. Poiché il sensore pancromatico non ha una sensibilità piatta (cioè non "vede" tutti i colori con la stessa efficienza), ogni banda multispettrale contribuisce al segnale Pan in modo diverso. Ad esempio, se il sensore Pan è molto sensibile al rosso e poco al blu, il peso $\alpha_i$ del canale rosso sarà maggiore.

Di seguito un [esempio di applicazione](https://www.satimagingcorp.com/satellite-sensors/superview-neo-satellite-constellation/) del pansharpening.

<img src="../../../Assets/Doha.jpg" alt="Immagine pancromatica satellitare della skyline di Doha" title="Esempio di immagine pancromatica ad altissima risoluzione di Doha">
Figura 02: _Skyline di Doha ripreso da una scena pancromatica sub-metrica: la risoluzione geometrica estrema consente di distinguere singoli edifici e infrastrutture urbane._


#### Missioni

- **Maxar (WorldView Legion), Airbus (Pléiades Neo) e Superview Neo-1:** Risoluzioni commerciali leader di mercato (fino a 30 cm).

- **Landsat 8/9:** Banda pancromatica a 15m per affinare le bande spettrali a 30m.<sup>29</sup>

***


### 3.2. Imaging multispettrale: il colore della terra

Le immagini ottiche servono a identificare tipologie di suolo e uso del suolo (coltivazioni, foreste, aree urbane), a monitorare bacini idrici, ghiacciai e neve, e a documentare eventi come incendi, alluvioni o frane. 

Lo standard per il monitoraggio ambientale globale, che acquisisce immagini in un numero discreto di bande spettrali (da 4 a 15 circa).

Le immagini multispettrali permettono ad esempio di distinguere vegetazione sana da quella malata attraverso indici come NDVI (Normalized Difference Vegetation Index). L’NDVI si calcola dalle riflettanze nel vicino infrarosso (NIR) e rosso (R): 
$$NDVI = \frac{NIR - R}{NIR + R},$$ 
ed è ampiamente utilizzato per quantificare la densità e il vigore della copertura vegetale. 


#### Cosa misura

In modalità multispettrale, il sensore dispone di alcuni canali separati (tipicamente 3–10 bande) più stretti (ad es. bande blu, verde, rossa, infrarosso vicino, ecc.), fornendo informazioni sul colore e la composizione della superficie. 

Riflettanza superficiale in bande discrete nel Visibile (VIS), Vicino Infrarosso (NIR) e Infrarosso a Onda Corta (SWIR).


#### Fisica e indici spettrali

Sfrutta le firme spettrali distintive dei materiali. Ad esempio, la clorofilla assorbe nel rosso e riflette fortemente nel NIR. 

L'uso di bande nello SWIR è fondamentale per discriminare la neve dalle nuvole e per monitorare lo stress idrico della vegetazione.

<img src="../../../Assets/PanvsMulti.png" alt="Confronto tra immagine pancromatica e multispettrale su uno stesso quartiere urbano" title="Differenze tra banda pancromatica e composito multispettrale">
_Figura 03: Confronto visivo tra una banda pancromatica ad alta risoluzione e il relativo composito multispettrale: il pancromatico cattura il dettaglio geometrico, mentre il multispettrale preserva la variazione cromatica utile per indici come NDVI e SWIR per discriminare materiali._


#### Applicazioni e missioni

- **Sentinel-2 (ESA):** Con 13 bande e [risoluzione](https://sentiwiki.copernicus.eu/web/s2-products) 10-20m o 60 m, è il riferimento per l'agricoltura di precisione e il monitoraggio land cover.<sup>16</sup>

- **Landsat 8/9 (NASA/USGS):** Garantisce la continuità delle osservazioni dal 1972, essenziale per studi di cambiamento a lungo termine. La risoluzione, in base alla banda scelta va dai 30 m ai 100 m.

***


### 3.3 Imaging iperspettrale

L'imaging iperspettrale (HSI) estende il concetto multispettrale acquisendo centinaia di bande contigue, permettendo un'analisi chimico-fisica dettagliata di ogni pixel.

Infatti, le bande strette e contigue dell'HSI permettono di rilevare le feature di assorbimento (picchi e valli stretti nella curva spettrale). Queste feature sono univoche per specifici legami chimici (es. legami O-H nei minerali argillosi, o specifici pigmenti nella vegetazione), permettendo di identificare quale materiale è presente, non solo di distinguerne il colore. La definirei una sorta di spettroscopia da remoto.


#### Cosa misura
I sensori iperspettrali si spingono oltre quelli multispettrali, acquisendo decine o centinaia di bande strettissime (dell’ordine di 10 nm) contigue, coprendo in dettaglio il continuo spettrale visibile/SWIR: ogni pixel contiene una sorta di "firma spettrale” continua dell’oggetto osservato. Ciò permette di misurare sottili differenze di riflettanza legate alla composizione chimica e fisica dei materiali (vegetazione, minerali, acque).

Quello che si studia non è altro che un "ipercubo" di dati $(x, y, \lambda)$ con centinaia di canali spettrali stretti (es. $5-10 nm$), coprendo il range VNIR-SWIR ($400-2500 nm$).


#### Funzionamento fisico e spectral mixing

Ogni pixel contiene uno spettro continuo che funge da "impronta digitale" chimica. Il segnale misurato $y$ è spesso modellato come una [mistura lineare](https://ieeexplore.ieee.org/document/974727) degli spettri puri dei materiali costituenti (_endmembers_) $M$ presenti nel pixel, secondo il _Linear Mixing_ (o _Mixture_) _Model_ (**LMM**) <sup>30</sup>:

$$y = \sum_{k=1}^{K} a_k m_k + n$$

Dove $a_k$ sono le abbondanze frazionarie. Questo permette di identificare materiali sub-pixel o minerali specifici.
> In mineralogia, un "endmember" è un minerale puro al 100% (es. quarzo puro) che, miscelato con altri, forma la roccia osservata nel pixel.


#### Utilità e applicazioni

- **Geologia Mineraria:** Identificazione di alterazioni idrotermali e terre rare.

- **Qualità dell'Acqua:** Distinzione tra diverse specie algali e sedimenti.<sup>32</sup>


<figure>
  <img src="../../../Assets/Sea.png" alt="Colori dell'oceano determinati dai costituenti in acqua" title="Colori dell'oceano determinati dai costituenti in acqua">
  <figcaption>
    Il colore dell'oceano è una funzione della luce che viene assorbita o diffusa in presenza dei costituenti disciolti o sospesi nell'acqua. <sup>32</sup>
  </figcaption>
</figure>


- **CubeSat Intelligenti:** La missione **FSSCat/$\Phi$-Sat-1** ha dimostrato l'uso di AI a bordo per processare dati iperspettrali (HyperScout-2) e scartare immagini nuvolose direttamente in orbita, ottimizzando il downlink.<sup>13</sup>


#### Missioni

- **EnMAP (DLR) & PRISMA (ASI):** Missioni scientifiche operative rispettivamente tedesca e italiana.<sup>34</sup>

- **PACE (NASA):** Lanciata nel 2024, con lo strumento OCI (Ocean Color Instrument) che estende l'iperspettrale agli oceani globali.<sup>32</sup>

> 🎮 **Simulazione spettrale.** Metti a confronto visivamente le modalità pancromatica, multispettrale e iperspettrale e osserva come cambiano risoluzione spaziale, spettro campionato e informazioni tematiche. Puoi aprirla a schermo intero dalla [pagina dedicata](Assets/simulations/spectral/index.html).

<iframe
  src="../../../Assets/simulations/spectral/index.html"
  title="Simulazione Sensori Spettrali"
  loading="lazy"
  style="width: 100%; min-height: 720px; border: 1px solid #e5e7eb; border-radius: 18px; margin: 16px 0;"
></iframe>

> Il widget mostra (a sinistra) il campionamento del segnale con le diverse bande e (a destra) la resa visiva sul terreno: il pancromatico punta alla massima risoluzione spaziale, il multispettrale introduce il colore ma perde dettaglio, mentre l'iperspettrale scende di risoluzione per recuperare informazione chimico-fisica (stress vegetativo, materiali, ecc.).

***


### 3.4. Infrarosso termico (TIR): misurare il calore del pianeta

I sensori TIR misurano l'energia emessa dalla Terra, permettendo di inferire la temperatura superficiale.


#### Cosa misura
In base al soggetto misurato esistono:

- **Land Surface Temperature (LST).**

- **Sea Surface Temperature (SST).**

- **Anomalie Termiche:** Incendi boschivi e attività vulcanica.


#### Funzionamento fisico e formule

La radianza misurata $L_{\lambda}$ viene convertita in temperatura di brillanza $T_b$ invertendo la legge di Planck <sup>36</sup>:

$$T_b = \frac{h c}{k_B \lambda \ln\left( \frac{2 h c^2}{\lambda^5 L_\lambda} + 1 \right)}$$

Per ottenere la temperatura cinetica reale ($T_{surf}$), è necessario correggere per l'emissività $\epsilon$ della superficie e per il contributo atmosferico (assorbimento/emissione vapore acqueo). Algoritmi di _Split-Window_ utilizzano due canali termici vicini (es. 11 $\mu m$ e 12 $\mu m$) per stimare e rimuovere l'effetto atmosferico.


### Missioni

- **Sentinel-3 (SLSTR):** Alta precisione (<0.3 K) per SST climatica, usando una doppia vista (nadir e obliqua) per correggere l'atmosfera.

- **Landsat 8/9 (TIRS):** Due bande termiche a 100m di risoluzione.

- **ECOSTRESS (ISS):** Monitoraggio dell'evapotraspirazione e dello stress idrico vegetale.

***


## 4. Radiometria a microonde passiva (surface imaging)

Sensori che osservano l'emissione naturale a microonde della superficie terrestre a basse frequenze (Banda L, C, X).


### Cosa misura

- **Umidità del Suolo (Soil Moisture):** La costante dielettrica dell'acqua è molto alta (\~80) rispetto al suolo secco (\~4), influenzando drasticamente l'emissività.

- **Salinità Oceanica (SSS):** In banda L (1.4 GHz), l'emissività dipende dalla salinità.


### Funzionamento fisico e interferometria sintetica

Nelle microonde vale l'approssimazione di Rayleigh-Jeans ($h\nu \ll k\_B T$), quindi la radianza è proporzionale alla temperatura fisica:

$$T\_b \approx \epsilon \cdot T\_{phys}$$

La missione **SMOS** (ESA) ha introdotto una tecnologia rivoluzionaria: il radiometro a sintesi d'apertura interferometrica (MIRAS). Invece di una grande antenna parabolica rotante (come in SMAP), usa un array statico di 69 antenne a forma di Y. L'immagine di temperatura di brillanza è ricostruita matematicamente dalla trasformata di Fourier inversa delle funzioni di visibilità misurate tra coppie di antenne.<sup>37</sup>


### Missioni

- **SMOS (ESA):** Pioniere della banda L interferometrica.

- **SMAP (NASA):** Radiometro con grande antenna rotante (6m) per umidità del suolo ad alta precisione.

- **AMSR-2 (JAXA):** Radiometro multifrequenza "workhorse" per acqua precipitabile, ghiaccio e SST.

***


## 5. Gravimetria satellitare: pesare l'acqua dallo spazio

La gravimetria misura le variazioni di massa del pianeta, offrendo una visione unica del ciclo dell'acqua profondo.


### Cosa misura

Anomalie del campo gravitazionale terrestre e le loro variazioni temporali (mensili). Queste variazioni sono dovute al movimento di grandi masse d'acqua (fusione ghiacciai, esaurimento falde acquifere, variazioni livello oceano).


### Funzionamento fisico: satellite-to-satellite tracking (SST)

Due satelliti identici (come in GRACE e GRACE-FO) volano sulla stessa orbita separati da circa 220 km. Un sistema di ranging a microonde (banda K) o un interferometro laser (in GRACE-FO) misura la variazione di distanza inter-satellitare con precisione micrometrica.

Quando il satellite di testa sorvola una massa eccessiva (es. una montagna), viene accelerato gravitazionalmente, allontanandosi dal secondo. Analizzando le variazioni di velocità relativa (Range-Rate $\dot{\rho}$), si ricostruisce il potenziale gravitazionale globale.48


### Missioni e applicazioni

- **GRACE / GRACE-FO (NASA/GFZ):** Hanno quantificato per la prima volta in modo inequivocabile la perdita di massa delle calotte polari e l'eccessivo prelievo dalle falde acquifere in India e California.<sup>50</sup>

- **GOCE (ESA):** Ha utilizzato un gradiometro (accelerometri ultrasensibili) per definire il geoide statico con risoluzione spaziale e precisione mai raggiunte prima.

***


## 6. Magnetometria satellitare

I magnetometri spaziali studiano il campo magnetico terrestre, scudo protettivo contro il vento solare.


### Cosa misura

Il vettore campo magnetico totale $\vec{B}$, separando i contributi del nucleo (Core field), della crosta (Lithospheric field) e delle correnti elettriche esterne (Ionosfera/Magnetosfera).


### Funzionamento fisico: fluxgate e scalari

Le missioni di alta precisione utilizzano una combinazione di strumenti:

1. **Magnetometro Fluxgate (Vettoriale):** Misura le tre componenti del campo. Sfrutta la saturazione magnetica periodica di un nucleo ferromagnetico; la seconda armonica del segnale indotto è proporzionale al campo esterno.<sup>51</sup> Richiede una calibrazione precisa dell'assetto tramite Star Trackers solidali al braccio (boom) dello strumento.

2. **Magnetometro Scalare Assoluto:** (es. Overhauser o elio otticamente pompato) Misura l'intensità totale $|\vec{B}|$ sfruttando la risonanza magnetica nucleare o transizioni atomiche (effetto Zeeman), fornendo un riferimento assoluto per calibrare i vettoriali.<sup>53</sup>


### Missioni

- **Swarm (ESA):** Costellazione di 3 satelliti che permette di separare le variazioni temporali da quelle spaziali del campo geomagnetico.

- **DSCOVR (NASA/NOAA):** Posizionato in L1, usa magnetometri per monitorare il campo magnetico interplanetario (IMF) trasportato dal vento solare, fornendo allerta precoce per tempeste geomagnetiche.<sup>54</sup>

***

## 7. Segnali di opportunità e CubeSat radar: la nuova frontiera

Questa categoria unisce due trend emergenti: l'uso di segnali non nativi per l'EO e la miniaturizzazione estrema dei sensori attivi.


### A. Monitoraggio traffico: AIS e ADS-B satellitare

I satelliti captano i messaggi di posizione trasmessi da navi (AIS) e aerei (ADS-B). La sfida principale è la **de-collisione dei pacchetti**: un satellite vede un'area enorme (FOV \~5000 km) contenente migliaia di emettitori che trasmettono negli stessi slot temporali (TDMA).

- **SOTDMA vs CSTDMA:** Il protocollo SOTDMA (usato dalle grandi navi Classe A) prenota gli slot futuri ed è più facile da decodificare dallo spazio rispetto al CSTDMA (Classe B), che usa un approccio randomico "ascolta prima di parlare", spesso saturato in orbita.<sup>59</sup>

- **Applicazioni:** Fusione con dati SAR per identificare navi "dark" (che non trasmettono AIS) coinvolte in pesca illegale o traffici illeciti.


### B. CubeSat radar: RainCube

Fino a poco tempo fa, i radar erano considerati incompatibili con i CubeSat a causa dei requisiti di potenza e dimensioni. La missione **RainCube** (NASA) ha dimostrato un radar meteorologico in banda Ka (35.7 GHz) su un CubeSat 6U.

- **Innovazione:** Uso di un'antenna parabolica dispiegabile ultraleggera e di tecniche di compressione dell'impulso. In banda Ka, la pioggia attenua fortemente il segnale; RainCube sfrutta proprio questo principio per profilare la struttura delle tempeste.<sup>61</sup>


### C. Smart LNB: pioggia dalle TV satellitari

Progetti come **NEFOCAST** trasformano i ricevitori TV satellitari domestici (Smart LNB) in pluviometri. Misurano l'attenuazione del segnale di downlink (Ku/Ka band) causata dalla pioggia (_Rain Fade_).

- **Formula:** L'attenuazione specifica $A$ (dB/km) è legata al tasso di precipitazione $R$ (mm/h) dalla legge di potenza $A = k R^\alpha$. Una rete densa di "sensori" domestici fornisce mappe di pioggia in tempo reale con risoluzione capillare.<sup>63</sup>

***


### Tabella comparativa sintetica delle tecnologie

|                         |                     |                                        |                                |                               |
| ----------------------- | ------------------- | -------------------------------------- | ------------------------------ | ----------------------------- |
| **Categoria**           | **Tipo Sensore**    | **Misura Principale**                  | **Missioni Esemplificative**   | **Applicazione Chiave**       |
| **GNSS-RO**             | Passivo (Limbo)     | Rifrattività ($N$), Temp., Umidità     | COSMIC-2, Spire, MetOp         | Meteo (NWP), Clima            |
| **GNSS-R**              | Bistatico           | Rugosità Superf., Vento, Soil Moisture | CYGNSS, FSSCat                 | Uragani, Inondazioni          |
| **SAR**                 | Attivo (Microonde)  | Backscatter ($\sigma^0$), Fase         | Sentinel-1, COSMO-SkyMed       | Deformazioni (InSAR), Ghiacci |
| **Altimetria Radar**    | Attivo (Nadir)      | SSH, SWH, Vento                        | Sentinel-3, Jason-3, SWOT      | Livello Mare, Oceanografia    |
| **Scatterometria**      | Attivo (Microonde)  | Vento Vettoriale                       | MetOp (ASCAT), CFOSAT          | Meteo Marina                  |
| **Ottico Pan**          | Passivo (Vis/NIR)   | Radianza (Alta Ris. Spaziale)          | WorldView, Pléiades, Landsat   | Cartografia, Intelligence     |
| **Ottico Multi**        | Passivo (Vis/IR)    | Riflettanza Spettrale (Bande)          | Sentinel-2, Landsat            | Agricoltura, Land Cover       |
| **Iperspettrale**       | Passivo (Vis/SWIR)  | Spettro Continuo ($>100$ bande)        | EnMAP, PRISMA, PACE            | Geologia, Qualità Acqua       |
| **Termico (TIR)**       | Passivo (Emissione) | Temperatura Brillanza ($T\_b$)         | Landsat, Sentinel-3, ECOSTRESS | SST, LST, Incendi             |
| **Radiometria (Suolo)** | Passivo (Microonde) | $T\_b$ (Banda L/C/X)                   | SMOS, SMAP                     | Umidità Suolo, Salinità       |
| **Sounding Atm.**       | Passivo (Microonde) | Profili T/Umidità (O$\_2$, H$\_2$O)    | AMSU/MHS, TROPICS              | Input Meteo Globale           |
| **Lidar Altimetrico**   | Attivo (Laser)      | Elevazione, Spessore Ghiaccio          | ICESat-2, GEDI                 | Bilancio Massa Ghiacci        |
| **Lidar Vento**         | Attivo (Doppler)    | Vento LOS (Doppler Shift)              | Aeolus                         | Vento in aria chiara          |
| **Gravimetria**         | Attivo (SST)        | Anomalie Gravità (Massa)               | GRACE-FO, GOCE                 | Acque Sotterranee, Ghiacciai  |
| **Magnetometria**       | Passivo (In-situ)   | Vettore Campo Magnetico                | Swarm, DSCOVR                  | Modelli Geomagnetici          |
| **Lightning (GLM)**     | Passivo (Ottico)    | Eventi Fulminei                        | GOES-R, MTG                    | Nowcasting Tempeste           |
| **AIS / ADS-B**         | Passivo (RF)        | Posizione Navi/Aerei                   | Spire, Aireon                  | Tracking Globale              |
| **CubeSat Radar**       | Attivo (Ka-band)    | Profilo Pioggia                        | RainCube                       | Dimostratore Tecnologico      |
| **Smart LNB**           | Opportunità         | Attenuazione Pioggia                   | NEFOCAST                       | Pluviometria Distribuita      |


## Conclusione

L'analisi di queste diciannove categorie rivela un sistema di osservazione della Terra sempre più interconnesso e multi-fisico. La tendenza dominante è la fusione dei dati (_Data Fusion_): la precisione verticale dei Lidar e dei Radar viene estesa orizzontalmente dalle costellazioni ottiche e radiometriche. Inoltre, l'integrazione di sensori scientifici tradizionali con dati di opportunità commerciali (GNSS-R, Smart LNB, AIS) sta creando un vero e proprio "Digital Twin" del pianeta, capace di quantificare non solo lo stato dell'ambiente naturale, ma anche l'impatto antropico in tempo reale.


## Infografica: matrice di confronto

<!-- Infografica Page (NEW) -->
<div id="infografica" class="content-page hidden">
  <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Infografica: Matrice di Confronto</h1>
  <p class="text-lg text-gray-700 mb-6">Questa tabella riassume le capacità operative di tutte le tecnologie analizzate. Usa questa legenda per orientarti:</p>

  <div class="flex flex-wrap gap-4 mb-6 text-sm">
    <span class="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold border border-yellow-200">☀️ Passivo (Richiede Sole/Emissione)</span>
    <span class="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-semibold border border-indigo-200">📡 Attivo (Emette segnale proprio)</span>
    <span class="px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold border border-green-200">☁️ Vede attraverso le nuvole</span>
  </div>




  <figure class="table-wrapper" data-enhanced-table>
    <div class="table-wrapper__scroll">
      <table class="min-w-full text-sm text-left text-gray-600">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th class="px-6 py-3">Tecnologia</th>
            <th class="px-6 py-3">Tipo</th>
            <th class="px-6 py-3">Sorgente fisica</th>
            <th class="px-6 py-3 text-center">Meteo / notte</th>
            <th class="px-6 py-3">Output principale</th>
          </tr>
        </thead>
        <tbody>
          <!-- 1. GNSS -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">1. GNSS</td>
            <td class="px-6 py-4"><span class="text-blue-600 font-semibold">Ricezione</span></td>
            <td class="px-6 py-4">Onde radio (L-band)</td>
            <td class="px-6 py-4 text-center text-xl" title="Ognitempo">☁️ 🌙</td>
            <td class="px-6 py-4">Posizione (XYZ), tempo (T)</td>
          </tr>
          <!-- 2. Ottico -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">2. Ottico</td>
            <td class="px-6 py-4"><span class="text-yellow-600 font-semibold">Passivo</span></td>
            <td class="px-6 py-4">Luce visibile / IR</td>
            <td class="px-6 py-4 text-center text-xl" title="Solo giorno, no nuvole">☀️ ❌</td>
            <td class="px-6 py-4">Immagini (foto)</td>
          </tr>
          <!-- 3. SAR -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">3. SAR</td>
            <td class="px-6 py-4"><span class="text-indigo-600 font-semibold">Attivo</span></td>
            <td class="px-6 py-4">Microonde (radar)</td>
            <td class="px-6 py-4 text-center text-xl" title="Ognitempo, giorno e notte">☁️ 🌙</td>
            <td class="px-6 py-4">Immagini (riflettività)</td>
          </tr>
          <!-- 4. InSAR -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">4. InSAR</td>
            <td class="px-6 py-4"><span class="text-indigo-600 font-semibold">Attivo</span></td>
            <td class="px-6 py-4">Fase radar</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙</td>
            <td class="px-6 py-4">Spostamenti mm / topografia</td>
          </tr>
          <!-- 5. Altimetria -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">5. Altimetria</td>
            <td class="px-6 py-4"><span class="text-indigo-600 font-semibold">Attivo</span></td>
            <td class="px-6 py-4">Impulso radar (nadir)</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙</td>
            <td class="px-6 py-4">Altezza superficie (cm)</td>
          </tr>
          <!-- 6. Radiometri -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">6. Radiometri MO</td>
            <td class="px-6 py-4"><span class="text-yellow-600 font-semibold">Passivo</span></td>
            <td class="px-6 py-4">Emissione termica</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙</td>
            <td class="px-6 py-4">Temperatura, umidità</td>
          </tr>
          <!-- 7. Iperspettrale -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">7. Iperspettrale</td>
            <td class="px-6 py-4"><span class="text-yellow-600 font-semibold">Passivo</span></td>
            <td class="px-6 py-4">Spettro visibile/IR</td>
            <td class="px-6 py-4 text-center text-xl">☀️ ❌</td>
            <td class="px-6 py-4">Firma chimica materiali</td>
          </tr>
          <!-- 8. LIDAR -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">8. LIDAR</td>
            <td class="px-6 py-4"><span class="text-indigo-600 font-semibold">Attivo</span></td>
            <td class="px-6 py-4">Laser (luce)</td>
            <td class="px-6 py-4 text-center text-xl" title="No nuvole">❌ 🌙</td>
            <td class="px-6 py-4">Profili 3D / altezze</td>
          </tr>
          <!-- 9. Gravimetria -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">9. Gravimetria</td>
            <td class="px-6 py-4"><span class="text-purple-600 font-semibold">Fisica</span></td>
            <td class="px-6 py-4">Campo gravitazionale</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙</td>
            <td class="px-6 py-4">Mappa di massa/acqua</td>
          </tr>
          <!-- 10. Magnetometria -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">10. Magnetometria</td>
            <td class="px-6 py-4"><span class="text-purple-600 font-semibold">Fisica</span></td>
            <td class="px-6 py-4">Campo magnetico</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙</td>
            <td class="px-6 py-4">Mappa campo magnetico</td>
          </tr>
          <!-- 11. Radio-Occ -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">11. Radio-Occ.</td>
            <td class="px-6 py-4"><span class="text-blue-600 font-semibold">Passivo (RX)</span></td>
            <td class="px-6 py-4">Rifrazione segnale GNSS</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙</td>
            <td class="px-6 py-4">Profili atmosferici</td>
          </tr>
          <!-- 12. Meteo GEO -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">12. Meteo GEO</td>
            <td class="px-6 py-4"><span class="text-yellow-600 font-semibold">Passivo</span></td>
            <td class="px-6 py-4">Visibile + termico</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙 (termico)</td>
            <td class="px-6 py-4">Video/img a disco intero</td>
          </tr>
          <!-- 13. Space Wx -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">13. Space Wx</td>
            <td class="px-6 py-4"><span class="text-purple-600 font-semibold">Fisica</span></td>
            <td class="px-6 py-4">Particelle / raggi X</td>
            <td class="px-6 py-4 text-center text-xl">N/A (spazio)</td>
            <td class="px-6 py-4">Conteggio particelle</td>
          </tr>
          <!-- 14. AIS -->
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-bold text-gray-900">14. AIS</td>
            <td class="px-6 py-4"><span class="text-blue-600 font-semibold">Ricezione</span></td>
            <td class="px-6 py-4">Radio VHF (navi)</td>
            <td class="px-6 py-4 text-center text-xl">☁️ 🌙</td>
            <td class="px-6 py-4">ID e posizione navi</td>
          </tr>
        </tbody>
      </table>
    </div>
  </figure>
  <p class="mt-4 text-sm text-gray-500 text-right">* Nota: ☁️ = Penetra le nuvole | 🌙 = Funziona di notte | ❌ = Bloccato/Non disponibile</p>
</div>

#### Works cited

1. Parametric Sizing Equations for Earth Observation Satellites | Request PDF - ResearchGate, <https://www.researchgate.net/publication/328159562_Parametric_Sizing_Equations_for_Earth_Observation_Satellites>

2. perspective on Gaussian processes for Earth observation | National Science Review, <https://academic.oup.com/nsr/article/6/4/616/5369430>

3. GNSS radio occultation (GNSS-RO): Lecture 1 – Principles and NWP use - ECMWF Events (Indico), <https://events.ecmwf.int/event/375/contributions/4253/attachments/2310/4039/gnssro_lecture_KL_2024.pdf>

4. A variational regularization of Abel transform for GPS radio occultation - AMT, <https://amt.copernicus.org/articles/11/1947/>

5. GNSS radio occultation excess-phase processing for climate applications including uncertainty estimation - AMT, <https://amt.copernicus.org/articles/16/5217/>

6. GNSS Radio Occultation | Constellation Observing System for Meteorology Ionosphere and Climate - ucar cosmic, <https://www.cosmic.ucar.edu/what-we-do/gnss-radio-occultation>

7. Using the Commercial GNSS RO Spire Data in the Neutral Atmosphere for Climate and Weather Prediction Studies - the NOAA Institutional Repository, <https://repository.library.noaa.gov/view/noaa/58772/noaa_58772_DS1.pdf>

8. Sensing the ionosphere with the Spire radio occultation constellation | Journal of Space Weather and Space Climate, <https://www.swsc-journal.org/articles/swsc/full_html/2021/01/swsc210051/swsc210051.html>

9. Reconnaissance satellite constellations: For enhanced global awareness - Spire, <https://spire.com/blog/space-reconnaissance/reconnaissance-satellite-constellations-for-enhanced-global-awareness/>

10. Space Weather Data from Commercial GNSS RO, <https://www.swpc.noaa.gov/sites/default/files/images/u4/07%20Rob%20Kursinski.pdf>

11. RainCube Demonstrates Miniature Radar Technology to Measure Storms - NASA Science, <https://science.nasa.gov/science-research/science-enabling-technology/technology-highlights/raincube-demonstrates-miniature-radar-technology-to-measure-storms/>

12. FSSCat Overview - ESA Earth Online, <https://earth.esa.int/eogateway/missions/fsscat/description>

13. FSSCat - Earth Online, <https://earth.esa.int/eogateway/missions/fsscat>

14. Synthetic-aperture radar - Wikipedia, <https://en.wikipedia.org/wiki/Synthetic-aperture_radar>

15. Synthetic Aperture Radar (SAR): Principles and Applications - eo4society, <https://eo4society.esa.int/wp-content/uploads/2021/02/D1T2a_LTC2015_Younis.pdf>

16. S1 Applications - SentiWiki - Copernicus, <https://sentiwiki.copernicus.eu/web/s1-applications>

17. Create an Interferogram Using ESA's Sentinel-1 Toolbox | NASA Earthdata, <https://www.earthdata.nasa.gov/learn/data-recipes/create-interferogram-using-esas-sentinel-1-toolbox>

18. InSAR Phase Unwrapping Error Correction for Rapid Repeat Measurements of Water Level Change in Wetlands - LaCoast.gov, <https://www.lacoast.gov/crms/crms_public_data/publications/Oliver-Cabrera%20et%20al%202021.pdf>

19. Unwrapped Interferograms: Creating a Deformation Map | NASA Earthdata, <https://www.earthdata.nasa.gov/learn/data-recipes/unwrapped-interferograms-creating-deformation-map>

20. Sentinel-1 InSAR Product Guide - HyP3, <https://hyp3-docs.asf.alaska.edu/guides/insar_product_guide/>

21. Sentinel-1 InSAR Processing using S1TBX - Alaska Satellite Facility, <https://asf.alaska.edu/wp-content/uploads/2019/05/generate_insar_with_s1tbx_v5.4.pdf>

22. Radar Altimetry Principle and Data Processing by M.-H. Rio, <https://ftp.itc.nl/pub/Dragon4_Lecturer_2018/D2_Tue/L1/D2L1-DRAGON_OTC18_Altimetry1_mhr.pdf>

23. Radar Altimetry for remote sensing of the oceans and their impact on climate - ESA Earth Online, <https://earth.esa.int/eogateway/documents/20142/0/01_Tuesday_OCT2013_Cipollini_Altimetry_1.pdf>

24. Using Altimetry service data - EUMETSAT - User Portal, <https://user.eumetsat.int/data/satellites/sentinel-3/altimetry-service>

25. Altimetry Applications - SentiWiki - Copernicus, <https://sentiwiki.copernicus.eu/web/altimetry-applications>

26. Backscatter LIDAR, <https://reef.atmos.colostate.edu/~odell/at652/lecture_2013/lecture8b.pdf>

27. Panchromatic Images Explained | Satellite Bands, Specs & Uses - XrTech Group, <https://xrtechgroup.com/panchromatic-imaging-bands-uses/>

28. Image Fusion for High-Resolution Optical Satellites Based on Panchromatic Spectral Decomposition - PMC, <https://pmc.ncbi.nlm.nih.gov/articles/PMC6603526/>

29. Panchromatic Imagery And Its Band Combinations In Use - EOS Data Analytics, <https://eos.com/make-an-analysis/panchromatic/>

30. Hyperspectral Imaging - arXiv, <https://arxiv.org/html/2508.08107v1>

31. Full article: Hyperspectral and multispectral image fusion addressing spectral variability by an augmented linear mixing model - Taylor & Francis Online, <https://www.tandfonline.com/doi/full/10.1080/01431161.2022.2041762>

32. Introduction to PACE Hyperspectral Observations for Water Quality Monitoring - NASA Applied Sciences, <https://appliedsciences.nasa.gov/sites/default/files/2024-09/PACE_Part1_Final.pdf>

33. SSC19-V-05 - DigitalCommons\@USU, <https://digitalcommons.usu.edu/cgi/viewcontent.cgi?article=4391&context=smallsat>

34. EnMAP, <https://www.enmap.org/>

35. Mission - EnMAP, <https://www.enmap.org/mission/>

36. Passive Microwave, <https://topex.ucsd.edu/rs/Passive_Microwave.pdf>

37. SMOS - ESA Earth Online - European Space Agency, <https://earth.esa.int/eogateway/missions/smos>

38. AMSR2 Overview NESDIS Operational Soil Moisture Products - Office of Satellite and Product Operations - NOAA OSPO, <https://www.ospo.noaa.gov/products/land/smops/sensors_AMSR2.html>

39. SMOS (Soil Moisture and Ocean Salinity) Mission - eoPortal, <https://www.eoportal.org/satellite-missions/smos>

40. Microwave radiometer to retrieve temperature profiles - AMT, <https://amt.copernicus.org/preprints/6/2857/2013/amtd-6-2857-2013.pdf>

41. ICESat-2: Home, <https://icesat-2.gsfc.nasa.gov/>

42. Counting on NASA's ICESat-2, <https://icesat-2.gsfc.nasa.gov/articles/counting-nasas-icesat-2>

43. IceSat 2 ATLAS photon-counting receiver - initial on-orbit performance - NASA Technical Reports Server, <https://ntrs.nasa.gov/api/citations/20200001212/downloads/20200001212.pdf>

44. Signal Photon Extraction Method for ICESat-2 Data Using Slope and Elevation Information Provided by Stereo Images - PubMed Central, <https://pmc.ncbi.nlm.nih.gov/articles/PMC10649317/>

45. Aeolus Objectives - ESA Earth Online, <https://earth.esa.int/eogateway/missions/aeolus/objectives>

46. First validation of Aeolus wind observations by airborne Doppler wind lidar measurements, <https://amt.copernicus.org/articles/13/2381/2020/>

47. The ESA ADM-Aeolus Doppler Wind Lidar Mission – Status and validation strategy - ECMWF, <https://www.ecmwf.int/sites/default/files/elibrary/2016/16851-esa-adm-aeolus-doppler-wind-lidar-mission-status-and-validation-strategy.pdf>

48. Gravity Recovery and Climate Experiment (GRACE) - NASA Sea Level Change Portal, <https://sealevel.nasa.gov/missions/grace>

49. GRACE-FO - Gravity Recovery and Climate Experiment Follow-On - Center for Space Research, <https://www2.csr.utexas.edu/grace/RL061LRI.html>

50. Satellite Gravimetry – Measuring Earth's Gravity Field from Space - IAG - Geodesy, <https://geodesy.science/item/satellite-gravimetry/>

51. In-flight calibration of the fluxgate magnetometer on Macau Science Satellite-1, <https://www.eppcgs.org/article/doi/10.26464/epp2025067>

52. A miniature two-axis fluxgate magnetometer - NASA Technical Reports Server, <https://ntrs.nasa.gov/api/citations/19700008650/downloads/19700008650.pdf>

53. Types of magnetometers, uses and characteristics | AV3 AEROVISUAL, <https://av3aerovisual.com/en/types-of-magnetometers-uses-and-characteristics/>

54. Deep Space Climate Observatory (DSCOVR) - National Centers for Environmental Information - NOAA, <https://www.ncei.noaa.gov/access/metadata/landing-page/bin/iso?id=gov.noaa.ngdc.stp.swx:satellite-systems_dscovr>

55. It's all systems go for NOAA's first space weather satellite, <https://www.noaa.gov/its-all-systems-go-noaas-first-space-weather-satellite>

56. GOES-R Post Launch Test | NASA Earthdata, <https://www.earthdata.nasa.gov/data/projects/goes-r-plt>

57. GOES-R Terrestrial Weather (ABI/GLM) - National Centers for Environmental Information, <https://www.ncei.noaa.gov/products/goes-terrestrial-weather-abi-glm>

58. GOES-R Series Data Book, <https://www.goes-r.gov/downloads/resources/documents/GOES-RSeriesDataBook.pdf>

59. Sotdma vs cstdma: understanding key differences for maritime communication - BytePlus, <https://www.byteplus.com/en/topic/560464>

60. AIS Know-How: Data transfer (SOTDMA vs. CSTDMA), <https://defender.com/assets/pdf/simrad/sotdma_cstdma_comparison.pdf>

61. RainCube: the first ever radar measurements from a CubeSat in space - SPIE Digital Library, <https://www.spiedigitallibrary.org/journals/journal-of-applied-remote-sensing/volume-13/issue-3/032504/RainCube--the-first-ever-radar-measurements-from-a-CubeSat/10.1117/1.JRS.13.032504.full>

62. RainCube - NASA ESTO, <https://esto.nasa.gov/wp-content/uploads/2020/07/RainCube.pdf>

63. Real-Time Rain Rate Evaluation via Satellite Downlink Signal Attenuation Measurement - PubMed Central, <https://pmc.ncbi.nlm.nih.gov/articles/PMC5580102/>

64. SmartLNB for weather forecasting - Nefocast, <http://www.nefocast.it/news/smartlnb-for-weather-forecasting/>

65. Improving Analysis and Prediction of Tropical Cyclones by Assimilating Radar and GNSS-R Wind Observations: Ensemble Data Assimilation and Observing System Simulation Experiments Using a Coupled Atmosphere–Ocean Model, <https://journals.ametsoc.org/view/journals/wefo/37/9/WAF-D-21-0202.1.xml>

66. NASA/University of Michigan - CYGNSS Handbook <https://cygnss.engin.umich.edu/wp-content/uploads/sites/534/2021/07/148-0138-ATBD-L2-Wind-Speed-Retrieval-R6_release.pdf>
