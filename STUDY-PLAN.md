# Study Plan — from zero to Claude Certified Architect

> A **6-week** plan (≈ 6–8 hrs/week). Compress to 3 weeks if you already build with LLMs; stretch to 10 if you're
> new. Every week = **learn (explainers) → build (project) → prove (drills)**. The loop is the point: you don't
> learn this by reading, you learn it by shipping something small and measuring it.

## How to use this repo each week
1. **Watch & play** the week's [interactive explainers](https://thedocwho.github.io/claude-architect-certification/illustrated/index.html) — drive every control, read the
   green takeaway, and *say the idea out loud to a 10-year-old*. If you can't, you don't have it yet.
2. **Build** the week's [project](projects/README.md) — even a tiny version. Code beats notes.
3. **Drill** the [practice scenarios](practice/README.md) for that domain; review every miss against the
   [exam traps](BLUEPRINT.md#high-frequency-exam-traps-the-distractors-that-look-smart-but-are-wrong).

---

## Week 0 — Foundations: what the API even is (1–2 evenings)
> Do **not** skip this. If "is it a CLI or an API? what's the SDK?" is fuzzy, everything later feels like magic.
> Go in this exact order:
- 🎨 [What is the Claude API?](https://thedocwho.github.io/claude-architect-certification/illustrated/api-foundations/what-is-the-api.html) — CLI vs API vs SDK, untangled. **Start here.**
- 🎨 [Same concepts, different surface](https://thedocwho.github.io/claude-architect-certification/illustrated/api-foundations/same-concepts-everywhere.html) — how this maps onto claude.ai and VS Code (Copilot Chat / Claude Code extension), if that's what you actually use day to day.
- 📋 [Getting your API key](reference/getting-started.md) — console signup, billing, storing it safely.
- 🎨 [The Messages API](https://thedocwho.github.io/claude-architect-certification/illustrated/api-foundations/messages-api.html) — your first Python call; request + response.
- 🎨 [The parameters that matter](https://thedocwho.github.io/claude-architect-certification/illustrated/api-foundations/parameters.html) · [How to read the API docs](https://thedocwho.github.io/claude-architect-certification/illustrated/api-foundations/reading-the-docs.html).
- 🎨 [model selection](https://thedocwho.github.io/claude-architect-certification/illustrated/api-foundations/model-selection.html) · [extended thinking](https://thedocwho.github.io/claude-architect-certification/illustrated/api-foundations/extended-thinking.html).
- 🏃 **Do the [hands-on Python exercises](practice/foundations-api.md)** — set up the SDK + key and actually run all 10. This is where it sticks.
- 📖 Then read the [BLUEPRINT](BLUEPRINT.md): the **five domains + weights** and the **14 traps**.
- **Outcome:** you can make an API call from memory, explain API-vs-SDK-vs-CLI, and read the docs to answer your own questions.

## Week 1 — Prompt Engineering & Structured Output (Domain 4, 20%)
- 🎨 [prompt anatomy](https://thedocwho.github.io/claude-architect-certification/illustrated/4-prompting/prompt-anatomy.html) → [few-shot](https://thedocwho.github.io/claude-architect-certification/illustrated/4-prompting/few-shot.html) → [structured output](https://thedocwho.github.io/claude-architect-certification/illustrated/4-prompting/structured-output.html) → [eval-driven](https://thedocwho.github.io/claude-architect-certification/illustrated/4-prompting/eval-driven.html).
- 🏗️ **[proj-05 — Structured Extraction](projects/proj-05-structured-extraction/README.md)**, stages 1–3 (schema, nullable, validation-retry). *Build the eval harness — you'll reuse it all month.*
- 🎯 Drills: [Domain 4 practice](practice/domain-4-prompting.md).
- **Trap focus:** nullable-not-invented · explicit criteria over adjectives · measure-before-ship.

## Week 2 — Tool Design & MCP (Domain 2, 18%)
- 🎨 [tool anatomy](https://thedocwho.github.io/claude-architect-certification/illustrated/2-tools-mcp/tool-anatomy.html) → [structured errors](https://thedocwho.github.io/claude-architect-certification/illustrated/2-tools-mcp/structured-errors.html) → [MCP architecture](https://thedocwho.github.io/claude-architect-certification/illustrated/2-tools-mcp/mcp-architecture.html).
- 🏗️ **[proj-03 — MCP Server](projects/proj-03-mcp-server/README.md)**, all stages. Publish it.
- 🎯 Drills: [Domain 2 practice](practice/domain-2-tools-mcp.md).
- **Trap focus:** the description *is* the API · structured errors + bounded retries · MCP standardises connection, not quality.

## Week 3 — Agentic Architecture (Domain 1, 27%) — *the big one*
- 🎨 [agent loop](https://thedocwho.github.io/claude-architect-certification/illustrated/1-agentic/agent-loop.html) → [workflows vs agents](https://thedocwho.github.io/claude-architect-certification/illustrated/1-agentic/workflows-vs-agents.html) → [multi-agent](https://thedocwho.github.io/claude-architect-certification/illustrated/1-agentic/orchestrator-workers.html) → [guardrails](https://thedocwho.github.io/claude-architect-certification/illustrated/1-agentic/guardrails.html).
- 🏗️ **[proj-01 — Support Agent](projects/proj-01-support-agent/README.md)**, all stages (reuse the proj-05 eval harness).
- 🎯 Drills: [Domain 1 practice](practice/domain-1-agentic.md). *Spend extra time here — it's 27%.*
- **Trap focus:** external stop conditions · simplest-thing-that-works · human-in-the-loop on irreversible actions.

## Week 4 — Agentic, part 2 + Context (Domains 1 & 5)
- 🏗️ **[proj-02 — Multi-Agent Research](projects/proj-02-multi-agent-research/README.md)** (subagents, provenance, partial failure).
- 🎨 [context window](https://thedocwho.github.io/claude-architect-certification/illustrated/5-context/context-window.html) → [prompt caching](https://thedocwho.github.io/claude-architect-certification/illustrated/5-context/prompt-caching.html) → [compaction](https://thedocwho.github.io/claude-architect-certification/illustrated/5-context/compaction.html) → [reliability](https://thedocwho.github.io/claude-architect-certification/illustrated/5-context/reliability.html).
- 🏗️ **[proj-06 — Context Engine](projects/proj-06-context-engine/README.md)**, stages 1–3.
- 🎯 Drills: [Domain 5 practice](practice/domain-5-context.md).
- **Trap focus:** partial-failure handling · progressive summarisation is lossy · escalate, don't bluff.

## Week 5 — Claude Code Configuration (Domain 3, 20%)
- 🎨 [CLAUDE.md hierarchy](https://thedocwho.github.io/claude-architect-certification/illustrated/3-claude-code/claudemd-hierarchy.html) → [Grep vs Glob](https://thedocwho.github.io/claude-architect-certification/illustrated/3-claude-code/grep-vs-glob.html) → [skills/rules/hooks](https://thedocwho.github.io/claude-architect-certification/illustrated/3-claude-code/skills-rules.html) → [headless/CI](https://thedocwho.github.io/claude-architect-certification/illustrated/3-claude-code/cicd-headless.html).
- 🏗️ **[proj-04 — Claude Code in CI/CD](projects/proj-04-claude-code-cicd/README.md)**, all stages.
- 🎯 Drills: [Domain 3 practice](practice/domain-3-claude-code.md).
- **Trap focus:** file precedence · hooks for hard guarantees · Grep≠Glob · headless flags · session isolation.

## Week 6 — Capstone + exam readiness
- 🏗️ **[Capstone — Enterprise Agent Platform](capstone/enterprise-agent-platform/README.md)**: stitch the spine
  (routing, cost, guardrails, evals, audit). You don't need all six fully built — you need the *governance* coherent.
- 🎯 Full **[mixed mock exam](practice/mock-exam.md)** under timed, closed-book conditions. Review every miss.
- 📖 Re-read the [BLUEPRINT traps](BLUEPRINT.md#high-frequency-exam-traps-the-distractors-that-look-smart-but-are-wrong)
  and the [cheatsheet](reference/cheatsheet.md) the night before.
- **Outcome:** you can narrate the capstone in 5 minutes and answer "why" for every design choice.

---

## The night-before checklist
- [ ] I can name all 5 domains **and** their weights.
- [ ] I can explain each of the **14 traps** and why the tempting answer is wrong.
- [ ] I can read the [cheatsheet](reference/cheatsheet.md) and nod at every line.
- [ ] I've done the [mock exam](practice/mock-exam.md) and reviewed misses.
- [ ] I can say, out loud, the [architect's narrative](capstone/enterprise-agent-platform/README.md#the-architects-narrative-your-interview-script).

## Tips for exam day
- It's **scenario**-based: read the scenario's *constraints* first — they decide the answer (cost limit? must be
  deterministic? irreversible action?).
- Two answers will look right; the **distractor sounds like good engineering**. Pick the one that matches the
  architect's mental model: simplest thing that works, external guardrails, measure first, engineer context,
  escalate don't bluff.
- Closed-book — so the [cheatsheet](reference/cheatsheet.md) must be in your head, not your hand.
