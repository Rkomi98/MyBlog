# InSAR: Quando SAR non basta

Qualche anno fa, durante un progetto universitario sull'alluvione che ha colpito l'Emilia-Romagna nel maggio 2023, avevo già messo le mani in pasta su dati Sentinel-1. L'obiettivo era a quel tempo era distinguere l'acqua comparsa dopo l'evento dai “corpi idrici permanenti” (laghi, fiumi, ecc) e capire quanto il preprocessing, in particolare la rimozione del rumore termico, influenzasse il risultato finale.

In quel lavoro il protagonista assoluto è stato il **backscatter**. Guardavo quanta energia tornava indietro verso il satellite, come cambiava tra due acquisizioni e cosa potevo dedurne sulla superficie osservata. La fase del segnale c'era, naturalmente, ma l'ho lasciata da parte.

Quando inizi a studiare l'InSAR, scopri che ciò che in quel progetto avevo lasciato da parte, era in realtà capace di fare una cosa piuttosto sorprendente: misurare da centinaia di chilometri di quota spostamenti del terreno dell'ordine dei centimetri e, nelle serie temporali ben costruite, dei millimetri.

Il punto interessante è che il satellite non diventa improvvisamente più preciso. È sempre lo stesso radar. Siamo noi a fargli una domanda diversa.

Quindi facciamo un passo indietro. Prima di parlare di interferogrammi, frange colorate, Persistent Scatterer e serie temporali, conviene capire che cosa contiene davvero un pixel SAR.

---

## Lo stesso pixel racconta due storie

Un'immagine radar non nasce come una fotografia in bianco e nero. Nei prodotti **SLC, Single Look Complex**, ogni pixel è un numero complesso e può essere descritto attraverso due grandezze: **ampiezza** e **fase**.

L'ampiezza ci dice, semplificando, quanto è forte il segnale tornato verso l'antenna. Da lì derivano l'intensità e, dopo la calibrazione radiometrica, grandezze come sigma naught usate per ragionare sul backscatter della superficie.

La fase racconta invece *dove* ci troviamo all'interno del ciclo dell'onda elettromagnetica ricevuta.

Questa distinzione sembra innocua. In realtà separa due mondi applicativi.

Con l'ampiezza posso osservare che l'acqua tende a restituire al radar un segnale debole quando la superficie è relativamente liscia e riflette specularmente l'energia lontano dal sensore. Posso quindi usarla per flood mapping, classificazione, change detection e una quantità di altre applicazioni.

Con la fase posso confrontare due acquisizioni e accorgermi che la distanza tra satellite e terreno è cambiata di una piccolissima frazione della lunghezza d'onda.

Ed è qui che comincia l'InSAR.

> **Definizione — SAR**  
> Il **Synthetic Aperture Radar** è un radar attivo: illumina la superficie con microonde e misura il segnale che torna al sensore. Il movimento della piattaforma lungo l'orbita viene sfruttato per sintetizzare un'antenna molto più grande di quella fisicamente disponibile e ottenere una risoluzione in azimuth molto più fine di quella di un radar ad apertura reale.

Sentinel-1 opera in **banda C a 5,405 GHz**, quindi con una lunghezza d'onda di circa **5,55 cm**. La modalità principale sulle terre emerse è l'**Interferometric Wide Swath**, o IW: circa **250 km di swath** con una risoluzione nominale di **5 × 20 m**. Il nome della modalità non è casuale: la missione è stata progettata anche per consentire interferometria sistematica su grandi aree.[^s1-facts] [^s1-instrument]

> **Da ricordare — Perché serve un prodotto SLC?**  
> Per fare interferometria non basta conoscere quanto è intensa la risposta radar. Serve conservare l'informazione complessa, quindi anche la fase. I prodotti GRD sono già stati rilevati e non mantengono la fase necessaria per costruire un interferogramma.[^s1-products]

---

## La fase non è una distanza

Qui vale la pena fermarsi un momento, perché è uno dei punti su cui si inciampa più facilmente.

Se il radar riceve un'onda con una certa fase, **non può ricavare da quella sola fase la distanza assoluta del bersaglio**. La fase viene osservata modulo \(2\pi\): dopo un giro completo siamo di nuovo nello stesso punto del ciclo.

È un po' come guardare soltanto la lancetta dei secondi di un orologio. Se segna 15, sai in quale posizione si trova, ma non puoi sapere se siano passati 15 secondi, 75 o 135 senza un'informazione aggiuntiva.

L'InSAR aggira il problema confrontando acquisizioni della **stessa area**, riprese con una geometria sufficientemente simile in tempi diversi.

Se tra le due acquisizioni il bersaglio si è mosso lungo la direzione satellite-terreno, cambia la distanza percorsa dall'onda. E cambia la fase.

Per una variazione di distanza lungo la **Line of Sight**, la relazione fondamentale è:

$$
\Delta \phi_{def} = \frac{4\pi}{\lambda}\,d_{LOS}
$$

Il fattore 4, invece del 2 che potremmo aspettarci a prima vista, viene dal viaggio di andata e ritorno del segnale: se il terreno si sposta di \(d\), il cammino radar cambia di \(2d\).

Da questa equazione segue una conseguenza molto utile:

$$
2\pi \quad \longleftrightarrow \quad \frac{\lambda}{2}
$$

Con Sentinel-1, \(\lambda/2\) vale circa **2,8 cm**.

Tieniamolo a mente. Tra poco ricomparirà in Italia centrale.

> **Definizione — Line of Sight (LOS)**  
> L'InSAR non misura direttamente «quanto il terreno è sceso» o «quanto si è mosso verso est». Misura la **proiezione dello spostamento tridimensionale lungo la linea che unisce il satellite al bersaglio**. È una distinzione piccola sulla carta e decisiva quando si interpretano i risultati.

---

## Due immagini non bastano: devono anche parlarsi

Prendiamo due acquisizioni SAR della stessa zona. Per costruire un interferogramma, i pixel che stiamo confrontando devono riferirsi agli stessi bersagli a terra con una precisione molto elevata. Il primo passaggio serio è quindi la **co-registrazione**.

Poi si combina il segnale complesso delle due immagini, moltiplicando un'immagine per il complesso coniugato dell'altra. Quello che interessa è la differenza di fase.

Fin qui sembrerebbe quasi troppo facile.

Il problema è che il satellite non ripassa esattamente dallo stesso punto nello spazio. La distanza tra le due orbite viene descritta dalla **baseline interferometrica**, che può essere scomposta in diverse componenti; per la sensibilità alla topografia e alla decorrelazione geometrica, la **baseline perpendicolare** è particolarmente importante.

Sentinel-1 beneficia di un controllo orbitale molto stretto proprio perché il repeat-pass interferometry richiede geometrie simili per mantenere una buona coerenza tra le acquisizioni.[^s1-baseline]

> **Definizione — InSAR**  
> Con **Interferometric Synthetic Aperture Radar** si indica l'insieme di tecniche che sfruttano la differenza di fase tra due o più acquisizioni SAR per ricavare informazioni sulla topografia e/o sulla deformazione della superficie.[^nasa-handbook]

Quando l'obiettivo è isolare la deformazione rimuovendo il contributo topografico, entriamo più precisamente nel territorio della **Differential InSAR, DInSAR**.

---

## Quelle frange colorate non sono decorazione

Il 24 agosto 2016 un terremoto colpì l'Italia centrale. ESA e CNR-IREA combinarono acquisizioni Sentinel-1 prese prima e dopo l'evento per costruire un interferogramma della zona deformata.

Nell'immagine apparvero **sette frange interferometriche**. ESA quantificò il loro significato in modo quasi didattico: le sette frange corrispondevano a circa **20 cm di deformazione lungo la linea di vista del radar**, mentre ogni ciclo completo di colore rappresentava circa **2,8 cm di spostamento**.[^italy-august]

Eccolo di nuovo, il nostro \(\lambda/2\).

Un interferogramma visualizza normalmente la fase *wrapped*, cioè confinata in un intervallo di ampiezza \(2\pi\). Quando la fase supera il limite, ricomincia il ciclo cromatico. Ogni giro completo è una frangia.

Per questo, se guardi un interferogramma co-sismico, quelle bande concentriche assomigliano un po' alle curve di livello di una carta topografica. Solo che non stanno contando metri di quota: stanno contando cicli di fase.

> **Caso reale — Italia centrale, agosto 2016**  
> Sentinel-1B acquisì l'area il 20 agosto e Sentinel-1A il 26 agosto, due giorni dopo il terremoto del 24. Nell'interferogramma pubblicato da ESA, sette cicli completi corrispondevano a circa 20 cm di deformazione LOS. È uno dei casi più puliti per collegare visivamente fase, frange e spostamento.[^italy-august]

C'è però un dettaglio che non va perso: **contare le frange non significa avere automaticamente lo spostamento tridimensionale del terreno**. Stiamo sempre osservando una proiezione lungo la LOS.

Su questo torniamo tra poco.

---

## L'interferogramma contiene più cose di quante ne vorremmo

A questo punto potremmo essere tentati di dire: differenza di fase uguale deformazione.

Ed è qui che casca l'asino.

La fase interferometrica non è un misuratore che restituisce direttamente il movimento. È una somma di contributi. Una forma utile per pensarla è:

$$
\Delta \phi =
\Delta \phi_{def}
+ \Delta \phi_{topo}
+ \Delta \phi_{orb}
+ \Delta \phi_{atmo}
+ \Delta \phi_{scatt}
+ \Delta \phi_{noise}
$$

La letteratura InSAR separa infatti il contributo della **deformazione** da quello della topografia residua, degli errori orbitali, dell'atmosfera, dei cambiamenti nello scattering e del rumore.[^phase-components]

Il nostro lavoro consiste nel togliere, modellare o ridurre tutto ciò che non è il segnale che stiamo cercando.

### La topografia

Due orbite leggermente differenti «vedono» il rilievo con geometrie diverse, e questo introduce un contributo di fase. Nel DInSAR si usa un **Digital Elevation Model** per simulare la componente topografica e sottrarla. Se il DEM contiene errori, una parte di quel contributo rimane e si comporta come topografia residua.

### L'atmosfera

Il segnale radar attraversa l'atmosfera due volte. Variazioni di pressione, temperatura, umidità e contenuto elettronico della ionosfera modificano il ritardo di propagazione. Se le condizioni sono diverse tra le acquisizioni, la differenza può finire dentro l'interferogramma e sembrare movimento.[^atmosphere]

