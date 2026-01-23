# Elixir Cheatsheet

Se stai leggendo questo articolo, probabilmente hai sentito parlare di Elixir, quel linguaggio che unisce la sintassi elegante di Ruby con la potenza bruta e la concorrenza (questo termine in italiano è veramente cacofonico) di Erlang. O forse sei stato solo incuriosito dal titolo dell'articolo. In ogni caso, ora lo vediamo insieme.

Elixir non è solo un altro linguaggio di scripting; è un modo diverso di pensare. Gira sulla BEAM (la macchina virtuale di Erlang), il che significa che è costruito per scalare e scrivere codice come si deve.

In questo articolo, esploreremo le sezioni fondamentali del seguente cheatsheet che ti lascio qui pronto da scaricare. Cercherò di darti una base solida, con esempi pratici e magari anche qualche trucco del mestiere. 

## Atomi e stringhe: le basi

In Elixir, come anche in chimica, tutto si basa sugli atomi. In particolare qui incontrerai spesso gli Atomi. 

> Un atomo è una costante il cui valore è il suo stesso nome. 

Pensa a loro come a delle etichette super efficienti o agli enum di altri linguaggi, ma più flessibili.

Le stringhe in Elixir sono binarie codificate in UTF-8. L'idea alla base è di non avere sorprese, così che funzionano come ti aspetti, ma con il supporto completo per l'interpolazione.

``` elixir
# Atomi
:successo
:errore
:ok

# Stringhe e variabili
name = "Dev"
"Ciao #{name}!" # => "Ciao Dev!"

# Concatenazione
"Hello " <> "World"
```

> 💡 Pro Tip: Gli atomi sono gestiti in una tabella interna della VM e non vengono mai deallocati dal Garbage Collector. Sono velocissimi per i confronti, ma non generarli dinamicamente (ad esempio convertendo input utente in atomi) all'infinito, o rischierai di esaurire la memoria della VM (Atom table limit).

Bene ma a cosa servono gli atomi? A comunicare stati o intenzioni senza usare stringhe super pesanti.

> Esempio: Invece di restituire la stringa "operazione_fallita", una funzione ti risponde con :error. 

Diciamo che è un'etichetta fissa e inequivocabile. Ok ma so che ti aspetti quella stringa che ti permette di dire "Ok conosco questo linguaggio", ovvero come stampare Hello world?

Non sarebbe un tutorial di programmazione senza stampare qualcosa a schermo, vero? In Elixir, il modulo `IO` gestisce l'Input e l'Output.

```elixir
IO.puts "Hello World!"
# Stampa: Hello World!
# Ritorna: :ok
```
Semplice, no? Ma c'è un dettaglio interessante: IO.puts restituisce sempre l'atomo :ok dopo aver stampato.

> 💡 Pro Tip: `IO.puts` è ottimo per mostrare testo agli umani, ma se provi a stampare strutture complesse (come Mappe o Liste), potresti ottenere risultati illeggibili. Per il debug, usa sempre `IO.inspect(dato)`. La magia di `IO.inspect` è che stampa il dato e lo restituisce intatto, permettendoti di inserirlo in mezzo al codice senza romperlo.

### 2. Collezioni: Liste vs Tuple

Qui è dove molti inciampano venendo da linguaggi imperativi.

Liste ([]): Sono liste collegate (Linked Lists).

Tuple ({}): Sono blocchi di memoria contigui.

Sembrano simili, ma le prestazioni sono opposte.

# Lista (Linked List)
lista = [1, 2, 3]
[0 | lista] # => [0, 1, 2, 3] (Prepend è veloce!)

# Tupla
tupla = {:ok, "Tutto bene"}
elem(tupla, 0) # => :ok (Accesso istantaneo)


💡 Pro Tip: Usa le Liste quando devi scorrere dati o aggiungere elementi in testa dinamicamente. Usa le Tuple quando sai esattamente quanti elementi hai (come restituire {:ok, result} da una funzione). Ricorda: aggiungere un elemento in fondo a una lista è un'operazione lenta (O(n)), mentre aggiungerlo in testa è istantaneo (O(1)).

