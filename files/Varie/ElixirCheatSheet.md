# Elixir Cheatsheet

Se stai leggendo questo articolo, probabilmente hai sentito parlare di Elixir, quel linguaggio che unisce la sintassi elegante di Ruby con la potenza bruta e la concorrenza (questo termine in italiano è veramente cacofonico) di Erlang. O forse sei stato solo incuriosito dal titolo dell'articolo. In ogni caso, ora lo vediamo insieme.

Elixir non è solo un altro linguaggio di scripting; è un modo diverso di pensare. Gira sulla **BEAM** (la macchina virtuale di Erlang), il che significa che è costruito per scalare e scrivere codice come si deve, gestendo milioni di processi concorrenti con una facilità disarmante.

In questo articolo, esploreremo i concetti fondamentali di Elixir, dandoti una base solida con esempi pratici e qualche trucco del mestiere che ti farà risparmiare ore di debug.

## 1. Hello World

Prima di tuffarci nei dettagli, iniziamo dal tradizionale step che vi permette di dire che sapete un linguaggio: come stampare il classico "Hello World".

In Elixir, il modulo `IO` gestisce l'Input e l'Output.

```elixir
IO.puts "Hello World!"
# Stampa: Hello World!
# Ritorna: :ok
```

Semplice, no? Ma c'è un dettaglio interessante: `IO.puts` restituisce sempre l'atomo `:ok` dopo aver stampato.

> 💡 **Pro Tip**: `IO.puts` è ottimo per mostrare testo agli umani, ma se provi a stampare strutture complesse (come Mappe o Liste), potresti ottenere risultati illeggibili. Per il debug, usa sempre `IO.inspect(dato)`. La magia di `IO.inspect` è che stampa il dato e lo restituisce intatto, permettendoti di inserirlo in mezzo al codice senza romperlo.

## 2. Atomi e Stringhe: le basi

In Elixir, come anche in chimica, tutto si basa sugli atomi. Ma cosa sono esattamente?

> **Un atomo è una costante il cui valore è il suo stesso nome.**

Pensa a loro come a delle etichette super efficienti o agli enum di altri linguaggi, ma più flessibili.

### Atomi

```elixir
:successo
:errore
:ok
:not_found
```

A cosa servono? A comunicare stati o intenzioni senza usare stringhe pesanti.

> **Esempio**: Invece di restituire la stringa `"operazione_fallita"`, una funzione ti risponde con `:error`. È un'etichetta fissa e inequivocabile.

### Stringhe

Le stringhe in Elixir sono codificate in UTF-8. Funzionano come ti aspetti, ma con il supporto completo per l'interpolazione.

```elixir
# Stringhe e variabili
name = "Dev"
"Ciao #{name}!" # => "Ciao Dev!"

# Concatenazione
"Hello " <> "World" # => "Hello World"

# Multilinea
"""
Questa è una stringa
su più righe
"""
```

> 💡 **Pro Tip**: Gli atomi sono gestiti in una tabella interna della VM e non vengono mai deallocati dal Garbage Collector. Sono velocissimi per i confronti, ma **non generarli dinamicamente** (ad esempio convertendo input utente in atomi) all'infinito, o rischierai di esaurire la memoria della VM (Atom table limit).

## 3. Collezioni: Liste vs Tuple

Qui è dove molti inciampano venendo da linguaggi imperativi. In Elixir abbiamo due tipi principali di collezioni:

- **Liste (`[]`)**: Sono Linked Lists (liste collegate). Immaginale come una caccia al tesoro: ogni elemento contiene il suo valore e un bigliettino che dice "il prossimo elemento è laggiù". Da una parte aggiungere un elemento in testa è istantaneo (basta creare un nuovo bigliettino che punta alla vecchia lista), dall'altra per trovare l'elemento numero 1000, devi leggere tutti i 999 bigliettini precedenti.

- **Tuple (`{}`)**: Sono blocchi di memoria contigui, simili agli array di C. Immaginale come uno scaffale fisso dove ogni cosa ha il suo posto numerato. Da una parte possono accedere a qualsiasi elemento è velocissimo, non importa dove si trovi. Dall'altra modificarle è costoso (in termini di memoria) perché bisogna copiare l'intero scaffale in un nuovo spazio.