### Le orbite

Orbiti imperfettamente note lasciano rampe e contributi a grande scala. Da qui l'importanza delle orbite precise e della modellazione geometrica.

### Il bersaglio stesso

Se tra due acquisizioni cambia il modo in cui la cella radar diffonde l'energia — vegetazione che cresce, neve che compare, terreno che si bagna, una frana che stravolge la superficie — la fase può diventare instabile.

Ed è qui che entra una parola che torna continuamente nell'InSAR: **coherence**.

---

## Coherence: quando due acquisizioni si riconoscono

La **coerenza interferometrica** misura la stabilità della relazione complessa tra le due acquisizioni. Viene normalmente espressa tra **0 e 1**: valori prossimi a 1 indicano una forte correlazione interferometrica; valori bassi indicano che la fase è diventata poco affidabile per stimare la deformazione.[^nasa-coherence]

Detta così sembra soltanto un indicatore di qualità. In realtà è più interessante.

La coerenza può diminuire perché le orbite sono troppo differenti, perché è passato troppo tempo, perché il terreno è cambiato, perché la vegetazione si è mossa, perché è comparsa neve, perché è cambiata l'umidità superficiale. ESA, nella propria pipeline di coherence Sentinel-1, cita esplicitamente dinamiche della vegetazione, copertura nevosa, umidità e movimenti di massa tra le cause della decorrelazione temporale.[^apex-coherence]

In altre parole, una bassa coerenza può dirti che il tuo interferogramma è poco affidabile. Ma può anche dirti che **sulla superficie è successo qualcosa**.

Questa doppia natura è facile da dimenticare.

> **Caso reale — Kåfjord, Norvegia**  
> Due acquisizioni Sentinel-1A del 30 agosto e del 23 settembre 2014 furono combinate per osservare una frana nel comune di Kåfjord, nella contea di Troms. Nei 24 giorni tra le due acquisizioni il terreno si era mosso di circa **1 cm**. Il caso è interessante perché mostra l'InSAR non come fotografia di un evento impulsivo, ma come strumento per seguire movimenti lenti di versante.[^kafjord]

> **Attenzione — Una frana veloce può essere più difficile di una lenta**  
> Se un evento modifica troppo la superficie tra due acquisizioni, i meccanismi di scattering possono cambiare al punto da perdere coerenza. L'InSAR non ha quindi un rapporto semplice del tipo «più grande è il movimento, più facile è misurarlo». Contano velocità, gradiente spaziale della deformazione, geometria e stabilità dello scattering. In alcuni casi la perdita di coerenza diventa essa stessa un'informazione utile per delimitare l'area cambiata.

---

## Wrapped, unwrapped e il problema dell'orologio

Torniamo per un attimo alla nostra lancetta dei secondi.

La fase osservata è wrapped: conosciamo la posizione nel ciclo, ma non sappiamo quanti giri completi ci siano stati. Per passare da un interferogramma a una mappa continua di spostamento dobbiamo ricostruire quei multipli di \(2\pi\).

È il **phase unwrapping**.

L'idea sembra semplice: se un pixel vale quasi \(+\pi\) e quello accanto quasi \(-\pi\), probabilmente non è avvenuto un salto fisico enorme; abbiamo semplicemente attraversato il confine convenzionale dell'intervallo di fase.

Nella realtà, però, il phase unwrapping può diventare uno dei passaggi più delicati della catena. Rumore, bassa coerenza e forti gradienti di deformazione possono produrre errori di un intero multiplo di \(2\pi\). E un errore di un ciclo, con Sentinel-1, significa circa 2,8 cm di errore LOS.

> **Definizione — Phase unwrapping**  
> È il processo con cui si ricostruisce una fase continua a partire dalla fase osservata modulo \(2\pi\), stimando quanti cicli completi vadano aggiunti ai diversi pixel. Un unwrapping sbagliato non introduce un piccolo rumore: può spostare intere zone di uno o più cicli.

Per questo la coherence map non è un allegato ornamentale dell'interferogramma. Ti dice dove stai chiedendo all'algoritmo di ricostruire una storia partendo da indizi robusti e dove, invece, gli stai chiedendo quasi di tirare a indovinare.

---

## Il satellite vede soltanto l'ombra del movimento

Immagina un bersaglio che si sposti di 10 cm verso est. Il satellite non misura «10 cm verso est». Misura quanto di quel vettore cade lungo la propria linea di vista.

Lo stesso movimento osservato da un'altra geometria produce una misura diversa.

Le orbite **ascending** e **descending** diventano quindi preziose perché osservano la stessa area da lati differenti. Sentinel-1 segue un'orbita quasi polare e guarda lateralmente: combinando geometrie diverse possiamo separare molto meglio la componente verticale e quella est-ovest, mentre la sensibilità alla componente nord-sud rimane intrinsecamente più debole.

Il terremoto dell'Italia centrale del 30 ottobre 2016 è un esempio quasi perfetto.

