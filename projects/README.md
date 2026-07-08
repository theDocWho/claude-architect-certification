# Projects — build the portfolio that proves you're an architect

The exam tests whether you can **design and ship production Claude systems**. These six builds are how you turn
that from theory into a résumé. Each one:

- maps to one of the exam's **six scenarios** and reinforces the matching **domain(s)**,
- is **buildable on free / low-cost tiers** (Anthropic API has pay-as-you-go; Haiku is cheap — every brief notes
  how to keep spend near-zero),
- ends with a **"Done when"** checklist and a **résumé line** you can actually use,
- and produces a public artifact (repo + short demo) you can link from LinkedIn.

> Do them **in order** — each reuses skills from the last. By project 6 you've touched all five domains twice.

| # | Project | Exam scenario | Domains | Résumé-worthy because… |
|---|---------|---------------|---------|------------------------|
| [01](proj-01-support-agent/README.md) | **Customer-Support Resolution Agent** | Customer Support | 1, 2, 5 | a tool-using agent with guardrails + escalation — the canonical production agent |
| [02](proj-02-multi-agent-research/README.md) | **Multi-Agent Research System** | Multi-Agent Research | 1, 5 | orchestrator + subagents with context isolation & partial-failure handling |
| [03](proj-03-mcp-server/README.md) | **Custom MCP Server** | Developer Productivity Tools | 2 | publishable MCP server other people's Claude can plug into |
| [04](proj-04-claude-code-cicd/README.md) | **Claude Code in CI/CD** | Claude Code in CI/CD | 3 | automated PR review + test-gen GitHub Action; team-level config |
| [05](proj-05-structured-extraction/README.md) | **Structured Data Extraction Pipeline** | Structured Data Extraction | 4 | schema-locked, batch-scaled extraction with nullable handling + evals |
| [06](proj-06-context-engine/README.md) | **Long-Conversation Context Engine** | (cross-cutting) | 5, 1 | compaction + memory + caching that survives 100-turn sessions |

## The capstone

Once the six are done, the [**Enterprise Agent Platform**](../capstone/enterprise-agent-platform/README.md)
stitches them into one coherent system — the single project that demonstrates *architect*-level judgment, not
just feature-building. This is the one you lead your portfolio with.

## How each brief is structured (and why)

Every brief follows the same shape so you build the architect's *habit of thought*:

1. **What you'll build** — the deliverable in two sentences.
2. **Why it matters for the exam** — the exact domain skills + traps it drills.
3. **Stages** — incremental milestones; each one runs before you move on.
4. **Make it better** — stretch goals once the core works.
5. **Done when** — the checklist that defines "shippable."
6. **Architect's Decision Lens** — the eight questions a certified architect answers *before* writing code
   (problem → is an agent even right? → design → guardrails → evals → cost → reliability → build-vs-buy).
7. **Concepts you must be able to explain** — your interview/exam self-test.

## Free-but-capable stack (shared across projects)

| Need | Use |
|------|-----|
| Model | **Claude Haiku** for cheap/volume, **Sonnet** for agents/coding; Opus only for hard design |
| SDK | the official **Anthropic SDK** (Python or TS) + the **Claude Agent SDK** for agents |
| Cost control | **prompt caching** on stable prefixes, **Message Batches API** for bulk, route easy cases to Haiku |
| Tools/integrations | **MCP** servers (build your own in proj-03) |
| Eval | a small **golden set** + **LLM-as-judge** grader (proj-05 builds the reusable harness) |
| Hosting a demo | a single FastAPI/Express service + a tiny web UI; deploy free on Render/Fly/HF Spaces |
