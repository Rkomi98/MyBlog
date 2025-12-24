# Rust: il linguaggio del momento
In questo articolo voglio rispondere alla domanda che più spesso ho ricevuto e ho deciso di iniziare una serie intera su Rust proprio con questa domanda: 

> Perché Rust mette così paura?

Per questo mi sono posto una domanda:

> Perché sembra difficile all'inizio (e perché in realtà non lo è)?

Spoiler sebbene sia una domanda semplice merita un articolo intero.
## Introduzione

Intanto cos'è Rust? Lo potrei definire come:

> Rust è un linguaggio di programmazione che punta a prestazioni e sicurezza della memoria senza l'utilizzo di garbage collector.

Rust è spesso celebrato come uno dei linguaggi "più amati" dagli sviluppatori.

Oddio, o lo conosci bene e lo ami, oppure lo temi e lo eviti

Diciamo che, chi lo conosce bene può confermare, questo garantisce prestazioni elevate, sicurezza nella gestione della memoria e un ecosistema moderno. Eppure, chi si avvicina a Rust provenendo da altri linguaggi spesso lo trova **ostico e frustrante** nei primi tentativi. 

La curva di apprendimento di questo linguaggio la definirei a dir poco leggendaria: c'è chi l'ha definita _ripida_ - anzi ["verticale"](https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=it's%20vertical), e racconta di aver ["urlato contro il compilatore"](https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=Learning%20Rust%20can%20feel%20like,intellectual%20hazing) durante i primi esperimenti. 

[Molti](https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=The%20borrow%20checker%20will%20make,don%E2%80%99t%20know%20how%20to%20code) arrivano a chiedersi se il problema siano loro stessi ("**sono io che non so programmare?**") quando vedono errori su errori dal compilatore Rust.

Vale quindi la pena chiedersi: Rust è davvero **intrinsecamente difficile**, oppure richiede semplicemente di adottare un **modello mentale diverso**? In questo articolo esploreremo l'idea che Rust _sembri_ difficile inizialmente non perché sia un linguaggio mal progettato (anzi, proprio il contrario), ma perché **mette in discussione abitudini e assunzioni** che gli sviluppatori portano da linguaggi più permissivi. Vedremo quali sono queste assunzioni, in che modo Rust le infrange sistematicamente, e come dopo il "**click mentale**" iniziale Rust possa trasformarsi da nemico apparentemente ostile a fidato alleato nello sviluppo quotidiano.

Alla fine, se ti senti frustrato con Rust, il messaggio è: **non sei tu il problema**. È normale all'inizio "litigare con il compilatore", ma con un cambio di prospettiva capirai che Rust non è più difficile degli altri linguaggi, è solo diverso. E quella differenza, una volta capita, **ripaga** con codice più solido, meno bug e una maggiore fiducia nello sviluppo del codice.

## Difficoltà vs complessità: misurare la "difficoltà" di un linguaggio

Prima di tutto, voglio chiarire per bene una cosa: cosa significa davvero che un linguaggio di programmazione è "difficile"? 

Spesso si confonde la **complessità intrinseca** di un linguaggio con la **difficoltà percepita** nell'impararlo. Possiamo distinguere vari tipi di complessità/difficoltà:

- **Complessità sintattica:** quanto è intricato o verboso il linguaggio in termini di simboli, parole chiave e regole grammaticali.
- **Complessità concettuale:** quanti concetti nuovi o non familiari bisogna apprendere (es. gestione esplicita della memoria, modelli di concorrenza, sistema di tipi avanzato).
- **Complessità "operativa":** quanto è difficile tradurre le intenzioni in codice funzionante. Ad esempio, quanto "sforzo" serve per ottenere un programma corretto e performante, o per debug/refactor.

Spesso si etichetta Rust come "difficile" perché eccelle in alcune di queste dimensioni: ha una sintassi ricca di simboli (, <'a>, &mut, ::, ecc.), introduce concetti nuovi come _ownership/borrowing_ e lifetimes, ed è inflessibile nell'operatività (se non è tutto perfettamente corretto, non compila). Insomma devo dire che non trovo troppe differenze con me!

Scherzi a parte, questa è una solo una visione parziale.

### La curva di apprendimento

È importante mettere in prospettiva la curva di apprendimento di Rust. Imparare un linguaggio **non** significa solo impararne la sintassi base, ma anche i suoi idiomi, il modello di librerie standard e le pratiche di design comuni. Non lo dico io, ma Julio Merino nel suo [blog](https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=Let%E2%80%99s%20first%20start%20by%20stating,not%20months%2C%20of%20frequent%20practice).

Lui sostiene che linguaggi come Python o Go hanno una sintassi essenziale che si impara praticamente "in un giorno", ma **richiedono comunque mesi** per padroneggiare idiomi e librerie in modo produttivo. In questo senso, Rust non è poi così diverso: richiede magari qualche giorno in più per afferrare le basi, ma nel **grande schema del tempo** necessario a diventare competenti, questa differenza iniziale si [ammortizza](https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=learning%20are%20amortized). Insomma, **tutti** i linguaggi richiedono tempo e pratica; Rust ne richiede semplicemente un po' di più all'inizio, "accogliendoti" con più informazioni e vincoli subito, invece di lasciarteli scoprire solo in seguito.

Un errore comune è paragonare Rust a linguaggi cosiddetti "facili" guardando solo la produttività del day 1. Ad esempio, Go o Python ti permettono di scrivere uno script funzionante dopo poche ore, mentre con Rust potresti impantanarti su errori del borrow checker. Ma ciò non significa che dopo tre mesi di utilizzo Go sia "più facile" di Rust. 

In realtà significa solo che quei linguaggi ti [**illudono di essere produttivo subito**](https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=The%20problem%20is%20that%20simpler,can%20be%20deployed%20or%20released), magari a costo di produrre codice non ottimale o non robusto all'inizio. Il primo programmino scritto in fretta in un linguaggio "facile" spesso è lontano dagli standard per la produzione software. Rust, al contrario, ti chiede di pensare di più all'inizio, cosicché **il codice che scrivi una volta compilato tende già ad essere solido**.

### Non è difficile, devi solo pensare diversamente
Un'altra prospettiva utile: _Rust non è difficile in senso assoluto, ma "sposta" la difficoltà su aspetti diversi_. Richiede di ragionare a un livello più vicino al computer rispetto a linguaggi ad alto livello. In altre parole, Rust **ti chiede fin da subito di capire cosa succede sotto**, come con la gestione della memoria, concorrenza, tipi. 

Come sostiene lo stesso Merino, molti programmatori oggi (soprattutto quelli formatisi con linguaggi come Python, Java, C# o JavaScript) non hanno mai dovuto preoccuparsi di come funziona l'allocazione della memoria o cosa succede davvero in un thread, perché vivevano in un mondo con garbage collector, runtime e astrazioni che _nascondono_ questi dettagli. 

Rust cade nel filone più tradizionale dei linguaggi di sistema: niente garbage collector; risorse gestite con regole di scoping (simile a RAII in C++); nessuna scorciatoia per evitare data race se non attraverso regole ferree di aliasing e mutabilità. 

Di conseguenza, _se hai un solido background in C/C++_, Rust non ti sembrerà così alieno. Anzi, uno sviluppatore C o C++ abituato a puntatori e RAII troverà Rust **abbastanza naturale**, probabilmente. Ma uno sviluppatore che ha usato altri linguaggi dovrà imparare concetti che prima ignorava completamente. La buona notizia è che questi concetti (come funziona la memoria, cos'è una race condition, ecc.) [**si possono imparare**](https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=The%20good%20thing%20is%20that,language%20you%20write%20code%20in) e anzi impararli ti renderà un programmatore migliore anche negli altri linguaggi. In altre parole, Rust "ti costringe" a un corso accelerato di fondamentali di informatica che altrove potresti rimandare.

In sintesi, quando diciamo che Rust è difficile, dobbiamo chiederci: è davvero _più complesso_ di altri linguaggi, o sta semplicemente portando alla luce complessità che altrove vengono nascoste? Spesso è vero il secondo caso. Il corollario è che giudicare Rust con le stesse metriche con cui giudichiamo un linguaggio scripting rischia di essere fuorviante. Rust fa un trade-off: **chiede più rigore al programmatore**, ma in cambio offre più aiuto del compilatore e meno sorprese a runtime. Per parafrasare un famoso detto di [Bjarne Stroustrup](https://mmapped.blog/posts/15-when-rust-hurts#:~:text=Bjarne%20Stroustrup), ideatore di C++: _"Ci sono due tipi di linguaggi: quelli di cui la gente si lamenta, e quelli che nessuno usa"_. Il fatto che molti trovino Rust arduo all'inizio non è un "verdetto di condanna", lo considerei più un marchio di crescita e ambizione del linguaggio.

## Assunzioni da dimenticare

Per capire perché Rust spiazza tanti programmatori, dobbiamo esaminare il "**bagaglio mentale**" che portiamo da altri linguaggi. Ogni linguaggio di programmazione crea nei suoi utenti delle aspettative su come le cose _dovrebbero funzionare_. Rust, con le sue regole, **viola intenzionalmente molte di queste aspettative**, costringendoci a ripensare il modo in cui progettiamo il codice. Ecco alcune assunzioni comuni che sviluppatori di Java, Python, JavaScript, C# (ma anche C/C++ in parte) potrebbero avere, e come Rust le smentisce:

### La gestione della memoria non è affar mio

In linguaggi con _garbage collector_ (Java, C#, Go, JavaScript, etc.), lo sviluppatore alloca oggetti liberamente e un sistema automatico li libera in background quando non servono più. In Rust [non c'è GC](https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=Rust%20falls%20in%20the%20more,computer%E2%80%99s%20processor%20and%20memory%20model): la memoria viene gestita tramite _ownership_ e _scope_. Questo significa che devi pensare esplicitamente a **chi possiede un dato e fino a quando**, perché appena esce dallo scope viene rilasciato automaticamente. 

Questo potrebbe traumatizzare chi viene da linguaggi GC. Mi aspetto domande del tipo: "Ma come, devo preoccuparmi che questa stringa sparisca tra quelle visibili?" 

In realtà Rust lo fa in automatico, ma _solo_ se le regole di ownership sono rispettate; se cerchi di violarle (ad esempio restituendo un riferimento a un valore che va fuori scope) il compilatore ti fermerà. Dunque Rust ti forza a **considerare la durata delle risorse** sin dal design delle funzioni, cosa a cui altrove non eri abituato.

### Assegnare o passare variabili in giro è innocuo

Chi viene da Python/Java pensa che fare x = y copi un riferimento e lasci y intatto, o comunque che passare una variabile a una funzione non la **invaliderà** al ritorno. In Rust, al contrario, assegnare o passare un valore **sposta** (move) il possesso di quel valore, a meno che il tipo non sia Copy. 

Ad esempio:

```rust
let s = String::from("hello");
let s2 = s;
```

Dopo queste due righe s non è più utilizzabile, perché la _String_ è stata mossa in s2, quasi come se fosse un [rifiuto radioattivo](https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=radioactive). 

In molti linguaggi questo concetto non esiste (l'oggetto rimarrebbe condiviso o ci sarebbe una copia di default); in Rust invece, come ho già detto, è il comportamento predefinito. All'inizio sembra che Rust tratti le variabili "come scorie radioattive che puoi toccare solo una volta", ma in realtà sta prevenendo aliasing incontrollato e duplicazioni di memoria inaspettate. Sta a te decidere quando clonare esplicitamente un dato, rendendolo _visibile_ nel codice, piuttosto che lasciare al linguaggio fare copie in modo blackbox. Questa è una grossa differenza di mentalità.
### "Posso avere più riferimenti a un oggetto e modificare tutto liberamente."

Nei linguaggi Object-Oriented (OO) tradizionali, è normale avere più alias verso lo stesso oggetto (ad es. diversi variabili che puntano allo stesso array/dizionario) e modificare l'oggetto attraverso uno qualsiasi di questi riferimenti. Rust invece impone regole di aliasing molto rigide: o hai un solo riferimento mutabile, _oppure_ puoi avere più riferimenti immutabili, ma non entrambi contemporaneamente. Non puoi modificare qualcosa se qualcun altro ne sta leggendo una copia, e viceversa, a pena di errore di compilazione. 

Questa restrizione (che inizialmente pare esagerata) in realtà elimina intere categorie di bug (data race, invalidazioni concorrenti, iteratori invalidi, ecc.). Ma per chi viene da ambienti dove "tutto è legato a quel puntatore e ci penso io a sistemare tutto insieme", è un cambio drastico.

Possiamo dire che Rust non "si fida" e ti obbliga a design più chiari su chi scrive e chi legge una certa risorsa in un dato momento.

### "Le eccezioni gestiscono gli errori; non devo verificarli dappertutto."

Molti linguaggi usano _exception_ per segnalare errori a runtime: se qualcosa va storto, si lancia un'eccezione che può propagarsi sullo stack fino a quando viene catturata. In questi linguaggi il flusso d'errore è **implicito**: una funzione può fallire e lanciare qualcosa senza dichiararlo esplicitamente nella firma (a meno di meccanismi come throws di Java, spesso bypassati con eccezioni runtime). 

Rust invece adotta un approccio totalmente diverso: gli errori sono valori, rappresentati da 

```rust 
Result<T, E>
```
 Non c'è un meccanismo di eccezione non dichiarata: se una funzione può fallire, deve restituire un Result (o "va in panico", ma il [_panic_](https://medium.com/rustaceans/rust-errors-arent-exceptions-87ce365d4dff#:~:text=Only%20panic%20when%20necessary) in Rust è riservato a condizioni eccezionali e non recuperabili). 
 
 Molti che arrivano da Java/C# inizialmente trattano Result come se fosse solo "una sintassi diversa per fare eccezioni", ma questa forma mentis  **non funziona** e porta solo ad altri problemi. 
 
 In Rust sei costretto a pensare all'errore come parte del normale flusso di programma (perciò _esplicitarlo_ col tipo con cui esegui il "return") e a gestirlo laddove avresti invece ignorato una possibile eccezione. 
 
 Questa è una delle frizioni più evidenti per chi arriva da linguaggi con eccezioni: quella sensazione di "verbosità" in Rust (controllare ogni risultato, usare `?` o `match` per propagare/gestire errori) non è un caso, ma un disegno deliberato per garantire maggiore affidabilità. 
 
 Come sintetizza bene uno [sviluppatore italiano](https://medium.com/rustaceans/rust-errors-arent-exceptions-87ce365d4dff): 
 
 >_"Uno degli errori più comuni è portare in Rust l'idea che Result sia solo un modo prolisso di fare eccezioni. Quel modello mentale si rompe subito e la frizione che senti non è un difetto di Rust, è il segnale che sotto c'è qualcosa di concettualmente diverso"_. 
 
 In Rust **l'errore è un dato, non un evento**, comprenderlo cambia totalmente l'approccio ad un modo di programmare in modo più robusto.

### L'abitudine con la programmazione ad oggetti.

Chi proviene da Java, C# o anche Python (che pur non avendo solo programmazione OO, fa largo uso di classi) potrebbe approcciare Rust cercando di riprodurre pattern OO classici: ereditarietà, gerarchie di classi, design basati su oggetti mutabili con metodi interni, getter/setter, ecc. 

Rust _non_ è un linguaggio strettamente OOP! Per carità, supporta alcuni aspetti (si possono avere metodi associati a strutture, implementare trait che sono un po' come interfacce, ecc.), ma manca l'ereditarietà classica e scoraggia certi pattern tipici di Java. 

Questo **influenza pesantemente** come strutturare i programmi e a cosa devi prestare attenzione. 

Ad esempio, pensiamo al [mondo Java](https://users.rust-lang.org/t/rust-is-a-nightmare-to-learn-coming-from-java/37650). In Java è comune modellare relazioni _genitore-figlio_ tra oggetti (es. un Employee che estende Person), mentre in Rust useresti probabilmente composizione o enum varianti, evitando di condividere mutabilità complessa tra strutture. 

Un programmatore Java potrebbe chiedersi "dov'è la mia ArrayList modificabile globalmente? Come posso specializzare questa classe?", e la risposta di Rust sarà: non ce le hai così come le conosci, devi "pensare in modo diverso!". 

### "Il runtime si occuperà dei dettagli (IO, thread, ecc.)."

Linguaggi ad alto livello spesso astraggono pesantemente il sistema sottostante. Ad esempio, in Python puoi creare thread senza preoccuparti di _shared memory_ perché l'interprete ha il GIL. In Java fai partire thread o async task confidando nel GC e nella JVM per gestire scheduling e memoria condivisa (salvo sincronizzazioni). 

Rust invece ti espone direttamente molti dettagli: se fai programmazione concorrente asincrona, devi sapere cos'è un Future e che non parte da solo senza un _executor_; devi assicurarti che i dati condivisi tra thread implementino Send e Sync (il compilatore te lo impone altrimenti) e magari usare esplicitamente `Arc<Mutex<T>>` per la condivisione mutua sicura. Insomma, **ti accorgi di dover "micro-gestire" aspetti che altrove erano impliciti**. 

Questo può far sembrare Rust scomodo per certe cose (ad esempio, la programmazione _async_ in Rust è notoriamente più verbosa e rigida rispetto a quella in Python/JavaScript, dove "basta" usare async/await. 

In realtà, ancora una volta, Rust ti costringe a fronteggiare complessità, come la concorrenza o il multithreading, fin dall'inizio, mentre altrove potresti ignorarle fino a quando non emergono bug da cui non sai come uscire.

Questo elenco potrebbe continuare, ma il punto chiave è: _molte frustrazioni iniziali con Rust derivano dal cercare di usare in Rust le stesse abitudini mentali di prima_. Come ha ammesso un [sviluppatore Java](https://users.rust-lang.org/t/rust-is-a-nightmare-to-learn-coming-from-java/37650/4) dopo i primi tentativi: il problema principale all'inizio era **"provare a scrivere in Rust come avrei scritto in Java"**, un errore che portava a impantanarsi di continuo. Solo quando ha accettato che Rust "non è Java" e richiede di ragionare in modo diverso, ovvero in modo **più attento, più esplicito, considerando aspetti di basso livello che la JVM nascondeva**, ha iniziato a progredire. In Rust devi disimparare certe scorciatoie o aspettative. All'inizio questo è faticoso e può sembrare che Rust _complichi_ tutto inutilmente. Ma come vedremo, c'è un motivo per ogni apparente complicazione.

Prima di passare oltre, vale la pena notare un [fenomeno curioso](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=Your%20learning%20pace%20doesn%E2%80%99t%20have,your%20attitude%20toward%20the%20language): **talvolta gli sviluppatori junior imparano Rust più facilmente dei veterani**. Questo perché, non avendo decenni di abitudini consolidate, i nuovi arrivati possono adattarsi al modello di Rust più rapidamente, mentre chi ha lunga esperienza con altri linguaggi potrebbe dover "combattere il proprio istinto" più a lungo. 

Come viene scritto [in questo articolo](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=I%20have%20seen%20junior%20devs,Leave%20your%20hubris%20at%20home) in cui l'autore sostiene di aver visto: 
> junior senza esperienza precedente eccellere in Rust, mentre senior developer blasonati arrancare o addirittura arrendersi, per via della difficoltà a mettere in discussione i propri pattern mentali. 

In Rust vince chi sa _imparare ad imparare_, chi accetta di tornare principiante e di "lasciare l'ego a casa". Dunque se trovi Rust difficile e programmi da anni, sappi che è normale: stai riforgiando il tuo modo di pensare, e pochi anni di esperienza altrove potrebbero rivelarsi meno utili del previsto finché non riallinei la tua mentalità.

## L'esplicitezza come scelta di design

Molte delle differenze di Rust si possono riassumere in un principio: **esplicito è meglio che implicito** 
> Suona familiare? È uno dei principi di design di Python, ma Rust lo porta a un livello ancora più alto 

Gli autori di Rust hanno fatto scelte precise per _non_ fare automaticamente certe cose che altri linguaggi fanno dietro le quinte, costringendo il programmatore a dichiarare le proprie intenzioni in modo formale nel codice. Questo può inizialmente dare l'impressione di verbosità eccessiva, ma è pensato per prevenire sorprese e aumentare la chiarezza e sicurezza del codice.

Abbiamo già visto esempi di esplicitezza: la mutabilità va dichiarata con mut altrimenti è tutto immutabile; le conversioni di tipo non avvengono implicitamente (Rust non convertirà un u32 in usize o una String in &str senza che tu lo dica esplicitamente); la gestione degli errori è nella firma della funzione; la condivisione mutabile tra thread richiede costrutti espliciti (Arc/Mutex). 

A queste possiamo aggiungere: niente _implicit type coercion_ (ogni cast deve essere esplicito, per evitare perdite di dati inattese), niente inizializzazioni di default magiche (devi inizializzare le variabili prima dell'uso, non esiste il concetto di default uninitialized che diventa un bug se dimenticato), e così via. Perfino caratteristiche avanzate come i _trait object_ in Rust richiedono sintassi esplicita (`Box<dyn Trait>`) invece di fare automaticamente _boxing_ o _virtual dispatch_ senza che te ne accorga.

Perché tutta questa enfasi sull'esplicito? **Perché elimina ambiguità e responsabilizza il programmatore**. Quando leggi codice Rust, vedi chiaramente cosa accade: quali variabili possono cambiare e quali no, dove può verificarsi un errore, chi possiede un certo dato e fino a quando. Nei linguaggi più permissivi spesso devi _dedurre_ questi aspetti (e a volte li deduci sbagliando, causando bug). Rust ti obbliga a scriverli nero su bianco. Questo comporta sicuramente più caratteri da digitare e più concetti da maneggiare, ma produce codice che, una volta compilato, **è molto affidabile**.

Per fare un [paragone](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=If%20you%20come%20from%20a,scale%20applications) con un linguaggio che tutti (o quasi) conosciamo: Python è notoriamente conciso ed "elegante", mentre Rust può sembrare verbose o "ugly". È vero che un programma Rust ha più annotazioni (tipi generici <T>, lifetime <'a>, ecc.) rispetto a un equivalente Python. Ma quella verbosità serve a qualcosa. 

Come spiega un esperto, **la verbosità di Rust ha benefici concreti nello sviluppo su larga scala**. 
1. **Leggibilità**: passerai più tempo a _leggere_ codice (tuo o altrui) che a scriverlo, e avere i tipi e mutabilità visibili nel codice ti dà più contesto locale per ragionare su cosa sta facendo una funzione. 
2. [**Secondo**](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=dismiss%20the%20language%20right%20away): facilita il _refactoring_: se vuoi modificare la struttura di un programma Rust, il compilatore ti guiderà evidenziando ogni punto in cui devi apportare cambiamenti (perché se dimentichi di aggiornare un uso, semplicemente non compila). 

In linguaggi dinamici o con meno controlli, puoi rinominare una funzione o cambiare il tipo di un argomento rompendo dieci chiamate in altre parti del codice e non accorgertene se non a runtime (o mai, se quella parte di codice non è ben coperta da test). In Rust invece **il compilatore è il tuo safety net** durante le ristrutturazioni: finché non torna tutto a compilare, sai di avere sistemato ogni punto necessario. Questo incoraggia a migliorare continuamente il codice senza paura di introdurre regressioni.

Un aspetto in cui l'esplicitezza di Rust è evidente è la gestione della memoria e risorse. Abbiamo accennato che Rust non fa pulizia automatica periodica come un GC, al contrario, utilizza il sistema di ownership per liberare risorse non appena escono di scope. Anche qui, Rust privilegia la prevedibilità: la memoria viene liberata in modo **deterministico** e visibile dal contesto (sai che alla fine di quel blocco quell'oggetto viene rilasciato). Ciò evita tutta una classe di problemi come il tempo di stop non deterministico dei GC, ma implica che devi pensare ai legami di vita (lifetimes) tra dati. In pratica Rust chiede di specificare i lifetimes solo quando non riesce a capirli da solo: questo è un altro esempio di equilibrio tra implicito ed esplicito. 

Spesso il compilatore può inferire i lifetimes, ma se c'è ambiguità ti darà un errore chiedendoti di specificarli tu. Il messaggio d'errore tipicamente dice qualcosa tipo _"questa funzione necessita di un parametro lifetime esplicito"_ e magari ti mostra perfino come aggiungerlo. In quel momento, sta **insegnando** qualcosa: se ci pensi, perché il compilatore non riesce a inferire quel lifetime? Forse la relazione tra le reference restituite non è ovvia, e specificando 
```rust 
fn foo<'a>(x: &'a str) -> &'a str
```
stai rendendo chiaro a te stesso e agli altri che l'output vive finché vive l'input. Questo è un esempio di come Rust ti fa essere esplicito non per sadismo, ma per rendere **cristalline le dipendenze** e prevenire comportamenti indesiderati. 

Come suggerisce [Matthias Endler](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=So%20you%20don%E2%80%99t%20have%20to,couldn%E2%80%99t%20figure%20it%20out%20itself), è utile _"non solo seguire le istruzioni del compilatore, ma chiedersi_ perché _ha bisogno di quell'informazione"_: spesso scoprirai che stai imparando qualcosa sul design delle tue funzioni.

Ownership, mutabilità, lifetimes, error handling esplicito, tutte queste scelte di design riflettono una filosofia: **il linguaggio preferisce che tu dichiari le cose, invece di indovinarle lui per te**. 

Un vantaggio ulteriore di questo approccio è che **ti "allena alla precisione"**. In altri linguaggi puoi permetterti di essere "approssimativo" o negligente su certe cose (es: usare una variabile non inizializzata, dimenticare di chiudere un file, non considerare un caso d'errore) e il programma comunque gira, salvo poi magari fallire in modi imprevisti a runtime. In Rust no. Diciamo che _"puoi essere disattento in altri linguaggi, ma non in Rust"_. 
> Devi essere accurato, "il modo con cui fai qualcosa è il modo con cui fai tutti", dice un [antico proverbio su Rust](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=%20An%20ancient%20Rust%20proverb)

Rust ti costringe ad essere accurato durante la scrittura, o il codice semplicemente non compila. Questo può sembrare un freno alla produttività ("accidenti, devo stare attento a ogni dettaglio!"), ma l'idea è che tutta la cura che metti prima nel soddisfare il compilatore **ti fa risparmiare tempo dopo** in debug e caccia ai bug. 

È come se Rust ti chiedesse: preferisci passare due ore ora a capire perché il borrow checker non ti lascia fare questa cosa, oppure due giorni tra un mese a debuggare un segfault/imprecisato crash in produzione? Preferisci aggiungere un case di errore adesso, o ricevere una chiamata alle 3 del mattino perché un'eccezione non gestita ha buttato giù il servizio? Rust ti fa **pagare i debiti tecnici in anticipo**, costringendoti a scrivere codice più completo e corretto fin da subito. 

Un esempio concreto di "costo di cerimonia" di Rust che è anche un beneficio in incognito: in molti linguaggi puoi riutilizzare la stessa variabile più volte senza pensarci; in Rust, se vuoi riutilizzare un valore dopo averlo passato, magari devi fare una copia esplicita con .clone(). Questo all'inizio pare noioso - "perché devo scrivere .clone()? Non potrebbe fare da solo una copia quando serve?". Ma Rust, in realtà, ti sta chiedendo: _sei sicuro di voler fare una copia? sai che questo ha un costo di performance?_ Insomma, ti obbliga a considerarlo. 

In sintesi, l'esplicitezza di Rust è una scelta di design consapevole che rispecchia la sua "personalità" severa ma giusta. Può far apparire Rust più complesso sulla carta (più parole chiave, più annotazioni, più regole da seguire), ma ciascuno di questi apparenti fardelli è lì per uno scopo. E soprattutto, una volta interiorizzati, **smettono di essere fardelli**. Un programma Rust idiomatico a un occhio allenato risulta chiaro e pulito quanto (se non più) di un programma Python, solo che richiede di _allenare_ quell'occhio. Per arrivarci, però, bisogna prima superare una fase in cui sembra di affogare nei dettagli: ed è qui che entra in gioco il ruolo del compilatore come guida/supporto (chiamalo come ti pare).

## Il compilatore di Rust: da nemico ad alleato

Molti sviluppatori, nei primi giorni con Rust, vivono un rapporto di amore-odio col **compilatore**. Più odio che amore, a dire il vero. I messaggi di errore di Rust sono famosi per la loro lunghezza e meticolosità nel descrivere cosa c'è che non va. Un novizio li vede comparire a dozzine e può avere l'impressione che il compilatore sia **ostile**, quasi _punitivo_. Non a caso si parla di "_fighting the compiler_" - combattere il compilatore, o nello specifico ["_fighting the borrow checker_"](https://practice.course.rs/fight-compiler/intro.html). 

Chi arriva da linguaggi permissivi, dove magari il compilatore (se c'è) si lamenta poco e lascia che il programma giri fino a che durante il _runtime_ non esploda qualcosa, trova sconvolgente un compilatore che sembra voler impedire di scrivere anche le cose più banali. 

Ogni volta che penso a questo penso ad una vignetta che personifica il compilatore Rust come un severo insegnante che bacchetta lo studente per ogni minimo errore, contro l'insegnante di altri linguaggi che invece lascia passare anche scemenze salvo poi far fare brutta figura all'esame (il runtime).

![Vignetta sul compilatore Rust](../Assets/RustVsTutti.png)

_Figura 01: Vignetta in cui Rust con la maschera di un professore severo “bacchetta” mentre gli altri compilatori lasciano correre. Le conseguenze si vedono poco dopo_

All'inizio, **è normale percepire il compilatore come un nemico**. "Scrivo una funzione che in qualsiasi altro linguaggio funzionerebbe, e Rust mi sputa tre paragrafi di diagnostica arrabbiata" [racconta un sviluppatore](https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=just%20when%20you%20think%20you%E2%80%99ve%20fixed%20it,%20it%20gives%20you%20a%20different%20error), "e quando penso di aver risolto, tira fuori un errore diverso". La frustrazione sale, ci si sente incompetenti. 

Questa sensazione di essere continuamente redarguiti porta molti a **urlare contro il compilatore** o definirlo in modi poco lusinghieri. Se ti senti così, sappi che sei in buona compagnia: quasi tutti i programmatori che usano Rust all'inizio ci sono passati (chi dice di no probabilmente mente). 

La svolta però arriva quando capisci che quel muro di errori in realtà è **un pannello di istruzioni**. Il compilatore Rust, per quanto severo, è anche straordinariamente _didattico_. I suoi messaggi non dicono solo "questo è sbagliato", spesso ti spiegano [**perché** è sbagliato e ti suggeriscono come risolvere](https://ferrous-systems.com/blog/the-compiler-is-your-friend/#:~:text=The%20compiler%20gives%20us%20an,the%20affected%20variable%20is%20underlined). Ad esempio, potresti vedere: _"cannot borrow foo as mutable because it is not declared as mutable… help: consider changing this to mut foo"_. Oppure: _"use of moved value x… value moved here… help: consider cloning the value"_. Insomma, il compilatore fa praticamente **debugging assieme a te**. All'inizio magari non te ne accorgi, sopraffatto dalla terminologia, ma pian piano inizi a leggere quei messaggi con più calma e capire che contengono la chiave per progredire. Un consiglio cruciale è proprio questo: _leggili con attenzione, quasi come fossero documentazione_.

Molti veterani di Rust testimoniano che ad un certo punto il loro rapporto col compilatore ha fatto inversione a U. **Più impari a fidarti di lui, più lui ti restituirà fiducia.** 

Si passa dal vedere il compilatore come un guardiano che blocca la porta, al vederlo come una **rete di sicurezza** sotto il trapezista: ti impedisce di cadere facendoti notare gli errori prima che diventino problemi reali.

Vale la pena sottolineare _quanto_ il compilatore Rust sia effettivamente diverso da altri. Non è marketing: i messaggi di Rust sono notoriamente più descrittivi e utili di quelli di, ad esempio, C++ o Java. Questo è frutto di uno sforzo cosciente della community di Rust fin dagli albori - c'è chi dice scherzando che Rust abbia _"il team di UX applicata ai messaggi d'errore"_. Infatti, nel corso degli anni i messaggi sono migliorati al punto che spesso suggeriscono direttamente la correzione. Ci sono [blog](https://news.ycombinator.com/item?id=44005195#:~:text=Evolution%20of%20Rust%20Compiler%20Errors,explanation%20of%20why%20it%27s%20wrong) che mostrano l'evoluzione degli errori di Rust: da frasi criptiche a spiegazioni quasi in prosa. Lo scopo è fare del compilatore un **strumento didattico** e non solo un giudice. 

Il compilatore è come una bussola: se stai "lottando" troppo contro di esso, probabilmente ti sta indicando che c'è una via più pulita.

Un ulteriore aiuto viene dagli strumenti satellite come **Clippy**, il linter di Rust. È [consigliatissimo](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=Turn%20on%20all%20clippy%20lints,step%20once%20your%20program%20compiles) attivare tutti i _lint_ di Clippy fin dal primo giorno. Clippy ti darà consigli su come migliorare il codice anche oltre gli errori strettamente necessari: ad esempio ti avvisa di possibili usi subottimali, codice non idiomatico, ecc. È come avere un reviewer robotico sempre disponibile. 

Unendo i puntini: _compilatore + Clippy + messaggi d'errore dettagliati_ trasformano quella che poteva essere un'esperienza di apprendimento ostica e solitaria in qualcosa di molto più guidato. Certo, rimane **impegnativo** (Rust non ti regala nulla) ma non sei solo: è come avere un team di mentori virtuali sempre con te (e aggiungiamo la community sui forum/Discord/Stack Overflow, che in Rust è notoriamente accogliente[\[48\]](https://users.rust-lang.org/t/isnt-rust-too-difficult-to-be-widely-adopted/6173#:~:text=Isn%27t%20rust%20too%20difficult%20to,the%20rough%20spots%20and%20surprises)).

In conclusione, il compilatore di Rust all'inizio può sembrare un ostacolo, ma col tempo diventa _il tuo migliore amico_. Questo cambiamento di prospettiva, da "lo odio" a "mi fido di lui", è forse il segnale più evidente che stai facendo tuo il modello mentale di Rust. Quando smetti di vederlo come un freno e inizi a usarlo come **strumento attivo per migliorare il tuo codice**, hai superato un punto di non ritorno: stai ragionando "in Rust". E come vedremo, a quel punto molte delle difficoltà percepite svaniscono, lasciando il posto ai reali benefici.

## Difficoltà vere e proprie vs attrito iniziale

Ci sono aspetti di Rust che **sono realmente complessi**, e altri che _sembrano_ difficili solo finché non si adotta il giusto approccio mentale. È importante distinguere le due cose. Spesso chi è all'inizio mette tutto sullo stesso piano ("Rust è difficile e basta"), ma facendo un passo indietro si può chiedere: quali concetti di Rust restano complicati anche dopo averli capiti, e quali invece diventano **non-problemi** una volta che hai fatto "amucizia" col linguaggio?

Difficoltà _reali_, o intrinseche, di Rust includono sicuramente alcune sue funzionalità avanzate che vediamo brevemente nelle prossime sezioni
### Lifetimes complessi
Il sistema dei lifetime in Rust è in genere comprensibile nei casi semplici, ma in scenari più avanzati (tipologie di dati auto-referenziali, grafi di oggetti mutualmente dipendenti, ecc.) può diventare molto intricato. Anche molti esperti "Rustacei" (definiamo da ora in poi così chi programma in Rust) talvolta faticano con lifetime particolarmente arzigogolati. 

Fortunatamente, questi casi non si presentano di frequente nello sviluppo quotidiano _se progetti bene le cose_: spesso esistono design alternativi per evitare gruppi di lifetime troppo complicati. Ma va riconosciuto che _sì, i lifetime sono un concetto difficile_ da padroneggiare del tutto, anche se, va detto, **nei casi comuni il compilatore li inferisce e non ci si pensa troppo**. 

Il grosso dell'attrito con i lifetime è nella fase di apprendimento iniziale (capire cosa sono `'a` e soci); dopo, compaiono raramente in forma esplicita salvo appunto in codice altamente sofisticato.

### Difficooltà vere e proprie
#### Il modello di concurrency/async:

Rust offre _fearless concurrency_ a compile-time, ma ciò significa che concetti come _thread safety_ e _lifetime statica dei future_ vanno compresi per fare programmazione concorrente. L'uso di async/await in Rust, combinato con Future, Pin, e i requisiti di Send per passare task a threadpool, rappresenta un aumento notevole di complessità rispetto a modelli asincroni in altri linguaggi. 

[Qualcuno](https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=Try%20async%20programming.) l'ha definito _"una botola sotto ai piedi"_ per chi, dopo aver faticosamente imparato ownership e trait, prova a cimentarsi con async. Improvvisamente compaiono errori su Send + 'static e simili che richiedono ulteriori spiegazioni. Questo è sicuramente un ambito dove Rust **è complesso**, non tanto per scarsa progettazione, quanto perché sta imponendo vincoli che altri linguaggi delegano al runtime o ignorano. 

La buona notizia è che per molti casi si possono usare librerie che semplificano un po' il quadro, ma rimane un'area avanzata.

#### Generics e trait oggetti avanzati

Usare generics di base (funzioni o strutture parametriche) è facile, ma Rust consente molta potenza col suo sistema di trait e tipi generici. Per fare un parallelismo con Spiderman, come da grandi poteri derivano grandi responsabilità, in questo caso da questa potenza deriva grande complessità. Ad esempio, capire come restituire valori trattati da funzioni (usando `impl Trait` o trait object con `Box<dyn Trait>`) non è immediato per i nuovi arrivati, che si scontrano con [errori](https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=And%20Rust%20says%3A) tipo _"the size for values of type T cannot be known at compile time"_. Questo costringe a imparare concetti come **monomorfizzazione vs dispatch dinamico**, che anche in questo caso, altrove sono nascosti. 

Rimane sempre vero che _il sistema di tipi di Rust è ricco_, e nelle sue pieghe più sofisticate può essere arduo.

#### Metaprogrammazione e macro

Rust ha un potente sistema di macro a tempo di compilazione (macro by example, procedurali, ecc.). Scrivere macro avanzate può essere difficile (anche se l'utente medio potrebbe non doverlo fare quasi mai). Anche capire codice macro-generato a volte è ostico, perché l'errore a compile time avviene nel codice espanso, non direttamente nella macro. Comunque, questa è una difficoltà riservata a chi vuole spingersi nella metaprogrammazione.
### Unsafe e low-level code
Se stai scrivendo codice in unsafe, stai disattivando i "guardrail" del compilatore e prendendo in mano responsabilità enormi (come per esempio gestire la sicurezza della memoria manualmente). Questo _è_ difficile e rimarrà tale, ma è volutamente confinato alle parti di codice che interagiscono col sistema o ottimizzazioni spinte. La maggior parte del codice Rust non tocca mai unsafe direttamente, specie quando si è all'inizio.

Queste sono le complessità _oggettive_ di Rust. È importante però notare che **la maggior parte dei programmatori non ha bisogno di padroneggiare subito questi aspetti per essere produttivo**. Rust si può usare efficacemente anche stando nel sottoinsieme "safe" e con pattern relativamente semplici. Uno dei consigli dati spesso è di _evitare di addentrarsi subito nelle parti più astruse_: ad esempio, [evita l'async nella prima settimana](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=Avoid%20async%20Rust%20in%20week%201), non partire scrivendo macro generiche o type hack complicati. 

Impara gradualmente: molti concetti avanzati li introdurrai solo quando realmente servono. Come osserva [Julio Merino](https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=Let%E2%80%99s%20conclude%20by%20saying%20that), esistono concetti avanzati in Rust che richiedono pazienza, ma **non sono frequentemente necessari**; basta sapere che esistono e dove trovare informazioni quando ne avrai bisogno. Insomma, _puoi ottenere moltissimo da Rust senza spingerti negli angoli più bui del linguaggio_.

### Attriti iniziali
D'altra parte, vediamo ora le difficoltà che sono più che altro **attriti iniziali**, destinati a scomparire col tempo e la pratica: 
#### Ownership e borrowing nei casi comuni

All'inizio l'idea che una variabile "si muova" o che serva un "&" per passare un riferimento fa impazzire. Ma dopo qualche mese diventa letteralmente _parte del tuo modo di pensare_. Non ci credi? Chiedi a chi usa Rust quotidianamente: tanti riferiscono che ormai ragionano in termini di ownership anche quando scrivono pseudocodice in un documento. Il concetto di chi possiede cosa e di prestito temporaneo diventa naturale, e anzi quando tornano a scrivere in linguaggi senza queste regole, si sentono quasi "troppo liberi" e un po' preoccupati ("uh-oh, qui posso modificare questo oggetto da due posti diversi, speriamo bene…"). Quindi, ciò che all'inizio sembra **la** montagna insormontabile (il famigerato borrow checker) in realtà non è un problema a lungo termine. Un [utente su Hacker News](https://news.ycombinator.com/item?id=19399532) ha scritto: 
>_"Personally, I had the same experience as you did, except the borrow checker also helped me unlearn a few bad habits and gave me a deeper understanding of references. Now it is second nature, and I rarely every fight the borrow checker. I think part of it is planning ahead."_. 

Questo testimonia che sì, all'inizio è tosto, ma una volta che la testa si abitua, non ci pensi più, e ne raccogli solo i benefici (niente più segfault, data race, ecc.).

#### La verbosità del codice

Scrivere `Some(x)` invece di poter usare un `null`, chiamare `.clone()`, fare `match result { Ok(v) => ..., Err(e) => ... }` invece di buttare eccezioni. Tutte queste cose che all'inizio percepisci come fastidiose, col tempo perdono peso. Diventi abile a usare scorciatoie idiomatiche (`?` per propagare errori, metodi come `.map_err()` ecc.) e soprattutto **capisci il perché** dietro ognuna. Ad esempio, accettare di "**usare `clone` quando serve senza vergogna**" è quasi un rito di passaggio: i nuovi fanno di tutto per evitare copie perché pensano sia "illegale" in Rust, poi arriva il momento in cui realizzano che chiamare `clone` esplicitamente è ok se serve, e non ti senti giudicato dal compilatore per questo. 

A quel punto, smetti di contare quante volte devi clonare e più semplicemente ragioni su performance in modo più olistico. Stesso concetto si applica per usare tipi come `String` vs `&str`: inizialmente sbagli, passi `String` quando servirebbe `&str` e viceversa, e ti arrabbi perché "Rust vuole una `String`. Poi piano piano impari quando serve l'una e l'altro. In altre parole: **l'attrito delle cose nuove passa con l'esperienza**. Un consiglio utile dal campo è: all'inizio non aver paura di scrivere codice poco idiomatico purché funzioni. [Per esempio](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=Don%E2%80%99t%20make%20it%20too%20hard,Here%20are%20some%20tips) copia pure con `.clone()` ovunque, usa tipi concreti invece di `generics` se ti semplifica, evita di complicarti con troppi `trait`, tanto potrai rifattorizzare in seguito quando ne saprai di più. Meglio _prima_ raggiungere un punto in cui il codice funziona, anche se verbose, _poi_ affinare lo stile man mano che capisci le idiomatiche migliori.

#### La sintassi strana e i simboli 
Ricordare di mettere `&` prima di una variabile per passarla come riferimento, capire quella sequenza di `-> Result<(), E>` in firma di funzione, decifrare errori con lifetime `&'a T`: tutte cose che inizialmente sembrano geroglifici, ma a forza di vederle diventano familiari. Diventa quasi una sorta di memoria muscolare: scrivi `&mut self` nei metodi senza pensarci, usi `::<>` per i turbofish quando serve, leggi `Box<dyn Trait>` come niente fosse. 

Quindi la verbosità sintattica è una difficoltà solo temporanea. Passato il periodo di acclimatamento, non ti accorgi più dei simboli aggiuntivi, mentre apprezzi ciò che esprimono.

#### Il design "alla Rust"

Questa è la madre di tutte le differenze. Finché cerchi di forzare Rust a fare le cose "come le faresti nel linguaggio X", Rust opporrà resistenza (compilatore, design, librerie). Quando invece inizi a _pensare in Rust_, trovi che tutto scorre molto più liscio. 

Un partecipante a un forum ([kornel](https://users.rust-lang.org/t/rust-is-a-nightmare-to-learn-coming-from-java/37650#:~:text=NullPointerException)) lo descrive bene: 
>_"all'inizio è davvero difficile, ma una volta che sai come pensare in Rust, il linguaggio diventa produttivo e piacevole. Tutte quelle annotazioni (\*, &'a, Box etc.) hanno un senso preciso, e ti permettono di scrivere programmi velocissimi, multi-thread senza paura di NullPointerException"_. 

È letteralmente un cambio di paradigma: smetti di lottare contro il linguaggio e inizi a _lavorare con esso_. Molti chiamano questo momento il **"click" mentale**.

Riassumendo: Rust ha un _core_ concettuale solido ma limitato (ownership/borrowing, lifetimes di base, trait) che va assolutamente assimilato, ed è quello lo scoglio iniziale. Oltre a questo core, ha un ecosistema di funzionalità avanzate che _possono_ essere difficili, ma non sono obbligatorie per i comuni casi d'uso iniziali. Una volta salito quel primo gradino ripido, **le difficoltà percepite scompaiono quasi totalmente**: usare Rust diventa scorrevole e non più faticoso della media degli altri linguaggi. Rimangono le complessità intrinseche, ma quelle le incontri solo quando serve davvero, magari dopo aver già accumulato esperienza e quindi con gli strumenti mentali adatti per gestirle.

Un ottimo consiglio trovato su Reddit recita: _"Rust è difficile all'inizio perché impone nuovi vincoli su di te, vincoli che in realtà esistevano anche prima ma che non venivano verificati"_. Ecco il punto: Rust materializza ostacoli che in altri linguaggi rimangono invisibili fino a quando non inciampi (pensiamo alla gestione memoria, concorrenza, errori). Quindi sì, **all'inizio è più dura**, perché _stai esplicitamente superando ostacoli che altrove erano impliciti_. Ma superato l'inizio, non è che Rust "continui ad essere sempre più difficile", anzi, spesso chi impara Rust nota che dopo un po' può concentrarsi sulla logica dell'applicazione _più liberamente_ di prima, perché tante preoccupazioni (null, race condition, memory leak) sono state sistemate dal linguaggio.

## Perché Rust?

Arriviamo ora alla fatidica domanda, perché iniziare ad usare Rust?

Per farlo vorrei far vedere i **benefici di medio-lungo termine** di questo linguaggio. Benefici di cui magari avevi già sentito parlare in teoria, ma qui vorrei analizzarli bene con anche il punto di vista di chi li ha _vissuti_ in prima persona:

### "Se compila, probabilmente funziona."

Questa frase è quasi un mantra in Rust. Ovviamente non è un'assoluta verità (si possono sempre avere bug logici), ma chi viene da linguaggi come C++ o Java rimane spesso sorpreso dalla confidenza che offre Rust: quando finalmente riesci a far compilare un programma complesso, c'è un'alta probabilità che giri correttamente al primo colpo. Non vedrai quasi mai crash inaspettati, _segmentation fault_, _null pointer exception_ o data race multithread nell'esecuzione di un programma Rust _safe_. Questo ti dà una tranquillità che rivoluziona il tuo modo di sviluppare. Puoi fare modifiche anche profonde al codice e confidare che se qualcosa va storto, il compilatore te lo dirà subito. Un utente ([lwojtow](https://users.rust-lang.org/t/rust-is-a-nightmare-to-learn-coming-from-java/37650))raccontava: "una volta che il mio codice Rust compilava, era di qualità immensamente superiore a quello Java che scrivevo da anni". Sembra esagerato, ma quell'utente sottolinea come i programmi Rust che scrive ora lo stupiscono in positivo rispetto a analoghi in Java scritti in passato, proprio per l'assenza di certi difetti.

### Meno bug e meno debugging

Penso sia la conseguenza diretta del punto precedente: tante categorie di bug semplicemente _non accadono più_. Use-after-free? Impossibile in safe Rust. Concorrenza con condizioni di gara? Il compilatore non ti fa condividere dati mutabili senza protezioni adeguate. Null dereference? Rust non ha il null (se non in unsafe), usi Option e quindi _devi_ gestire l'assenza di valore. Overflow aritmetico? Rust, in debug, li rileva a runtime (in release li gestisce con modulo, ma puoi attivare i check se vuoi). E così via. 

Anche errori logici (come dimenticare di gestire un caso di errore) diventano meno frequenti perché Rust ti spinge a considerarli tutti. Il risultato pratico è che una volta superata la fatica iniziale, **spenderai meno tempo a cacciare bug**. Questo è confermato da tanti sviluppatori: Rust riduce drasticamente il tempo dedicato al troubleshooting rispetto a C/C++ ad esempio, perché se il programma compila hai già la certezza che tanti possibili problemi non ci sono. Ci possono ovviamente essere bug applicativi (un calcolo sbagliato, una condizione non gestita che però è "logicamente" valida per il compilatore), ma quelli li puoi coprire con test. Intanto non ti sei dovuto preoccupare dei soliti problemi di memoria o concorrenza che affliggono altri ecosistemi.

### Refactoring e manutenzione facilitati

Abbiamo detto che Rust ti obbliga a sistemare tutto prima che compili. Questo che all'inizio è un fastidio ("non compila nulla finché non è tutto giusto!") col tempo diventa una sorta di superpotere. 

Ti accorgi che puoi _osare_ refactoring molto grandi - come cambiare struttura a dei moduli, modificare tipi di ritorno di funzioni pubbliche, riorganizzare l'ownership tra componenti - con l'aiuto infallibile del compilatore. 

In altri ambienti, rifattorizzare può essere rischioso: potresti dimenticare di aggiornare un punto e introdurre un bug che scoprirai forse in produzione. In Rust, finché il codice compila, hai un'alta confidenza di aver applicato correttamente ogni modifica necessaria. 

In linguaggi dove il refactoring è oneroso o rischioso, spesso la gente preferisce tenersi codice subottimale per non rompere nulla. Con Rust, è più facile mantenere la codebase sana e adattarla a nuove esigenze.

### Performance prevedibile e meno "magie nere"

Rust, essendo privo di runtime pesante, ti dà prestazioni vicine al C/C++, ma soprattutto **prevedibili**. Niente garbage collector che parte nel mezzo di una transazione critica causando un glitch; niente VM che ottimizza il codice in modi imperscrutabili (ok, c'è LLVM dietro le quinte, ma in generale hai più controllo su allocazioni e comportamento). Questo significa che investire in Rust paga soprattutto in scenari dove performance e controllo sono cruciali (sistemi, embedded, applicazioni server ad alta intensità, ecc.). 

Molti adottano Rust proprio per questo motivo: dopo la curva iniziale, hai uno strumento che ti permette di costruire software con performance di sistema **senza dover scendere a livello di C non sicuro**. E con la confidenza aggiuntiva che se il tuo programma Rust compila senza _unsafe_, puoi praticamente _dimenticarti_ di tutti i problemi di memoria manuale che rendono lo sviluppo in C/C++ un incubo. È un livello di **fiducia** difficilmente raggiungibile altrove. Non a caso il motto del team Rust è _"fearless"_, senza paura: _fearless concurrency, fearless refactoring, fearless future_. Significa poter affrontare problemi difficili (come la concorrenza) senza il timore di introdurre bug invisibili, perché sai che il compilatore ti _copre le spalle_.

### Crescita come programmatore

[Molti](https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=Rust%20made%20me%20a%20better,way%20I%20never%20had%20before) riportano che imparare Rust li ha resi programmatori migliori anche quando tornano ad altri linguaggi. 

Bene ma perché?

Perché Rust ti costringe a ragionare su aspetti che prima ignoravi. Dopo aver usato Rust, quando in Java allochi oggetti in un loop stretto magari inizi a porti il dubbio del garbage collector, cosa che prima facevi distrattamente. Oppure presti più attenzione a evitare stati mutabili globali in Python perché hai visto i benefici dell'immutabilità di default. Insomma, Rust **allena buone abitudini** che sono trasferibili. 

Sempre sull'articolo di Medium che ho menzionato prima, un sviluppatore ha scritto: 
> _"Rust mi ha costretto a pensare a ownership, lifetimes e correttezza in un modo in cui non avevo mai fatto prima, e questo mi ha reso un programmatore migliore in ogni linguaggio"_

È un grande complimento al linguaggio: non solo non era impossibile da imparare, ma addirittura quella fatica ha elevato il suo livello generale.

Tutto ciò porta alla risposta finale: _perché Rust non è davvero difficile_. La difficoltà che percepiamo è il pedaggio iniziale per entrare in un nuovo modo di programmare. Una volta pagato quel pedaggio, la strada si spiana e **il viaggio procede spedito**. Rust a quel punto non è più difficile di qualsiasi altro linguaggio.
Anzi, su certe cose diventa più facile, perché hai strumenti che ti sorvegliano e aiutano costantemente. 

La cosa bella è che c'è un'intera comunità di persone pronte a confermarlo e ad aiutarti lungo la strada.

## Conclusione
Per concludere con una metafora, usare Rust è un po' come un **allenamento intensivo**. All'inizio ti sembra di subire un trattamento da "Full Metal Jacket", ti urla contro, ti fa rifare il letto 10 volte, non capisci perché tutta questa disciplina. Ma alla fine del campionato, sei temprato, forte e preparato a situazioni che altri non reggerebbero. 

![Meme Rust Full Metal Jacket](../Assets/RustFMJ.png)

_Meme: Rust in versione "Full Metal Jacket"._

Rust alla fine **"si fida di te perché ti ha addestrato a meritartelo"**_: 

Tutti abbiamo avuto quel momento di sconforto, ma perseverando si supera. Il gioco vale la candela: Rust ti ripagherà con un'esperienza di programmazione appagante, in cui tornerai a divertirti a scrivere codice sapendo che quello che scrivi è robusto e "corretto per costruzione".

In definitiva, Rust _sembra_ difficile all'inizio perché ti chiede di cambiare mentalità, ma **non lo è in senso assoluto**. È diverso, è rigoroso, ma non è stregoneria. Come ogni cosa nuova e valida, richiede impegno per essere padroneggiata. E una volta padroneggiata, scoprirai forse di aver trovato non solo un linguaggio efficiente, ma anche un _mentore_ che ti ha insegnato a programmare in modo più consapevole. Quindi, armati di pazienza, abbraccia il cambiamento di paradigma, e continua a provarci: _keep going. It gets better_.

## Fonti
Rust Forum, Medium, Blog tecnici e documentazione ufficiale citati nel test: 
- https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=it's%20vertical
- https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=Learning%20Rust%20can%20feel%20like,intellectual%20hazing
- https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=The%20borrow%20checker%20will%20make,don%E2%80%99t%20know%20how%20to%20code
- https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=Let%E2%80%99s%20first%20start%20by%20stating,not%20months%2C%20of%20frequent%20practice
- https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=learning%20are%20amortized
- https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=The%20problem%20is%20that%20simpler,can%20be%20deployed%20or%20released
- https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=The%20good%20thing%20is%20that,language%20you%20write%20code%20in
- https://mmapped.blog/posts/15-when-rust-hurts#:~:text=Bjarne%20Stroustrup
- https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=Rust%20falls%20in%20the%20more,computer%E2%80%99s%20processor%20and%20memory%20model
- https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=radioactive
- https://medium.com/rustaceans/rust-errors-arent-exceptions-87ce365d4dff#:~:text=Only%20panic%20when%20necessary
- https://medium.com/rustaceans/rust-errors-arent-exceptions-87ce365d4dff
- https://users.rust-lang.org/t/rust-is-a-nightmare-to-learn-coming-from-java/37650
- https://users.rust-lang.org/t/rust-is-a-nightmare-to-learn-coming-from-java/37650/4
- https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=Your%20learning%20pace%20doesn%E2%80%99t%20have,your%20attitude%20toward%20the%20language
- https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=I%20have%20seen%20junior%20devs,Leave%20your%20hubris%20at%20home
- https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=If%20you%20come%20from%20a,scale%20applications
- https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=dismiss%20the%20language%20right%20away
- https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=So%20you%20don%E2%80%99t%20have%20to,couldn%E2%80%99t%20figure%20it%20out%20itself
- https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=%20An%20ancient%20Rust%20proverb
- https://practice.course.rs/fight-compiler/intro.html
- https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=just%20when%20you%20think%20you%E2%80%99ve%20fixed%20it,%20it%20gives%20you%20a%20different%20error
- https://ferrous-systems.com/blog/the-compiler-is-your-friend/#:~:text=The%20compiler%20gives%20us%20an,the%20affected%20variable%20is%20underlined
- https://news.ycombinator.com/item?id=44005195#:~:text=Evolution%20of%20Rust%20Compiler%20Errors,explanation%20of%20why%20it%27s%20wrong
- https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=Turn%20on%20all%20clippy%20lints,step%20once%20your%20program%20compiles
- https://users.rust-lang.org/t/isnt-rust-too-difficult-to-be-widely-adopted/6173#:~:text=Isn%27t%20rust%20too%20difficult%20to,the%20rough%20spots%20and%20surprises
- https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=Try%20async%20programming.
- https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=And%20Rust%20says%3A
- https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=Avoid%20async%20Rust%20in%20week%201
- https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=Let%E2%80%99s%20conclude%20by%20saying%20that
- https://news.ycombinator.com/item?id=19399532
- https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=Don%E2%80%99t%20make%20it%20too%20hard,Here%20are%20some%20tips
- https://users.rust-lang.org/t/rust-is-a-nightmare-to-learn-coming-from-java/37650#:~:text=NullPointerException
- https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=Rust%20made%20me%20a%20better,way%20I%20never%20had%20before