Gli esperti di CNR-IREA e INGV, analizzando le acquisizioni radar Sentinel-1, ricostruirono un quadro in cui l'area vicino a **Montegallo** si era spostata di circa **40 cm verso est**, quella di **Norcia** di circa **30 cm verso ovest**, mentre intorno a **Castelluccio** il terreno aveva subito una subsidenza fino a circa **60 cm**. Nei pressi di Norcia venne inoltre stimato un sollevamento di circa **12 cm**.[^italy-october]

Se avessimo guardato soltanto una singola LOS, avremmo ottenuto una proiezione di questa storia. Combinando geometrie differenti, il quadro diventa molto più leggibile.

> **Caso reale — Norcia e Castelluccio, ottobre 2016**  
> Questo caso è utile perché sposta il ragionamento dalla domanda «quanto si è mosso?» alla domanda corretta: **«quanto si è mosso, e in quale direzione rispetto alla geometria con cui lo sto osservando?»**[^italy-october]

> **Domanda da colloquio**  
> Perché ascending + descending non restituiscono automaticamente il vettore 3D completo?  
> Perché le geometrie SAR quasi polari hanno una sensibilità molto limitata alla componente nord-sud. In assenza di informazione aggiuntiva, la decomposizione robusta riguarda soprattutto verticale ed est-ovest.

---

## Un interferogramma è una fotografia. Una serie temporale è un film

Un singolo interferogramma può essere spettacolare dopo un terremoto. Ma se devo monitorare la subsidenza di una città, una frana lenta o la stabilità di un'infrastruttura, il punto non è sapere che cosa è successo tra martedì e domenica.

Voglio capire **come evolve il movimento nel tempo**.

È qui che entrano le tecniche **multi-temporali InSAR**.

Le due famiglie che compaiono più spesso sono la **Persistent Scatterer Interferometry (PSI)** e gli approcci **Small Baseline Subset (SBAS)**. La frontiera tra famiglie e implementazioni non è sempre netta — negli anni sono nate molte varianti e tecniche ibride — ma l'intuizione di fondo è abbastanza chiara.[^tsinsar-review]

### Persistent Scatterer Interferometry

La PSI cerca bersagli la cui risposta di fase rimanga stabile lungo una lunga sequenza di acquisizioni: i **Persistent Scatterer**.

In ambiente urbano sono spesso edifici, strutture metalliche, ponti o altri bersagli puntuali che continuano a comportarsi in modo coerente nel tempo. Una volta individuati, possiamo modellare separatamente deformazione, atmosfera, errori topografici residui e altri contributi e ricostruire per ciascun punto una velocità media e una serie temporale.[^psi-review]

### Small Baseline Subset

Gli approcci SBAS costruiscono invece una rete di interferogrammi scegliendo coppie con **baseline temporali e spaziali relativamente piccole**, proprio per ridurre la decorrelazione. La rete viene poi invertita per ricostruire l'evoluzione temporale dello spostamento.[^sbas-hpc]

Una semplificazione utile è questa: la PSI mette al centro la stabilità di bersagli persistenti; SBAS mette al centro una rete di coppie interferometriche scelte per contenere la decorrelazione. Nella pratica moderna, però, strumenti e idee possono contaminarsi e molte pipeline lavorano anche con **Distributed Scatterer**, cioè gruppi omogenei di pixel che non si comportano come un singolo scatterer puntuale ma contengono comunque informazione interferometrica sfruttabile.[^ds-review]

> **Definizione — Persistent Scatterer**  
> Un bersaglio radar che mantiene caratteristiche interferometriche sufficientemente stabili nel tempo da poter essere utilizzato per stimare deformazione e altri parametri attraverso una serie di acquisizioni.

> **Definizione — Distributed Scatterer**  
> Una regione composta da più scatterer con proprietà statisticamente simili. Preso singolarmente, un pixel può non avere la stabilità di un PS; trattando opportunamente un insieme omogeneo di pixel si può però recuperare informazione interferometrica utile.[^ds-review]

---

## Quando l'InSAR smette di essere un esperimento e diventa un servizio

Fin qui abbiamo ragionato come se stessimo costruendo un'analisi su un'area di studio.

Poi arriva lo **European Ground Motion Service**, EGMS, e la scala cambia completamente.

EGMS è il servizio del Copernicus Land Monitoring Service che usa dati InSAR derivati da Sentinel-1 per misurare i movimenti del terreno in Europa. I prodotti vengono aggiornati con cadenza annuale; nel prodotto Basic ogni punto di misura è associato a una velocità media LOS, a indicatori di qualità e a una serie temporale di spostamento.[^egms-overview] [^egms-basic]

La specifica tecnica arriva a dichiarare una **risoluzione della velocità media migliore di 1 mm/anno** e, per determinate classi di punti, deviazioni standard dell'ordine del millimetro per anno.[^egms-spec]

La cosa interessante, soprattutto se vogliamo capire come un'attività scientifica diventa operativa, è l'organizzazione del servizio.

Nel 2024 **e-GEOS è diventata Group Leader del consorzio ORIGINAL** incaricato dall'Agenzia Europea dell'Ambiente dell'implementazione e dell'operatività end-to-end di EGMS per il periodo **2024-2028**. Il servizio usa dati Sentinel-1 e, secondo e-GEOS, si appoggia anche all'infrastruttura HPC **davinci-1 di Leonardo** per sostenere la produzione a scala continentale.[^egeos-egms]

