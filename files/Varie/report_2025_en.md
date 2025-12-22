# AI Report 2025: What Really Changed

## Abstract

In 2025, GenAI stopped being just ChatGPT and only used to answer "simple" questions; instead, it enabled many other things: from research across hundreds of sources using "agentic" browsers, IDEs working alongside developers, and open/local models becoming truly competitive. This article reconstructs the key releases month by month, compares the main players, and concludes with practical lessons and the most probable trends for 2026.

This report tells the story of 2025 **in a very practical way** from the perspective of someone who, until a year ago, was a student, and now focuses on bringing GenAI and its applications into companies: what was released, what truly changed habits, and which companies "brought home" concrete results.

---

## Timeline 2025 (complete and explained)

A mini-legend that will be trivial for some, but not for others, I think is necessary. Therefore, here it is:
- **"Pro / top" models**: you call them when you need to solve very complex tasks (long reasoning, difficult decisions, delicate code).
- **"Flash / fast" models**: you call them when you need to *perform simple tasks* (summaries, classifications with examples, triage, customer care, small repeated automations).
- **"Open / local" models**: you choose them when **control, costs, privacy** matter, and you want to run them on dedicated servers or even on your own computer.
- **Agents (research, IDE, browser with pilot, app creators)**: agentic AI has truly changed people's habits: by talking to the chatbot, it delegates to the most suitable tools based on needs. This opens up a myriad of possible scenarios and applications in everyday life.

---

### January 2025
January showed that you don't need huge budgets to create good models:

- **Codestral 25.01 (Mistral, coding)**
  - When: **January 13, 2025**
  - In brief: Mistral model specialized in **code generation and completion**, designed for IDEs, refactoring, and development assistance.
  - Source: **[F05]**

- **DeepSeek‑R1 (reasoning, open)**
  - When: **January 20, 2025**
  - What it is: open model oriented towards **structured reasoning** (logical steps, chains of thought) and complex tasks, with a focus on accessibility and costs.
  - Why is it important? Reasoning is no longer exclusive to OpenAI; it also becomes accessible to teams that cannot spend like the big players.
  - Source: **[F03]**

- **Stargate Project (OpenAI + SoftBank + Oracle + MGX, infrastructure)**
  - When: **January 21, 2025**
  - In brief: a major AI infrastructure project with joint partnerships and investments to **build/guarantee computing capacity** (data centers, energy, cloud) and make it available for large-scale model training and use.
  - Why it matters: it shifts attention to the **compute supply chain** (data centers, energy, cooling, chips) and long-term industrial agreements. In practice, competitive advantage is also about who can guarantee **stable and scalable capacity** for months/years, not just who trains the strongest model.
  - Source: **[F01]** (support: [F02])

- **Operator (OpenAI)**:
  - When: **January 23**
  - What it is: an assistant that doesn't just answer, but uses a browser (clicks, scrolls, forms) to perform actions for you. It's the beginning of the "autopilot" on the web, later integrated into ChatGPT's agent mode in July.

- **Humanity’s Last Exam (benchmark, “nasty questions”)**
  - When: **January 24, 2025** (paper publication)
  - What it is: an evaluation benchmark with **very difficult questions** to measure reasoning, robustness, and generalization.
  - In brief: it moves the bar from "how well it writes" to "does it truly solve complex tasks."
  - Source: **[F04]**

---

### February 2025
In February, the tool that most revolutionized my life was born: Deep Research.

Deep Research accelerated and improved the quality of research. Studying today is a pleasure for those who, like me, are super curious and always want to have multiple sources under control simultaneously.

- **Deep Research (OpenAI, guided research up to the report)**
  - When: **February 3, 2025**
  - What it is: a workflow/feature for **assisted research** that produces structured reports with sources and citations.
  - In brief: the habit "I want to know more about a topic" is born: this starts a pipeline consisting of plan → source collection → synthesis with citations → conclusions.
  - Source: **[F06]**

- **Le Chat (Mistral, consumer/enterprise product)**
  - When: **February 6, 2025** (public announcement/launch reported by the press)
  - What it is: Mistral chat product with **apps and interface** designed for consumer and business use. Mistral attempts to compete on user experience (speed, low latency) with an entirely European positioning.
  - Source: **[F07]**

