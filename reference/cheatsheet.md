# Cheatsheet — the night-before, one-page recall

> Closed-book exam → this lives in your **head**. If any line makes you pause, re-drive the linked explainer.

## Domains & weights (memorize)
**Agentic 27% · Claude Code 20% · Prompting 20% · Tools/MCP 18% · Context 15%.**

## The architect's reflexes
- **Simplest thing that works:** prompt → workflow → agent. Autonomy only when steps can't be scripted.
- **Description is the API.** Bad tool use → fix the words/schema, not the model.
- **Nullable, not invented.** Optional/unknown field → `["type","null"]` + "null when…". Never all-`required`.
- **Structured errors:** `errorCategory` + `isRetryable` + human message, in a **bounded** retry loop.
- **External guardrails on every loop:** max turns + token budget the model can't override.
- **Human-in-the-loop** on irreversible/over-authority actions.
- **Measure first:** eval (golden set + grader + bar + regression gate) before any prompt/model change.
- **Engineer context, don't buy a bigger window:** relevant retrieval, caching, compaction, structured memory.
- **Route to the cheapest capable model.** Haiku (volume) · Sonnet (default agents/coding) · Opus (hard/novel).
- **Escalate, don't bluff.** Silent failure is the cardinal sin; propagate `partial`/`failed` status.

## Domain 1 — Agentic
- Loop = model turn → **your harness** runs tool → append `tool_result` → stop check. Model only *requests*.
- Patterns: chaining · routing · parallelization · orchestrator–workers · evaluator–optimizer · autonomous agent.
- Multi-agent = lead + isolated subagents → compressed summaries + **provenance**; handle **partial failure**.
- Stop conditions are **external** (turns/budget); the model finishing is the happy path, not the safety net.

## Domain 2 — Tools & MCP
- Tool = `name` + **`description`** + `input_schema` (+ your code the model never sees).
- MCP = "USB-C for AI": **host** (app) / **client** (connector) / **server** (reusable integration).
- Server exposes **tools** (model-controlled) · **resources** (app-controlled) · **prompts** (user-controlled).
- Transport: **stdio** (local) vs **streamable HTTP** (remote/auth). MCP standardises *connection*, not *quality*.

## Domain 3 — Claude Code
- CLAUDE.md hierarchy: **user (`~/.claude`) → project (committed) → directory → local (git-ignored)**; specific wins, files **add to** the stack; `@imports`.
- **Grep = file contents** · **Glob = file names.** "Where is `x()` defined" → Grep. "All `*.test.ts`" → Glob.
- Built-ins: Read · Write · Edit · Bash · Grep · Glob. Don't reimplement search/read with Bash `find`/`grep`/`cat`.
- **Rules** (path-scoped) · **Skills** (model invokes; `allowed-tools`, `context: fork`) · **Hooks** (deterministic, event-driven). "Must/always/block" → **hook**.
- Headless: `claude -p "…" --output-format json --permission-mode plan`. **Session isolation** = fresh, reproducible. Review jobs = read-only.

## Domain 4 — Prompting & structured output
- Structure: **role (system)** → **explicit criteria** (not adjectives) → **XML-tagged context** (long docs *before* the question) → **few-shot** (2–5, edge cases, consistent) → **prefill**.
- Reliable JSON = **tool_use schema contract** + nullable fields + **validation-retry** (bounded).
- Bulk = **Message Batches API** (~50% cheaper, async). Accuracy-critical = add a **verification pass**.
- Eval = golden set (with edge cases) + grader (exact / code / **LLM-as-judge**) + metric/bar + regression gate. Higher average that breaks a case = **regression**.

## Domain 5 — Context & reliability
- Window holds: system + tools + history + retrieved docs + **reserved output**. Stuffing → cost, latency, **context rot**.
- **Prompt caching:** stable prefix **first** (`cache_control`); write once (~125%), read many (~10%); mind the TTL (~5 min).
- **Compaction is lossy** — protect transactional facts (IDs, amounts, decisions) in **structured memory** / external store; summarise only narrative.
- **Escalation triggers:** exceeds authority · low confidence · repeated tool failure · high stakes · guardrail tripped. Degrade **explicitly**.

## Models (Foundations)
- **Haiku** = fast/cheap, high volume, simple tasks. **Sonnet** = balanced default (agents/coding/RAG). **Opus** = deepest reasoning, hard/novel/high-stakes. **Route**, don't default to biggest. **Extended thinking** for hard multi-step tasks; size with evals.

## API basics
- Everything is `/v1/messages`: `model`, top-level `system`, alternating `user`/`assistant` `messages[]`, `max_tokens`. **Stateless** — you resend the whole history each turn (why long chats fill the window).