Sembrano simili, ma le prestazioni sono **opposte**.

### Liste (Linked Lists)

```elixir
# Creare una lista
lista = [1, 2, 3]

# Accedere agli elementi
List.first(lista) # => 1
List.last(lista)  # => 3

# Aggiungere in testa (VELOCE!)
[0 | lista] # => [0, 1, 2, 3]

# Aggiungere in coda (LENTO!)
lista ++ [4] # => [1, 2, 3, 4]

# Concatenare liste
[1, 2] ++ [3, 4] # => [1, 2, 3, 4]

# Lunghezza
length(lista) # => 3
```

### Tuple

```elixir
# Creare una tupla
tupla = {:ok, "Tutto bene"}

# Accedere agli elementi (per indice)
elem(tupla, 0) # => :ok
elem(tupla, 1) # => "Tutto bene"

# Dimensione della tupla
tuple_size(tupla) # => 2

# Aggiornare una tupla (crea una nuova tupla)
put_elem(tupla, 1, "Modificato")
# => {:ok, "Modificato"}

# Uso comune: risultati di funzioni
{:ok, "Successo"}
{:error, "Qualcosa è andato storto"}
```

> 💡 **Pro Tip**: Usa le **Liste** quando devi scorrere dati o aggiungere elementi in testa dinamicamente. Usa le **Tuple** quando sai esattamente quanti elementi hai (come restituire `{:ok, result}` da una funzione). Ricorda: aggiungere un elemento in fondo a una lista è un'operazione lenta **O(n)**, mentre aggiungerlo in testa è istantaneo **O(1)**.

## 4. Mappe e Keyword Lists

Hai bisogno di strutture chiave-valore? Hai due strade principali:

### Mappe (%{})

Le Mappe sono il "go-to" per strutture dati generiche. Offrono accesso rapido e una sintassi oggettivamente comoda.

```elixir
# Creare una mappa con chiavi atomo
user = %{name: "Lucia", age: 23}

# Accedere ai valori (due modi)
user.name    # => "Lucia" (solo se la chiave è un atomo)
user[:age]   # => 23
user[:email] # => nil (chiave non esiste)

# Mappa con chiavi stringa
config = %{"host" => "localhost", "port" => 8080}
config["host"] # => "localhost"

# Aggiornare un valore esistente
%{user | age: 24} # => %{name: "Lucia", age: 24}

# Aggiungere nuove chiavi
Map.put(user, :email, "lucia@example.com")
# => %{name: "Lucia", age: 23, email: "lucia@example.com"}

# Rimuovere una chiave
Map.delete(user, :age)
# => %{name: "Lucia"}

# Verificare se una chiave esiste
Map.has_key?(user, :name) # => true
```

### Keyword Lists

Sono liste speciali di tuple usate principalmente per passare opzioni alle funzioni. La differenza con le mappe? L'ordine è garantito e le chiavi possono ripetersi.

```elixir
# Keyword List
options = [debug: true, active: false]
# È zucchero sintattico per: [{:debug, true}, {:active, false}]

# Accesso
options[:debug] # => true

# Chiavi duplicate (l'accesso prende il primo)
options = [debug: true, active: false, debug: false]
options[:debug] # => true (primo valore)

# Uso comune: opzioni di funzione
String.split("a,b,c", ",", trim: true)
Enum.map([1, 2], fn x -> x * 2 end)
```

> 💡 **Pro Tip**: Se cerchi una chiave che non esiste con la sintassi `map.key`, otterrai un **errore** (KeyError); se usi `map[:key]`, otterrai `nil`. Usa la prima quando sei sicuro che la chiave esiste, la seconda quando vuoi gestire l'assenza del valore.

## 5. Pattern Matching: La Magia dell'Operatore =

Ecco, finalmente siamo arrivati al motivo per cui ho iniziato ad apprezzare Elixir. In Elixir, il simbolo `=` **non è un'assegnazione** nel senso tradizionale. È un **match operator**: Elixir prova a far combaciare (match) il lato sinistro con il destro. Se ci riesce, lega le variabili; se no, lancia un errore.