3. Mappe e Keyword Lists

Hai bisogno di chiave-valore? Hai due strade principali.
Le Mappe (%{}) sono il "go-to" per strutture dati generiche. Le Keyword Lists sono liste speciali di tuple usate principalmente per passare opzioni alle funzioni (perché l'ordine è garantito e le chiavi possono ripetersi).

# Mappa
user = %{name: "Alice", age: 30}
user.name # => "Alice" (Sintassi comoda se la chiave è un atomo)
user[:age] # => 30

# Keyword List
[debug: true, active: false]
# È zucchero sintattico per: [{:debug, true}, {:active, false}]


💡 Pro Tip: Nelle mappe, puoi usare il pattern matching per estrarre valori nidificati in modo elegantissimo. Se cerchi una chiave che non esiste con la sintassi map.key, otterrai un errore; se usi map[:key], otterrai nil. Scegli in base a quanto sei sicuro che il dato esista!

4. Pattern Matching: La Magia (=)

In Elixir, il simbolo = non è un'assegnazione. È un operatore di confronto (match operator). Elixir prova a far combaciare il lato sinistro con il destro. Se ci riesce, lega le variabili; se no, lancia un errore.

È la feature più potente del linguaggio.

# Assegnazione "classica" (Match riuscito)
x = 1

# Pattern Matching
{a, b} = {10, 20}
# Ora a vale 10, b vale 20

# Matching parziale
{:ok, result} = {:ok, "Dati salvati"}
# result ora vale "Dati salvati"

# Questo fallirebbe:
# {:ok, result} = {:error, "Qualcosa non va"} 
# ** (MatchError) no match of right hand side value


💡 Pro Tip: Usa l'underscore _ come "jolly" quando non ti interessa un valore specifico ma devi soddisfare la struttura del pattern. Esempio: {:ok, _} = funzione_che_ritorna_ok().

5. Funzioni e Moduli

Il codice vive nei moduli. Le funzioni possono essere "con nome" (def) o "anonime" (fn). Una cosa bellissima? Puoi definire la stessa funzione più volte con argomenti diversi (pattern matching nella firma della funzione!).

defmodule Math do
  # Clausola 1: Se l'argomento è 0
  def factorial(0), do: 1
  
  # Clausola 2: Per tutti gli altri numeri
  def factorial(n), do: n * factorial(n - 1)
end

# Funzione anonima
add = fn a, b -> a + b end
add.(1, 2) # Nota il punto per chiamare le anonime!


💡 Pro Tip: L'ordine conta! Elixir controlla le definizioni delle funzioni dall'alto in basso. Metti sempre i casi più specifici (come factorial(0)) prima dei casi generali, altrimenti non verranno mai eseguiti.

6. L'Operatore Pipe (|>)

Probabilmente il simbolo più amato dagli sviluppatori Elixir. Prende il risultato dell'espressione a sinistra e lo passa come primo argomento alla funzione a destra. Rende il codice leggibile come una ricetta di cucina, evitando le parentesi annidate f(g(h(x))).

# Senza Pipe (Difficile da leggere)
String.upcase(String.trim("  elixir  "))

# Con Pipe (Chiaro e lineare)
"  elixir  "
|> String.trim()
|> String.upcase()
# => "ELIXIR"


💡 Pro Tip: Quando fai debugging in una catena di pipe lunga, usa IO.inspect/1 nel mezzo. Restituisce il valore che riceve intatto, ma lo stampa in console. È perfetto per "spiare" i dati mentre fluiscono nella pipeline.

dati
|> elabora()
|> IO.inspect(label: "Dopo elaborazione")
|> salva()


Conclusione

Questo è solo un assaggio della potenza di Elixir, ma copre le fondamenta che troverai nel cheatsheet. La curva di apprendimento può sembrare ripida all'inizio a causa del paradigma funzionale, ma una volta che il concetto di immutabilità e pattern matching fa click, non vorrai più tornare indietro.

Hai domande su una sezione specifica o vuoi approfondire la concorrenza con i processi? Scrivilo nei commenti! 👇

Happy Coding! 🚀