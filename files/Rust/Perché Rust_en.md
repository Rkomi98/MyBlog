# Rust: The Language of the Moment
In this article, I want to answer the question I've received most often, and I've decided to start an entire series on Rust with this very question:

> Why is Rust so scary?

For this reason, I asked myself a question:

> Why does it seem difficult at first (and why it actually isn't)?

Spoiler: although it's a simple question, it deserves an entire article.
## Introduction

First, what is Rust? I could define it as:

> Rust is a programming language that aims for performance and memory safety without the use of a garbage collector.

Rust is often celebrated as one of the "most loved" languages by developers.

Oh dear, either you know it well and love it, or you fear it and avoid it.

Let's say that, as those who know it well can confirm, it guarantees high performance, memory management safety, and a modern ecosystem. Yet, those who approach Rust coming from other languages often find it **daunting and frustrating** in their first attempts.

I would describe the learning curve of this language as legendary, to say the least: some have called it _steep_ - or even ["vertical"](https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=it's%20vertical), and recount ["screaming at the compiler"](https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=Learning%20Rust%20can%20feel%20like,intellectual%20hazing) during their first experiments.

[Many](https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=The%20borrow%20checker%20will%20make,don%E2%80%99t%20know%20how%20to%20code) even wonder if they are the problem ("**is it me who doesn't know how to code?**") when they see error after error from the Rust compiler.

It's therefore worth asking: Is Rust truly **intrinsically difficult**, or does it simply require adopting a **different mental model**? In this article, we will explore the idea that Rust _seems_ difficult initially not because it's a poorly designed language (quite the opposite, in fact), but because it **challenges habits and assumptions** that developers bring from more permissive languages. We will see what these assumptions are, how Rust systematically breaks them, and how, after the initial "**mental click**," Rust can transform from an apparently hostile enemy into a trusted ally in daily development.

Ultimately, if you feel frustrated with Rust, the message is: **you are not the problem**. It's normal to "fight with the compiler" at first, but with a change in perspective, you'll understand that Rust is not more difficult than other languages; it's just different. And that difference, once understood, **pays off** with more robust code, fewer bugs, and greater confidence in code development.

## Difficulty vs. Complexity: Measuring a Language's "Difficulty"

First of all, I want to clarify one thing thoroughly: what does it truly mean for a programming language to be "difficult"?

Often, the **intrinsic complexity** of a language is confused with the **perceived difficulty** in learning it. We can distinguish various types of complexity/difficulty:

- **Syntactic complexity:** how intricate or verbose the language is in terms of symbols, keywords, and grammatical rules.
- **Conceptual complexity:** how many new or unfamiliar concepts need to be learned (e.g., explicit memory management, concurrency models, advanced type system).
- **"Operational" complexity:** how difficult it is to translate intentions into working code. For example, how much "effort" is needed to obtain a correct and performant program, or for debugging/refactoring.

Rust is often labeled as "difficult" because it excels in some of these dimensions: it has a syntax rich in symbols (, <'a>, &mut, ::, etc.), introduces new concepts like _ownership/borrowing_ and lifetimes, and is inflexible in its operation (if everything isn't perfectly correct, it won't compile). In short, I must say I don't find too many differences with myself!

Jokes aside, this is only a partial view.

### The Learning Curve

It's important to put Rust's learning curve into perspective. Learning a language **doesn't** just mean learning its basic syntax, but also its idioms, the standard library model, and common design practices. I'm not saying this, but Julio Merino in his [blog](https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=Let%E2%80%99s%20first%20start%20by%20stating,not%20months%2C%20of%20frequent%20practice).

Lui sostiene che linguaggi come Python o Go hanno una sintassi essenziale che si impara praticamente "in un giorno", ma **richiedono comunque mesi** per padroneggiare idiomi e librerie in modo produttivo. In questo senso, Rust non è poi così diverso: richiede magari qualche giorno in più per afferrare le basi, ma nel **grande schema del tempo** necessario a diventare competenti, questa differenza iniziale si [ammortizza](https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=learning%20are%20amortized). Insomma, **tutti** i linguaggi richiedono tempo e pratica; Rust ne richiede semplicemente un po' di più all'inizio, "accogliendoti" con più informazioni e vincoli subito, invece di lasciarteli scoprire solo in seguito.

Un errore comune è paragonare Rust a linguaggi cosiddetti "facili" guardando solo la produttività del day 1. Ad esempio, Go o Python ti permettono di scrivere uno script funzionante dopo poche ore, mentre con Rust potresti impantanarti su errori del borrow checker. Ma ciò non significa che dopo tre mesi di utilizzo Go sia "più facile" di Rust. 

In realtà significa solo che quei linguaggi ti [**illudono di essere produttivo subito**](https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=The%20problem%20is%20that%20simpler,can%20be%20deployed%20or%20released), magari a costo di produrre codice non ottimale o non robusto all'inizio. Il primo programmino scritto in fretta in un linguaggio "facile" spesso è lontano dagli standard per la produzione software. Rust, al contrario, ti chiede di pensare di più all'inizio, cosicché **il codice che scrivi una volta compilato tende già ad essere solido**.

### Non è difficile, devi solo pensare diversamente
Un'altra prospettiva utile: _Rust non è difficile in senso assoluto, ma "sposta" la difficoltà su aspetti diversi_. Richiede di ragionare a un livello più vicino al computer rispetto a linguaggi ad alto livello. In altre parole, Rust **ti chiede fin da subito di capire cosa succede sotto**, come con la gestione della memoria, concorrenza, tipi. 

Come sostiene lo stesso Merino, molti programmatori oggi (soprattutto quelli formatisi con linguaggi come Python, Java, C# o JavaScript) non hanno mai dovuto preoccuparsi di come funziona l'allocazione della memoria o cosa succede davvero in un thread, perché vivevano in un mondo con garbage collector, runtime e astrazioni che _nascondono_ questi dettagli. 

Rust cade nel filone più tradizionale dei linguaggi di sistema: niente garbage collector; risorse gestite con regole di scoping (simile a RAII in C++); nessuna scorciatoia per evitare data race se non attraverso regole ferree di aliasing e mutabilità. 

Di conseguenza, _se hai un solido background in C/C++_, Rust non ti sembrerà così alieno. Anzi, uno sviluppatore C o C++ abituato a puntatori e RAII troverà Rust **abbastanza naturale**, probabilmente. Ma uno sviluppatore che ha usato altri linguaggi dovrà imparare concetti che prima ignorava completamente. La buona notizia è che questi concetti (come funziona la memoria, cos'è una race condition, ecc.) [**si possono imparare**](https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=The%20good%20thing%20is%20that,language%20you%20write%20code%20in) e anzi impararli ti renderà un programmatore migliore anche negli altri linguaggi. In altre parole, Rust "ti costringe" a un corso accelerato di fondamentali di informatica che altrove potresti rimandare.

In sintesi, quando diciamo che Rust è difficile, dobbiamo chiederci: è davvero _più complesso_ di altri linguaggi, o sta semplicemente portando alla luce complessità che altrove vengono nascoste? Spesso è vero il secondo caso. Il corollario è che giudicare Rust con le stesse metriche con cui giudichiamo un linguaggio scripting rischia di essere fuorviante. Rust fa un trade-off: **chiede più rigore al programmatore**, ma in cambio offre più aiuto del compilatore e meno sorprese a runtime. Per parafrasare un famoso detto di [Bjarne Stroustrup](https://mmapped.blog/posts/15-when-rust-hurts#:~:text=Bjarne%20Stroustrup), ideatore di C++: _"Ci sono due tipi di linguaggi: quelli di cui la gente si lamenta, e quelli che nessuno usa"_. Il fatto che molti trovino Rust arduo all'inizio non è un "verdetto di condanna", lo considererei più un marchio di crescita e ambizione del linguaggio.

## Assunzioni da dimenticare

Per capire perché Rust spiazza tanti programmatori, dobbiamo esaminare il "**bagaglio mentale**" che portiamo da altri linguaggi. Ogni linguaggio di programmazione crea nei suoi utenti delle aspettative su come le cose _dovrebbero funzionare_. Rust, con le sue regole, **viola intenzionalmente molte di queste aspettative**, costringendoci a ripensare il modo in cui progettiamo il codice. Ecco alcune assunzioni comuni che sviluppatori di Java, Python, JavaScript, C# (ma anche C/C++ in parte) potrebbero avere, e come Rust le smentisce:

### La gestione della memoria non è affar mio

In languages with a _garbage collector_ (Java, C#, Go, JavaScript, etc.), the developer allocates objects freely, and an automatic system frees them in the background when they are no longer needed. In Rust, [there is no GC](https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=Rust%20falls%20in%20the%20more,computer%E2%80%99s%20processor%20and%20memory%20model): memory is managed through _ownership_ and _scope_. This means you must explicitly think about **who owns a piece of data and for how long**, because as soon as it goes out of scope, it is automatically released.

This might be traumatizing for those coming from GC languages. I expect questions like: "Wait, do I have to worry about this string disappearing from the visible ones?"

In reality, Rust does this automatically, but _only_ if the ownership rules are respected; if you try to violate them (for example, by returning a reference to a value that goes out of scope), the compiler will stop you. Therefore, Rust forces you to **consider the lifetime of resources** from the very design of functions, something you weren't used to elsewhere.

### Assigning or Passing Variables Around is Harmless

Those coming from Python/Java think that `x = y` copies a reference and leaves `y` intact, or at least that passing a variable to a function will not **invalidate** it upon return. In Rust, on the contrary, assigning or passing a value **moves** the ownership of that value, unless the type is `Copy`.

For example:

```rust
let s = String::from("hello");
let s2 = s;
```

After these two lines, `s` is no longer usable, because the _String_ has been moved into `s2`, almost as if it were [radioactive waste](https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i_survived-459082669e91#:~:text=radioactive).

In many languages, this concept does not exist (the object would remain shared or there would be a default copy); in Rust, however, as I already mentioned, it is the default behavior. At first, it seems that Rust treats variables "like radioactive waste that you can only touch once," but in reality, it is preventing uncontrolled aliasing and unexpected memory duplications. It's up to you to decide when to explicitly clone data, making it _visible_ in the code, rather than letting the language make copies in a black-box manner. This is a major difference in mindset.

### "I can have multiple references to an object and modify everything freely."

In traditional Object-Oriented (OO) languages, it's normal to have multiple aliases to the same object (e.g., different variables pointing to the same array/dictionary) and modify the object through any of these references. Rust, however, imposes very strict aliasing rules: you either have a single mutable reference, _or_ you can have multiple immutable references, but not both simultaneously. You cannot modify something if someone else is reading a copy of it, and vice versa, under penalty of a compilation error.

This restriction (which initially seems exaggerated) actually eliminates entire categories of bugs (data races, concurrent invalidations, invalid iterators, etc.). But for those coming from environments where "everything is tied to that pointer, and I'll take care of fixing everything together," it's a drastic change.

We can say that Rust doesn't "trust" you and forces you to design clearer patterns for who writes and who reads a certain resource at a given moment.

### "Exceptions handle errors; I don't have to check for them everywhere."

Many languages use _exceptions_ to signal runtime errors: if something goes wrong, an exception is thrown that can propagate up the stack until it is caught. In these languages, the error flow is **implicit**: a function can fail and throw something without explicitly declaring it in its signature (unless mechanisms like Java's `throws` are used, which are often bypassed with runtime exceptions).

Rust, however, adopts a totally different approach: errors are values, represented by

```rust
Result<T, E>
```
 There is no undeclared exception mechanism: if a function can fail, it must return a Result (or "panic", but [_panic_](https://medium.com/rustaceans/rust-errors-arent-exceptions-87ce365d4dff#:~:text=Only%20panic%20when%20necessary) in Rust is reserved for exceptional and unrecoverable conditions).
 
 Many coming from Java/C# initially treat Result as if it were just "a different syntax for exceptions", but this mindset **does not work** and only leads to other problems.
 
 In Rust, you are forced to think of the error as part of the normal program flow (thus _explicitly stating it_ with the type you use for the "return") and to handle it where you might otherwise have ignored a possible exception.
 
 This is one of the most evident points of friction for those coming from languages with exceptions: that feeling of "verbosity" in Rust (checking every result, using `?` or `match` to propagate/handle errors) is not accidental, but a deliberate design to ensure greater reliability.
 
 As an [Italian developer](https://medium.com/rustaceans/rust-errors-arent-exceptions-87ce365d4dff) aptly summarizes:
 
 >_"One of the most common mistakes is bringing the idea to Rust that Result is just a verbose way of doing exceptions. That mental model quickly breaks down, and the friction you feel is not a flaw in Rust; it's a sign that there's something conceptually different underneath"_.
 
 In Rust, **the error is data, not an event**; understanding this completely changes the approach to more robust programming.

### The habit of object-oriented programming.

Those coming from Java, C#, or even Python (which, while not exclusively OO programming, makes extensive use of classes) might approach Rust trying to reproduce classic OO patterns: inheritance, class hierarchies, designs based on mutable objects with internal methods, getters/setters, etc.

Rust is _not_ a strictly OOP language! To be clear, it supports some aspects (you can have methods associated with structs, implement traits which are somewhat like interfaces, etc.), but it lacks classic inheritance and discourages certain patterns typical of Java.

This **heavily influences** how you structure programs and what you need to pay attention to.

For example, let's consider the [Java world](https://users.rust-lang.org/t/rust-is-a-nightmare-to-learn-coming-from-java/37650). In Java, it's common to model _parent-child_ relationships between objects (e.g., an Employee extending Person), whereas in Rust you would probably use composition or enum variants, avoiding sharing complex mutability between structs.

A Java programmer might ask "where is my globally mutable ArrayList? How can I specialize this class?", and Rust's answer will be: you don't have them as you know them, you need to "think differently!".

### "The runtime will handle the details (IO, threads, etc.)."

High-level languages often heavily abstract the underlying system. For example, in Python, you can create threads without worrying about _shared memory_ because the interpreter has the GIL. In Java, you start threads or async tasks trusting the GC and the JVM to manage scheduling and shared memory (barring synchronizations).

Rust, however, exposes many details directly: if you do asynchronous concurrent programming, you need to know what a Future is and that it doesn't start on its own without an _executor_; you need to ensure that data shared between threads implements Send and Sync (the compiler enforces it otherwise) and perhaps explicitly use `Arc<Mutex<T>>` for safe mutual sharing. In short, **you realize you have to "micro-manage" aspects that were implicit elsewhere**.

This can make Rust seem inconvenient for certain things (for example, Rust's _async_ programming is notoriously more verbose and rigid compared to Python/JavaScript, where "just" using async/await is enough).

In reality, once again, Rust forces you to confront complexity, such as concurrency or multithreading, from the outset, whereas elsewhere you might ignore them until bugs emerge that you don't know how to fix.

This list could go on, but the key point is: _many initial frustrations with Rust stem from trying to use the same mental habits in Rust as before_. As a [Java developer](https://users.rust-lang.org/t/rust-is-a-nightmare-to-learn-coming-from-java/37650/4) admitted after initial attempts: the main problem at first was **"trying to write Rust like I would write Java"**, a mistake that led to constant stumbling. Only when they accepted that Rust "is not Java" and requires different thinking, specifically **more careful, more explicit, considering low-level aspects that the JVM concealed**, did they start to make progress. In Rust, you have to unlearn certain shortcuts or expectations. Initially, this is tiring and can make Rust seem to _unnecessarily complicate_ everything. But as we will see, there's a reason for every apparent complication.

Before moving on, it's worth noting a [curious phenomenon](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=Your%20learning%20pace%20doesn%E2%80%99t%20have,your%20attitude%20toward%20the%20language): **sometimes junior developers learn Rust more easily than veterans**. This is because, lacking decades of established habits, newcomers can adapt to Rust's model more quickly, while those with long experience in other languages might have to "fight their instincts" for longer.

As written [in this article](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=I%20have%20seen%20junior%20devs,Leave%20your%20hubris%20at%20home) where the author claims to have seen:
> juniors with no prior experience excel in Rust, while seasoned senior developers struggle or even give up, due to the difficulty in questioning their mental patterns.

In Rust, those who know how to _learn to learn_ win, those who accept returning to being a beginner and "leaving their ego at home." So if you find Rust difficult and have been programming for years, know that it's normal: you are reforging your way of thinking, and a few years of experience elsewhere might prove less useful than expected until you realign your mindset.

## Explicitness as a Design Choice

Many of Rust's differences can be summarized in one principle: **explicit is better than implicit**
> Sound familiar? It's one of Python's design principles, but Rust takes it to an even higher level

The authors of Rust made precise choices _not_ to automatically do certain things that other languages do behind the scenes, forcing the programmer to formally declare their intentions in the code. This can initially give the impression of excessive verbosity, but it is designed to prevent surprises and increase code clarity and safety.

We have already seen examples of explicitness: mutability must be declared with `mut`, otherwise everything is immutable; type conversions do not happen implicitly (Rust will not convert a `u32` to `usize` or a `String` to `&str` without you explicitly saying so); error handling is in the function signature; mutable sharing between threads requires explicit constructs (`Arc`/`Mutex`).

To these, we can add: no _implicit type coercion_ (every cast must be explicit, to avoid unexpected data loss), no magical default initializations (you must initialize variables before use; the concept of a default uninitialized value that becomes a bug if forgotten does not exist), and so on. Even advanced features like _trait objects_ in Rust require explicit syntax (`Box<dyn Trait>`) instead of automatically performing _boxing_ or _virtual dispatch_ without you noticing.

Why all this emphasis on explicitness? **Because it eliminates ambiguity and empowers the programmer**. When you read Rust code, you clearly see what's happening: which variables can change and which cannot, where an error might occur, who owns a certain piece of data, and for how long. In more permissive languages, you often have to _infer_ these aspects (and sometimes you infer them incorrectly, causing bugs). Rust forces you to write them down explicitly. This certainly means more characters to type and more concepts to handle, but it produces code that, once compiled, **is very reliable**.

To draw a [comparison](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=If%20you%20come%20from%20a,scale%20applications) with a language that everyone (or almost everyone) knows: Python is notoriously concise and "elegant," while Rust can seem verbose or "ugly." It's true that a Rust program has more annotations (generic types `<T>`, lifetimes `<'a>`, etc.) compared to a Python equivalent. But that verbosity serves a purpose.

As an expert explains, **Rust's verbosity has concrete benefits in large-scale development**.
1. **Readability**: you will spend more time _reading_ code (yours or others') than writing it, and having types and mutability visible in the code gives you more local context to reason about what a function is doing.
2. [**Second**](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=dismiss%20the%20language%20right%20away): it facilitates _refactoring_: if you want to modify the structure of a Rust program, the compiler will guide you by highlighting every point where you need to make changes (because if you forget to update a usage, it simply won't compile).

In dynamic languages or those with fewer controls, you can rename a function or change the type of an argument, breaking ten calls in other parts of the code and not realizing it until runtime (or never, if that part of the code is not well covered by tests). In Rust, however, **the compiler is your safety net** during refactoring: as long as everything doesn't compile again, you know you've fixed every necessary point. This encourages continuous code improvement without fear of introducing regressions.

One aspect where Rust's explicitness is evident is memory and resource management. We mentioned that Rust does not perform periodic automatic cleanup like a GC; instead, it uses the ownership system to free resources as soon as they go out of scope. Here too, Rust prioritizes predictability: memory is freed in a **deterministic** way and visible from the context (you know that at the end of that block, that object is released). This avoids an entire class of problems like non-deterministic GC stop times, but it implies that you must think about data lifetimes. In practice, Rust only asks you to specify lifetimes when it cannot figure them out on its own: this is another example of the balance between implicit and explicit.

Often the compiler can infer lifetimes, but if there's ambiguity, it will give you an error asking you to specify them. The error message typically says something like _"this function needs an explicit lifetime parameter"_ and might even show you how to add it. At that moment, it is **teaching** something: if you think about it, why can't the compiler infer that lifetime? Perhaps the relationship between the returned references is not obvious, and by specifying
```rust
fn foo<'a>(x: &'a str) -> &'a str
```
you are making it clear to yourself and others that the output lives as long as the input lives. This is an example of how Rust makes you explicit not out of sadism, but to make **dependencies crystal clear** and prevent undesirable behavior.

As [Matthias Endler](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=So%20you%20don%E2%80%99t%20have%20to,couldn%E2%80%99t%20figure%20it%20out%20itself) suggests, it's useful _"not just to follow the compiler's instructions, but to ask_ why _it needs that information"_: often you'll find you're learning something about the design of your functions.

Ownership, mutability, lifetimes, explicit error handling—all these design choices reflect a philosophy: **the language prefers you to declare things, rather than it guessing them for you**.

A further advantage of this approach is that it **"trains you for precision"**. In other languages, you can afford to be "approximate" or negligent about certain things (e.g., using an uninitialized variable, forgetting to close a file, not considering an error case) and the program still runs, only to perhaps fail in unexpected ways at runtime. Not in Rust. Let's say _"you can be careless in other languages, but not in Rust"_.
> You must be accurate, "the way you do one thing is the way you do all things," says an [ancient Rust proverb](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=%20An%20ancient%20Rust%20proverb)

Rust forces you to be accurate during writing, or the code simply won't compile. This might seem like a drag on productivity ("darn it, I have to pay attention to every detail!"), but the idea is that all the care you put in beforehand to satisfy the compiler **saves you time later** in debugging and bug hunting.

It's as if Rust is asking you: would you rather spend two hours now figuring out why the borrow checker won't let you do this, or two days a month from now debugging a segfault/unspecified crash in production? Would you rather add an error case now, or receive a call at 3 AM because an unhandled exception brought down the service? Rust makes you **pay technical debt upfront**, forcing you to write more complete and correct code from the start.

An concrete example of Rust's "ceremony cost" that is also a benefit in disguise: in many languages, you can reuse the same variable multiple times without thinking; in Rust, if you want to reuse a value after passing it, you might need to make an explicit copy with `.clone()`. This initially seems tedious – "why do I have to write `.clone()`? Couldn't it just make a copy when needed?". But Rust, in reality, is asking you: _are you sure you want to make a copy? do you know this has a performance cost?_ In short, it forces you to consider it.

In summary, Rust's explicitness is a conscious design choice that reflects its strict but fair "personality." It might make Rust appear more complex on paper (more keywords, more annotations, more rules to follow), but each of these apparent burdens is there for a purpose. And most importantly, once internalized, **they stop being burdens**. An idiomatic Rust program, to a trained eye, appears as clear and clean as (if not more than) a Python program, it just requires _training_ that eye. To get there, however, one must first overcome a phase where it feels like drowning in details: and this is where the compiler's role as a guide/support comes into play (call it what you will).

## The Rust compiler: from enemy to ally

Many developers, in their early days with Rust, experience a love-hate relationship with the **compiler**. More hate than love, to be honest. Rust's error messages are famous for their length and meticulousness in describing what's wrong. A novice sees them appear by the dozens and may get the impression that the compiler is **hostile**, almost _punitive_. It's no coincidence that people talk about "_fighting the compiler_" – or specifically ["_fighting the borrow checker_"](https://practice.course.rs/fight-compiler/intro.html).

Those coming from permissive languages, where the compiler (if present) complains little and lets the program run until something explodes during _runtime_, find it shocking to encounter a compiler that seems to want to prevent even the most trivial things from being written.

Every time I think about this, I think of a cartoon that personifies the Rust compiler as a strict teacher who scolds the student for every minor mistake, versus the teacher of other languages who lets even nonsense slide, only for the student to make a fool of themselves in the exam (the runtime).

![Cartoon about the Rust compiler](../Assets/RustVsTutti.png)

_Figure 01: Cartoon where Rust, in the guise of a strict professor, “scolds” while other compilers let things slide. The consequences are seen shortly after._

Initially, **it's normal to perceive the compiler as an enemy**. "I write a function that would work in any other language, and Rust spits out three paragraphs of angry diagnostics" [a developer recounts](https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=just%20when%20you%20think%20you%E2%80%99ve%20fixed%20it,%20it%20gives%20you%20a%20different%20error), "and when I think I've fixed it, it throws a different error." Frustration mounts, one feels incompetent.

This feeling of being constantly reprimanded leads many to **shout at the compiler** or describe it in unflattering ways. If you feel this way, know that you're in good company: almost all Rust programmers have gone through it initially (anyone who says otherwise is probably lying).

The turning point, however, comes when you understand that wall of errors is actually **an instruction panel**. The Rust compiler, as strict as it is, is also extraordinarily _didactic_. Its messages don't just say "this is wrong"; they often explain [**why** it's wrong and suggest how to fix it](https://ferrous-systems.com/blog/the-compiler-is-your-friend/#:~:text=The%20compiler%20gives%20us%20an,the%20affected%20variable%20is%20underlined). For example, you might see: _"cannot borrow foo as mutable because it is not declared as mutable… help: consider changing this to mut foo"_. Or: _"use of moved value x… value moved here… help: consider cloning the value"_. In short, the compiler practically **debugs with you**. Initially, you might not notice, overwhelmed by the terminology, but gradually you start reading those messages more calmly and realize they contain the key to progress. A crucial piece of advice is precisely this: _read them carefully, almost as if they were documentation_.

Many Rust veterans testify that at some point their relationship with the compiler made a U-turn. **The more you learn to trust it, the more it will return that trust.**

You go from seeing the compiler as a guardian blocking the door, to seeing it as a **safety net** beneath the trapeze artist: it prevents you from falling by pointing out errors before they become real problems.

It's worth emphasizing _how much_ the Rust compiler is actually different from others. It's not marketing: Rust's messages are notoriously more descriptive and helpful than those of, for example, C++ or Java. This is the result of a conscious effort by the Rust community from its very beginning - some jokingly say that Rust has _"the UX team applied to error messages"_. In fact, over the years, messages have improved to the point where they often directly suggest the correction. There are [blogs](https://news.ycombinator.com/item?id=44005195#:~:text=Evolution%20of%20Rust%20Compiler%20Errors,explanation%20of%20why%20it%27s%20wrong) that show the evolution of Rust errors: from cryptic phrases to almost prose-like explanations. The goal is to make the compiler an **educational tool** and not just a judge.

The compiler is like a compass: if you're "fighting" against it too much, it's probably indicating that there's a cleaner path.

Further help comes from satellite tools like **Clippy**, Rust's linter. It is [highly recommended](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=Turn%20on%20all%20clippy%20lints,step%20once%20your%20program%20compiles) to enable all Clippy _lints_ from day one. Clippy will give you advice on how to improve your code even beyond strictly necessary errors: for example, it warns you about possible suboptimal uses, non-idiomatic code, etc. It's like having a robotic reviewer always available.

Connecting the dots: _compiler + Clippy + detailed error messages_ transform what could have been a difficult and solitary learning experience into something much more guided. Of course, it remains **challenging** (Rust gives you nothing for free) but you're not alone: it's like having a team of virtual mentors always with you (and let's add the community on forums/Discord/Stack Overflow, which in Rust is notoriously welcoming[\[48\]](https://users.rust-lang.org/t/isnt-rust-too-difficult-to-be-widely-adopted/6173#:~:text=Isn%27t%20rust%20too%20difficult%20to,the%20rough%20spots%20and%20surprises)).

In conclusion, the Rust compiler may seem like an obstacle at first, but over time it becomes _your best friend_. This shift in perspective, from "I hate it" to "I trust it," is perhaps the clearest sign that you are internalizing Rust's mental model. When you stop seeing it as a hindrance and start using it as an **active tool to improve your code**, you've passed a point of no return: you're thinking "in Rust." And as we'll see, at that point many of the perceived difficulties vanish, giving way to the real benefits.

## Real Difficulties vs. Initial Friction

There are aspects of Rust that **are genuinely complex**, and others that _seem_ difficult only until the right mental approach is adopted. It's important to distinguish between the two. Often beginners put everything on the same level ("Rust is just difficult"), but by taking a step back, one can ask: which Rust concepts remain complicated even after understanding them, and which instead become **non-issues** once you've "befriended" the language?

_Real_, or intrinsic, difficulties of Rust certainly include some of its advanced features that we will briefly look at in the next sections
### Complex Lifetimes
Rust's lifetime system is generally understandable in simple cases, but in more advanced scenarios (self-referential data types, graphs of mutually dependent objects, etc.) it can become very intricate. Even many experienced "Rustaceans" (we'll define Rust programmers this way from now on) sometimes struggle with particularly convoluted lifetimes.

Fortunately, these cases do not occur frequently in daily development _if you design things well_: often alternative designs exist to avoid overly complicated lifetime groups. But it must be acknowledged that _yes, lifetimes are a difficult concept_ to fully master, although, it must be said, **in common cases the compiler infers them and you don't think about them too much**.

The bulk of the friction with lifetimes is in the initial learning phase (understanding what `'a` and its companions are); afterwards, they rarely appear explicitly except in highly sophisticated code.

### Real Difficulties
#### The concurrency/async model:

Rust offers _fearless concurrency_ at compile-time, but this means that concepts like _thread safety_ and _static lifetime of futures_ must be understood for concurrent programming. The use of async/await in Rust, combined with Future, Pin, and the Send requirements for passing tasks to a threadpool, represents a significant increase in complexity compared to asynchronous models in other languages.

[Someone](https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i_survived-459082669e91#:~:text=Try%20async%20programming.) called it _"a trapdoor under your feet"_ for those who, after painstakingly learning ownership and traits, try their hand at async. Suddenly, errors related to Send + 'static and similar concepts appear, requiring further explanation. This is certainly an area where Rust **is complex**, not so much due to poor design, but because it imposes constraints that other languages delegate to the runtime or ignore.

The good news is that in many cases, libraries can be used to simplify the picture somewhat, but it remains an advanced area.

#### Advanced Generics and Trait Objects

Using basic generics (parametric functions or structs) is easy, but Rust allows for a lot of power with its system of traits and generic types. To draw a parallel with Spiderman, just as great power comes with great responsibility, in this case, great complexity arises from this power. For example, understanding how to return values processed by functions (using `impl Trait` or trait objects with `Box<dyn Trait>`) is not immediate for newcomers, who encounter [errors](https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i_survived-459082669e91#:~:text=And%20Rust%20says%3A) like _"the size for values of type T cannot be known at compile time"_. This forces one to learn concepts like **monomorphization vs. dynamic dispatch**, which, again, are hidden elsewhere.

It remains true that _Rust's type system is rich_, and in its more sophisticated corners, it can be arduous.

#### Metaprogramming and Macros

Rust has a powerful compile-time macro system (macro by example, procedural, etc.). Writing advanced macros can be difficult (though the average user might almost never need to). Even understanding macro-generated code is sometimes tricky, because the compile-time error occurs in the expanded code, not directly in the macro. However, this difficulty is reserved for those who want to delve into metaprogramming.
### Unsafe and Low-Level Code
If you are writing unsafe code, you are disabling the compiler's "guardrails" and taking on enormous responsibilities (such as manually managing memory safety). This _is_ difficult and will remain so, but it is deliberately confined to parts of the code that interact with the system or involve aggressive optimizations. Most Rust code never touches unsafe directly, especially when starting out.

These are the _objective_ complexities of Rust. However, it's important to note that **most programmers do not need to master these aspects immediately to be productive**. Rust can be used effectively even by staying within the "safe" subset and using relatively simple patterns. One of the frequently given pieces of advice is to _avoid delving into the most abstruse parts immediately_: for example, [avoid async Rust in week 1](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=Avoid%20async%20Rust%20in%20week%201), don't start by writing generic macros or complicated type hacks.

Learn gradually: many advanced concepts will only be introduced when truly needed. As [Julio Merino](https://jmmv.dev/2018/06/rust-review-learning-curve.html#:~:text=Let%E2%80%99s%20conclude%20by%20saying%20that) observes, there are advanced concepts in Rust that require patience, but **are not frequently necessary**; it's enough to know they exist and where to find information when you need it. In short, _you can achieve a lot with Rust without venturing into the darkest corners of the language_.

### Initial Friction
On the other hand, let's now look at difficulties that are more like **initial friction**, destined to disappear with time and practice:
#### Ownership and Borrowing in Common Cases

Initially, the idea that a variable "moves" or that an "&" is needed to pass a reference drives you crazy. But after a few months, it literally becomes _part of your way of thinking_. Don't believe it? Ask anyone who uses Rust daily: many report that they now reason in terms of ownership even when writing pseudocode in a document. The concept of who owns what and temporary borrowing becomes natural, and in fact, when they return to writing in languages without these rules, they feel almost "too free" and a little worried ("uh-oh, here I can modify this object from two different places, let's hope for the best..."). So, what initially seems like **the** insurmountable mountain (the infamous borrow checker) is actually not a long-term problem. A [user on Hacker News](https://news.ycombinator.com/item?id=19399532) wrote:
>_"Personally, I had the same experience as you did, except the borrow checker also helped me unlearn a few bad habits and gave me a deeper understanding of references. Now it is second nature, and I rarely every fight the borrow checker. I think part of it is planning ahead."_.

This testifies that yes, it's tough at first, but once your mind gets used to it, you no longer think about it, and you only reap the benefits (no more segfaults, data races, etc.).

#### Code verbosity

Writing `Some(x)` instead of being able to use `null`, calling `.clone()`, doing `match result { Ok(v) => ..., Err(e) => ... }` instead of throwing exceptions. All these things that you initially perceive as annoying, lose weight over time. You become skilled at using idiomatic shortcuts (`?` to propagate errors, methods like `.map_err()` etc.) and above all, **you understand the why** behind each one. For example, accepting to "**use `clone` when needed without shame**" is almost a rite of passage: newcomers do everything to avoid copies because they think it's "illegal" in Rust, then comes the moment when they realize that explicitly calling `clone` is okay if needed, and you don't feel judged by the compiler for it.

At that point, you stop counting how many times you have to clone and more simply reason about performance in a more holistic way. The same concept applies to using types like `String` vs `&str`: initially you make mistakes, passing `String` when `&str` would be needed and vice versa, and you get angry because "Rust wants a `String`." Then little by little you learn when one and the other are needed. In other words: **the friction of new things passes with experience**. A useful tip from the field is: at first, don't be afraid to write unidiomatic code as long as it works. [For example](https://corrode.dev/blog/flattening-rusts-learning-curve/#:~:text=Don%E2%80%99t%20make%20it%20too%20hard,Here%20are%20some%20tips), feel free to copy with `.clone()` everywhere, use concrete types instead of `generics` if it simplifies things for you, avoid complicating things with too many `trait`s, you can refactor later when you know more. It's better to _first_ reach a point where the code works, even if verbose, _then_ refine the style as you understand the best idioms.

#### Strange syntax and symbols
Remembering to put `&` before a variable to pass it as a reference, understanding that sequence of `-> Result<(), E>` in a function signature, deciphering errors with lifetime `&'a T`: all things that initially seem like hieroglyphs, but by dint of seeing them, they become familiar. It almost becomes a kind of muscle memory: you write `&mut self` in methods without thinking, you use `::<>` for turbofish when needed, you read `Box<dyn Trait>` as if it were nothing.

So syntactic verbosity is only a temporary difficulty. After the acclimatization period, you no longer notice the additional symbols, while appreciating what they express.

#### The "Rust-style" design

This is the mother of all differences. As long as you try to force Rust to do things "the way you would do them in language X," Rust will resist (compiler, design, libraries). When you start to _think in Rust_, you find that everything flows much more smoothly.

A forum participant ([kornel](https://users.rust-lang.org/t/rust-is-a-nightmare-to-learn-coming-from-java/37650#:~:text=NullPointerException)) describes it well:
>_"at first it's really difficult, but once you know how to think in Rust, the language becomes productive and pleasant. All those annotations (\*, &'a, Box etc.) have a precise meaning, and allow you to write very fast, multi-threaded programs without fear of NullPointerException"_.

It's literally a paradigm shift: you stop fighting the language and start _working with it_. Many call this moment the **"mental click"**.

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
In summary: Rust has a solid but limited conceptual _core_ (ownership/borrowing, basic lifetimes, traits) that absolutely must be assimilated, and that is the initial hurdle. Beyond this core, it has an ecosystem of advanced features that _can_ be difficult, but are not mandatory for common initial use cases. Once that first steep step is climbed, **the perceived difficulties almost totally disappear**: using Rust becomes smooth and no more strenuous than the average of other languages. Intrinsic complexities remain, but you only encounter those when truly necessary, perhaps after having already accumulated experience and thus with the appropriate mental tools to manage them.

An excellent piece of advice found on Reddit states: _"Rust is hard at first because it imposes new constraints on you, constraints that actually existed before but were not checked"_. Here's the point: Rust materializes obstacles that in other languages remain invisible until you stumble upon them (think memory management, concurrency, errors). So yes, **it's harder at first**, because _you are explicitly overcoming obstacles that were implicit elsewhere_. But once past the beginning, it's not that Rust "continues to get harder and harder"; on the contrary, often those who learn Rust notice that after a while they can concentrate on the application's logic _more freely_ than before, because many concerns (null, race conditions, memory leaks) have been addressed by the language.

## Why Rust?

Now we come to the fateful question: why start using Rust?

To do this, I'd like to show the **medium-to-long-term benefits** of this language. Benefits you might have already heard about in theory, but here I want to analyze them thoroughly, also from the perspective of those who have _experienced_ them firsthand:

### "If it compiles, it probably works."

This phrase is almost a mantra in Rust. Obviously, it's not an absolute truth (you can always have logical bugs), but those coming from languages like C++ or Java are often surprised by the confidence Rust offers: when you finally manage to compile a complex program, there's a high probability it will run correctly on the first try. You will almost never see unexpected crashes, _segmentation faults_, _null pointer exceptions_, or multithreaded data races when executing _safe_ Rust programs. This gives you a peace of mind that revolutionizes your development approach. You can make even deep changes to the code and trust that if something goes wrong, the compiler will tell you immediately. A user ([lwojtow](https://users.rust-lang.org/t/rust-is-a-nightmare-to-learn-coming-from-java/37650)) recounted: "once my Rust code compiled, it was of immensely higher quality than the Java code I had been writing for years." It sounds exaggerated, but that user emphasizes how the Rust programs they write now positively surprise them compared to similar Java programs written in the past, precisely because of the absence of certain defects.

### Fewer bugs and less debugging

I think this is a direct consequence of the previous point: many categories of bugs simply _no longer happen_. Use-after-free? Impossible in safe Rust. Concurrency with race conditions? The compiler won't let you share mutable data without adequate protection. Null dereference? Rust doesn't have null (except in unsafe code); you use Option, and therefore you _must_ handle the absence of a value. Arithmetic overflow? Rust, in debug mode, detects them at runtime (in release mode, it handles them with wrapping, but you can activate checks if you want). And so on. 

Even logical errors (like forgetting to handle an error case) become less frequent because Rust pushes you to consider all of them. The practical result is that once the initial effort is overcome, **you will spend less time hunting bugs**. This is confirmed by many developers: Rust drastically reduces the time spent on troubleshooting compared to C/C++, for example, because if the program compiles, you already have the certainty that many possible problems are absent. Of course, there can still be application bugs (a wrong calculation, an unhandled condition that is "logically" valid for the compiler), but those can be covered with tests. Meanwhile, you haven't had to worry about the usual memory or concurrency issues that plague other ecosystems.

### Easier Refactoring and Maintenance

We've said that Rust forces you to fix everything before it compiles. What is initially an annoyance ("nothing compiles until everything is right!") eventually becomes a kind of superpower. 

You realize you can _dare_ to undertake very large refactorings – such as changing module structures, modifying return types of public functions, reorganizing ownership between components – with the infallible help of the compiler.

In other environments, refactoring can be risky: you might forget to update a point and introduce a bug that you might only discover in production. In Rust, as long as the code compiles, you have high confidence that you have correctly applied every necessary change.

In languages where refactoring is costly or risky, people often prefer to keep suboptimal code to avoid breaking anything. With Rust, it's easier to maintain a healthy codebase and adapt it to new requirements.

### Predictable Performance and Fewer "Black Magic"

Rust, being free of a heavy runtime, gives you performance close to C/C++, but above all, **predictable** performance. No garbage collector starting in the middle of a critical transaction causing a glitch; no VM optimizing code in inscrutable ways (ok, there's LLVM behind the scenes, but in general, you have more control over allocations and behavior). This means that investing in Rust pays off especially in scenarios where performance and control are crucial (systems, embedded, high-intensity server applications, etc.).

Many adopt Rust precisely for this reason: after the initial curve, you have a tool that allows you to build software with system performance **without having to descend to unsafe C level**. And with the added confidence that if your Rust program compiles without _unsafe_, you can practically _forget_ about all the manual memory problems that make C/C++ development a nightmare. It's a level of **trust** rarely achievable elsewhere. It's no coincidence that the Rust team's motto is _"fearless"_: _fearless concurrency, fearless refactoring, fearless future_. It means being able to tackle difficult problems (like concurrency) without the fear of introducing invisible bugs, because you know the compiler _has your back_.

### Growth as a Programmer

[Many](https://medium.com/@techInFocus/rusts-learning-curve-is-brutal-here-s-how-i-survived-459082669e91#:~:text=Rust%20made%20me%20a%20better,way%20I%20never%20had%20before) report that learning Rust has made them better programmers even when they return to other languages.

Okay, but why?

Because Rust forces you to think about aspects you previously ignored. After using Rust, when allocating objects in a tight loop in Java, you might start questioning the garbage collector, something you previously did distractedly. Or you pay more attention to avoiding global mutable states in Python because you've seen the benefits of default immutability. In short, Rust **trains good habits** that are transferable.

Also, in the Medium article I mentioned earlier, a developer wrote:
> _"Rust forced me to think about ownership, lifetimes, and correctness in a way I never had before, and that has made me a better programmer in every language"_

It's a great compliment to the language: not only was it not impossible to learn, but that effort even elevated his overall skill level.

All of this leads to the final answer: _because Rust isn't really difficult_. The difficulty we perceive is the initial toll to enter a new way of programming. Once that toll is paid, the road smooths out and **the journey proceeds swiftly**. At that point, Rust is no more difficult than any other language.
In fact, in some ways it becomes easier, because you have tools that constantly monitor and help you.

The nice thing is that there's an entire community of people ready to confirm this and help you along the way.

## Conclusion
To conclude with a metaphor, using Rust is a bit like **intensive training**. At first, it feels like you're undergoing a "Full Metal Jacket" treatment; it yells at you, makes you remake your bed 10 times, and you don't understand why all this discipline. But by the end of the championship, you are tempered, strong, and prepared for situations that others wouldn't withstand.

![Meme Rust Full Metal Jacket](../Assets/RustFMJ.png)

_Meme: Rust in "Full Metal Jacket" version._

Rust ultimately **"trusts you because it has trained you to earn it"**:

We all have had that moment of discouragement, but by persevering, you overcome it. The game is worth the candle: Rust will reward you with a fulfilling programming experience, where you will once again enjoy writing code, knowing that what you write is robust and "correct by construction."

Ultimately, Rust _seems_ difficult at first because it asks you to change your mindset, but **it is not in an absolute sense**. It's different, it's rigorous, but it's not witchcraft. Like anything new and valuable, it requires effort to master. And once mastered, you might discover that you've found not only an efficient language but also a _mentor_ who has taught you to program more consciously. So, arm yourself with patience, embrace the paradigm shift, and keep trying: _keep going. It gets better_.

## Sources
Rust Forum, Medium, technical blogs, and official documentation cited in the text:
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