**È la feature più potente del linguaggio** e cambia completamente il modo in cui scrivi codice.

### Come Funziona

Pensa a `=` come a un'equazione matematica. Elixir cerca di rendere veri entrambi i lati:

```elixir
# "x deve essere uguale a 1"
x = 1
# Elixir lega x al valore 1

# "1 deve essere uguale a 1"
1 = x
# OK! Matcha perché x vale 1

# "2 deve essere uguale a 1"
2 = x
# ** (MatchError) no match of right hand side value: 1
```

### Pattern Matching con Tuple

Ora che conosci le tuple, esatttamente come le abbiamo costruite, ora vediamo come destrutturarle:

```elixir
# Destrutturare una tupla
{a, b} = {10, 20}
# a => 10, b => 20

# Uso pratico: gestire risultati di funzioni
{:ok, result} = {:ok, "Operazione riuscita"}
# result => "Operazione riuscita"

# Se il pattern non matcha, errore!
{:ok, result} = {:error, "Qualcosa è andato storto"}
# ** (MatchError) no match of right hand side value: {:error, "Qualcosa è andato storto"}

# Ignorare valori che non ci interessano
{:ok, _} = {:ok, "Non mi interessa il contenuto"}
# OK! L'underscore matcha qualsiasi cosa

# Esempio real-world: File.read
{:ok, contenuto} = File.read("config.txt")
# Se il file esiste, contenuto avrà il testo
# Se no, MatchError (crash diciamo "intenzionale")
```

### Pattern Matching con Liste

Le liste assumono tutto un altro fascino con il pattern matching:

```elixir
# Destrutturare head (testa) e tail (coda)
[head | tail] = [1, 2, 3, 4, 5]
# head => 1
# tail => [2, 3, 4, 5]

# Prendere i primi due elementi
[first, second | rest] = [1, 2, 3, 4, 5]
# first => 1, second => 2, rest => [3, 4, 5]

# Pattern matching esatto
[1, 2, 3] = [1, 2, 3]
# OK!

# Pattern matching con valori misti
[1, x, 3] = [1, 42, 3]
# x => 42

# Lista vuota
[] = []
# OK!

# Questo fallirebbe
[a, b] = [1, 2, 3]
# ** (MatchError) - il pattern richiede esattamente 2 elementi
```

### Pattern Matching con Mappe

Le mappe sono ancora più flessibili: puoi matchare solo le chiavi che ti interessano!

```elixir
# Estrarre valori specifici
%{name: nome} = %{name: "Lucia", age: 23, city: "Roma"}
# nome => "Lucia"
# age e city vengono ignorati

# Estrarre più valori
%{name: n, age: a} = %{name: "Lucia", age: 23, city: "Roma"}
# n => "Lucia", a => 23

# Verificare che una chiave esista con un certo valore
%{status: :ok} = %{status: :ok, data: "qualcosa"}
# OK!

%{status: :ok} = %{status: :error, data: "qualcosa"}
# ** (MatchError) - status non è :ok

# Combinare con atomi per validazione
%{type: :user, id: user_id} = %{type: :user, id: 42, name: "Bob"}
# user_id => 42
# Utile per validare che stiamo ricevendo il tipo giusto di dato!
```

### Pattern Matching in Azione: Funzioni

Ora guarda come sono eleganti e funzionali le definizioni di funzione:

```elixir
defmodule FileHandler do
  # Clausola 1: matcha solo se il risultato è {:ok, contenuto}
  def handle({:ok, contenuto}) do
    "File letto con successo: #{contenuto}"
  end
  
  # Clausola 2: matcha solo se il risultato è {:error, motivo}
  def handle({:error, motivo}) do
    "Errore nella lettura: #{motivo}"
  end
end

# Uso
File.read("test.txt") |> FileHandler.handle()
# Elixir sceglie automaticamente la clausola giusta!
```
> definire la definizione di funzione funzionale sembra quasi un gioco di parole

### Il pin operator (^)

A volte non vuoi riassegnare una variabile, ma vuoi matchare contro il suo valore attuale:

```elixir
# Senza pin: riassegna
x = 1
x = 2  # x ora vale 2

# Con pin: matcha il valore attuale
x = 1
^x = 1  # OK, matcha perché x vale 1
^x = 2  # Errore! x vale 1, non 2

# Ecco un uso pratico: come validare un valore atteso
expected_status = :ok
^expected_status = get_status()
# Si assicura che get_status() ritorni :ok, altrimenti crasha
```

### L'underscore: il jolly

L'underscore `_` matcha qualsiasi cosa ma non la lega a una variabile:

```elixir
# Ignorare completamente un valore
{:ok, _} = {:ok, "Non mi interessa"}

# Ignorare parti di una lista
[_, secondo, _, quarto] = [1, 2, 3, 4]
# secondo => 2, quarto => 4

# Dare un nome descrittivo ma non usare il valore (evita warning). In _ ci sarà tutto il contenuto che non usi
{:ok, _} = File.read("test.txt")
```

### Pattern Matching Everywhere!

Il pattern matching non si usa solo con `=`. È ovunque in Elixir:

```elixir
# Nelle funzioni (vedi sezione 6)
def calcola({:somma, a, b}), do: a + b
def calcola({:prodotto, a, b}), do: a * b

# Nel case (vedi sezione 8)
case File.read("file.txt") do
  {:ok, contenuto} -> "Letto: #{contenuto}"
  {:error, :enoent} -> "File non trovato"
  {:error, motivo} -> "Errore: #{motivo}"
end

# Nelle list comprehensions
for {:ok, valore} <- results, do: valore

# Nei parametri di funzioni anonime
Enum.map([{:ok, 1}, {:ok, 2}], fn {:ok, n} -> n * 2 end)
```

> 💡 **Pro Tip**: Il pattern matching ti permette di scrivere codice **dichiarativo** invece che **imperativo**. Invece di chiedere "questo valore è ok? Poi estrailo", dici "questo deve essere {:ok, valore}" e Elixir fa tutto il lavoro sporco. Se il pattern non matcha, il programma crasha (fail fast), che è esattamente quello che vuoi durante lo sviluppo, ovvero, non avere problemi dopo, ma capire subito se c'è un problema.

## 6. Funzioni e Moduli

Il codice vive nei **moduli**. Le funzioni possono essere "con nome" (`def`) o "anonime" (`fn`). Una cosa bellissima? Puoi definire la stessa funzione più volte con argomenti diversi, sfruttando il **pattern matching nella firma della funzione** (che hai appena visto nella sezione precedente!).

### Funzioni con Nome

```elixir
defmodule Math do
  # Funzione semplice
  def add(a, b), do: a + b
  
  # Funzione con corpo multi-linea
  def multiply(a, b) do
    result = a * b
    result
  end
  
  # Funzione privata (solo dentro il modulo)
  defp private_helper(x), do: x * 2
end

Math.add(2, 3)      # => 5
Math.multiply(4, 5) # => 20
```

### Pattern Matching nelle Funzioni

Ora che conosci il pattern matching, ecco dove diventa davvero utile e potente, o meglio che ti permette di fare un sacco di cose:

```elixir
defmodule FileHandler do
  # Clausola 1: matcha {:ok, contenuto}
  def process({:ok, contenuto}) do
    "Elaborato: #{contenuto}"
  end
  
  # Clausola 2: matcha {:error, motivo}
  def process({:error, motivo}) do
    "Errore: #{motivo}"
  end
end

# Elixir sceglie automaticamente la clausola giusta!
FileHandler.process({:ok, "dati"})    # => "Elaborato: dati"
FileHandler.process({:error, "boom"}) # => "Errore: boom"
```

### Ricorsione con Pattern Matching

Il pattern matching rende la ricorsione elegantissima:

```elixir
defmodule Math do
  # Caso base: 0! = 1
  def factorial(0), do: 1
  
  # Caso ricorsivo: n! = n * (n-1)!
  def factorial(n) when n > 0 do
    n * factorial(n - 1)
  end
end

Math.factorial(5) # => 120
```

```elixir
defmodule ListHelper do
  # Caso base: lista vuota
  def sum([]), do: 0
  
  # Caso ricorsivo: somma la testa + somma della coda
  def sum([head | tail]) do
    head + sum(tail)
  end
end

ListHelper.sum([1, 2, 3, 4]) # => 10
```