- **GPT‑4.5 (OpenAI, more resilience and reliability)**
  - When: **February 27, 2025**
  - What it is: Update to OpenAI's flagship model with **improved reliability** on long tasks. One of the most economical and widely used models for writing is born.
  - Source: **[F08]**

- **“Vibe coding” enters the vocabulary**
  - When: **February 2, 2025** (the term explodes after a post/tweet by Andrej Karpathy)
  - What it is: A way of developing where **AI writes most of the code** and the human guides iterations, testing, and quality.
  - In brief: Many people start working this way: *I don't write every line, but I guide an AI system and with each iteration I ask it to change a few things until the app stands up*.
  - Source: **[F09]**

---

### March 2025 — Google clarifies its strategy: power, speed, control

- **Gemini 2.5 Pro (Google, preview)**
  - When: **March 25, 2025**
  - What it is: Google's high-end model (preview) for **deep reasoning** and complex tasks.
  - In brief: “deep choice” for long reasoning, technical analysis, complex code.
  - Source: **[F10]**

- **Gemma 3 (Google, open)**
  - When: **March 10, 2025**
  - What it is: Google's **open** family of models, designed for local and custom deployments.
  - In brief: Open is no longer a hobby: it becomes a real option for creating internal assistants and automations close to data.
  - Source: **[F11]**

---

### April 2025 — Multimodal matures and open raises the stakes

- **Llama 4 (Meta, open: Scout/Maverick)**
  - When: **April 5, 2025**
  - What it is: New generation of Meta's open models (Scout/Maverick) with **long contexts** and local use.
  - In brief: Pushes hard on long contexts and "in-house" models, useful for documents and code.
  - Source: **[F13]**

- **Pixtral Large 25.02 (Mistral, vision + text)**
  - When: **April 8, 2025** (release on AWS Marketplace)
  - What it is: Mistral's **multimodal** model (text + images) for visual analysis and documents. This is another signal of the European approach: multimodal, but designed for practical use cases.
  - Source: **[F14]**

- **o3 and o4‑mini (OpenAI, “work-ready” reasoning)**
  - When: **April 16, 2025**
  - What it is: A pair of OpenAI models focused on **operational reasoning**, with power/cost variants. These models are primarily used for debugging, code review, and document analysis.
  - Source: **[F12]**

- **Qwen3 (Alibaba, hybrid reasoning)**
  - When: **April 29, 2025**
  - What it is: New family of Alibaba models with **hybrid reasoning** and local cloud distribution.
  - In brief: Strengthens a highly competitive Asia-first ecosystem, especially in local cloud.
  - Source: **[F15]**

- **Lovable 2.0 (app creator, no‑code/low‑code)**
  - When: **April 24, 2025**
  - What it is: Platform for **creating apps without code**, with AI assistance and guided workflows.
  - In brief: Makes it "normal" to build prototypes and internal micro-tools without being expert developers.
  - Source: **[F29]**

---

### May 2025 — AI enters mass-market products

- **AI Mode in Google Search (“assistant-style” search)**
  - When: **May 20, 2025**
  - What it is: New Search experience with **synthetic and conversational answers** instead of a list of links.
  - In brief: For many, search stops being a list of results and becomes a dialogue with synthesis.
  - Source: **[F16]**

- **Veo 3 (Google/DeepMind, video with audio)**
  - When: **May 20, 2025** (launch press coverage)
  - What it is: Generative model for **video with synchronized audio**, designed for rapid production.
  - In brief: Huge impact on training, marketing, internal demos, and education.
  - Source: **[F17]**

- **Claude 4 (Anthropic: Opus/Sonnet)**
  - When: **May 22, 2025**
  - What it is: New family of Anthropic models (Opus/Sonnet) with a **focus on reasoning and coding**.
  - In brief: The idea of a "digital colleague" that handles long tasks, especially coding, grows.
  - Source: **[F18]**

