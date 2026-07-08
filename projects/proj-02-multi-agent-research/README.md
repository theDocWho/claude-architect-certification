# proj-02 — Multi-Agent Research System

> **Exam scenario:** Multi-Agent Research System · **Domains:** 1 (Agentic, 27%) · 5 (Context, 15%) · ⭐⭐⭐⭐
> A **lead** agent that decomposes a research question, spawns specialised **subagents** (search → analyze →
> verify → write), each with its **own context window**, then synthesises their reports — **with provenance** and
> **partial-failure handling**. This is the build that proves you understand orchestration, not just prompting.

> 🎨 Drive it first: [multi-agent orchestration](https://thedocwho.github.io/claude-architect-certification/illustrated/1-agentic/orchestrator-workers.html) ·
> [workflows vs agents](https://thedocwho.github.io/claude-architect-certification/illustrated/1-agentic/workflows-vs-agents.html) ·
> [the context window](https://thedocwho.github.io/claude-architect-certification/illustrated/5-context/context-window.html).

## What you'll build
An orchestrator that takes a question like *"Compare the 2025 EU and US AI safety regulations and summarise the
practical differences for a startup"* and runs a **hub-and-spoke** flow: the lead plans subtasks, each subagent
works in isolation and returns a **compressed summary with source IDs**, and the lead synthesises a final report
where **every claim is traceable** — and clearly flags anything a failed subagent left unverified.

## Why it matters for the exam
This is the scenario that most directly tests Domain 1's hardest ideas: **task decomposition**, **subagent
spawning**, **context isolation/passing**, and **partial failure**. The exam's favourite trap — a lead that
synthesises anyway when a subagent dies — is exactly what you'll build defences against.

## Stages
1. **Lead decomposition.** Lead agent turns the question into 3–5 concrete subtasks (a plan). Use structured
   output so the plan is machine-readable. *Checkpoint: a vague question yields a sensible, typed subtask list.*
2. **Subagents with isolated context.** Run each subtask as its own agent (fresh context). Pass it **only** its
   task + minimal context — not the whole history. Each returns a **short summary + source IDs**, never its raw
   firehose. *Checkpoint: the lead never sees raw search dumps, only tidy reports.*
3. **Synthesis with provenance.** Lead merges the reports into one answer, carrying source IDs so each claim is
   attributable. *Checkpoint: every sentence in the final report cites which subagent/source it came from.*
4. **Partial-failure handling.** Kill a subagent (simulate a search timeout). The lead must **detect** the gap,
   **retry or fall back**, and if still missing, **flag the affected claims as unverified** — not hide it.
5. **Cost & latency.** Run independent subagents **in parallel**; compare wall-clock and token cost vs a single
   mega-agent doing it all in one window.

## Make it better
- (cheap) Subagents on **Haiku/Sonnet**, lead on **Sonnet/Opus** — match model to job.
- (stretch) Add an **evaluator** subagent (evaluator–optimizer) that critiques the draft before finalising.
- (stretch) Persist each run's plan + reports so a run is **resumable** after a crash.

## Done when
- [ ] A single question fans out to isolated subagents and returns one synthesised, **cited** report.
- [ ] Killing a subagent produces an **explicitly flagged** gap, never a silently incomplete answer.
- [ ] You can show the multi-agent run beats one-big-agent on a broad question (quality and/or context budget).
- [ ] You can explain *why* you split: context budget, not "more brains."

## Architect's Decision Lens
1. **Problem:** answer broad research questions that overflow a single context window.
2. **Is multi-agent right?** Only because the task is **broad + parallelisable**; a linear task would use a chain.
3. **Design:** hub-and-spoke; lead plans + synthesises, subagents work in isolation.
4. **Guardrails:** per-subagent turn/budget caps; bounded retries on failure.
5. **Evals:** rubric-graded report quality + a provenance check (every claim traceable).
6. **Cost:** parallelism for latency; cheaper models on subagents; cache shared instructions.
7. **Reliability:** detect & flag partial failures; never synthesise over a silent gap.
8. **Build vs buy:** Agent SDK for the loops; *your* orchestration + provenance + failure logic is the value.

## Concepts you must be able to explain
Why isolation (context budget) is the real reason to go multi-agent; how context is *passed* (minimal, not the
whole history); how provenance survives synthesis; the three hazards (context passing, partial failure,
provenance) and your defence for each; when a chain would have been the better choice.

**Résumé line:** *Designed a hub-and-spoke multi-agent research system with context-isolated subagents, source
provenance through synthesis, and explicit partial-failure handling; parallelised subagents to cut latency while
staying within per-agent context budgets.*
