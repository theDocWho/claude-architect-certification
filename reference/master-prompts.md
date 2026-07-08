# Master Prompts — one reusable scaffold per domain

Copy-paste starting points that already bake in the architect's reflexes. Use them to kick off each project, or
to self-quiz ("which guardrail did this prompt skip?").

---

## 1 · Agentic — bounded tool-using agent (system prompt)

```
You are a {role} agent. Resolve the user's request using the provided tools.

Rules of operation:
- Use the simplest path: answer directly if you can; only call a tool when you need its result.
- You may take at most {MAX_TURNS} tool turns. If you cannot finish, summarize progress and escalate.
- NEVER take an irreversible or over-authority action (e.g. refund > ${CAP}, account deletion) without
  explicit human approval — request it and stop.
- If a tool returns isRetryable=true, retry up to {MAX_RETRIES}; if isRetryable=false, do not retry —
  follow its message (e.g. ask the user to confirm).
- If you are unsure, the stakes are high, or a tool keeps failing, escalate to a human and say why.
  Do not guess on anything consequential.
```

## 2 · Tools/MCP — a tool definition that Claude uses correctly

```json
{
  "name": "get_order_status",
  "description": "Look up ONE order by numeric ID. Use when the user asks where an order is, whether it shipped, or if it can be cancelled. Do NOT use for refunds (use issue_refund) or returns (use start_return). Read-only. Returns: status, ship_date, estimated_delivery, cancellable.",
  "input_schema": {
    "type": "object",
    "properties": {
      "order_id": { "type": "integer", "description": "Numeric ID, e.g. 4471. Digits only; strip any '#'." },
      "include_line_items": { "type": ["boolean", "null"], "description": "True to include items; null/omit if only status was asked." }
    },
    "required": ["order_id"]
  }
}
```
*Structured error to return on failure:*
```json
{ "errorCategory": "NOT_FOUND", "isRetryable": false, "message": "No order 99999. Ask the customer to confirm the ID." }
```

## 3 · Claude Code — a starter project `CLAUDE.md`

```markdown
# Project: {name}
Stack: {e.g. TypeScript monorepo, pnpm}. Never edit generated/ or dist/.

## Conventions
- Run {test cmd} before declaring work done.
- Prefer small, surgical diffs; match surrounding style.

## Scoped rules
- Backend rules live in backend/CLAUDE.md (Python, ruff, pytest, alembic).
- Web rules live in web/CLAUDE.md (React, Tailwind, PascalCase components).

## Hard guarantees (enforced by hooks, not this file)
- PreToolUse hook BLOCKS edits to .env / secrets.* — do not attempt them.
```
*Headless CI invocation:* `claude -p "Review this diff for bugs/security; output JSON." --output-format json --permission-mode plan`

## 4 · Prompting — structured extraction prompt

```
You are a meticulous data-extraction engine. Extract fields from the document into the schema via the
`extract` tool. Rules:
- Output ONLY by calling the tool; match the schema exactly (correct types — numbers as numbers).
- If a field is not present in the document, set it to null. NEVER guess or fabricate a value.
- If the document is too garbled to trust a field, set it null and set needs_human_review = true.

<document>
{DOCUMENT_TEXT}
</document>
```
*Few-shot for ambiguity:* add 2–5 `<example>` input→output pairs covering the edge cases (missing field,
multi-value, garbled), in the exact output format.

## 5 · Context/Reliability — compaction with protected memory

```
When the conversation approaches the context limit, compact as follows:
1. PRESERVE VERBATIM in a "memory" block: all IDs, amounts, dates, decisions made, and open tasks.
   These must survive exactly — do not summarize or round them.
2. SUMMARIZE only the conversational narrative (what was discussed) in 3–5 sentences.
3. Replace the old turns with [memory block + narrative summary]; keep the most recent turns as-is.
After compacting, if your confidence in any preserved fact dropped, flag it and ask the user to confirm
rather than answering from a blurred memory.
```

---

### Self-quiz with these
For each prompt above, name the guardrail it encodes and the **trap** it prevents. If you can do that for all
five, you've internalised the architect's reflexes. Cross-check against the
[cheatsheet](cheatsheet.md) and [blueprint traps](../BLUEPRINT.md#high-frequency-exam-traps-the-distractors-that-look-smart-but-are-wrong).