Questo passaggio mi sembra uno dei più interessanti di tutta la storia. L'InSAR non è più soltanto un algoritmo che produce un bell'interferogramma: diventa una **catena industriale di dati**, con requisiti di qualità, riproducibilità, aggiornamento, infrastruttura di calcolo e distribuzione del prodotto.

### Basic, Calibrated, Ortho

EGMS distribuisce tre livelli che aiutano anche a fissare le idee sulla geometria della misura.

| Prodotto | Che cosa contiene |
|---|---|
| **Basic (L2a)** | Misure di spostamento in LOS, relative a un riferimento locale, con serie temporali e metriche di qualità. |
| **Calibrated (L2b)** | Misure LOS calibrate su un riferimento derivato da GNSS, quindi confrontabili in un sistema di riferimento comune. |
| **Ortho (L3)** | Due componenti più immediate da interpretare: **verticale** ed **est-ovest**, ottenute combinando geometrie ascending e descending e utilizzando informazione GNSS per gestire la debole sensibilità nord-sud. |

La documentazione Copernicus sottolinea proprio questo punto: il prodotto Ortho combina look-angle differenti e restituisce layer verticali ed east-west su griglia di 100 m.[^egms-levels] [^egms-ortho]

---

## Metro C: pochi millimetri sotto una città enorme

C'è un caso che rende bene il salto dalla teoria alla città reale.

Nell'ottobre 2025, parlando delle applicazioni geospaziali di e-GEOS, **Emanuele Mele, responsabile InSAR Service**, ha citato il monitoraggio della **Metro C di Roma**. Durante la costruzione sono stati effettuati monitoraggi interferometrici per verificare la presenza di deformazioni in atto e osservare **subsidenza del terreno e compattazione nelle zone di scavo sotto il tessuto urbano**.[^metro-c]

Qui cambia anche il modo di interpretare il dato.

Dopo un terremoto cerchiamo una deformazione improvvisa che compare tra due epoche. Sotto una città vogliamo invece capire se un punto apparentemente immobile sta seguendo una tendenza lenta, se accelera, se mostra una discontinuità e se quella dinamica coincide con una fase di cantiere o con un'altra causa.

La serie temporale conta più del singolo numero.

> **Caso reale — Metro C, Roma**  
> L'InSAR diventa uno strumento di monitoraggio delle conseguenze di una grande opera nel sottosuolo urbano. Il valore non sta soltanto nella precisione della misura, ma nella possibilità di osservare molti punti contemporaneamente e seguirli nel tempo senza installare un sensore fisico su ciascuno di essi.[^metro-c]

Ed è forse qui che si vede meglio cosa rende speciale il remote sensing: non sostituisce automaticamente le misure a terra, ma cambia radicalmente **la scala alla quale possiamo decidere dove guardare**.

---

## Non tutti i radar parlano con la stessa voce

Sentinel-1 è un ottimo punto di partenza, ma non è l'unico sistema SAR che incontriamo in applicazioni interferometriche. Cambiando missione cambiano banda, lunghezza d'onda, risoluzione, revisit, geometrie disponibili, politiche di acquisizione e costi.

Una tabella aiuta a mettere ordine.

| Missione | Banda | Frequenza / lunghezza d'onda | Un tratto utile da ricordare |
|---|---|---|---|
| **Sentinel-1** | C | 5,405 GHz, \(\lambda\) ≈ 5,55 cm | IW: 250 km di swath, 5 × 20 m; acquisizioni sistematiche e dati Copernicus aperti. |
| **COSMO-SkyMed / CSG** | X | banda X | Elevata risoluzione e grande flessibilità operativa; CSG offre, per esempio, Stripmap nominale 3 × 3 m. |
| **RADARSAT-2 / RCM** | C | 5,405 GHz, \(\lambda\) ≈ 5,55 cm | Tradizione canadese in banda C; RADARSAT-2 offre polarizzazioni multiple e diverse modalità di imaging. |
| **SAOCOM** | L | 1,275 GHz, \(\lambda\) ≈ 23,5 cm | Lunghezza d'onda molto maggiore della C/X band; la missione argentina è pensata anche per applicazioni legate all'umidità del suolo. |

Le specifiche provengono dalle rispettive agenzie spaziali.[^s1-facts] [^csg-spec] [^radarsat-spec] [^saocom-spec]

La lunghezza d'onda non è un dettaglio da catalogo.

In generale, una **banda X**, più corta, può offrire grande sensibilità a piccoli cambiamenti e alte risoluzioni ma tende a essere più vulnerabile alla decorrelazione quando la scena cambia. La **banda L**, molto più lunga, interagisce più profondamente con la vegetazione e spesso mantiene coerenza più a lungo in aree vegetate. La **banda C** vive in mezzo e, con Sentinel-1, ha avuto soprattutto il vantaggio enorme di una politica di acquisizione sistematica e di una copertura molto ampia.

Detto questo, ridurre la scelta del sensore alla sola banda sarebbe un errore. Revisit time, risoluzione, polarizzazione, angolo d'incidenza, disponibilità delle acquisizioni, baseline e geometria della scena possono contare altrettanto.

