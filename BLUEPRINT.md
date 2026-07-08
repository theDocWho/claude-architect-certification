# Exam Blueprint — Claude Certified Architect (Foundations)

> The map. Everything in this repo is built against this blueprint. Read it once up front, and again the night
> before the exam.

## What the exam is

- **Name:** Claude Certified Architect — Foundations (CCA-F), Anthropic's first official technical certification
  (launched **March 12, 2026**).
- **Format:** proctored, **60 multiple-choice questions** (one correct answer + three distractors), embedded in
  **scenario** contexts. **Closed-book, no AI assistance.**
- **Scenarios:** you get **4 randomly drawn from a pool of 6** (below). Questions live *inside* a scenario.
- **What it certifies:** that you can **design and ship production-grade Claude applications at enterprise
  scale** — across the Claude API, Claude Agent SDK, Claude Code, and MCP.

## The five domains (and their weights)

| # | Domain | Weight | Why it matters | Our explainers |
|---|--------|:---:|---|---|
| 1 | **Agentic Architecture & Orchestration** | **27%** | Breaks the most things in production: loops, orchestration, subagents, stop conditions. | [agent loop](https://thedocwho.github.io/claude-architect-certification/illustrated/1-agentic/agent-loop.html) · [workflows vs agents](https://thedocwho.github.io/claude-architect-certification/illustrated/1-agentic/workflows-vs-agents.html) · [multi-agent](https://thedocwho.github.io/claude-architect-certification/illustrated/1-agentic/orchestrator-workers.html) · [guardrails](https://thedocwho.github.io/claude-architect-certification/illustrated/1-agentic/guardrails.html) |
| 3 | **Claude Code Configuration & Workflows** | **20%** | The most config-heavy domain — you know where files go, or you don't. | [CLAUDE.md hierarchy](https://thedocwho.github.io/claude-architect-certification/illustrated/3-claude-code/claudemd-hierarchy.html) · [Grep vs Glob](https://thedocwho.github.io/claude-architect-certification/illustrated/3-claude-code/grep-vs-glob.html) · [skills/rules/hooks](https://thedocwho.github.io/claude-architect-certification/illustrated/3-claude-code/skills-rules.html) · [headless/CI](https://thedocwho.github.io/claude-architect-certification/illustrated/3-claude-code/cicd-headless.html) |
| 4 | **Prompt Engineering & Structured Output** | **20%** | Where wrong answers *sound* like good engineering. | [prompt anatomy](https://thedocwho.github.io/claude-architect-certification/illustrated/4-prompting/prompt-anatomy.html) · [few-shot](https://thedocwho.github.io/claude-architect-certification/illustrated/4-prompting/few-shot.html) · [structured output](https://thedocwho.github.io/claude-architect-certification/illustrated/4-prompting/structured-output.html) · [eval-driven](https://thedocwho.github.io/claude-architect-certification/illustrated/4-prompting/eval-driven.html) |
| 2 | **Tool Design & MCP Integration** | **18%** | Overlooked by almost everyone; tool descriptions matter more than people think. | [tool anatomy](https://thedocwho.github.io/claude-architect-certification/illustrated/2-tools-mcp/tool-anatomy.html) · [structured errors](https://thedocwho.github.io/claude-architect-certification/illustrated/2-tools-mcp/structured-errors.html) · [MCP architecture](https://thedocwho.github.io/claude-architect-certification/illustrated/2-tools-mcp/mcp-architecture.html) |
| 5 | **Context Management & Reliability** | **15%** | Smallest weight, but failures here cascade into every other domain. | [context window](https://thedocwho.github.io/claude-architect-certification/illustrated/5-context/context-window.html) · [prompt caching](https://thedocwho.github.io/claude-architect-certification/illustrated/5-context/prompt-caching.html) · [compaction](https://thedocwho.github.io/claude-architect-certification/illustrated/5-context/compaction.html) · [reliability](https://thedocwho.github.io/claude-architect-certification/illustrated/5-context/reliability.html) |

> Study order ≠ weight order. We sequence **Foundations → 4 → 2 → 1 → 3 → 5** so each domain builds on the last
> (you need prompts + tools before agents make sense). The catalog's Next → arrows follow this path.

## The six scenarios (you'll see four)

| Scenario | Core skill | Our project |
|---|---|---|
| **Customer Support Resolution Agent** | tool-using agent, 80%+ first-contact resolution, escalation points | [proj-01](projects/proj-01-support-agent/README.md) |
| **Multi-Agent Research System** | subagent coordination, context passing, partial failures | [proj-02](projects/proj-02-multi-agent-research/README.md) |
| **Developer Productivity Tools** | built-in tools (Read/Write/Bash/Grep/Glob) + MCP integration | [proj-03](projects/proj-03-mcp-server/README.md) |
| **Code Generation with Claude Code** | slash commands, CLAUDE.md, when plan mode helps | [proj-04](projects/proj-04-claude-code-cicd/README.md) |
| **Claude Code in CI/CD** | `-p`, `--output-format json`, session isolation | [proj-04](projects/proj-04-claude-code-cicd/README.md) |
| **Structured Data Extraction** | JSON schemas, nullable fields, batch processing | [proj-05](projects/proj-05-structured-extraction/README.md) |

## High-frequency "exam traps" (the distractors that look smart but are wrong)

Each of these is a wrong answer the exam loves. Know why it's wrong cold:

1. **"The model decides when to stop."** Not a stop condition — that's the thing you guard against. Need an
   *external* cap (max turns + budget). → Domain 1
2. **"Spin up a multi-agent swarm"** for a task that's really classify-then-answer. Down-scope: routing/chain
   beats an agent when steps are predictable. → Domain 1
3. **"More agents = better."** Multi-agent adds coordination cost + failure modes; use it only for broad,
   parallel work. A lead that ignores a dead subagent is wrong. → Domain 1
4. **"Add more tools / switch models"** when a tool is misused. Almost always the fix is a **better description /
   schema**. → Domain 2
5. **Mark everything `required`.** Forces the model to fabricate values it doesn't have. Use **nullable**. → Domains 2 & 4
6. **Return a raw stack trace / "failed".** The agent can't tell retry from give-up. Use
   `errorCategory` + `isRetryable` + message, in a **bounded** retry loop. → Domain 2
7. **Put a hard guarantee in a prompt/skill.** Probabilistic. "Always/must/block" → **hook** (deterministic). → Domain 3
8. **Confuse Grep and Glob.** Grep = file *contents*; Glob = file *names*. "Where is `login()` defined" = Grep. → Domain 3
9. **"Just run interactive Claude in CI."** No human to answer prompts. Use headless `-p` + `--output-format json`. → Domain 3
10. **"Be more detailed/professional."** Vague, unmeasurable. Use **explicit, checkable criteria** + XML tags. → Domain 4
11. **"Looks better, ship it."** Always measure with an **eval** first; a higher average that breaks an edge case
    is still a regression. → Domain 4
12. **"Use the biggest context window / most powerful model."** Costlier, slower, and big windows still rot.
    Engineer context; route to the cheapest capable model. → Domains 5 & Foundations
13. **"Just summarise everything"** to manage long context. Progressive summarisation is **lossy** — it drops
    exact transactional data. Keep IDs/amounts in **structured memory**. → Domain 5
14. **"Keep retrying until it works."** When the situation exceeds authority / is high-stakes, **escalate**.
    Silent failure is the cardinal sin. → Domain 5

## The architect's mental model (one paragraph)

Start with the **simplest thing that works** (a prompt, then a workflow, only then an agent). Make every tool's
**description the contract**, fail with **structured errors**, and let the agent recover in **bounded** loops.
Put **external guardrails** on every loop and a **human** on every irreversible action. **Measure** with evals
before you change anything. **Engineer the context** (relevant retrieval, caching, compaction, structured memory)
instead of buying a bigger window. **Route** work to the cheapest capable model. And when in doubt, **escalate
explicitly** rather than fail silently. That paragraph is, more or less, the answer key.

---
*Sources for the exam structure: Anthropic certification announcement (March 2026); domain weightings and
scenario pool as reported by [the-ai-corner.com](https://www.the-ai-corner.com/p/claude-certified-architect-curriculum-2026)
and [dev.to/aws-builders](https://dev.to/aws-builders/the-claude-certified-architect-exam-5-domains-6-scenarios-and-everything-you-need-to-know-4le3).
Always confirm current details on [Anthropic's official certification page](https://www.anthropic.com/) before
booking.*
