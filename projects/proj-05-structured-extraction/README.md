# proj-05 — Structured Data Extraction Pipeline

> **Exam scenario:** Structured Data Extraction · **Domain:** 4 (Prompt Eng & Structured Output, 20%) · ⭐⭐⭐
> Turn a pile of messy, real-world documents (invoices, resumes, contracts, support emails) into **clean,
> schema-valid JSON** — at scale, cheaply, and **honestly** (null where the data genuinely isn't there). Ships
> with a **validation-retry loop**, **batch processing**, and a **reusable eval harness** you'll reuse in every
> later project.

> 🎨 Drive it first: [structured output](https://thedocwho.github.io/claude-architect-certification/illustrated/4-prompting/structured-output.html) ·
> [eval-driven prompting](https://thedocwho.github.io/claude-architect-certification/illustrated/4-prompting/eval-driven.html) ·
> [few-shot](https://thedocwho.github.io/claude-architect-certification/illustrated/4-prompting/few-shot.html) ·
> [model selection](https://thedocwho.github.io/claude-architect-certification/illustrated/api-foundations/model-selection.html).

## What you'll build
A pipeline that takes a folder of unstructured documents and emits one JSON record per doc matching a fixed
schema, using **tool_use as the output contract**. It handles **missing fields as explicit null**, runs a
**bounded validation-retry loop** on schema failures, processes thousands of docs via the **Message Batches API**,
and reports accuracy against a **golden set** with an **LLM-as-judge** grader.

## Why it matters for the exam
This is Domain 4's exact scenario. The traps it drills: **nullable vs required** (don't force fabrication),
**validation-retry** (not "ask nicely for JSON"), **batch vs real-time** at scale, and **measure-before-ship**
evals. The eval harness you build here is reused by projects 01, 02, and 06.

## Stages
1. **Schema as a tool.** Define the target schema as a tool's `input_schema`; mark genuinely-optional fields
   **nullable** with descriptions of when null applies. *Checkpoint: a complete doc extracts cleanly with correct
   types (numbers as numbers, not "$1,200" strings).*
2. **Nullable, not invented.** Feed a doc that's **missing** a field; assert the output is `null`, not a plausible
   guess. *Checkpoint: the missing due-date becomes `null`, every time.*
3. **Validation-retry loop.** Validate each output against the schema; on failure return a precise
   `VALIDATION` error and let the model fix it — **capped at 3 tries**. *Checkpoint: a garbled OCR doc either
   self-corrects or is flagged `needs_human_review`, never confident garbage.*
4. **Batch at scale.** Move bulk extraction to the **Message Batches API** (async, ~50% cheaper). Compare cost +
   throughput vs a real-time loop. *Checkpoint: 1,000 docs processed for a fraction of the per-call price.*
5. **Eval harness.** A golden set (with edge cases: missing fields, multi-value, garbled) + an LLM-as-judge
   grader + a metric and bar. Wire it as a **regression gate**. *Checkpoint: a prompt change that breaks an edge
   case is caught by a falling score.*

## Make it better
- (cheap) Run the bulk on **Haiku**; escalate only low-confidence docs to Sonnet (router pattern).
- (stretch) Add a **verification pass** (evaluator–optimizer) for accuracy-critical fields.
- (stretch) Package the eval harness as a small library and reuse it in proj-01/02/06.

## Done when
- [ ] Clean docs → schema-valid JSON with correct types; missing fields → explicit `null`.
- [ ] Validation-retry recovers malformed output within the cap, or flags for human review.
- [ ] Bulk runs go through the Batch API with a documented cost/throughput win.
- [ ] The eval reports accuracy on a golden set and **blocks** a regression.

## Architect's Decision Lens
1. **Problem:** structure thousands of messy documents reliably and cheaply.
2. **Is an LLM right?** Regex/templates break on format variation; an LLM + schema contract generalises.
3. **Design:** tool_use schema contract + validation-retry + batch for volume.
4. **Guardrails:** bounded retries; `needs_human_review` flag for low confidence; nullable fields.
5. **Evals:** golden set with edge cases; LLM-as-judge; regression gate.
6. **Cost:** Batch API + Haiku routing + caching the schema/instructions.
7. **Reliability:** never emit a fabricated value; flag uncertainty explicitly.
8. **Build vs buy:** SDK + Batch API are the platform; *your* schema design + eval harness is the value.

## Concepts you must be able to explain
Why tool_use beats "please output JSON"; nullable-not-invented and why required-everything forces hallucination;
the validation-retry loop and its cap; when to choose the Batch API; what an LLM-as-judge grader is and why edge
cases must stay in the golden set; how a higher average can still be a regression.

**Résumé line:** *Built a document-extraction pipeline using tool_use schema contracts, nullable-field handling,
a bounded validation-retry loop, and the Message Batches API (~50% cost reduction at scale), gated by an
LLM-as-judge eval harness.*
