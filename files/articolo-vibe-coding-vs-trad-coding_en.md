# Vibe Coding vs. Traditional Programming (2023–2025)

## Abstract

Vibe coding, which is nothing more than a method of programming guided entirely by AI, spread between 2023 and 2025 thanks to tools like GitHub Copilot, Cursor, Sourcegraph Cody, Tabnine, Codeium, and AI assistants integrated into IDEs.

In this first article, I want to compare vibe coding with the traditional approach ("old coding") based on recent studies, company cases, and user experiences. The data shows a nuanced picture: in **controlled corporate environments**, AI pair programming can accelerate development ([+26% tasks completed on average](https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-leaders-need-to-know/)) especially for *junior developers*, without apparent immediate drops in quality.
I believe this is the data point everyone talks about, and that you, reading this article, are also familiar with.

However, what you probably don't know is that, in complex projects, experienced developers have encountered unexpected slowdowns (with reports of even [+19% more time using AI](https://www.infoq.com/news/2025/07/ai-productivity/)) despite the perception of greater speed.

On the quality front, AI-generated code works but tends to have lower maintainability, due to *duplications*, *doubled code churn*, and **potential security vulnerabilities** [if used without supervision](https://visualstudiomagazine.com/articles/2024/01/25/copilot-research.aspx). To address this problem, tools like Code Mender, which I've already discussed in a previous podcast, are beginning to emerge.

Culturally, AI assistants increase developer satisfaction by [reducing repetitive tasks](https://www.secondtalent.com/resources/github-copilot-statistics/), but concerns arise: less experienced programmers risk not developing the [deep understanding of code](https://nmn.gl/blog/ai-and-learning) that characterizes a developer worthy of the name, and blind trust in AI ("accept all and go") can lead to **loss of control** and **opaque code**. In summary, vibe coding offers unprecedented speed and accessibility, but requires **strong human intervention** in the *architecture, review, and testing* phases to **ensure quality, security, and long-term sustainability**.

## Methodology

In this section, I want to show the **analysis methodology** of studies on **AI pair programming**, first highlighting the selection criteria and then presenting a comparison between different sources.

For this analysis, sources published between 2023 and 2025 in multiple languages were examined, prioritizing quantitative and reproducible evidence. In particular:

1.  Peer-reviewed experimental studies and technical white papers with clear methodology (RCT, benchmark). These were considered Grade A evidence (high solidity, low risk of bias);
2.  Industrial case studies with real metrics on teams (Grade B if conducted internally with possible context bias);
3.  Direct developer testimonials (blogs, videos, forums) that include concrete experiments or verifiable code (Grade C as anecdotal, medium/high bias risk). For each source, we extracted details on: context and tools used, type of activity performed (e.g., new development, refactoring, bugfix, testing), objective metrics (time taken, percentage of bugs or vulnerabilities, test coverage, performance), and subjective metrics (satisfaction, cognitive load, perceived learning).

During the synthesis, evidence was cross-referenced to highlight convergences or discrepancies. For example, the results of a large corporate RCT (4,800 developers at Microsoft/Accenture, Grade A evidence) are compared with those of an RCT on experienced OSS developers (16 open-source maintainers, Grade A evidence), as well as with case studies such as the internal adoption of Copilot in a company (ZoomInfo, 400 engineers, Grade B evidence).

Individual experiences (e.g., a full-stack prototype developed entirely with AI) were included as Grade C evidence to highlight practical and cultural aspects difficult to detect from numbers alone. All sources are cited via links to the original references.

## Technical Results

### Impact on productivity and development speed (Copilot, Cursor, multi-company RCT)

Data shows that AI assistants can accelerate software development, but with important distinctions for **context** and programmer **seniority**.

*   **Multi-company RCT (Microsoft, Accenture, another multinational, 2024)**: With GitHub Copilot, **+26% tasks completed** on average, **+13.5%** weekly commits, and **+38%** in compilation frequency are observed. The study **does not detect negative impacts on quality** (bugs, review, build) → the extra speed **does not** come at the expense of functionality ([IT Revolution – study summary](https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-leaders-need-to-know/)).
*   **Accenture controlled trial (120 dev sample, 6-month duration, enterprise context, 2024)**: **+8.7%** pull requests per developer, **+15%** *merge rate*, and **+84%** successful first-time builds (minor initial friction) ([metrics summary](https://www.secondtalent.com/resources/github-copilot-statistics/); see also [GitHub × Accenture](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-in-the-enterprise-with-accenture/)).
*   **Where it accelerates most**: Repetitive/boilerplate tasks (CRUD, mapping, test scaffolding, standard integrations) and onboarding to new codebases; **less effect** on complex/novel business logic (requires human guidance and verification) ([GitHub × Accenture](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-in-the-enterprise-with-accenture/)).
*   **Junior vs. Senior**: Benefits are **more pronounced for junior profiles** (higher adoption and acceptance of suggestions); for seniors, the increase is more contained and depends on the quality of integration into the workflow ([MIT working paper – RCT](https://economics.mit.edu/sites/default/files/inline-files/draft_copilot_experiments.pdf)).

> **Context Note (Experienced OSS)**: In an independent RCT on open-source maintainers, the use of AI tools (Cursor/Claude) resulted in an **average slowdown of +19%** on 246 real tasks, **despite** the perception of *speed-up* (~–20%). Extra time spent on prompting, reviewing, and adapting to the architecture negated the gains ([METR – blog](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/); [arXiv](https://arxiv.org/abs/2507.09089); [InfoQ](https://www.infoq.com/news/2025/07/ai-productivity/)).

**Summary Table (Productivity/Speed)**

| Metric                      | Variation with AI    | Context/Source                                                                                                                                                |
| --------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tasks completed             | **+26%**             | [IT Revolution](https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-leaders-need-to-know/) |
| Weekly commits              | **+13.5%**           | [IT Revolution](https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-leaders-need-to-know/) |
| Compilation frequency       | **+38%**             | [IT Revolution](https://itrevolution.com/articles/new-research-reveals-ai-coding-assistants-boost-developer-productivity-by-26-what-it-leaders-need-to-know/) |
| PRs per developer           | **+8.7%**            | [SecondTalent – Accenture](https://www.secondtalent.com/resources/github-copilot-statistics/)                                                                 |
| Merge rate                  | **+15%**             | [SecondTalent – Accenture](https://www.secondtalent.com/resources/github-copilot-statistics/)                                                                 |
| First-attempt builds        | **+84%**             | [SecondTalent – Accenture](https://www.secondtalent.com/resources/github-copilot-statistics/)                                                                 |
| Time on complex OSS tasks   | **+19%** (slower)    | [METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)                                                                              |

### Code quality and maintainability

> **Operational Checklist & Guardrails**:
> - Enable mandatory linters + formatters (ESLint, Prettier, Black)
> - Measure churn and duplications with SonarQube or CodeClimate
> - Include planned refactoring slots in each sprint
> - Appoint code owners for critical directories to maintain consistency

When we talk about the quality of the code produced, a somewhat controversial discussion opens up: the immediate functionality of AI-generated code is often good, but **medium-term maintainability** issues emerge without disciplined programmer intervention. In terms of out-of-the-box functional correctness, several studies indicate that AI-assisted code can be just as valid as manually written code. Below are some examples from the research:

*   **Trend 2024–2025**: Analyzing internal quality and maintainability, worrying trends related to the massive use of AI emerge. An independent white paper (Coding on Copilot, GitClear 2024) analyzed millions of lines of code on GitHub to measure its evolution after Copilot's introduction. The result: code churn—the percentage of code that is modified or removed within two weeks of its creation—is sharply increasing ([