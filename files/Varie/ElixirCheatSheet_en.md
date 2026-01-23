# Elixir Cheatsheet

If you're reading this article, you've probably heard of Elixir, that language that combines Ruby's elegant syntax with Erlang's raw power and concurrency (this term in Italian is truly cacophonous). Or maybe you were just intrigued by the article's title. In any case, let's look at it together now.

Elixir isn't just another scripting language; it's a different way of thinking. It runs on BEAM (Erlang's virtual machine), which means it's built to scale and write code properly.

In this article, we'll explore the fundamental sections of the following cheatsheet, which I've prepared for you to download here. I'll try to give you a solid foundation, with practical examples and perhaps even some trade secrets.

## Atoms and strings: the basics

In Elixir, as in chemistry, everything is based on atoms. Specifically, you'll often encounter Atoms here.

> An atom is a constant whose value is its own name.

Think of them as super-efficient labels or enums from other languages, but more flexible.

Strings in Elixir are UTF-8 encoded binaries. The underlying idea is to have no surprises, so they work as you expect, but with full support for interpolation.

``` elixir
# Atoms
:successo
:errore
:ok

# Strings and variables
name = "Dev"
"Ciao #{name}!" # => "Ciao Dev!"

# Concatenation
"Hello " <> "World"
```

> 💡 Pro Tip: Atoms are managed in an internal VM table and are never deallocated by the Garbage Collector. They are very fast for comparisons, but don't generate them dynamically (e.g., converting user input to atoms) indefinitely, or you risk running out of VM memory (Atom table limit).

Okay, but what are atoms for? To communicate states or intentions without using super heavy strings.

> Example: Instead of returning the string "operazione_fallita", a function responds with :error.

Let's say it's a fixed and unequivocal label. Okay, but I know you're expecting that string that lets you say "Okay, I know this language," which is how to print Hello world?

It wouldn't be a programming tutorial without printing something to the screen, would it? In Elixir, the `IO` module handles Input and Output.

```elixir
IO.puts "Hello World!"
# Prints: Hello World!
# Returns: :ok
```
Simple, right? But there's an interesting detail: IO.puts always returns the atom :ok after printing.

> 💡 Pro Tip: `IO.puts` is great for showing text to humans, but if you try to print complex structures (like Maps or Lists), you might get unreadable results. For debugging, always use `IO.inspect(data)`. The magic of `IO.inspect` is that it prints the data and returns it intact, allowing you to insert it into your code without breaking it.

### 2. Collections: Lists vs Tuples

This is where many stumble coming from imperative languages.

Lists ([]): They are linked lists (Linked Lists).

Tuples ({}): They are contiguous memory blocks.

They seem similar, but their performance is opposite.

```
# List (Linked List)
lista = [1, 2, 3]
[0 | lista] # => [0, 1, 2, 3] (Prepend is fast!)

# Tuple
tupla = {:ok, "Tutto bene"}
elem(tupla, 0) # => :ok (Instant access)
```

> 💡 Pro Tip: Use Lists when you need to iterate over data or dynamically add elements to the head. Use Tuples when you know exactly how many elements you have (like returning {:ok, result} from a function). Remember: adding an element to the end of a list is a slow operation (O(n)), while adding it to the head is instantaneous (O(1)).

### 3. Maps and Keyword Lists

Need key-value? You have two main paths.
Maps (%{}) are the "go-to" for generic data structures. Keyword Lists are special lists of tuples primarily used to pass options to functions (because order is guaranteed and keys can be repeated).

```
# Map
user = %{name: "Alice", age: 30}
user.name # => "Alice" (Convenient syntax if the key is an atom)
user[:age] # => 30

# Keyword List
[debug: true, active: false]
# It's syntactic sugar for: [{:debug, true}, {:active, false}]
```

> 💡 Pro Tip: In maps, you can use pattern matching to extract nested values very elegantly. If you look for a non-existent key with the map.key syntax, you'll get an error; if you use map[:key], you'll get nil. Choose based on how sure you are that the data exists!

### 4. Pattern Matching: The Magic (=)

In Elixir, the `=` symbol is not an assignment. It's a match operator. Elixir tries to match the left side with the right. If it succeeds, it binds the variables; otherwise, it throws an error.

It's the most powerful feature of the language.

```
# "Classic" assignment (Match successful)
x = 1

# Pattern Matching
{a, b} = {10, 20}
# Now a is 10, b is 20

# Partial Matching
{:ok, result} = {:ok, "Dati salvati"}
# result now holds "Dati salvati"
```

# This would fail:
# {:ok, result} = {:error, "Something went wrong"}
# ** (MatchError) no match of right hand side value


💡 Pro Tip: Use the underscore _ as a "wildcard" when you don't care about a specific value but need to satisfy the pattern's structure. Example: {:ok, _} = function_that_returns_ok().

5. Functions and Modules

Code lives in modules. Functions can be "named" (def) or "anonymous" (fn). A beautiful thing? You can define the same function multiple times with different arguments (pattern matching in the function signature!).

defmodule Math do
  # Clause 1: If the argument is 0
  def factorial(0), do: 1
  
  # Clause 2: For all other numbers
  def factorial(n), do: n * factorial(n - 1)
end

# Anonymous function
add = fn a, b -> a + b end
add.(1, 2) # Note the dot to call anonymous functions!


💡 Pro Tip: Order matters! Elixir checks function definitions from top to bottom. Always put more specific cases (like factorial(0)) before general cases, otherwise they will never be executed.

6. The Pipe Operator (|>)

Probably the most beloved symbol by Elixir developers. It takes the result of the expression on the left and passes it as the first argument to the function on the right. It makes code readable like a cooking recipe, avoiding nested parentheses f(g(h(x))).

# Without Pipe (Hard to read)
String.upcase(String.trim("  elixir  "))

# With Pipe (Clear and linear)
"  elixir  "
|> String.trim()
|> String.upcase()
# => "ELIXIR"


💡 Pro Tip: When debugging a long pipe chain, use IO.inspect/1 in the middle. It returns the value it receives intact, but prints it to the console. It's perfect for "spying" on data as it flows through the pipeline.

data
|> process()
|> IO.inspect(label: "After processing")
|> save()


Conclusion

This is just a taste of Elixir's power, but it covers the fundamentals you'll find in the cheatsheet. The learning curve might seem steep at first due to the functional paradigm, but once the concept of immutability and pattern matching clicks, you won't want to go back.

Do you have questions about a specific section or want to delve deeper into concurrency with processes? Write it in the comments! 👇

Happy Coding! 🚀