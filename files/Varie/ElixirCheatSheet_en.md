# Elixir Cheatsheet: A Practical Guide from Beginner to Expert

If you're reading this article, you've probably heard of Elixir, that language that combines Ruby's elegant syntax with Erlang's raw power and concurrency (this term in Italian is truly cacophonous). Or perhaps you were just intrigued by the article's title. In any case, let's explore it together now.

Elixir isn't just another scripting language; it's a different way of thinking. It runs on the **BEAM** (Erlang's virtual machine), which means it's built to scale and write proper code, handling millions of concurrent processes with disarming ease.

In this article, we'll explore Elixir's fundamental concepts, giving you a solid foundation with practical examples and some trade secrets that will save you hours of debugging.

## 1. Hello World and the Essentials

Before diving into the details, let's start with tradition: how to print the classic "Hello World".

In Elixir, the `IO` module handles Input and Output.

```elixir
IO.puts "Hello World!"
# Prints: Hello World!
# Returns: :ok
```

Simple, right? But there's an interesting detail: `IO.puts` always returns the atom `:ok` after printing.

> 💡 **Pro Tip**: `IO.puts` is great for displaying text to humans, but if you try to print complex structures (like Maps or Lists), you might get unreadable results. For debugging, always use `IO.inspect(data)`. The magic of `IO.inspect` is that it prints the data and returns it intact, allowing you to insert it into your code without breaking it.

## 2. Atoms and Strings: The Foundations

In Elixir, as in chemistry, everything is based on atoms. But what exactly are they?

> **An atom is a constant whose value is its own name.**

Think of them as super-efficient labels or enums from other languages, but more flexible.

### Atoms

```elixir
:successo
:errore
:ok
:not_found
```

What are they for? To communicate states or intentions without using heavy strings.

> **Example**: Instead of returning the string `"operation_failed"`, a function responds with `:error`. It's a fixed and unequivocal label.

### Strings

Strings in Elixir are binaries encoded in UTF-8. They work as you expect, but with full support for interpolation.

```elixir
# Strings and variables
name = "Dev"
"Ciao #{name}!" # => "Ciao Dev!"

# Concatenation
"Hello " <> "World" # => "Hello World"

# Multiline
"""
This is a string
on multiple lines
"""
```

> 💡 **Pro Tip**: Atoms are managed in an internal VM table and are never deallocated by the Garbage Collector. They are extremely fast for comparisons, but **do not generate them dynamically** (e.g., by converting user input into atoms) indefinitely, or you risk exhausting the VM's memory (Atom table limit).

## 3. Collections: Lists vs Tuples

This is where many stumble coming from imperative languages. In Elixir, we have two main types of collections:

-   **Lists (`[]`)**: These are Linked Lists
-   **Tuples (`{}`)**: These are contiguous memory blocks

They seem similar, but their performance characteristics are **opposite**.

### Lists (Linked Lists)

```elixir
# List (Linked List)
list = [1, 2, 3]
[0 | list] # => [0, 1, 2, 3] (Prepend is fast!)

# Destructuring a list
[head | tail] = [1, 2, 3, 4]
# head => 1
# tail => [2, 3, 4]

# Appending (SLOW!)
list ++ [4] # => [1, 2, 3, 4]
```

### Tuples

```elixir
# Tuple
tuple = {:ok, "All good"}
elem(tuple, 0) # => :ok (Instant access)

# Pattern matching with tuples
{:ok, result} = {:ok, "Success"}
# result => "Success"

# Updating a tuple (creates a new tuple)
put_elem(tuple, 1, "Modified")
```

> 💡 **Pro Tip**: Use **Lists** when you need to iterate over data or dynamically add elements to the head. Use **Tuples** when you know exactly how many elements you have (like returning `{:ok, result}` from a function). Remember: adding an element to the end of a list is a slow **O(n)** operation, while adding it to the head is instantaneous **O(1)**.

## 4. Maps and Keyword Lists

Need key-value structures? You have two main paths:

### Maps (%{})

Maps are the "go-to" for generic data structures. They offer fast access and convenient syntax.

```elixir
# Map with atom keys
user = %{name: "Alice", age: 30}
user.name # => "Alice" (Convenient syntax if the key is an atom)
user[:age] # => 30

# Map with mixed keys
mixed = %{"city" => "Rome", :country => "Italy"}
mixed["city"] # => "Rome"

# Updating a map (special syntax for atoms)
%{user | age: 31} # => %{name: "Alice", age: 31}

# Adding new keys
Map.put(user, :email, "alice@example.com")
```

### Keyword Lists

These are special lists of tuples primarily used for passing options to functions (because order is guaranteed and keys can be repeated).

```elixir
# Keyword List
options = [debug: true, active: false, debug: true]
# It's syntactic sugar for: [{:debug, true}, {:active, false}, {:debug, true}]

# Access
options[:debug] # => true (takes the first one)

# Common use: function options
String.split("a,b,c", ",", trim: true)
```

> 💡 **Pro Tip**: In maps, you can use pattern matching to extract nested values in a very elegant way. If you look for a key that doesn't exist with the `map.key` syntax, you will get an **error**; if you use `map[:key]`, you will get `nil`. Choose based on how sure you are that the data exists!

## 5. Pattern Matching: The Magic of the = Operator

In Elixir, the `=` symbol **is not an assignment**. It is a **match operator**. Elixir tries to match the left side with the right side. If it succeeds, it binds the variables; otherwise, it throws an error.

**It is the most powerful feature of the language.**

### Pattern Matching Examples

```elixir
# "Classic" assignment (Match successful)
x = 1

# Pattern Matching with tuples
{a, b} = {10, 20}
# Now a is 10, b is 20

# Partial matching with atoms
{:ok, result} = {:ok, "Data saved"}
# result now is "Data saved"

# This would fail:
# {:ok, result} = {:error, "Something is wrong"}
# ** (MatchError) no match of right hand side value

# Matching with lists
[first, second | rest] = [1, 2, 3, 4, 5]
# first => 1, second => 2, rest => [3, 4, 5]

# Matching with maps
%{name: name} = %{name: "Alice", age: 30}
# name => "Alice"
```

### The Pin Operator (^)

Sometimes you don't want to reassign a variable, but you want to match its current value. Use `^`:

```elixir
x = 1
^x = 1  # OK, matches
^x = 2  # Error! x is 1, not 2
```

> 💡 **Pro Tip**: Use the underscore `_` as a "wildcard" when you don't care about a specific value but need to satisfy the pattern's structure. Example: `{:ok, _} = function_that_returns_ok()`. You can also use `_variable` to give a descriptive name but indicate that you won't use it (avoids compiler warnings).

## 6. Functions and Modules

Code lives in **modules**. Functions can be "named" (`def`) or "anonymous" (`fn`). A beautiful thing? You can define the same function multiple times with different arguments, leveraging **pattern matching in the function signature!**

### Named Functions

```elixir
defmodule Math do
  # Clause 1: If the argument is 0
  def factorial(0), do: 1

  # Clause 2: For all other numbers
  def factorial(n) when n > 0 do
    n * factorial(n - 1)
  end

  # Public function
  def add(a, b), do: a + b

  # Private function (only within the module)
  defp multiply(a, b), do: a * b
end

Math.factorial(5) # => 120
Math.add(2, 3)    # => 5
```

### Guard Clauses

Guard clauses add extra conditions to pattern matching:

```elixir
defmodule Temperature do
  def describe(temp) when temp > 30, do: "Hot"
  def describe(temp) when temp > 15, do: "Mild"
  def describe(temp) when temp > 0, do: "Cold"
  def describe(_), do: "Freezing"
end
```

### Anonymous Functions

```elixir
# Classic syntax
add = fn a, b -> a + b end
add.(1, 2) # => 3 (Note the dot to call anonymous functions!)

# Shorthand syntax with &
multiply = &(&1 * &2)
multiply.(3, 4) # => 12

# Multi-clause
handle_result = fn
  {:ok, result} -> "Success: #{result}"
  {:error, reason} -> "Error: #{reason}"
end
```

> 💡 **Pro Tip**: Order matters! Elixir checks function definitions **from top to bottom**. Always put more specific cases (like `factorial(0)`) before general cases, otherwise they will never be executed. Guard clauses are evaluated **after** the basic pattern matching.

## 7. The Pipe Operator (|>)

Probably the most beloved symbol by Elixir developers. The pipe operator `|>` takes the result of the expression on the left and passes it as the **first argument** to the function on the right. It makes the code readable like a cooking recipe, avoiding nested parentheses like `f(g(h(x)))`.

### Pipe Examples

```elixir
# Without Pipe (Hard to read)
String.upcase(String.trim("  elixir  "))

# With Pipe (Clear and linear)
"  elixir  "
|> String.trim()
|> String.upcase()
# => "ELIXIR"

# Complex pipeline
user_input
|> String.downcase()
|> String.split(" ")
|> Enum.map(&String.capitalize/1)
|> Enum.join(" ")
# Converts "hello WORLD" to "Hello World"
```

> 💡 **Pro Tip**: When debugging a long pipe chain, use `IO.inspect/1` in the middle. It returns the value it receives intact, but prints it to the console. It's perfect for "peeking" at data as it flows through the pipeline.

```elixir
data
|> process()
|> IO.inspect(label: "After processing")
|> transform()
|> IO.inspect(label: "After transformation")
|> save()
```

## 8. Control Flow: if, case, cond

Although Elixir favors pattern matching, it still has traditional control constructs.

### if/unless

```elixir
if true do
  "True"
else
  "False"
end

# Inline
if temperature > 25, do: "Hot", else: "Cold"
```

# unless (opposite of if)
unless error?, do: "All good"
```

### case

Perfect for multiple pattern matching:

```elixir
case File.read("file.txt") do
  {:ok, content} ->
    "File read: #{content}"
  
  {:error, :enoent} ->
    "File not found"
  
  {:error, reason} ->
    "Error: #{reason}"
end
```

### cond

When you have multiple conditions to evaluate (like an else-if chain):

```elixir
cond do
  temperature > 30 -> "Very hot"
  temperature > 20 -> "Hot"
  temperature > 10 -> "Mild"
  true -> "Cold"  # Default case
end
```

### with

To chain operations that might fail:

```elixir
with {:ok, user} <- fetch_user(id),
     {:ok, email} <- validate_email(user.email),
     {:ok, _} <- send_email(email) do
  {:ok, "Email sent"}
else
  {:error, reason} -> {:error, reason}
end
```

## 9. Concurrency: Processes and Messages

This is where Elixir truly shines. Processes in Elixir are **not** operating system threads, but lightweight BEAM processes. You can have millions of them concurrently.

### Creating a Process

```elixir
# Spawn a process
pid = spawn(fn -> 
  IO.puts "Hello from the process!"
end)

# Spawn and send messages
pid = spawn(fn ->
  receive do
    {:hello, sender} -> 
      send(sender, {:response, "Hello to you too!"})
    _ -> 
      IO.puts "Unrecognized message"
  end
end)

# Send a message
send(pid, {:hello, self()})

# Receive the response
receive do
  {:response, msg} -> IO.puts msg
after
  1000 -> IO.puts "Timeout!"
end
```

### Task: Processes with Style

`Task`s are a high-level abstraction for processes:

```elixir
# Asynchronous Task
task = Task.async(fn -> 
  :timer.sleep(1000)
  "Result after 1 second"
end)

# Do other work...
IO.puts "Working..."

# Wait for the result
result = Task.await(task)
IO.puts result
```

### Agent: Shared State

`Agent`s manage state concurrently:

```elixir
# Create an agent
{:ok, counter} = Agent.start_link(fn -> 0 end)

# Read the state
Agent.get(counter, fn state -> state end) # => 0

# Update the state
Agent.update(counter, fn state -> state + 1 end)

# Read and update
Agent.get_and_update(counter, fn state -> 
  {state, state + 1}  # {value_to_return, new_state}
end)
```

> 💡 **Pro Tip**: Elixir processes are **isolated**: if one crashes, it doesn't bring down the others. This is Erlang's "Let it crash" principle. Use **Supervisors** to automatically manage restarting crashed processes.

## 10. Enum and Stream: Working with Collections

The `Enum` module is your best friend for manipulating lists, maps, and anything enumerable.

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

Unlike `Enum`, `Stream` is **lazy**:

```elixir
# Stream does not execute immediately
stream = 1..1_000_000
|> Stream.map(&(&1 * 3))
|> Stream.filter(&(rem(&1, 2) == 0))

# Executed only when needed
Enum.take(stream, 5)
# => [6, 12, 18, 24, 30]
```

## Conclusion

This has been a journey through the fundamental concepts of Elixir, but it's just the beginning. We've covered:

-   **Atoms and Strings**: the data type foundations
-   **Collections**: Lists, Tuples, Maps, and Keyword Lists
-   **Pattern Matching**: the killer feature that changes the way you program
-   **Functions and Modules**: how to organize code
-   **Pipe Operator**: for writing readable and fluid code
-   **Control Flow**: managing flow with case, cond, and with
-   **Concurrency**: processes, Tasks, and Agents to harness the power of the BEAM
-   **Enum and Stream**: eager and lazy collection manipulation

### Why Choose Elixir?

1.  **Scalability**: Millions of concurrent processes without breaking a sweat
2.  **Reliability**: "Let it crash" with Supervisors for fault-tolerant systems
3.  **Productivity**: Clear syntax and fantastic tools (Mix, IEx, ExUnit)
4.  **Ecosystem**: Phoenix for web, Nerves for IoT, Livebook for data science
5.  **Community**: Welcoming and constantly growing

### Next Steps

If you want to delve deeper:

-   **OTP (Open Telecom Platform)**: GenServer, Supervisor, Application
-   **Phoenix Framework**: for building real-time web applications
-   **Ecto**: the most elegant database wrapper you've ever seen
-   **LiveView**: interactive UIs without writing JavaScript
-   **Macros and Metaprogramming**: extending the language itself

The learning curve might seem steep at first due to the functional paradigm, but once the concepts of **immutability** and **pattern matching** click, you won't want to go back.

### Useful Resources

- [Official Documentation](https://elixir-lang.org/docs.html)
- [Elixir School](https://elixirschool.com/it/) - Free tutorial in Italian
- [Exercism Elixir Track](https://exercism.org/tracks/elixir) - Practical Exercises
- [Phoenix Framework](https://www.phoenixframework.org/)

Do you have questions about a specific section? Do you want us to delve deeper into GenServer or Supervisor? Write it in the comments! 👇

**Happy Coding!** 🚀✨