### Guard Clauses

Le guard clauses aggiungono condizioni extra **dopo** il pattern matching:

```elixir
defmodule Temperature do
  # Pattern matching + condizione
  def describe(temp) when temp > 30, do: "Caldissimo! 🔥"
  def describe(temp) when temp > 15, do: "Mite 😊"
  def describe(temp) when temp > 0, do: "Freddo 🥶"
  def describe(_), do: "Gelido ❄️" # forma di catch‑all senza warning di variabile inutilizzata. Simile ad un else.
end

Temperature.describe(35) # => "Caldissimo! 🔥"
Temperature.describe(18) # => "Mite 😊"
```

Guards supportati: `<`, `>`, `==`, `!=`, `and`, `or`, `not`, `is_list`, `is_map`, `is_atom`, etc.

### Funzioni Anonime

Funzioni "usa e getta" senza nome:

```elixir
# Sintassi classica
add = fn a, b -> a + b end
add.(1, 2) # => 3 (Nota il punto per chiamare le anonime!)

# Con pattern matching multi-clausola
handle_result = fn
  {:ok, result} -> "Successo: #{result}"
  {:error, reason} -> "Errore: #{reason}"
  _ -> "Caso non gestito"
end

handle_result.({:ok, "tutto ok"}) # => "Successo: tutto ok"
```

### Sintassi Shorthand con &

Per funzioni super semplici:

```elixir
# Versione lunga
Enum.map([1, 2, 3], fn x -> x * 2 end)

# Versione corta con & (capture operator)
Enum.map([1, 2, 3], &(&1 * 2))
# &1 = primo argomento, &2 = secondo, etc.

# Passare funzioni esistenti
Enum.map(["hello", "world"], &String.upcase/1)
# => ["HELLO", "WORLD"]
```

### Default Arguments

```elixir
defmodule Greeter do
  # \\ definisce un valore di default
  def greet(name, saluto \\ "Ciao") do
    "#{saluto}, #{name}!"
  end
end

Greeter.greet("Lucia")           # => "Ciao, Lucia!"
Greeter.greet("Lucia", "Buongiorno") # => "Buongiorno, Lucia!"
```

> 💡 **Pro Tip**: L'ordine conta! Elixir controlla le definizioni delle funzioni **dall'alto in basso**. Metti sempre i casi più specifici (come `factorial(0)`) prima dei casi generali, altrimenti non verranno mai eseguiti. Le guard clauses vengono valutate **dopo** il pattern matching base.

## 7. L'Operatore Pipe (|>): Scrivere Codice Leggibile

Il pipe operator `|>` è probabilmente il simbolo più amato dagli sviluppatori Elixir. Prende il risultato dell'espressione a sinistra e lo passa come **primo argomento** alla funzione a destra.

### Il Problema che Risolve

Senza pipe, il codice diventa un incubo di parentesi annidate:

```elixir
# Orribile da leggere (devi leggere da dentro verso fuori)
String.upcase(String.trim(String.reverse("  elixir  ")))

# Diviso in variabili temporanee (troppo verboso)
step1 = String.reverse("  elixir  ")
step2 = String.trim(step1)
step3 = String.upcase(step2)
```

### La Soluzione: Il Pipe

```elixir
# Leggibile come una ricetta di cucina (dall'alto in basso)
"  elixir  "
|> String.reverse()
|> String.trim()
|> String.upcase()
# => "RIXILE"
```

Leggi il codice come: "Prendi la stringa, POI invertila, POI rimuovi gli spazi, POI rendila maiuscola".

### Come Funziona

Il pipe passa il risultato come **primo argomento**:

```elixir
# Queste due espressioni sono identiche
"hello" |> String.upcase()
String.upcase("hello")

# Pipeline
"hello" |> String.upcase() |> String.reverse()
# È uguale a:
String.reverse(String.upcase("hello"))
```

### Esempi Pratici

