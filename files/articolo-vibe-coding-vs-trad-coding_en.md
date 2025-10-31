# Vibe Coding vs Traditional Programming (2023–2025)

## Abstract

“Vibe coding” — letting an AI pair programmer drive the entire implementation — exploded between 2023 and 2025 thanks to tools such as GitHub Copilot, Cursor, Sourcegraph Cody, Tabnine, Codeium, and the assistants now embedded in mainstream IDEs.

This first article compares vibe coding with the traditional (“old coding”) approach through the lens of recent studies, enterprise case studies, and developer testimonials. The data paints a nuanced picture. In **controlled enterprise environments**, AI pair programming boosts delivery ([+26% tasks completed on average](https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-leaders-need-to-know/)), especially for *junior developers*, without immediate quality regressions. That headline number is well known.

Less publicised: on complex projects, seasoned engineers have reported unexpected slowdowns (up to [+19% longer when using AI](https://www.infoq.com/news/2025/07/ai-productivity/)) even though the experience felt faster.

Quality-wise, AI-generated code generally runs, but tends to be less maintainable due to *duplication*, *higher code churn*, and **potential security gaps** [when unsupervised](https://visualstudiomagazine.com/articles/2024/01/25/copilot-research.aspx). The market is responding with tools such as Code Mender, which I analysed in an earlier podcast.

On the cultural side, AI assistants raise developer satisfaction by [reducing repetitive work](https://www.secondtalent.com/resources/github-copilot-statistics/). Yet concerns are mounting: inexperienced programmers risk missing the [deep understanding of code](https://nmn.gl/blog/ai-and-learning) that defines a professional engineer, and blind trust in AI (“accept all and ship”) can lead to **loss of control** and **opaque systems**. Bottom line: vibe coding unlocks remarkable velocity and accessibility, but it still demands **strong human intervention** in *architecture, review, and testing* to **guarantee quality, security, and long-term sustainability**.

## Methodology

Sources published between 2023 and 2025 in multiple languages were analysed, prioritising quantitative, reproducible evidence. In particular:

1. **Peer-reviewed experiments and technical white papers** with clear methodology (RCTs, benchmarks). Classified as grade A evidence (high robustness, low bias).
2. **Industry case studies** with real team metrics (grade B when conducted internally, acknowledging context bias).
3. **Direct developer accounts** (blogs, videos, forums) that include concrete experiments or verifiable code (grade C, anecdotal with medium/high bias). For each source we extracted: context and tools used, type of activity (greenfield development, refactoring, bug fixing, testing), objective metrics (time, bug rate, vulnerability rate, test coverage, performance), and subjective metrics (satisfaction, cognitive load, perceived learning).

During synthesis, we compared evidence to highlight convergences or discrepancies. Example: results from a large corporate RCT (4,800 developers across Microsoft/Accenture, grade A) were contrasted with an RCT on experienced OSS maintainers (16 contributors, grade A) and with case studies such as Copilot’s internal adoption at ZoomInfo (400 engineers, grade B).

Individual experiences (e.g., a full-stack prototype built entirely with AI) were included as grade C evidence to capture practical and cultural aspects that raw numbers miss. Every source is linked to its original reference.

## Technical Findings

### Impact on Productivity and Delivery Speed

The data confirms that AI assistants can accelerate software development, but the uplift depends heavily on **context** and engineer **seniority**.

- **Multi-company RCT (Microsoft, Accenture, global enterprise).** GitHub Copilot users achieved **+26% more tasks**, **+13.5% weekly commits**, and **+38% compilation frequency**. The study reports **no negative quality impact** (bugs, reviews, builds), indicating that the extra speed did **not** compromise correctness. ([IT Revolution summary](https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-leaders-need-to-know/))
- **Accenture controlled trial.** Teams saw **+8.7% pull requests per engineer**, **+15% merge rate**, and **+84% first-pass build success** thanks to faster boilerplate generation and inline test scaffolding.
- **Advanced OSS maintainers benchmark.** When tackling deep refactors or unfamiliar stacks, experienced developers reported a **+19% time cost** despite feeling faster. ([InfoQ analysis](https://www.infoq.com/news/2025/07/ai-productivity/)) Extra time was spent debugging hallucinated code and stitching partial snippets.

**Takeaway:** AI improves throughput on patterned, well-understood tasks. The closer you get to novel architecture, brittle legacy code, or multi-repo changes, the more the human must slow down and reassert intent.

### Code Quality and Maintainability

- **Duplication and churn.** AI-generated patches often include redundant logic and inflate churn because the assistant rewrites more context than necessary. Teams without tight review discipline report double-digit increases in duplicated blocks and “fix-forward” commits.
- **Readability.** Default suggestions lean toward generic naming and mixed paradigms. Without prompts that enforce house style, readability drops, especially in polyglot repositories.
- **Second-order debt.** Case studies from regulated industries describe “confidence cliffs”: initial velocity hides the fact that AI-suggested abstractions rarely match the domain language, leading to expensive cleanups later.

ZoomInfo’s internal metrics (400 engineers) illustrate the trade-offs:

| Metric                  | Trend with AI use      | Notes                                               | Source                                                                 |
|-------------------------|------------------------|-----------------------------------------------------|------------------------------------------------------------------------|
| Build success           | **+84%**               | Thanks to templated tests and guardrails            | [ZoomInfo](https://arxiv.org/abs/2501.13282)                           |
| Review iteration        | **+24%**               | More rounds to align on structure                   | [ZoomInfo](https://arxiv.org/abs/2501.13282)                           |
| Code churn              | **~2×**                | AI rewrites large chunks between revisions          | [ZoomInfo](https://arxiv.org/abs/2501.13282)                           |
| Acceptance LoC          | **~20%**               | Significant boilerplate / partial outputs           | [ZoomInfo](https://arxiv.org/abs/2501.13282)                           |
| Perceived quality       | Variable               | Requires standards plus iterative refactoring       | [ZoomInfo](https://arxiv.org/abs/2501.13282)                           |

Overall, vibe coding tends to deliver **more code, faster**, but with **lower intrinsic cleanliness and reuse**.

Senior engineers writing code manually often pause to integrate the new feature into the existing design—refactoring neighbouring modules when appropriate. An AI prompted in isolation usually emits a fresh solution, unaware of duplication elsewhere. The result: AI-driven applications that consume 3–4× more server resources than hand-crafted equivalents.

### Defects and Security

The critical question: does AI coding introduce more **bugs** or **security issues**? Evidence suggests AI is good at avoiding *syntactic/compilation* errors but can inject *logic bugs or subtle vulnerabilities* if unchecked. Controlled studies so far have not identified higher functional bug rates attributable to AI; in fact, build errors often decrease and tests pass more easily thanks to AI assistance.

However, multiple experiments show that blind trust in AI causes mistakes an expert would catch. Models such as GPT-4 occasionally “invent” functions or APIs when prompts are ambiguous, or produce plausible but incorrect solutions for edge cases. A [Microsoft 2022 study](https://visualstudiomagazine.com/articles/2024/01/25/copilot-research.aspx#:~:text=%2A%20,is%20needed%20in%20the%20future) found situations where Copilot delivered misleading algorithmic solutions: the base case worked, but boundary conditions failed — errors a careful developer would have spotted via tests. Literature repeatedly advises against letting the AI “fly solo”: “Copilot is powerful; it should not pilot the plane alone.”

The developer **must stay in the loop** to validate business logic. Supporting evidence: a [study on ChatGPT in university programming tasks](https://cybersecurityadvisors.network/2025/08/06/ai-assisted-software-development-and-the-vibe-coding-debate-by-nick-kelly/) observed that inexperienced students trusted the output even when it contained mistakes. If the program failed, they simply asked the AI to “fix it again” without understanding the root cause. This can create cycles where a bug is “patched” by the AI with another flawed change, sowing hard-to-diagnose issues.

#### Security

Security deserves special attention. My deep dive shows AI-generated code often includes known vulnerabilities or unsafe practices unless the user steers the model explicitly toward hardened implementations.

- **Known vulnerabilities.** [Pearce et al. (2021/22)](https://arxiv.org/abs/2108.09293) evaluated 89 CWE scenarios: 39% of generated programs contained vulnerabilities, with first Copilot suggestions hitting ~39% in Python and ~50% in C. Over 40% exhibited at least one weakness (buffer overflow, SQL injection, hard-coded secrets, etc.). Without filtering, AI tends to **replicate patterns** seen in training data **even when unsafe**. Example: suggesting a SQL query via string concatenation (injection-prone) because that pattern appears frequently on GitHub.
- **Personal anecdote.** I nearly shipped an exposed API key. In the rush of an incident I relied entirely on vibe coding and forgot to hide secrets in `.env`. This illustrates how AI-accelerated workflows can bypass long-ingrained security habits if we disengage.

AI assistants are improving: Copilot and Cursor now attempt to flag known insecure patterns, and tools like CodeQL can run automatic scans post-generation. Still, a [2025 study](https://arxiv.org/html/2506.1102v1) uncovered *malicious prompts* designed to trick developers into inserting backdoors by hiding them within seemingly harmless prompt histories. Attackers can weaponise shared prompt libraries or contextual cues to smuggle payloads into generated code, reinforcing the need for stringent review.

Practical mitigation strategies:

1. **Automated security gates.** Integrate SAST/DAST/SCA scanners at commit or CI time to catch common issues before merge.
2. **Prompt hygiene.** Avoid pasting secrets, internal architecture layouts, or proprietary algorithms into prompts. Even if the vendor promises retention controls, treat prompts as potentially recoverable.
3. **Defense-in-depth culture.** Encourage threat modeling, test-first habits, and security code review even when AI produces the initial patch.

### Performance and Scalability

AI can draft distributed-system scaffolding or microservice templates quickly, but it rarely accounts for non-functional constraints unless explicitly guided. Engineers report that generative snippets often ignore backpressure, batching, circuit breakers, or resource pools — ingredients essential for latency and throughput. Pushing AI-generated code straight to production without human optimisation can therefore degrade performance.

Benchmark tuning (GPU kernels, concurrency hot paths, caching strategies) still demands domain expertise. AI provides decent pseudocode, but not the nuanced micro-optimisations that production workloads require. Experienced teams treat AI as a brainstorming partner, then profile and refine manually.

### Developer Satisfaction

Synthesised surveys (e.g., [Second Talent](https://www.secondtalent.com/resources/github-copilot-statistics/)) show higher morale because AI removes repetitive work such as CRUD endpoints, table mappings, unit test scaffolding, and boilerplate docs.

Still, senior engineers warn about **skill atrophy**: entry-level developers who accept suggestions blindly struggle to build conceptual depth. Namanyay Goel’s viral post “[New Junior Developers Can’t Actually Code](https://nmn.gl/blog/ai-and-learning#:~:text=We%E2%80%99re%20at%20this%20weird%20inflection,That%E2%80%99s%20where%20things%20get%20concerning)” describes junior hires who deliver features courtesy of Copilot/ChatGPT, yet cannot answer “why does your code work this way?” Similar anecdotes appear on university forums: students submit seemingly correct assignments but cannot explain basic design decisions, indicating they neither wrote nor understood the solution.

AI can also be a powerful teaching aid when used deliberately. Juniors can ask the assistant to explain a snippet, propose alternatives, or outline debugging strategies — getting instant, tailored feedback that static resources never provided. Many engineers report closing knowledge gaps faster thanks to AI-as-mentor. The difference lies in **user mindset**: if the developer approaches AI to learn (“why?”), validates the answers, and experiments with variants, they grow quickly. If they stay in autopilot mode, copying solutions without reflection, learning stalls. Goel advises juniors: “Use Copilot/ChatGPT sparingly; interrogate the solutions and rebuild the reasoning.”

Education programmes are adapting. Some curricula integrate AI as a tool to explore multiple approaches and then critique them with instructors. Personally, I rely on ChatGPT to brainstorm training roadmaps: while time estimates remain shaky, the structured paths are often spot on.

Within companies, senior mentors carry an even bigger load. They must coach juniors on responsible AI usage to avoid **skill atrophy**. This means pair reviews where mentors ask juniors to explain AI-generated code, or policies requiring juniors to attempt a manual solution before prompting the AI. Mentors now teach **prompt engineering** and **AI code quality control** in addition to traditional craftsmanship. Some organisations codify guidelines: AI-generated code must undergo human review by a senior who inspects not only style but also architecture. Examples:

- “Copilot duplicated this logic in three places; extract a shared function.”
- “ChatGPT imported an outdated library from a sample; it’s not production-grade for performance reasons.”

These meta-cognitive lessons are vital to grow engineers who can reason even when AI suggests the first draft.

Finally, there is the psychological dimension. For many developers, hand-writing code is both craft and passion. AI assistants capable of generating large chunks shake that identity. Some fear becoming “operators steering AI” rather than craftsmen. Analogies abound: loss of craftsmanship mirrors industrial automation where the human shifts from artisan to machine supervisor. I see AI as an amplifier, not a replacement — akin to moving from punch cards to modern programming. The craft survives by shifting focus: less time manually writing every loop, more time architecting systems that weave AI and human code coherently. As [Greenman](https://medium.com/data-science-collective/the-ai-vibe-coding-paradox-why-experience-matters-more-than-ever-33c343bfc2e1#:~:text=,Humans%20architect%20systems%20that%20work) puts it, “AI executes code brilliantly. Humans architect systems that work.”

## Training, Skill Development, and Role Impact

The cultural debate often centres on learning: will vibe coding create a generation that can only “prompt” without understanding code? The risk exists, but it is manageable.

- **Learning posture matters.** Developers who interrogate AI output, ask for explanations, and refactor suggestions build intuition. Those who simply paste suggestions don’t.
- **Mentorship evolves.** Seniors must coach juniors on prompt design, validation, and clean-up. Code reviews focus not only on correctness but also on understanding: “Explain the decision behind this AI snippet.” Teams are adopting joint AI sessions (senior + junior) to discuss pros/cons of AI proposals synchronously.
- **Continual practice.** Mixing AI-assisted work with periodic “no-AI kata” keeps foundational skills sharp and reveals gaps. Some teams nominate an “AI custodian” to steward code quality across AI contributions.
- **Identity and motivation.** Reposition AI as a co-pilot that frees engineers to tackle higher-order design. Satisfaction comes from orchestrating robust systems, even if the assistant generated part of the code.

## Summary and Recommendations

Vibe coding versus traditional development is **not** a zero-sum game. AI delivers revolutionary speed and accessibility; traditional methods guarantee control, robustness, and clarity. The evidence favours a hybrid strategy that maximises upside and mitigates risk. Key takeaways:

1. **Productivity.** AI-driven coding accelerates repetitive work (boilerplate, CRUD, mappings, test scaffolding, baseline docs), particularly for less-experienced engineers. Put **guardrails** in place: linters, formatters, conventional commits, automated tests.
2. **Quality and maintainability.** Treat AI output like junior developer code. Require human review, refactoring, and testing before merge. Consider designating an “AI code custodian” to oversee stylistic and architectural coherence.
3. **Security.** Never assume AI output is safe. Run security pipelines (SAST/DAST/SCA), enforce secure coding checklists, and reintroduce threat modeling. AI speeds implementation; developers must restore security-by-design.
4. **Architecture and performance.** Do not let vibe coding run wild without a plan. Establish architecture, module boundaries, and critical decisions upfront to avoid heterogeneous chaos. Profile and optimise critical paths manually.
5. **Developer growth.** Use AI deliberately as a learning tool. Encourage juniors to ask for explanations, not only solutions. Pair programming sessions (human + AI) expose tacit knowledge. Schedule occasional “no AI” exercises to maintain core skills. During code review, ask developers to justify AI-generated code to ensure comprehension. Mentorship and pairing remain essential — AI does not remove the need to explain the “why” and “how”.

In short: the future belongs to developers who know **when to engage autopilot** and **when to grip the steering wheel**. Use AI to handle the tedious stretches; rely on human judgment for intent, architecture, and safety.