- **Perplexity Labs (“project mode”)**
  - When: **May 29, 2025**
  - What it is: Mode that transforms requests into **projects with outputs** (reports, plans, files). It becomes simple to create interactive dashboards from web data.
  - In brief: Simplifies the transition from "asking questions" to "commissioning results" (reports, plans, files).
  - Source: **[F19]**

- **Gemma 3n (Google, on‑device)**
  - When: **May 20, 2025**
  - What it is: **lightweight on‑device** version of Gemma models to run on local hardware.
  - In brief: brings the idea of on-device AI systems.
  - Source: **[F20]**

---

### June 2025 — Europe stakes a claim on reasoning

- **Magistral (Mistral, reasoning)**
  - When: **June 10, 2025**
  - What it is: Mistral model focused on **step-by-step reasoning**, targeting enterprise.
  - In brief: Mistral enters the field of models that reason step-by-step, with a very "product-oriented" tone and attention to the European context.
  - Source: **[F21]**

---

### July 2025 — The pilot browser becomes concrete

- **Comet (Perplexity, pilot browser: staggered public beta)**
  - When: **July 9, 2025**
  - What it is: browser with **integrated agent** for web search and actions, in progressive beta.
  - In brief: "the office in the browser" becomes a reality: search, web actions, small workflows.
  - Source: **[F22]**

- **ChatGPT agent / “agent mode”**
  - When: July 17:
  - What it is: a mode appears within ChatGPT that combines search and action. It doesn't just summarize: it navigates and uses a "virtual" computer, executes steps in sequence, and can produce an editable result (e.g., slides, spreadsheets, reports).

---

### August 2025 — The generational leap

- **GPT‑5 (OpenAI)**
  - When: **August 7, 2025**
  - What it is: new generation of the OpenAI model, designed for **broader capabilities and contexts**.
  - In brief: increases the sense of continuity for long tasks: not just answers, but accompaniment until delivery.
  - Source: **[F23]**

---

### September 2025 — Efficiency: scaling without burning budget

- **Gemini 2.5 Flash‑Lite (Google, preview)**
  - When: **September 2025** (indicated as “09‑2025” in release materials)
  - What it is: **fast and economical** variant of Gemini for high-volume automations.
  - In brief: fuel for repetitive automations (summaries, classifications, triage) at a lower cost.
  - Source: **[F24]**

---

### October 2025 — The web becomes “operational”

- **ChatGPT Atlas (OpenAI, pilot browser)**
  - When: **October 21, 2025**
  - What it is: ChatGPT experience with **web navigation and actions** managed by the agent.
  - In brief: the assistant doesn't just explain: it can navigate, fill out forms, follow steps, collect data.
  - Source: **[F25]**

- **Cursor (Anysphere) and the season of "companion" coding**
  - When: **Q4 2025 (staggered releases and rollout)**
  - What it is: editor/IDE with **integrated AI assistant** for real-time writing, refactoring, and review.
  - In brief: the editor stops being a place where you "write" and becomes a place where you **coordinate** (write, check, refactor, test).
  - Note: the precise date here depends on channels/rollout; in this version, I preferred not to set a single day without a unique primary source.

---

### November 2025 — Google relaunches on “Pro”

- **GPT‑5.1 (OpenAI)**
  - When: November 12
  - What it is: update to the GPT‑5 series with two modes (more “instant” and more “reasoned”) and more control over tone. In practice: more natural conversations, and less friction when moving from idea to finished work. I noticed that the automatic switch worked better and the grounding was more reliable.

- **Gemini 3 Pro (Google)**
  - When: **November 18, 2025**
  - What it is: Google's high-end model for **complex multimodal tasks** and long contexts.
  - In brief: returns strong on complex work (text + images + long contexts), with a focus on real-world scenarios.
  - Source: **[F26]**

---

### December 2025 — Consolidation and “software builders”

- **GPT‑5.2 (OpenAI)**
  - When: **December 11, 2025**
  - What it is: incremental model update with **stability improvements** and reasoning. Works better with images, on long and complex chats. Also improves in coding.
  - In brief: pushes for professional work and multi-step projects (more operational stability).
  - Source: **[F27]**