> **Domanda da colloquio**  
> «Perché dovrei scegliere COSMO-SkyMed invece di Sentinel-1?»  
> Una buona risposta non parte da «X-band è migliore». Parte dal requisito: risoluzione, frequenza di osservazione, area da coprire, tipo di bersaglio, stabilità temporale, geometrie disponibili e vincoli economici. Solo dopo si sceglie il sensore.

---

## Un esempio italiano in banda X: il Parco archeologico di Sibari

Nel 2024 e-GEOS ha raccontato un progetto per il **Parco archeologico di Sibari**, area esposta sia a instabilità del terreno sia a rischio idraulico legato alle esondazioni del Crati.

Per il rischio di instabilità è stata predisposta una catena di monitoraggio basata su **metodologia InSAR e dati COSMO-SkyMed**; le informazioni sugli spostamenti vengono poi rese disponibili attraverso servizi di visualizzazione e interrogazione della piattaforma di data intelligence di Leonardo.[^sibari]

È un caso utile perché mette insieme diversi pezzi del puzzle: banda X, monitoraggio ripetuto, una catena operativa e un utente finale che non ha bisogno di «un interferogramma», ma di informazioni leggibili per decidere come proteggere un sito.

Il prodotto finale raramente coincide con la tecnica che lo ha generato.

---

## Dall'SLC alla mappa di deformazione

A questo punto ha senso rimettere in fila una catena di processamento tipica. I dettagli cambiano tra SNAP, ISCE, GAMMA, SARscape, MintPy, LiCSBAS e le pipeline proprietarie, ma la logica generale rimane riconoscibile.

1. **Selezione delle acquisizioni** compatibili per geometria, orbita, modalità e polarizzazione.
2. **Acquisizione dei prodotti SLC** e delle informazioni orbitali precise.
3. **Co-registrazione** delle immagini sulla stessa geometria radar.
4. **Formazione dell'interferogramma** e stima della coherence.
5. **Rimozione della fase topografica**, normalmente usando un DEM.
6. **Filtraggio interferometrico** quando opportuno, per ridurre il rumore di fase senza distruggere il segnale.
7. **Phase unwrapping** nelle aree in cui la fase è sufficientemente affidabile.
8. **Conversione della fase in displacement LOS** e scelta di un riferimento spaziale coerente.
9. **Geocoding e validazione** rispetto a dati esterni, GNSS, livellazione, inventari o conoscenza del fenomeno.
10. Se abbiamo molte acquisizioni, **stima della serie temporale**, dell'Atmospheric Phase Screen, delle velocità e degli altri parametri del modello.

Con Sentinel-1 IW si aggiungono aspetti specifici della modalità TOPS: gestione dei burst e delle sub-swath, co-registrazione azimutale molto accurata e deburst. È uno dei motivi per cui una pipeline operativa richiede molto più della sequenza di pulsanti che possiamo imparare in un tutorial.

> **Più in profondità — Cosa stiamo cercando di isolare?**  
> Alla fine della catena vogliamo che la fase residua sia dominata da \(\Delta\phi_{def}\). Tutto il resto — topografia residua, orbita, atmosfera, scattering instabile e rumore — è qualcosa da modellare, stimare, filtrare o almeno quantificare.

---

## Torniamo all'Emilia-Romagna

A questo punto posso tornare al progetto da cui ero partito.

Nel flood mapping con Sentinel-1 mi interessava osservare come cambiava il **backscatter** tra acquisizioni e come il preprocessing influenzasse la separazione tra superfici allagate e acqua permanente. Avevo lavorato con calibrazione, multilooking, rimozione del rumore termico, terrain correction e change detection.

Se volessi usare le stesse acquisizioni per un problema InSAR, però, la domanda cambierebbe completamente.

| Flood mapping SAR | InSAR per deformazione |
|---|---|
| L'informazione centrale è l'**ampiezza/backscatter**. | L'informazione centrale è la **differenza di fase**. |
| Posso lavorare con prodotti detected come GRD. | Ho bisogno della fase complessa, quindi tipicamente di **SLC**. |
| Cerco un cambiamento nelle proprietà elettromagnetiche della superficie. | Cerco una variazione di distanza lungo la **LOS**. |
| Una superficie che cambia molto può essere proprio il segnale che cerco. | Una superficie che cambia molto può distruggere la coerenza e impedirmi di misurare la fase. |
| La terrain correction serve a riportare correttamente il dato nello spazio geografico. | Il DEM entra anche nella modellazione e rimozione della **fase topografica**. |
| Il confronto può essere fatto sulle intensità calibrate. | Devo co-registrare con grande precisione i segnali complessi e gestire wrapping/unwrapping. |

È la stessa missione satellitare. Spesso persino la stessa scena.

Ma stiamo interrogando il dato in modo diverso.

Questa, secondo me, è la chiave per non vivere SAR e InSAR come due capitoli indipendenti di un manuale. Il pixel è sempre quello. Cambia la parte del segnale a cui decidiamo di dare ascolto.

---

## Quando l'InSAR non è la risposta giusta

Arrivati fin qui è facile innamorarsi della tecnica. Succede spesso con gli strumenti eleganti: appena impariamo come funzionano, iniziamo a vederli come soluzione naturale di ogni problema.

Meglio vaccinarsi subito.

