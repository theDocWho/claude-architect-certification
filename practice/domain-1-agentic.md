# Drill — Domain 1: Agentic Architecture & Orchestration (27%)

Highest weight. Read each scenario's constraints first. Answers + "why wrong" at the bottom.

---

**Q1.** A team's customer-support agent occasionally runs for dozens of turns and burns large token bills before
returning an answer. What's the *most important* fix?

- A. Switch from Sonnet to Opus so it reasons better and finishes sooner.
- B. Add an external **max-turns and token-budget cap** the model can't override.
- C. Add a strong system-prompt instruction: "always finish in under 5 turns."
- D. Increase `max_tokens` so the final answer isn't truncated.

---

**Q2.** You're asked to build a system that classifies an incoming email as refund / tech-support / sales and
routes it to the right canned workflow. A teammate proposes an autonomous agent with tools. Best response?

- A. Agree — autonomous agents are the most capable choice.
- B. Use a **router workflow** (classify → dispatch); the steps are predictable, so an agent adds cost and risk
  for no benefit.
- C. Use a multi-agent system with one agent per category.
- D. Use an evaluator–optimizer loop.

---

**Q3.** In your multi-agent research system, one subagent (the "verify" worker) times out. The lead has results
from the other three. What should the lead do?

- A. Synthesize the final answer from the three successful workers and return it.
- B. Retry the failed worker within a bounded limit; if still failing, **flag the affected claims as unverified**
  in the output.
- C. Abort the entire run and return an error.
- D. Substitute the verify worker's result with the analyze worker's output.

---

**Q4.** Which action in a support agent most clearly requires a **human-in-the-loop** checkpoint?

- A. Looking up an order's status.
- B. Summarizing the conversation.
- C. **Issuing a $400 refund** when the policy cap is $200.
- D. Classifying the customer's intent.

---

**Q5.** A task is "research and write a competitive analysis across 8 products," and a single agent keeps
overflowing its context window with raw search results. Why does splitting into subagents help?

- A. Because more agents are inherently smarter.
- B. Because each subagent gets its **own context window** and returns only a compressed summary — you're buying
  parallel **context budget**, not extra intelligence.
- C. Because subagents are cheaper than one agent.
- D. Because it removes the need for guardrails.

---

**Q6.** You're choosing between a fixed workflow and an autonomous agent for a feature. Which fact most argues for
an **autonomous agent**?

- A. The task has clean, predictable, orderable steps.
- B. Latency and cost must be minimized.
- C. **The path can't be scripted in advance** — the needed steps depend on what's discovered at run time.
- D. The output must match a strict JSON schema.

---

## Answers

**Q1 — B.** Runaway loops need an *external* cap (turns + budget) the model can't talk past. **A** may not stop
the loop and costs more. **C** is a prompt instruction — probabilistic, not a guarantee (trap #1/#7). **D** fixes
truncation, not loop length. *(Trap: "the model decides when to stop.")*

**Q2 — B.** Predictable buckets → routing workflow; an agent adds nondeterminism, cost, and failure surface for
no gain. **A/C/D** all over-engineer. *(Trap: simplest thing that works; "spin up a swarm.")*

**Q3 — B.** Reliability = account for *every* spoke. Bounded retry, then **explicitly** flag the gap. **A** ships
a silent, unverified answer (the classic wrong answer). **C** throws away good work. **D** fabricates provenance.
*(Trap: synthesize over a dead subagent.)*

**Q4 — C.** Irreversible, money-moving, *and* over policy authority → human approval. The others are read-only or
internal. *(Trap: no human on consequential actions.)*

**Q5 — B.** The real win is **context budget** spent in parallel + compressed summaries back to the lead — not
"more brains." **A/C/D** are myths. *(Trap: "more agents = better.")*

**Q6 — C.** Autonomy earns its keep only when the steps can't be scripted. **A/B/D** all point *toward* a
workflow. *(Trap: reaching for an agent when a workflow fits.)*