- **Gemini 3 Flash (Google)**
  - When: **December 17, 2025**
  - What it is: **faster** version of Gemini 3 for quick tasks and high throughput.
  - In brief: “fast but smart” as default; further reduces idle times.
  - Source: **[F28]**

---

## Focus: AI in Space (2025)

In 2025, the keyword in space is not “science fiction,” it’s **autonomy**. The reason is simple: when you are in orbit (or beyond), communication is costly and delayed. Therefore: more software capable of deciding and adapting on board means a more efficient mission.

### USA — more operational autonomy and more data discipline

- **U.S. Space Force: Data & AI Plan FY2025**
  - When: **March 19, 2025**
  - What it signals: AI is not just a "model," it's **organization**: shared data, literacy, tools, governance.
  - Source: **[F31]**

- **Satellites that decide "if it makes sense to take a shot"**
  - When: **July 25, 2025** (account of a public demo/test)
  - What it signals: part of the intelligence moves onboard: less "download everything to Earth," more "choose and filter first."
  - Source: **[F32]**

*(Note: many NASA/DoD activities are continuous and don't always have a single "launch" date. In this section, I've only included points where a public date is explicit.)*

### China — in-orbit computing and constellations that process data onboard

- **Launch of a "space computing constellation" (initiative led by Zhejiang Lab)**
  - When: **May 15, 2025**
  - What it signals: push towards a network of satellites that **process data directly in orbit**, reducing transfers to Earth.
  - Source: **[F33]**

### Europe — reliability, interoperability, "serious" Earth Observation

In 2025, Europe tends to move with a more "engineering" approach: less show, more verifiability.

- **ESA Φ‑lab / AI4EO (AI for Earth Observation)**
  - When: **ongoing initiative (active in 2025)**
  - What it signals: focus on AI applied to Earth observation (climate, ice, agriculture, risks).
  - Source: **[F34]**

---

## An important note: who invested a lot but reaped little

In 2025, a recurring pattern was observed (valid across all sectors):
1) **Eternal Pilot**: Beautiful PoCs, but no one brings them into production. PoCs must first and foremost be feasible and useful to those who will then use them. Last but not least, it must be clear how to use them. Adoption becomes key in this sense.
2) **Disordered Data**: a problem as old as time. Data cannot be duplicated or confused, and processes must be standardized to be suitable for transformation with AI.
3) **Unmeasured Quality**: without metrics (errors, times, savings, risks), adoption remains emotional and then fades. Continuous monitoring over time to understand the impact remains fundamental, and not everyone is doing it.
4) **Vague Governance**: who can use what? with what data? who signs off on the output? if no one decides, no one scales.

The difference between those who won and those who lost in 2025 was almost always here: **processes + data + responsibility**, rather than "the newest model."

---

## Company by company: what they did well, what they didn't, and final score

> **How I read the score (0–10):** concrete utility, quality, speed of improvement, distribution, product clarity.

### OpenAI — 9+

**The story of the year:** top of the class, but flunked the exam everyone was watching: GPT‑5.

**What they did well**

The two gems of the year: Deep Research and Agent/Operator. One gives you the report (with sources), the other gets to work and does things (clicks, forms, searches, info gathering). These two, for me, were truly "wow" because they save you hours.
On coding: Codex is what refueled them. When you need to work on the real repo and not on 10 lines thrown into chat, that's where OpenAI gained ground.
The blunder: GPT‑5. A long, somewhat fluffy announcement, and the general feeling of "okay... so what?". Then it recovered at the end with a strong comeback.
Personal note: the reasoning models were another cool thing, but that's last year's news.

**Where they blundered (in my perception)**

* **GPT‑5** was the exam everyone was watching: enormous expectations, a long announcement, and for many, the feeling of "much ado about nothing." It's good to reduce hallucinations, but the facts said otherwise.

**Why a 9+**

* Because, despite the slip-up, at the end of the year, they pulled ahead with a final sprint. In general, when you need to get things done, it's often still the most complete choice.

---

### Google / DeepMind — **9.5/10**

**The story of the year:** recovered a lot of ground and, in early December, truly gave the impression of surpassing OpenAI. Then OpenAI sprinted ahead in the final stretch, but "the distance" is now minimal.

