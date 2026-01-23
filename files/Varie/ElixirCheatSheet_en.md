# Elixir Cheatsheet

If you're reading this article, you've probably heard of Elixir, that language that combines Ruby's elegant syntax with Erlang's raw power and concurrency (this term in Italian is truly cacophonous). Or maybe you were just intrigued by the article's title. In any case, let's explore it together now.

Elixir isn't just another scripting language; it's a different way of thinking. It runs on the **BEAM** (Erlang's virtual machine), which means it's built to scale and write proper code, handling millions of concurrent processes with disarming ease.

In this article, we'll explore Elixir's fundamental concepts, giving you a solid foundation with practical examples and a few trade tricks that will save you hours of debugging.

## 1. Hello World

Before diving into the details, let's start with the traditional step that allows you to say you know a language: how to print the classic "Hello World".

In Elixir, the `IO` module handles Input and Output.

```elixir
IO.puts "Hello World!"
# Prints: Hello World!
# Returns: :ok
```

Simple, right? But there's an interesting detail: `IO.puts` always returns the atom `:ok` after printing.

> 💡 **Pro Tip**: `IO.puts` is great for showing text to humans, but if you try to print complex structures (like Maps or Lists), you might get unreadable results. For debugging, always use `IO.inspect(data)`. The magic of `IO.inspect` is that it prints the data and returns it intact, allowing you to insert it into your code without breaking it.

## 2. Atoms and Strings: The Basics

In Elixir, just like in chemistry, everything is based on atoms. But what exactly are they?

> **An atom is a constant whose value is its own name.**

Think of them as super-efficient labels or enums from other languages, but more flexible.

### Atoms

```elixir
:success
:error
:ok
:not_found
```

What are they for? To communicate states or intentions without using heavy strings.

> **Example**: Instead of returning the string `"operation_failed"`, a function responds with `:error`. It's a fixed and unambiguous label.

### Strings

Strings in Elixir are UTF-8 encoded. They work as you'd expect, but with full support for interpolation.

```elixir
# Strings and variables
name = "Dev"
"Hello #{name}!" # => "Hello Dev!"

# Concatenation
"Hello " <> "World" # => "Hello World"

# Multiline
"""
This is a string
on multiple lines
"""
```

> 💡 **Pro Tip**: Atoms are managed in an internal VM table and are never deallocated by the Garbage Collector. They are extremely fast for comparisons, but **do not generate them dynamically** (e.g., by converting user input into atoms) indefinitely, or you risk running out of VM memory (Atom table limit).

## 3. Collections: Lists vs Tuples

This is where many stumble coming from imperative languages. In Elixir, we have two main types of collections:

- **Lists (`[]`)**: These are Linked Lists. Imagine them as a treasure hunt: each element contains its value and a small note that says "the next element is over there." On one hand, adding an element to the head is instantaneous (just create a new note pointing to the old list), but on the other hand, to find the 1000th element, you have to read all 999 previous notes.

- **Tuples (`{}`)**: These are contiguous memory blocks, similar to C arrays. Imagine them as a fixed shelf where everything has its numbered place. On one hand, accessing any element is extremely fast, no matter where it is. On the other hand, modifying them is costly (in terms of memory) because the entire shelf must be copied to a new space.

They seem similar, but their performance characteristics are **opposite**.

### Lists or linked lists

```elixir
# Create a list
list = [1, 2, 3]

# Access elements
List.first(list) # => 1
List.last(list)  # => 3

# Add to head (FAST!)
[0 | list] # => [0, 1, 2, 3]

# Add to tail (SLOW!)
list ++ [4] # => [1, 2, 3, 4]

# Concatenate lists
[1, 2] ++ [3, 4] # => [1, 2, 3, 4]

# Length
length(list) # => 3
```

### Tuples

```elixir
# Create a tuple
tuple = {:ok, "All good"}

# Access elements (by index)
elem(tuple, 0) # => :ok
elem(tuple, 1) # => "All good"

# Tuple size
tuple_size(tuple) # => 2

# Update a tuple (creates a new tuple)
put_elem(tuple, 1, "Modified")
# => {:ok, "Modified"}

# Common use: function results
{:ok, "Success"}
{:error, "Something went wrong"}
```

> 💡 **Pro Tip**: Use **Lists** when you need to iterate over data or dynamically add elements to the head. Use **Tuples** when you know exactly how many elements you have (like returning `{:ok, result}` from a function). Remember: adding an element to the end of a list is a slow **O(n)** operation, while adding it to the head is instantaneous **O(1)**.

## 4. Maps and Keyword Lists

Do you need key-value structures? You have two main paths:

### Maps (%{})

Maps are the "go-to" for generic data structures. They offer quick access and an objectively convenient syntax.

```elixir
# Create a map with atom keys
user = %{name: "Lucia", age: 23}

# Access values (two ways)
user.name    # => "Lucia" (only if the key is an atom)
user[:age]   # => 23
user[:email] # => nil (key does not exist)

# Map with string keys
config = %{"host" => "localhost", "port" => 8080}
config["host"] # => "localhost"

# Update an existing value
%{user | age: 24} # => %{name: "Lucia", age: 24}

# Add new keys
Map.put(user, :email, "lucia@example.com")
# => %{name: "Lucia", age: 23, email: "lucia@example.com"}

# Remove a key
Map.delete(user, :age)
# => %{name: "Lucia"}

# Check if a key exists
Map.has_key?(user, :name) # => true
```

### Keyword Lists

These are special lists of tuples primarily used to pass options to functions. The difference from maps? Order is guaranteed, and keys can be repeated.

```elixir
# Keyword List
options = [debug: true, active: false]
# This is syntactic sugar for: [{:debug, true}, {:active, false}]

# Access
options[:debug] # => true

# Duplicate keys (access takes the first one)
options = [debug: true, active: false, debug: false]
options[:debug] # => true (first value)

# Common use: function options
String.split("a,b,c", ",", trim: true)
Enum.map([1, 2], fn x -> x * 2 end)
```

> 💡 **Pro Tip**: If you look for a key that doesn't exist with the `map.key` syntax, you will get an **error** (KeyError); if you use `map[:key]`, you will get `nil`. Use the first when you are sure the key exists, the second when you want to handle the absence of the value.

## 5. Pattern Matching: The Magic of the `=` Operator

Here, we've finally arrived at why I started to appreciate Elixir. In Elixir, the `=` symbol is **not an assignment** in the traditional sense. It is a **match operator**: Elixir tries to match the left side with the right. If it succeeds, it binds the variables; otherwise, it throws an error.

**It is the most powerful feature of the language** and completely changes the way you write code.

### How does it work?

Think of `=` as a mathematical equation. Elixir tries to make both sides true:

```elixir
# "x must be equal to 1"
x = 1
# Elixir binds x to the value 1

# "1 must be equal to 1"
1 = x
# OK! Matches because x is 1

# "2 must be equal to 1"
2 = x
# ** (MatchError) no match of right hand side value: 1
```

### Pattern Matching with tuples

Now that you know tuples, exactly how we constructed them, let's see how to destructure them:

```elixir
# Destructure a tuple
{a, b} = {10, 20}
# a => 10, b => 20

# Practical use: handle function results
{:ok, result} = {:ok, "Operation successful"}
# result => "Operation successful"

# If the pattern doesn't match, error!
{:ok, result} = {:error, "Something went wrong"}
# ** (MatchError) no match of right hand side value: {:error, "Something went wrong"}

# Ignore values we don't care about
{:ok, _} = {:ok, "I don't care about the content"}
# OK! The underscore matches anything

# Real-world example: File.read
{:ok, content} = File.read("config.txt")
# If the file exists, content will have the text
# Otherwise, MatchError (an "intentional" crash)
```

### Pattern Matching with lists

Lists take on a whole new charm with pattern matching:

```elixir
# Destructure head and tail
[head | tail] = [1, 2, 3, 4, 5]
# head => 1
# tail => [2, 3, 4, 5]

# Take the first two elements
[first, second | rest] = [1, 2, 3, 4, 5]
# first => 1, second => 2, rest => [3, 4, 5]

# Exact pattern matching
[1, 2, 3] = [1, 2, 3]
# OK!

# Pattern matching with mixed values
[1, x, 3] = [1, 42, 3]
# x => 42

# Empty list
[] = []
# OK!

# This would fail
[a, b] = [1, 2, 3]
# ** (MatchError) - the pattern requires exactly 2 elements
```

### Pattern Matching with maps

Maps are even more flexible: you can match only the keys you are interested in!

```elixir
# Extract specific values
%{name: name} = %{name: "Lucia", age: 23, city: "Rome"}
# name => "Lucia"
# age and city are ignored

# Extract multiple values
%{name: n, age: a} = %{name: "Lucia", age: 23, city: "Rome"}
# n => "Lucia", a => 23

# Verify that a key exists with a certain value
%{status: :ok} = %{status: :ok, data: "something"}
# OK!

%{status: :ok} = %{status: :error, data: "something"}
# ** (MatchError) - status is not :ok

# Combine with atoms for validation
%{type: :user, id: user_id} = %{type: :user, id: 42, name: "Bob"}
# user_id => 42
# Useful for validating that we are receiving the correct type of data!
```

### Pattern Matching with functions

Now look at how elegant and functional function definitions are:

```elixir
defmodule FileHandler do
  # Clause 1: matches only if the result is {:ok, content}
  def handle({:ok, content}) do
    "File read successfully: #{content}"
  end
  
  # Clause 2: matches only if the result is {:error, reason}
  def handle({:error, reason}) do
    "Error reading: #{reason}"
  end
end

# Usage
File.read("test.txt") |> FileHandler.handle()
# Elixir automatically chooses the correct clause!
```
> defining the definition of a functional function almost sounds like a pun

### The pin operator (^)

Sometimes you don't want to reassign a variable, but you want to match against its current value:

```elixir
# Without pin: reassigns
x = 1
x = 2  # x is now 2

# With pin: matches the current value
x = 1
^x = 1  # OK, matches because x is 1
^x = 2  # Error! x is 1, not 2

# Here's a practical use: how to validate an expected value
expected_status = :ok
^expected_status = get_status()
# Ensures that get_status() returns :ok, otherwise it crashes
```

### The underscore: the wildcard

The underscore `_` matches anything but doesn't bind it to a variable:

```elixir
# Completely ignore a value
{:ok, _} = {:ok, "I don't care"}

# Ignore parts of a list
[_, second, _, fourth] = [1, 2, 3, 4]
# second => 2, fourth => 4

# Give a descriptive name but don't use the value (avoids warnings). _ will contain all the content you don't use
{:ok, _} = File.read("test.txt")
```

### Pattern Matching everywhere!

Pattern matching isn't just used with `=`. It's everywhere in Elixir:

```elixir
# In functions (see section 6)
def calculate({:sum, a, b}), do: a + b
def calculate({:product, a, b}), do: a * b

# In case statements (see section 8)
case File.read("file.txt") do
  {:ok, content} -> "Read: #{content}"
  {:error, :enoent} -> "File not found"
  {:error, reason} -> "Error: #{reason}"
end

# In list comprehensions
for {:ok, value} <- results, do: value

# In anonymous function parameters
Enum.map([{:ok, 1}, {:ok, 2}], fn {:ok, n} -> n * 2 end)
```

> 💡 **Pro Tip**: Pattern matching allows you to write **declarative** code instead of **imperative** code. Instead of asking "is this value ok? Then extract it", you say "this must be {:ok, value}" and Elixir does all the heavy lifting. If the pattern doesn't match, the program crashes (fail fast), which is exactly what you want during development – not to have problems later, but to understand immediately if there's an issue.

## 6. Functions and Modules

Code lives in **modules**. Functions can be "named" (`def`) or "anonymous" (`fn`). Something beautiful? You can define the same function multiple times with different arguments, leveraging **pattern matching in the function signature** (which you just saw in the previous section!).

### Named Functions

```elixir
defmodule Math do
  # Simple function
  def add(a, b), do: a + b
  
  # Multi-line body function
  def multiply(a, b) do
    result = a * b
    result
  end
  
  # Private function (only within the module)
  defp private_helper(x), do: x * 2
end

Math.add(2, 3)      # => 5
Math.multiply(4, 5) # => 20
```

### Pattern Matching in Functions

Now that you know pattern matching, here's where it becomes truly useful and powerful, or rather, allows you to do a lot of things:

```elixir
defmodule FileHandler do
  # Clause 1: matches {:ok, content}
  def process({:ok, content}) do
    "Processed: #{content}"
  end
  
  # Clause 2: matches {:error, reason}
  def process({:error, reason}) do
    "Error: #{reason}"
  end
end

# Elixir automatically chooses the correct clause!
FileHandler.process({:ok, "data"})    # => "Processed: data"
FileHandler.process({:error, "boom"}) # => "Error: boom"
```

### Recursion with Pattern Matching

Pattern matching makes recursion very elegant:

```elixir
defmodule Math do
  # Base case: 0! = 1
  def factorial(0), do: 1
  
  # Recursive case: n! = n * (n-1)!
  def factorial(n) when n > 0 do
    n * factorial(n - 1)
  end
end

Math.factorial(5) # => 120
```

```elixir
defmodule ListHelper do
  # Base case: empty list
  def sum([]), do: 0
  
  # Recursive case: sum the head + sum of the tail
  def sum([head | tail]) do
    head + sum(tail)
  end
end

ListHelper.sum([1, 2, 3, 4]) # => 10
```

### Guard Clauses

Guard clauses add extra conditions **after** pattern matching:

```elixir
defmodule Temperature do
  # Pattern matching + condition
  def describe(temp) when temp > 30, do: "Very hot! 🔥"
  def describe(temp) when temp > 15, do: "Mild 😊"
  def describe(temp) when temp > 0, do: "Cold 🥶"
  def describe(_), do: "Freezing ❄️" # catch-all form without unused variable warning. Similar to an else.
end

Temperature.describe(35) # => "Very hot! 🔥"
Temperature.describe(18) # => "Mild 😊"
```

Supported guards: `<`, `>`, `==`, `!=`, `and`, `or`, `not`, `is_list`, `is_map`, `is_atom`, etc.

### Anonymous Functions

Disposable "throwaway" functions without a name:

```elixir
# Classic Syntax
add = fn a, b -> a + b end
add.(1, 2) # => 3 (Note the dot to call anonymous functions!)

# With multi-clause pattern matching
handle_result = fn
  {:ok, result} -> "Success: #{result}"
  {:error, reason} -> "Error: #{reason}"
  _ -> "Unhandled case"
end

handle_result.({:ok, "all good"}) # => "Success: all good"
```

### Shorthand Syntax with &

For super simple functions:

```elixir
# Long version
Enum.map([1, 2, 3], fn x -> x * 2 end) # => [2, 4, 6]

# Short version with & (capture operator)
Enum.map([1, 2, 3], &(&1 * 2)) # => [2, 4, 6]
# &1 = first argument, &2 = second, etc.

# Passing existing functions
Enum.map(["hello", "world"], &String.upcase/1)
# => ["HELLO", "WORLD"]
```

### Default Arguments

```elixir
defmodule Greeter do
  # \\ defines a default value
  def greet(name, greeting \\ "Hello") do
    "#{greeting}, #{name}!"
  end
end

Greeter.greet("Lucia")           # => "Hello, Lucia!"
Greeter.greet("Lucia", "Good morning") # => "Good morning, Lucia!"
```

> 💡 **Pro Tip**: Order matters! Elixir checks function definitions **from top to bottom**. Always put more specific cases (like `factorial(0)`) before general cases, otherwise they will never be executed. Guard clauses are evaluated **after** basic pattern matching.

## 7. The Pipe Operator (|>): Writing Readable Code

The pipe operator `|>` is probably the most beloved symbol by Elixir developers. It takes the result of the expression on the left and passes it as the **first argument** to the function on the right.

### Why does it exist?

If the pipe operator didn't exist, the code would be a nightmare of nested parentheses:

```elixir
# Horrible to read (you have to read from the inside out)
String.upcase(String.trim(String.reverse("  elixir  ")))

# Split into temporary variables (too verbose)
step1 = String.reverse("  elixir  ")
step2 = String.trim(step1)
step3 = String.upcase(step2)
```

And here's the solution, using pipe

```elixir
# Readable like a cooking recipe (from top to bottom)
"  elixir  "
|> String.reverse()
|> String.trim()
|> String.upcase()
# => "RIXILE"
```

Read the code as: "Take the string, THEN reverse it, THEN trim the spaces, THEN make it uppercase."

### How does it work?

The pipe passes the result as the **first argument**:

```elixir
# These two expressions are identical
"hello" |> String.upcase()
String.upcase("hello")

# Pipeline
"hello" |> String.upcase() |> String.reverse()
# Is equivalent to:
String.reverse(String.upcase("hello"))
```

### Examples

```elixir
# Process user input
user_input
|> String.downcase()
|> String.split(" ")
|> Enum.map(&String.capitalize/1)
|> Enum.join(" ")
# "hello WORLD" becomes "Hello World"

# Working with numbers
[1, 2, 3, 4, 5]
|> Enum.filter(&(rem(&1, 2) == 0))
|> Enum.map(&(&1 * 10))
|> Enum.sum()
# => 60 (because 2*10 + 4*10 = 60)

# API chain (common pattern in web)
conn
|> assign(:user, current_user)
|> put_flash(:info, "Welcome!")
|> render("index.html")
```

### Pipe with multi-argument functions

Remember: the pipe passes the value as the **first** argument. The others must be specified:

```elixir
# String.split requires (string, separator)
"a,b,c"
|> String.split(",")
# Is equivalent to: String.split("a,b,c", ",")

# With more arguments
"hello world"
|> String.split(" ")
|> Enum.join("-")
# => "hello-world"
```

### Debugging with `IO.inspect`

The number one trick for debugging is to combine the pin and `IO.inspect`:

```elixir
data
|> process()
|> IO.inspect(label: "✓ After processing")
|> transform()
|> IO.inspect(label: "✓ After transformation")
|> validate()
|> IO.inspect(label: "✓ After validation")
|> save()

# Console output:
# ✓ After processing: [1, 2, 3]
# ✓ After transformation: [2, 4, 6]
# ✓ After validation: {:ok, [2, 4, 6]}
```

> 💡 **Pro Tip**: `IO.inspect/2` (meaning it takes 2 arguments, used to distinguish overloads) returns the value it receives intact, so it doesn't break the pipeline. It's perfect for "spying" on data as it flows. Always use the `label:` parameter to know which step you are viewing!

## 8. Control Flow: if, case, cond

Even though Elixir favors pattern matching, it still has traditional control constructs.

### if/unless

```elixir
if true do
  "True"
else
  "False"
end

# Inline
if temperature > 25, do: "Hot", else: "Cold"

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

For concatenating operations that can fail:

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

Here's another example where Elixir excels. Processes in Elixir are **not** operating system threads, but lightweight BEAM processes. You can have millions of them concurrently.

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

## 10. Enum and Stream: How to Work with Collections

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

In this brief journey, we have covered the fundamental concepts of Elixir, namely:

- **Atoms and strings**: the foundations of data types
- **Collections**: Lists, Tuples, Maps, and Keyword Lists
- **Pattern Matching**: the killer feature that changes the way you program
- **Functions and modules**: how to organize code
- **Pipe Operator**: for writing readable and fluid code
- **Control Flow**: flow management with case, cond, and with
- **Concurrency**: processes, Tasks, and Agents to leverage the power of BEAM
- **Enum and Stream**: eager and lazy collection manipulation

### Why choose Elixir?
Let's say I have several reasons in mind, but ordering by importance based on my experience, I can say:

1. **Scalability**: Millions of concurrent processes without too many problems.
2. **Reliability**: "Let it crash" with Supervisors for fault-tolerant systems.
3. **Productivity**: Clear syntax and fantastic tools (Mix, IEx, ExUnit).
4. **Ecosystem**: Phoenix for web, Nerves for IoT, Livebook for data science.
5. **Community**: Welcoming and constantly growing!

If you have others, I invite you to write to me to tell me your opinion!

### Next Steps

If you want to delve deeper:

- **OTP (Open Telecom Platform)**: GenServer, Supervisor, Application
- **Phoenix Framework**: for building real-time web applications
- **Ecto**: the most elegant database wrapper you've ever seen
- **LiveView**: interactive UIs without writing JavaScript
- **Macros and Metaprogramming**: extending the language itself

The learning curve might seem steep at first, but once you grasp the concept of **immutability** and get used to **pattern matching**, you won't want to go back. Trust me!

### Useful Resources

- [Official Documentation](https://elixir-lang.org/docs.html)
- [Elixir School](https://elixirschool.com/it/) - Free tutorial in Italian (Note: The link points to the Italian version, keeping it as is per instructions)
- [Exercism Elixir Track](https://exercism.org/tracks/elixir) - Practical exercises
- [Phoenix Framework](https://www.phoenixframework.org/)

Do you have questions about a specific section? Do you want us to delve deeper into GenServer or Supervisor? Write to me on LinkedIn!

**Happy Coding!** 🚀✨