L'InSAR soffre quando la superficie cambia troppo rapidamente tra acquisizioni, quando la copertura vegetale distrugge la stabilità di fase, quando neve e umidità cambiano il comportamento elettromagnetico, quando il movimento è orientato quasi perpendicolarmente alla LOS o quando il gradiente spaziale della deformazione è così forte da rendere ambiguo l'unwrapping.

Una frana molto rapida può quindi essere **meno** misurabile con DInSAR di una deformazione lenta e continua. Un movimento quasi nord-sud può essere importante sul terreno e quasi invisibile nella geometria SAR. Un'atmosfera sfavorevole può creare pattern che sembrano deformazioni. Un edificio può essere un eccellente Persistent Scatterer mentre il prato accanto diventa quasi muto.

Il punto non è ricordare una lista di limitazioni. È imparare a formulare, prima del processamento, la domanda giusta:

> **La geometria, la scala temporale e il tipo di superficie mi permettono di osservare il fenomeno che sto cercando?**

Se la risposta è no, nessun algoritmo a valle può recuperare informazione che il sensore non ha misurato in modo utilizzabile.

---

## Se l'ho capito davvero, dovrei saper rispondere a queste domande

Questa parte è quasi un test personale. Se una risposta richiede di tornare alle definizioni, va benissimo: significa che abbiamo trovato il punto da ripassare.

1. Perché per un interferogramma ho bisogno di un prodotto SLC e non mi basta un GRD?
2. Perché un ciclo completo di fase corrisponde a \(\lambda/2\) di displacement LOS e non a \(\lambda\)?
3. Quali contributi, oltre alla deformazione, entrano nella fase interferometrica?
4. Che cosa mi dice la coherence e perché una bassa coherence non significa sempre soltanto «dato brutto»?
5. Perché una superficie urbana tende spesso a offrire più Persistent Scatterer di un campo coltivato?
6. Perché un movimento grande può essere più difficile da misurare di uno piccolo?
7. Che cosa significa dire che l'InSAR misura lungo la LOS?
8. Che cosa guadagno combinando orbite ascending e descending, e quale componente rimane difficile da osservare?
9. Qual è l'intuizione che separa PSI e SBAS?
10. Se dovessi scegliere tra Sentinel-1, COSMO-SkyMed e SAOCOM, quali requisiti guarderei prima ancora di parlare di banda?
11. Perché un servizio come EGMS è un problema anche di data engineering e High Performance Computing, oltre che di remote sensing?
12. In che cosa il mio vecchio workflow di flood mapping Sentinel-1 assomiglia a una pipeline InSAR e in che cosa, invece, cambia radicalmente?

Se queste domande diventano conversazione e smettono di sembrare interrogazione, probabilmente il grosso del lavoro è fatto.

---

## Tirando le fila

La parte che trovo più affascinante dell'InSAR è che il risultato finale sembra quasi sproporzionato rispetto all'informazione di partenza.

Abbiamo un radar che manda un'onda, aspetta un'eco e registra un numero complesso. Poi facciamo ripassare il satellite, confrontiamo due fasi che da sole sono ambigue, togliamo la topografia, cerchiamo di capire cosa abbia fatto l'atmosfera, scartiamo le zone che hanno perso coerenza, ricostruiamo i cicli della fase e proiettiamo tutto lungo una geometria che non coincide quasi mai con la direzione che ci interessa davvero.

Sembra un castello fragile.

Eppure da questo castello vengono fuori i centimetri del terremoto di Amatrice, il centimetro di movimento di un versante norvegese, le serie temporali di un continente intero e la possibilità di seguire la subsidenza sopra gli scavi di una metropolitana.

Forse è proprio questo il punto. L'InSAR non è potente perché elimina l'ambiguità. È potente perché **la modella abbastanza bene da trasformarla in misura**.

E quando torni a guardare un'immagine Sentinel-1 dopo averlo capito, quel pixel non è più soltanto chiaro o scuro.

Ha anche una memoria.

---

## Fonti e approfondimenti

[^s1-facts]: European Space Agency, **Sentinel-1 — Facts and figures**. https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-1/Facts_and_figures

[^s1-instrument]: European Space Agency, **Sentinel-1 — Instrument**. https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-1/Instrument

[^s1-products]: Copernicus Sentinel-1, **Product Definition / Level-1 products**. I prodotti SLC sono complessi e conservano ampiezza e fase; i GRD sono detected. https://sentinels.copernicus.eu/documents/247904/1877131/Sentinel-1-Product-Definition.pdf

[^s1-baseline]: Copernicus Sentinel-1 Mission Performance Centre, **Sentinel-1A & Sentinel-1B Annual Performance Report 2018**, sezione sulla interferometric baseline. https://sentinels.copernicus.eu/documents/247904/3406423/Sentinel-1-Annual-Performance-Report-2018.pdf

[^nasa-handbook]: NASA Earthdata, **SAR Handbook — Chapter 2: Spaceborne Synthetic Aperture Radar**, sezione sui principi dell'Interferometric SAR. https://earthdata.nasa.gov/s3fs-public/2025-04/SARHB_CH2_Content.pdf

[^italy-august]: European Space Agency, **Italy earthquake displacement**, 26 agosto 2016. https://www.esa.int/ESA_Multimedia/Images/2016/08/Italy_earthquake_displacement