**What they did exceptionally well**

* They won with the **ecosystem**: if you consider Search, Workspace, Android, YouTube, and distribution, when Google moves a button, you feel it everywhere.
* **NotebookLM** was the most underrated and most powerful move: it made studying and onboarding lighter (audio, guided summaries, infographic slides, etc.).
* The "family of tools" strategy is clear: when you need depth, go with **Pro**, for daily life, go with **Flash**, and if you want control and local-first, look at **Gemma**.

**Love and Hate (and I understand you here)**

* **AI Mode**: very convenient, but not always reliable; when it makes mistakes, it hallucinates badly. #GotIt
* Some things removed or limited (like **screen control** in AI Studio) are frustrating: these were the features that made you say "ok, we're getting somewhere."

**Why 9.5 and not 10**

* Too many tools like Opal that are still to be integrated. Too many things that do the same thing and compete with each other.

---

### Anthropic — **9.0/10**

**The story of the year:** the *coding model*.

It doesn't do a thousand things, but what it does, it does well. And above all: if you ask it something, it often responds with code that produces the result.
- Want presentations? It writes code to make them.
- Want documents? It writes code to make them.
- Want Excel tables? It gives you the code and creates the file.
- Did you paste an endless scroll? It still tries to "package" it into something sensible.

**What it did well**

Consistency on long tasks and complex contexts. Their Deep research is nice.

**The big flaw**

* It's **very expensive**. And when you use it a lot, you feel the cost.

---

### Meta — **5.0/10**

**The story of the year**: I thought I'd give it less, but at least it tried.
- The models were released and, from my experience, they flopped.
- The choice to force you to see their model on your phone every day... I don't understand it. Or rather, I understand the logic, but it's a strange move.
- Via API: among the worst I've tried (along with IBM Granite).

**What it did well**

* The true value remains open: the fact that many pieces are **released open** allows the world to test them, adapt them, research them, and build around them.

**What didn't work (in my experience)**

* Performance: via API it was one of the worst models I tried (along with IBM Granite).
* "Forced" distribution: the choice to push the model into Meta's main apps in a very mandatory way is… Let's say peculiar. I understand the logic, but the "imposition" effect can become a boomerang.

**Why I don't go below 5:** because releasing open, even when you don't shine, is still a useful act for the ecosystem.

### Mistral — **8.0/10**

**The story of the year:** finally a European alternative that is slowly reaching almost the level of the others.

**What it did well**

* **Memory** arrived (and the idea is good: useful without becoming intrusive).
* Speech models arrived with **Voxtral**.
* Italian, according to benchmarks, performs **better than French**.
* **Mistral Small** was my favorite open model of the year: practical, fast, "for work."

**Where it can still grow**

* In "long" research flows (deep research), there's room to do more.
* On documents (reading/extraction/summarization on complex files), it still lacks something to truly be a "default" choice.
* It is still little known outside of technical circles.

**Why the score is 8:** excellent direction and strong identity; it's not yet "everywhere," but it's becoming credible.

### Microsoft — **6.5/10**

**The story of the year:** FINALLY.

Finally, it decided not to put an exclusive on OpenAI. Finally, it has decent performance. Finally, it has a lot of nice features taken (and adapted) from what worked elsewhere.

**What it did well**

* It started moving more independently and pragmatically.
* It has enormous distribution: if it gets the experience right, it can become the gateway for many.

**What still doesn't convince me**

* Operational reliability: a service down on **Tuesday, December 9** caused quite a few problems.
* A lot of potential, but it's not applied enough yet, especially in its proprietary software (where it could really push productivity).

**Why the score is 6.5:** six months ago, I didn't think I'd give it a passing grade. Now we're there, but it's close to transforming potential into a truly stable "work machine."

### Perplexity — **8.0/10**

**The story of the year:** Comet is cool, but Labs is cooler.

**What I like**

* The "project mode" is practical: you start with a question and end up with an already usable result.
* The press review using tasks + Labs truly makes it easier to stay updated.
* The way it "takes" information, for me, is often more reliable than other competitors (personal opinion).

**Things that leave me perplexed**