```elixir
# Processare input utente
user_input
|> String.downcase()
|> String.split(" ")
|> Enum.map(&String.capitalize/1)
|> Enum.join(" ")
# "hello WORLD" diventa "Hello World"

# Lavorare con numeri
[1, 2, 3, 4, 5]
|> Enum.filter(&(rem(&1, 2) == 0))
|> Enum.map(&(&1 * 10))
|> Enum.sum()
# => 60 (perché 2*10 + 4*10 = 60)

# API chain (pattern comune nel web)
conn
|> assign(:user, current_user)
|> put_flash(:info, "Benvenuto!")
|> render("index.html")
```

### Pipe con Funzioni Multi-Argomento

Ricorda: il pipe passa il valore come **primo** argomento. Gli altri vanno specificati:

```elixir
# String.split richiede (stringa, separatore)
"a,b,c"
|> String.split(",")
# È uguale a: String.split("a,b,c", ",")

# Con più argomenti
"hello world"
|> String.split(" ")
|> Enum.join("-")
# => "hello-world"
```

### Debug con IO.inspect

Il trucco killer per il debugging:

```elixir
dati
|> elabora()
|> IO.inspect(label: "✓ Dopo elaborazione")
|> trasforma()
|> IO.inspect(label: "✓ Dopo trasformazione")
|> valida()
|> IO.inspect(label: "✓ Dopo validazione")
|> salva()

# Output in console:
# ✓ Dopo elaborazione: [1, 2, 3]
# ✓ Dopo trasformazione: [2, 4, 6]
# ✓ Dopo validazione: {:ok, [2, 4, 6]}
```

> 💡 **Pro Tip**: `IO.inspect/2` restituisce il valore che riceve intatto, quindi non interrompe la pipeline. È perfetto per "spiare" i dati mentre fluiscono. Usa sempre il parametro `label:` per sapere quale step stai vedendo!

## 8. Control Flow: if, case, cond

Anche se Elixir privilegia il pattern matching, ha comunque costrutti di controllo tradizionali.

### if/unless

```elixir
if true do
  "Vero"
else
  "Falso"
end

# Inline
if temperatura > 25, do: "Caldo", else: "Freddo"

# unless (opposto di if)
unless errore?, do: "Tutto ok"
```

### case

Perfetto per il pattern matching multiplo:

```elixir
case File.read("file.txt") do
  {:ok, contenuto} ->
    "File letto: #{contenuto}"
  
  {:error, :enoent} ->
    "File non trovato"
  
  {:error, reason} ->
    "Errore: #{reason}"
end
```

### cond

Quando hai condizioni multiple da valutare (come un else-if chain):

```elixir
cond do
  temperatura > 30 -> "Caldissimo"
  temperatura > 20 -> "Caldo"
  temperatura > 10 -> "Mite"
  true -> "Freddo"  # Default case
end
```

### with

Per concatenare operazioni che possono fallire:

```elixir
with {:ok, user} <- fetch_user(id),
     {:ok, email} <- validate_email(user.email),
     {:ok, _} <- send_email(email) do
  {:ok, "Email inviata"}
else
  {:error, reason} -> {:error, reason}
end
```

## 9. Concorrenza: Processi e Messaggi

Ecco dove Elixir brilla davvero. I processi in Elixir **non sono** thread del sistema operativo, ma processi leggeri della BEAM. Puoi averne milioni contemporaneamente.

### Creare un Processo

```elixir
# Spawn di un processo
pid = spawn(fn -> 
  IO.puts "Ciao dal processo!"
end)

# Spawn e invio di messaggi
pid = spawn(fn ->
  receive do
    {:ciao, mittente} -> 
      send(mittente, {:risposta, "Ciao anche a te!"})
    _ -> 
      IO.puts "Messaggio non riconosciuto"
  end
end)

# Inviare un messaggio
send(pid, {:ciao, self()})

# Ricevere la risposta
receive do
  {:risposta, msg} -> IO.puts msg
after
  1000 -> IO.puts "Timeout!"
end
```

### Task: Processi con Stile

I `Task` sono un'astrazione di alto livello per processi:

```elixir
# Task asincrono
task = Task.async(fn -> 
  :timer.sleep(1000)
  "Risultato dopo 1 secondo"
end)

# Fare altro lavoro...
IO.puts "Sto lavorando..."

# Aspettare il risultato
result = Task.await(task)
IO.puts result
```

### Agent: Stato Condiviso

