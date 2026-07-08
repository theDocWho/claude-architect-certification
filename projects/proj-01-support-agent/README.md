# proj-01 — Customer-Support Resolution Agent

> **Exam scenario:** Customer Support Resolution Agent · **Domains:** 1 (Agentic, 27%) · 2 (Tools/MCP, 18%) · 5 (Reliability, 15%) · ⭐⭐⭐
> A tool-using support agent that resolves real issues (order status, returns, billing) end-to-end — and, just
> as importantly, **knows when to stop and escalate**. This is the single most representative production-agent
> build, and the one interviewers probe hardest: *how do you keep it from doing something dumb?*

> 🎨 Drive the concepts first: [agent loop](https://thedocwho.github.io/claude-architect-certification/illustrated/1-agentic/agent-loop.html) ·
> [tool anatomy](https://thedocwho.github.io/claude-architect-certification/illustrated/2-tools-mcp/tool-anatomy.html) ·
> [guardrails](https://thedocwho.github.io/claude-architect-certification/illustrated/1-agentic/guardrails.html) ·
> [reliability & escalation](https://thedocwho.github.io/claude-architect-certification/illustrated/5-context/reliability.html).

## What you'll build
A small support agent (Claude Agent SDK or a hand-rolled loop on the Messages API) with **3–5 real tools**
(`get_order_status`, `start_return`, `issue_refund`, `lookup_account`), wrapped in **guardrails** (max turns,
refund cap, human approval on irreversible actions) and **explicit escalation**. Ships with a tiny chat UI and a
golden-set eval that measures first-contact resolution.

## Why it matters for the exam
Drills the highest-weight domain end-to-end: the **loop**, **tool design** (descriptions + nullable fields +
structured errors), **stop conditions / human-in-the-loop**, and **escalation triggers**. The exam's wrong
answers here are "let the model decide when to stop" and "just retry" — you'll build the right way and feel why.

## Stages
1. **Define the tools well.** Write 3–5 tools with sharp descriptions, typed `input_schema`, required-vs-nullable
   fields, and **structured errors** (`errorCategory`, `isRetryable`, human message). Back them with a fake
   in-memory "orders" DB. *Checkpoint: the model calls the right tool with clean args, unprompted.*
2. **Build the loop.** Wire model turn → execute tool → append `tool_result` → stop check. Cap it: **max turns**
   + a **token budget**. *Checkpoint: a multi-tool question ("where's #4471 and can I cancel?") resolves in one
   session and the loop always terminates.*
3. **Add guardrails.** Refund **policy cap** ($200); **human approval** before `issue_refund`; an input check that
   rejects off-topic / injection attempts. *Checkpoint: a $5,000 refund request is blocked and escalated, not
   issued.*
4. **Escalation & graceful degradation.** Triggers for exceeds-authority, repeated tool failure, legal/safety,
   low confidence. On a DB outage it degrades explicitly ("can't reach records right now") instead of guessing.
5. **Eval it.** A 25–40 case golden set tagged by intent; measure **first-contact resolution %** and
   **incorrect-action rate**. Add a case that *should* escalate and assert it does.

## Make it better
- (cheap) Route easy intents to **Haiku**, hard ones to **Sonnet** — log the cost delta.
- (cheap) **Prompt-cache** the system prompt + tool defs across turns.
- (stretch) Expose the tools via your **proj-03 MCP server** instead of inline definitions.
- (stretch) Add a supervisor "output guardrail" pass that screens replies before they reach the user.

## Done when
- [ ] Resolves order-status, return, and billing questions end-to-end with correct tool calls.
- [ ] **Never** issues a refund over the cap or without the approval step; both paths are tested.
- [ ] Always terminates (max-turns/budget) and **escalates** on the right triggers.
- [ ] Eval reports first-contact resolution ≥ 80% on your set, and you can narrate one failure case.

## Architect's Decision Lens (fill this before coding)
1. **Problem:** resolve common support issues without a human for the easy 80%.
2. **Is an agent even right?** A fixed FAQ bot can't take *actions* (refunds/returns); a free agent is risky.
   **A bounded tool-using agent with human checkpoints** is the justified middle.
3. **Design:** agent loop + 3–5 tools; route by intent; human-in-the-loop on money-moving actions.
4. **Guardrails:** max turns, token budget, refund cap, approval gate, input/output screens.
5. **Evals:** golden set by intent; metrics = resolution % + incorrect-action rate (the costly failure).
6. **Cost:** Haiku for triage/easy, Sonnet for hard; cache system+tools.
7. **Reliability:** explicit escalation + graceful degradation on tool outage; no silent failure.
8. **Build vs buy:** leverage the Agent SDK loop; *your* logic is the guardrails + escalation — that's the story.

## Concepts you must be able to explain
Where the model stops and the harness starts; why the description is the API; required-vs-nullable; why "the
model decides when to stop" isn't a stop condition; the difference between retry, degrade, and escalate; how you
proved resolution rate instead of guessing it.

**Résumé line:** *Built a production customer-support agent (Claude Agent SDK) with tool-use, policy guardrails,
human-in-the-loop approval, and explicit escalation; reached 80%+ first-contact resolution on an evaluated golden
set.*