* **Deep research** is too short: when you're working on serious things, you'd want more depth.
* Price: it's not cheap, but Pro is included in bundles (like TIM/PayPal).

---

### xAI — **6.9/10**

**The story of the year:** very fast, but full of rough edges.

I don't know, maybe it's because of the "no-filter" approach and in the image and likeness of its "creator": I find it hard to consider it a truly marketable product, because it often **touches ethical boundaries** that you cannot ignore in a company.

**However…**

*   It's among the fastest for certain things (on-the-fly coding, creativity, images).
*   Sometimes its freedom of tone makes it surprisingly useful, until it becomes a risk.

**Why 6.9:** extremely useful for some things, but too "ungovernable" to become a professional default.

---

### Alibaba — **8.0/10**

**The story of the year:** the Qwen family is pushing hard.

I have little to say because, in general, the models command respect and have become an important part of the ecosystem.

**Why I don't give more (personal, traumatic note 😄)**
Once I made an incredible mess on a European server because of Qwen: it was the only one that had gone off balance and told me how to force a CUDA update. Lifelong trauma.

**Why it still gets an 8:** solid direction, competitive models, real drive. Just... well, I treat them with kid gloves now.

### DeepSeek — **7.8/10**

**The story of the year:** the blonde big fish that drove the world crazy.

In January, it created an earthquake: suddenly it became clear that OpenAI **is no longer out of reach** and that "high" quality can also come from a less obvious player.

**What it did well**

*   It showed that "serious" reasoning can be more accessible and less tied to huge budgets.
*   It continued to push on the research front, and with **DeepSeek‑V3.2** it made it clear that it's still alive.

**What didn't work (in my experience)**

*   Ethical/security issues: doubts and criticalities emerged that make it difficult to use it "lightheartedly" in professional contexts.
*   It didn't always keep pace with competitors on the finished product (integrations, consumer experience, release continuity).

**What I'd like to see in 2026**

*   If the effort is serious, in addition to research, I would also invest in the **consumer** side (experience, reliability, daily functions).

**Why the score is 7.8 and not higher:** huge initial impact, but more continuity and more product are needed.

### Cursor / Anysphere — **10/10**

**The story of the year:** amazing development project.

It made me laugh when GPT‑5 came out there before it did on ChatGPT: it's a sign of how fast it has become at bringing innovations *where they are really needed*.

It's my go-to IDE: in one year it has grown tremendously and has made a "cyclical" way of working natural: I propose → I generate → I test → I correct → I redo. When it gets into the flow, it makes you churn out work.

**Why 10:** enormous daily impact and continuous improvement without losing its way.

---

### Lovable and "app creators" — **8.0/10**

**The story of the year:** the best place (online) for vibe coding "from demo to running thing".

For making mocks connected to a small DB (like Supabase) it's really cool: from idea to prototype in a few hours.

**Why it's not higher**

*   The final stretch remains "hard": it's difficult to maintain, manage security, and generally manage "production-grade" quality.
*   When a project grows, more expert help is often still needed to avoid accumulating technical debt.

**Why it's 8:** right direction and huge impact on prototypes/MVPs.

---

### Apple — **2.0/10**

**The story of the year:** it tried twice and, for many people, failed twice.

The last time I asked a friend "how does Apple Intelligence work?", she replied: "What is it?". And that, in my opinion, says it all.

**Why so low**

*   It arrives late and in batches, and many people don't understand what is actually available and what isn't.

---

### Space and Defense (sector) — **7.4/10**

**The story of the year:** less hype, more real plans.

**What's strong**

*   Roadmaps and concrete experiments on robotics and autonomy.

**What slows it down**

*   Long cycles, security, certifications.

---

## Conclusion — The discoveries of 2025 and what to expect in 2026

### The 5 main discoveries of 2025

1.  **Research has become a complete job**: you don't look for "information," you ask for "a report."
2.  **The office moves to the browser**: if the browser can act, many activities become faster.
3.  **Coding changes pace**: more drafts, more tests, more rapid iterations; less time on repetitive tasks.
4.  **Hype is not enough**: many companies discover that process, clean data, and quality measures are needed.
5.  **Efficiency and responsibility matter as much as power**: costs, energy, error control.