Gli `Agent` gestiscono stato in modo concorrente:

```elixir
# Creare un agent
{:ok, counter} = Agent.start_link(fn -> 0 end)

# Leggere lo stato
Agent.get(counter, fn state -> state end) # => 0

# Aggiornare lo stato
Agent.update(counter, fn state -> state + 1 end)

# Leggere e aggiornare
Agent.get_and_update(counter, fn state -> 
  {state, state + 1}  # {valore_da_ritornare, nuovo_stato}
end)
```

> 💡 **Pro Tip**: I processi Elixir sono **isolati**: se uno crasha, non porta giù gli altri. Questo è il principio "Let it crash" di Erlang. Usa i **Supervisor** per gestire automaticamente il riavvio di processi crashati.

## 10. Enum e Stream: Lavorare con le Collezioni

Il modulo `Enum` è il tuo migliore amico per manipolare liste, mappe e qualsiasi cosa enumerabile.

```elixir
# Map
Enum.map([1, 2, 3], fn x -> x * 2 end)
# => [2, 4, 6]

# Filter
Enum.filter([1, 2, 3, 4], fn x -> rem(x, 2) == 0 end)
# => [2, 4]

# Reduce
Enum.reduce([1, 2, 3], 0, fn x, acc -> x + acc end)
# => 6

# Chaining
[1, 2, 3, 4, 5]
|> Enum.filter(&(rem(&1, 2) == 0))
|> Enum.map(&(&1 * 10))
# => [20, 40]
```

### Stream: Lazy Evaluation

A differenza di `Enum`, `Stream` è **lazy** (valutazione pigra):

```elixir
# Stream non esegue subito
stream = 1..1_000_000
|> Stream.map(&(&1 * 3))
|> Stream.filter(&(rem(&1, 2) == 0))

# Eseguito solo quando serve
Enum.take(stream, 5)
# => [6, 12, 18, 24, 30]
```

## Conclusione

Questo è stato un viaggio attraverso i concetti fondamentali di Elixir, ma è solo l'inizio. Abbiamo coperto:

- **Atomi e Stringhe**: le fondamenta del tipo di dati
- **Collezioni**: Liste, Tuple, Mappe e Keyword Lists
- **Pattern Matching**: la killer feature che cambia il modo di programmare
- **Funzioni e Moduli**: come organizzare il codice
- **Pipe Operator**: per scrivere codice leggibile e fluido
- **Control Flow**: gestione del flusso con case, cond e with
- **Concorrenza**: processi, Task e Agent per sfruttare la potenza della BEAM
- **Enum e Stream**: manipolazione di collezioni eager e lazy

### Perché Scegliere Elixir?

1. **Scalabilità**: Milioni di processi concorrenti senza sudare
2. **Affidabilità**: "Let it crash" con Supervisor per sistemi fault-tolerant
3. **Produttività**: Sintassi chiara e strumenti fantastici (Mix, IEx, ExUnit)
4. **Ecosistema**: Phoenix per il web, Nerves per IoT, Livebook per data science
5. **Community**: Accogliente e in crescita costante

### Prossimi Passi

Se vuoi approfondire:

- **OTP (Open Telecom Platform)**: GenServer, Supervisor, Application
- **Phoenix Framework**: per costruire applicazioni web real-time
- **Ecto**: il database wrapper più elegante che tu abbia mai visto
- **LiveView**: UI interattive senza scrivere JavaScript
- **Macro e Metaprogramming**: estendere il linguaggio stesso

La curva di apprendimento può sembrare ripida all'inizio a causa del paradigma funzionale, ma una volta che il concetto di **immutabilità** e **pattern matching** fa click, non vorrai più tornare indietro.

### Risorse Utili

- [Documentazione Ufficiale](https://elixir-lang.org/docs.html)
- [Elixir School](https://elixirschool.com/it/) - Tutorial gratuito in italiano
- [Exercism Elixir Track](https://exercism.org/tracks/elixir) - Esercizi pratici
- [Phoenix Framework](https://www.phoenixframework.org/)

Hai domande su una sezione specifica? Vuoi che approfondiamo GenServer o Supervisor? Scrivilo nei commenti! 👇

**Happy Coding!** 🚀✨