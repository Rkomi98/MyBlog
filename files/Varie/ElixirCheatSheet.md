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
# Lista (Linked List)
lista = [1, 2, 3]
[0 | lista] # => [0, 1, 2, 3] (Prepend è veloce!)

# Destrutturare una lista
[head | tail] = [1, 2, 3, 4]
# head => 1
# tail => [2, 3, 4]

# Aggiungere in coda (LENTO!)
lista ++ [4] # => [1, 2, 3, 4]
```

### Tuple

```elixir
# Tupla
tupla = {:ok, "Tutto bene"}
elem(tupla, 0) # => :ok (Accesso istantaneo)

# Pattern matching con tuple
{:ok, result} = {:ok, "Successo"}
# result => "Successo"

# Aggiornare una tupla (crea una nuova tupla)
put_elem(tupla, 1, "Modificato")
```

> 💡 **Pro Tip**: Usa le **Liste** quando devi scorrere dati o aggiungere elementi in testa dinamicamente. Usa le **Tuple** quando sai esattamente quanti elementi hai (come restituire `{:ok, result}` da una funzione). Ricorda: aggiungere un elemento in fondo a una lista è un'operazione lenta **O(n)**, mentre aggiungerlo in testa è istantaneo **O(1)**.

## 4. Mappe e Keyword Lists

Hai bisogno di strutture chiave-valore? Hai due strade principali:

### Mappe (%{})

Le Mappe sono il "go-to" per strutture dati generiche. Offrono accesso rapido e una sintassi oggettivamente comoda.

```elixir
# Mappa con chiavi atomo
user = %{name: "Lucia", age: 23}
user.name # => "Lucia" (Sintassi comoda se la chiave è un atomo)
user[:age] # => 23

# Mappa con chiavi miste
mixed = %{"città" => "Roma", :paese => "Italia"}
mixed["città"] # => "Roma"

# Aggiornare una mappa (sintassi speciale per atomi)
%{user | age: 24} # => %{name: "Lucia", age: 31}

# Aggiungere nuove chiavi
Map.put(user, :email, "lucia@example.com")
```

### Keyword Lists

Sono liste speciali di tuple usate principalmente per passare opzioni alle funzioni (perché l'ordine è garantito e le chiavi possono ripetersi).

```elixir
# Keyword List
options = [debug: true, active: false, debug: true]
# È zucchero sintattico per: [{:debug, true}, {:active, false}, {:debug, true}]

# Accesso
options[:debug] # => true (prende il primo)

# Uso comune: opzioni di funzione
String.split("a,b,c", ",", trim: true)
```

> 💡 **Pro Tip**: Nelle mappe, puoi usare il pattern matching per estrarre valori nidificati in modo elegantissimo. Se cerchi una chiave che non esiste con la sintassi `map.key`, otterrai un **errore**; se usi `map[:key]`, otterrai `nil`. Scegli in base a quanto sei sicuro che il dato esista!

## 5. Pattern Matching: La Magia dell'Operatore =

In Elixir, il simbolo `=` **non è un'assegnazione**. È un **operatore di confronto** (match operator). Elixir prova a far combaciare il lato sinistro con il destro. Se ci riesce, lega le variabili; se no, lancia un errore.

**È la feature più potente del linguaggio.**

### Esempi di Pattern Matching

```elixir
# Assegnazione "classica" (Match riuscito)
x = 1

# Pattern Matching con tuple
{a, b} = {10, 20}
# Ora a vale 10, b vale 20

# Matching parziale con atomi
{:ok, result} = {:ok, "Dati salvati"}
# result ora vale "Dati salvati"

# Questo fallirebbe:
# {:ok, result} = {:error, "Qualcosa non va"} 
# ** (MatchError) no match of right hand side value

# Matching con liste
[first, second | rest] = [1, 2, 3, 4, 5]
# first => 1, second => 2, rest => [3, 4, 5]