### Probable trends for 2026

*   **Tools that work in blocks of 30–120 minutes**, not single responses.
*   **More "autopilots" within existing software** (browsers, office suites, IDEs).
*   **Prices and metrics linked to results**, not just consumption.
*   **More attention to quality and security** (especially in companies and public administration).
*   **More "local" execution** where possible, for costs and privacy.

---

### Appendix — Summary scores (for quick comparison)

* Cursor/Anysphere 10.0
* Google/DeepMind 9.5
* OpenAI 9.2
* Anthropic 9.0
* Perplexity 8.0
* Lovable 8.0
* Alibaba 8.0
* Mistral 8.0
* DeepSeek 7.8
* Space/Defense 7.4
* xAI 6.9
* Microsoft 6.5
* Meta 5.0
* Apple 2.0

## Appendix — Sources (with links)

$1

*   **[F02c]** OpenAI — [“Introducing upgrades to Codex”](https://openai.com/index/introducing-upgrades-to-codex/) — 16 May 2025
*   **[F02d]** OpenAI — [“gpt-5.1-codex-max (model docs)”](https://platform.openai.com/docs/models/gpt-5-1-codex-max) — 2025
*   **[F02a]** OpenAI — [“New tools for building agents”](https://openai.com/index/new-tools-for-building-agents/) — 11 Mar 2025
*   **[F02b]** OpenAI — [“Introducing ChatGPT agent: bridging research and action”](https://openai.com/index/introducing-chatgpt-agent/) — 17 Jul 2025
*   **[F03]** DeepSeek — [“DeepSeek‑R1 Release Notes”](https://api-docs.deepseek.com/news/news250120) (weights: [Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-R1)) — 20 Jan 2025
*   **[F04]** arXiv — [“Humanity’s Last Exam”](https://arxiv.org/abs/2501.14249) — 24 Jan 2025
*   **[F05]** Mistral AI — [“Codestral 25.01”](https://mistral.ai/it/news/codestral-2501) — 13 Jan 2025
*   **[F06]** OpenAI — [“Introducing deep research”](https://openai.com/index/introducing-deep-research/) — 3 Feb 2025
*   **[F07]** Mistral AI — [“The all new le Chat: Your AI assistant for life and work”](https://mistral.ai/en/news/all-new-le-chat) — 6 Feb 2025
*   **[F08]** OpenAI — [“Introducing GPT‑4.5”](https://openai.com/index/introducing-gpt-4-5/) — 27 Feb 2025
*   **[F09]** Ars Technica — [“Will the future of software development run on vibes?”](https://arstechnica.com/ai/2025/03/is-vibe-coding-with-ai-gnarly-or-reckless-maybe-some-of-both/) — 5 Mar 2025
*   **[F10]** Google — [“Gemini 2.5: Our newest Gemini model with thinking”](https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/) — 25 Mar 2025
*   **[F11]** Google — [“Gemma 3: Google’s new open model based on Gemini 2.0”](https://blog.google/technology/developers/gemma-3/) — 10 Mar 2025
*   **[F12]** OpenAI — [“OpenAI o3 and o4‑mini System Card”](https://openai.com/index/o3-o4-mini-system-card/) — 16 Apr 2025
*   **[F13]** Meta — [“Llama 4”](https://ai.meta.com/blog/llama-4/) (alt: [https://www.llama.com/llama4/](https://www.llama.com/llama4/)) — 5 Apr 2025
*   **[F14]** AWS — [“Amazon Bedrock adds Mistral AI Pixtral Large 25.02”](https://aws.amazon.com/about-aws/whats-new/2025/04/amazon-bedrock-mistral-ai-pixtral-large-25-02/) — 8 Apr 2025
*   **[F15]** Qwen Team (Alibaba) — [“Qwen3”](https://qwenlm.github.io/blog/qwen3/) — 29 Apr 2025
*   **[F16]** Google — [“AI Mode in Google Search: Updates from Google I/O 2025”](https://blog.google/products/search/google-search-ai-mode-update/) — 20 May 2025
*   **[F17]** Google DeepMind — [“Veo”](https://deepmind.google/models/veo/) — 20 May 2025
*   **[F18]** Anthropic — [“Introducing Claude 4”](https://www.anthropic.com/news/claude-4) — 22 May 2025
*   **[F19]** Perplexity — [“Introducing Perplexity Labs”](https://www.perplexity.ai/hub/blog/introducing-perplexity-labs) — 29 May 2025
*   **[F20]** Google — [“Build transformative AI applications with Google AI”](https://blog.google/technology/developers/google-ai-developer-updates-io-2025/) — 20 May 2025
*   **[F21]** Mistral AI — [“Magistral”](https://mistral.ai/en/news/magistral) — 10 Jun 2025
*   **[F22]** Perplexity — [“Introducing Comet”](https://www.perplexity.ai/hub/blog/introducing-comet) — 9 Jul 2025
*   **[F23]** OpenAI — [“Introducing GPT‑5”](https://openai.com/index/introducing-gpt-5/) — 7 Aug 2025
*   **[F23a]** OpenAI — [“GPT‑5.1: A smarter, more conversational ChatGPT”](https://openai.com/index/gpt-5-1/) — 12 Nov 2025
*   **[F24]** Google — [“Gemini 2.5 Flash‑Lite” (models docs)](https://ai.google.dev/gemini-api/docs/models/gemini#gemini-2.5-flash-lite) — Sep 2025
*   **[F25]** OpenAI — [“Introducing ChatGPT Atlas”](https://openai.com/index/introducing-chatgpt-atlas/) — 21 Oct 2025
*   **[F26]** Google Workspace Updates — [“Gemini 3 Pro”](https://workspaceupdates.googleblog.com/2025/11/gemini-3-pro.html) — 18 Nov 2025
*   **[F27]** OpenAI — [“Introducing GPT‑5.2”](https://openai.com/index/introducing-gpt-5-2/) — 11 Dec 2025
*   **[F28]** Google — [“Gemini 3 Flash”](https://blog.google/products/gemini/gemini-3-flash/) — 17 Dec 2025
*   **[F29]** Lovable — [“Lovable 2.0”](https://lovable.dev/blog/lovable-2-0) — 24 Apr 2025
*   **[F30]** Lovable — [“Series B”](https://lovable.dev/blog/series-b) — 18 Dec 2025
*   **[F31]** U.S. Space Force — [“Data & AI FY2025 Strategic Action Plan”](https://www.spaceforce.mil/Portals/1/Documents/Data%20and%20AI%20FY25%20Strategic%20Action%20Plan.pdf) — 19 Mar 2025
*   **[F32]** NASA — [dynamic targeting / onboard decision‑making for Earth observation](https://www.nasa.gov/) — 25 Jul 2025
*   **[F33]** Gov.cn — [news on “space‑based computing constellation”](https://english.www.gov.cn/) — 15 May 2025
$1

* **[F35]** PayPal — [“PayPal partners with Perplexity to help users shop smarter”](https://newsroom.paypal-corp.com/2025-06-25-PayPal-partners-with-Perplexity-to-help-users-shop-smarter) — 25 Jun 2025
* **[F36]** Reuters — [“PayPal partners with Perplexity to help users shop smarter”](https://www.reuters.com/world/us/paypal-partners-with-perplexity-help-users-shop-smarter-2025-06-25/) — 25 Jun 2025
* **[F37]** The Verge — [“Apple drops ‘available now’ from Apple Intelligence page”](https://www.theverge.com/news/653413/apple-intelligence-available-now-advertising-claim) — 22 Apr 2025
* **[F38]** Ars Technica — [“Anthropic launches Claude Max plan for $200 per month”](https://arstechnica.com/information-technology/2025/04/anthropic-launches-claude-max-plan-for-200-per-month/) — 9 Apr 2025
* **[F39]** Gartner Peer Insights — [“Cursor reviews (AI code assistants)”](https://www.gartner.com/reviews/market/ai-code-assistants/vendor/anysphere/product/cursor) — 2025
* **[F40]** Trustpilot — [“Lovable reviews”](https://www.trustpilot.com/review/lovable.dev) — 2025