# proj-06 — Long-Conversation Context Engine

> **Cross-cutting** · **Domains:** 5 (Context & Reliability, 15%) · 1 (Agentic, 27%) · ⭐⭐⭐⭐
> Most agents die a slow death by context overflow. Build the **context engine** that keeps a 100+-turn agent
> coherent and cheap: **compaction** that doesn't lose transactional data, **structured memory** that survives
> verbatim, and **prompt caching** that keeps the bill flat. This is the build that separates "I made an agent"
> from "I made an agent that runs all day."

> 🎨 Drive it first: [context window](https://thedocwho.github.io/claude-architect-certification/illustrated/5-context/context-window.html) ·
> [compaction & memory](https://thedocwho.github.io/claude-architect-certification/illustrated/5-context/compaction.html) ·
> [prompt caching](https://thedocwho.github.io/claude-architect-certification/illustrated/5-context/prompt-caching.html).

## What you'll build
A reusable context-management layer for a long-running agent (e.g. wrap your proj-01 support agent). It tracks
token usage, **compacts** old turns when the window fills, preserves **critical facts** (IDs, amounts, decisions,
open tasks) in a **structured memory note** that compaction never blurs, and **caches** the stable prefix so cost
per turn stays roughly flat as the conversation grows.

## Why it matters for the exam
Domain 5's sharpest trap is that **progressive summarisation is lossy** and silently drops precise transactional
data. You'll build the defence (structured memory + external store) and *measure* that an order number survives 80
turns. You'll also feel why "just use a bigger window" is the wrong instinct — cost, latency, and context rot.

## Stages
1. **Token accounting.** Instrument the agent to track tokens per segment (system, tools, history, output reserve)
   and warn at a threshold (e.g. 75% of the window). *Checkpoint: a live readout of window fill, like the
   explainer.*
2. **Compaction trigger.** When fill crosses the threshold, summarise the **oldest** turns into a compact note and
   replace them — keeping recent turns verbatim. *Checkpoint: a 60-turn chat compacts and keeps going without
   overflow.*
3. **Structured memory (the key part).** Maintain a schema'd scratchpad (`order_id`, `amounts`, `decisions`,
   `open_tasks`) updated each turn and **preserved verbatim** across compaction. *Checkpoint: after 80 turns the
   agent still answers "what was my refund amount?" exactly — the naïve summary path cannot.*
4. **Prompt caching.** Put system + tools + the memory note as a stable, cached prefix; only the changing user
   turn sits outside the breakpoint. *Checkpoint: cost-per-turn stays roughly flat as turns grow, instead of
   climbing.*
5. **Reliability check.** Add an escalation when memory is at risk of loss or the agent's confidence drops after a
   compaction — degrade explicitly rather than answering from a blurred summary.

## Make it better
- (stretch) Swap structured memory for an **external store + retrieval** (fetch facts on demand) and compare.
- (stretch) A/B the **naïve summarisation** vs **structured memory** strategies on a "recall the exact value"
  eval and chart the accuracy gap.
- (stretch) Add a "session resume" feature: persist memory so an agent can pick up a conversation after a restart.

## Done when
- [ ] A 100-turn session never overflows the window and stays coherent.
- [ ] An exact transactional value (order #, dollar amount) is recalled correctly **after** compaction.
- [ ] Cost-per-turn is roughly flat thanks to caching, with numbers to show it.
- [ ] You can demo the naïve-summary failure side-by-side with your structured-memory fix.

## Architect's Decision Lens
1. **Problem:** keep a long-running agent coherent and affordable past the context window.
2. **Is "bigger window" right?** No — it's costlier, slower, and still rots. Engineer the context instead.
3. **Design:** compaction + structured memory note + cached stable prefix.
4. **Guardrails:** threshold trigger; escalate on at-risk memory.
5. **Evals:** exact-recall-after-compaction test; cost-per-turn curve.
6. **Cost:** caching keeps per-turn flat; compaction caps growth.
7. **Reliability:** never answer from a blurred summary on precise data; degrade explicitly.
8. **Build vs buy:** the loop is the SDK; *your* memory + compaction strategy is the value.

## Concepts you must be able to explain
What lives in the context window and why output needs reserved space; context rot; why progressive summarisation
is lossy and what to protect from it; structured memory vs external retrieval; how caching keeps per-turn cost
flat and the stable-prefix-first rule; when to escalate after a lossy compaction.

**Résumé line:** *Built a context-management layer for long-running Claude agents combining threshold-triggered
compaction, verbatim structured memory for transactional data, and prompt caching — sustaining coherent 100+-turn
sessions at roughly flat cost-per-turn.*