[^phase-components]: Pepe, A. & Calò, F., **A Review of Interferometric Synthetic Aperture RADAR (InSAR) Multi-Track Approaches for the Retrieval of Earth's Surface Displacements**, *Applied Sciences*, 2017. https://www.mdpi.com/2076-3417/7/12/1264

[^atmosphere]: Ding, X. et al., **Atmospheric Effects on InSAR Measurements and Their Mitigation**, *Sensors*, 2008. https://www.mdpi.com/1424-8220/8/9/5426

[^nasa-coherence]: NASA Earthdata GIS, **Interferometric Coherence** — descrizione del prodotto di displacement OPERA. La coherence è descritta come misura della similarità della fase radar tra due acquisizioni, da 0 a 1. https://gis.earthdata.nasa.gov/gis05/rest/services/DISASTERS_202606_EARTHQUAKE_VENEZUELA/202611_opera_displacement/ImageServer

[^apex-coherence]: ESA APEx Algorithm Catalogue, **Sentinel-1 Coherence**. https://algorithm-catalogue.apex.esa.int/apps/sentinel1_sar_coherence

[^kafjord]: European Space Agency, **Landslide risk monitoring with Sentinel-1**, 27 marzo 2015. https://www.esa.int/ESA_Multimedia/Images/2015/03/Landslide_risk_monitoring_with_Sentinel-1

[^italy-october]: European Space Agency, **Sentinel satellites reveal east–west shift in Italian quake**, 3 novembre 2016. https://www.esa.int/Applications/Observing_the_Earth/Copernicus/Sentinel-1/Sentinel_satellites_reveal_east_west_shift_in_Italian_quake

[^tsinsar-review]: Osmanoğlu, B. et al., **Radar Interferometry: 20 Years of Development in Time Series Techniques and Future Perspectives**, *Remote Sensing*, 2020. https://www.mdpi.com/2072-4292/12/9/1364

[^psi-review]: Crosetto, M. et al., **An Approach to Persistent Scatterer Interferometry**, *Remote Sensing*, 2014. https://www.mdpi.com/2072-4292/6/7/6662

[^sbas-hpc]: Zinno, I. et al., **High Performance Computing in Satellite SAR Interferometry: A Critical Perspective**, *Remote Sensing*, 2021. https://www.mdpi.com/2072-4292/13/23/4756

[^ds-review]: Even, M. & Schulz, K., **InSAR Deformation Analysis with Distributed Scatterers: A Review Complemented by New Advances**, *Remote Sensing*, 2018. https://www.mdpi.com/2072-4292/10/5/744

[^egms-overview]: Copernicus Land Monitoring Service, **European Ground Motion Service**. https://land.copernicus.eu/en/products/european-ground-motion-service

[^egms-basic]: Copernicus Land Monitoring Service, **European Ground Motion Service: Basic**. https://land.copernicus.eu/en/products/european-ground-motion-service/egms-basic

[^egms-spec]: Copernicus Land Monitoring Service, **EGMS Product Description and Format Specification**. https://library.land.copernicus.eu/products/European_Ground_Motion_Service_Product_Description_v3.html

[^egeos-egms]: e-GEOS, **Rilevare e misurare i movimenti del terreno dallo Spazio: e-GEOS alla guida del progetto europeo**, 18 luglio 2024. https://www.e-geos.it/press-release/rilevare-e-misurare-i-movimenti-del-terreno-dallo-spazio-e-geos-alla-guida-del-progetto-europeo/

[^egms-levels]: Copernicus Land Monitoring Service, **What European Ground Motion Service products are made available to the user?** https://land.copernicus.eu/en/faq/products/european-ground-motion-service/what-products-are-made-available-to-the-user

[^egms-ortho]: Copernicus Land Monitoring Service, **EGMS Explorer Manual / Ortho product description**. https://land.copernicus.eu/en/technical-library/egms-end-user-interface-manual/@@download/file

[^metro-c]: Telespazio, **Smart city, dati satellitari per governare le metropoli del futuro**, 7 ottobre 2025. Intervento di Emanuele Mele, responsabile InSAR Service di e-GEOS. https://www.telespazio.com/it/focus-detail/-/detail/space-panorama-episodio-4

[^csg-spec]: Agenzia Spaziale Italiana, **COSMO-SkyMed Seconda Generazione — System and Products Description**. https://www.asi.it/wp-content/uploads/2021/02/CSG-Mission-and-Products-Description_issue-A-1.pdf

[^radarsat-spec]: Canadian Space Agency, **RADARSAT satellites: Technical comparison**. https://www.asc-csa.gc.ca/eng/satellites/radarsat/technical-features/radarsat-comparison.asp

[^saocom-spec]: CONAE, **SAOCOM Mission Products Definition**. https://catalogos.conae.gov.ar/Catalogo/docs/SAOCOM/SAOCOM%20Mission%20Products%20Definition.pdf

[^sibari]: e-GEOS, **Giornata Internazionale dei Monumenti e dei Siti 2024** — monitoraggio del Parco archeologico di Sibari con InSAR e COSMO-SkyMed. https://www.e-geos.it/news-stories/giornata-internazionale-dei-monumenti-e-dei-siti-2024/
