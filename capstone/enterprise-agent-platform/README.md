# Capstone — Enterprise Agent Platform

> **The one you lead your portfolio with.** · Touches **all five domains** · ⭐⭐⭐⭐⭐
> The six projects each prove one skill. The capstone proves **judgment**: stitching them into a single, coherent,
> production-shaped system, and making the architectural trade-offs a Claude Certified Architect is hired to make.
> This is the artifact that says *architect*, not *feature-builder*.

> 🎨 This capstone exercises every explainer in [the catalog](https://thedocwho.github.io/claude-architect-certification/illustrated/index.html). Skim the
> [exam blueprint](../../BLUEPRINT.md) before you start so each design choice maps to a domain.

## The brief
Build an **internal "AI operations" platform** for a fictional mid-size company (pick a domain you find fun:
fintech support, devtools, e-commerce, healthcare-admin). It must let non-engineers get reliable, *governed* help
from Claude across several jobs:

1. A **support-resolution agent** that handles customer issues with tools, guardrails, and escalation. *(proj-01)*
2. A **research/analysis agent** that answers broad internal questions via orchestrated subagents with provenance.
   *(proj-02)*
3. An **MCP integration layer** exposing the company's systems (orders DB, knowledge base, ticketing) as reusable
   tools. *(proj-03)*
4. A **Claude-Code-in-CI** workflow that keeps the platform's own codebase reviewed and tested. *(proj-04)*
5. A **document-intake pipeline** that structures incoming docs (invoices, forms) into the systems. *(proj-05)*
6. A **context engine** so long agent sessions stay coherent and cheap. *(proj-06)*

…all sharing **one governance spine**: model routing, cost controls, evals, guardrails, and an audit trail.

## What makes it *architect*-level (not just six apps glued together)
The grade is in the **cross-cutting decisions** — the things the exam's hardest questions probe:

| Spine concern | What you must decide & demonstrate |
|---|---|
| **Model routing** | Which jobs use Haiku vs Sonnet vs Opus, and *why* — with cost numbers. A router sends easy cases down, hard cases up. |
| **Cost control** | Prompt caching on shared prefixes; Batch API for bulk; measured $/task per workflow. |
| **Guardrails** | One consistent policy: max-turns/budget everywhere, human-in-the-loop on irreversible actions, input/output screens. |
| **Evals** | A shared eval harness; every workflow has a golden set + regression gate. No "looks better" ships. |
| **Reliability** | Uniform escalation triggers; no silent failure; partial-failure handling in the multi-agent path. |
| **Context** | Compaction + structured memory + caching so nothing dies of context overflow. |
| **Governance / audit** | Every consequential action is logged with provenance; you can answer "why did the agent do that?" |

## Deliverables
- **A running system**: one service (FastAPI/Express) + a simple web console, deployable free (Render/Fly/HF
  Spaces). It doesn't need to be big — it needs to be *coherent and governed*.
- **An architecture doc** (2–4 pages) with: a system diagram, the model-routing table, the guardrail policy, the
  eval strategy, and an **ADR** (architecture decision record) for one hard call you made (e.g. "why a workflow,
  not an agent, for intake").
- **A cost model**: $/task for each workflow, and the levers (caching, batching, routing) you pulled.
- **A 3–5 minute demo video** walking the system and one deliberate failure (a blocked refund, a flagged partial
  failure) to show the guardrails working.

## Done when
- [ ] All six workflows run through one platform with a shared governance spine.
- [ ] You can defend **every** model choice with a cost/quality reason backed by an eval.
- [ ] You can demonstrate a guardrail *stopping* something bad (over-cap refund, secret edit, silent gap).
- [ ] The architecture doc + ADR + cost model exist and are honest about trade-offs.
- [ ] A stranger can watch the demo and understand what you built and why.

## The architect's narrative (your interview script)
Be able to walk this end-to-end in 5 minutes:
> *"It's a governed AI-ops platform. Easy support cases route to Haiku, hard analysis fans out to Sonnet
> subagents with provenance; everything shares max-turn/budget caps and human approval on money-moving actions.
> Bulk intake uses the Batch API at ~half the cost; long sessions survive via compaction plus a structured memory
> note that keeps order IDs and amounts verbatim. Every workflow is gated by an eval, and every consequential
> action is audited. The one decision I'd defend hardest is using a fixed workflow — not an agent — for document
> intake, because the steps are predictable and an agent there would just add cost and failure modes."*

If you can say that and back each clause with code, you don't just pass the Claude Certified Architect exam — you
*are* one.