# Matching con mappe
%{name: nome} = %{name: "Alice", age: 30}
# nome => "Alice"
```

### Il Pin Operator (^)

A volte non vuoi riassegnare una variabile, ma vuoi matchare il suo valore attuale. Usa `^`:

```elixir
x = 1
^x = 1  # OK, matcha
^x = 2  # Errore! x vale 1, non 2
```

> 💡 **Pro Tip**: Usa l'underscore `_` come "jolly" quando non ti interessa un valore specifico ma devi soddisfare la struttura del pattern. Esempio: `{:ok, _} = funzione_che_ritorna_ok()`. Puoi anche usare `_variabile` per dare un nome descrittivo ma indicare che non la userai (evita warning del compilatore).

## 6. Funzioni e Moduli

Il codice vive nei **moduli**. Le funzioni possono essere "con nome" (`def`) o "anonime" (`fn`). Una cosa bellissima? Puoi definire la stessa funzione più volte con argomenti diversi, sfruttando il **pattern matching nella firma della funzione!**

### Funzioni con Nome

```elixir
defmodule Math do
  # Clausola 1: Se l'argomento è 0
  def factorial(0), do: 1
  
  # Clausola 2: Per tutti gli altri numeri
  def factorial(n) when n > 0 do
    n * factorial(n - 1)
  end
  
  # Funzione pubblica
  def add(a, b), do: a + b
  
  # Funzione privata (solo dentro il modulo)
  defp multiply(a, b), do: a * b
end

Math.factorial(5) # => 120
Math.add(2, 3)    # => 5
```

### Guard Clauses

Le guard clauses aggiungono condizioni extra al pattern matching:

```elixir
defmodule Temperature do
  def describe(temp) when temp > 30, do: "Caldo"
  def describe(temp) when temp > 15, do: "Mite"
  def describe(temp) when temp > 0, do: "Freddo"
  def describe(_), do: "Gelido"
end
```

### Funzioni Anonime

```elixir
# Sintassi classica
add = fn a, b -> a + b end
add.(1, 2) # => 3 (Nota il punto per chiamare le anonime!)

# Sintassi shorthand con &
multiply = &(&1 * &2)
multiply.(3, 4) # => 12

# Multi-clausola
handle_result = fn
  {:ok, result} -> "Successo: #{result}"
  {:error, reason} -> "Errore: #{reason}"
end
```

> 💡 **Pro Tip**: L'ordine conta! Elixir controlla le definizioni delle funzioni **dall'alto in basso**. Metti sempre i casi più specifici (come `factorial(0)`) prima dei casi generali, altrimenti non verranno mai eseguiti. Le guard clauses vengono valutate **dopo** il pattern matching base.

## 7. L'Operatore Pipe (|>)

Probabilmente il simbolo più amato dagli sviluppatori Elixir. Il pipe operator `|>` prende il risultato dell'espressione a sinistra e lo passa come **primo argomento** alla funzione a destra. Rende il codice leggibile come una ricetta di cucina, evitando le parentesi annidate tipo `f(g(h(x)))`.

### Esempi di Pipe

```elixir
# Senza Pipe (Difficile da leggere)
String.upcase(String.trim("  elixir  "))

# Con Pipe (Chiaro e lineare)
"  elixir  "
|> String.trim()
|> String.upcase()
# => "ELIXIR"

# Pipeline complessa
user_input
|> String.downcase()
|> String.split(" ")
|> Enum.map(&String.capitalize/1)
|> Enum.join(" ")
# Converte "hello WORLD" in "Hello World"
```

> 💡 **Pro Tip**: Quando fai debugging in una catena di pipe lunga, usa `IO.inspect/1` nel mezzo. Restituisce il valore che riceve intatto, ma lo stampa in console. È perfetto per "spiare" i dati mentre fluiscono nella pipeline.

```elixir
dati
|> elabora()
|> IO.inspect(label: "Dopo elaborazione")
|> trasforma()
|> IO.inspect(label: "Dopo trasformazione")
|> salva()
```

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