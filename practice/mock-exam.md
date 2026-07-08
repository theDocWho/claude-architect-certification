# Mock Exam — mixed, scenario-based

> **Do this timed and closed-book in Week 6.** 12 questions across all five domains, framed in scenarios like the
> real thing. Target: **≥ 10/12**. Below 10, find which domain(s) you missed and re-drive those explainers.
> Answer key at the very bottom — don't peek.

---

### Scenario A — "ShopFast" support automation
*ShopFast wants an agent to resolve order/return/billing issues. Policy: refunds over $200 need a manager.*

**Q1.** The agent occasionally loops for 40+ turns. The single most important safeguard is:
- A. A bigger model.  B. **An external max-turns + budget cap.**  C. A "be quick" system instruction.  D. Higher `max_tokens`.

**Q2.** A customer demands a $900 refund. The correct design behavior:
- A. Issue it; the customer is upset.  B. Refuse politely and move on.  C. **Block it and escalate to a human (exceeds authority).**  D. Issue $200 and apologize.

**Q3.** ShopFast's order-lookup tool errors when an ID is missing. The error should be:
- A. A raw stack trace.  B. **`NOT_FOUND`, `isRetryable: false`, "confirm the ID with the customer."**  C. `RATE_LIMIT`, retryable.  D. Silent empty result.

---

### Scenario B — "InsightDesk" research assistant
*InsightDesk answers broad internal questions by fanning out to subagents (search/analyze/verify/write).*

**Q4.** The "verify" subagent times out. The lead has the other three results. Best action:
- A. Synthesize and ship from the three.  B. **Bounded retry; if still failing, flag affected claims as unverified.**  C. Abort the run.  D. Reuse the analyze result as verification.

**Q5.** Why split this into subagents rather than one big agent?
- A. More agents are smarter.  B. **Each gets an isolated context window + returns a summary — parallel context budget.**  C. It removes the need for guardrails.  D. Subagents never fail.

**Q6.** Sessions get long and start losing the exact figures cited earlier. The fix:
- A. "Summarize everything" each time it's long.  B. Truncate old turns.  C. **Structured memory note (verbatim facts) + summarize only narrative.**  D. Bigger context window.

---

### Scenario C — "DevTeam" Claude Code rollout
*DevTeam standardizes Claude Code across a TS monorepo and adds CI automation.*

**Q7.** They need the linter to run after **every** edit, guaranteed. Use:
- A. A line in `CLAUDE.md`.  B. A skill.  C. **A `PostToolUse` hook.**  D. A slash command.

**Q8.** Backend-only Python rules should apply just under `/backend`. Use:
- A. User-level `~/.claude/CLAUDE.md`.  B. **A directory `CLAUDE.md` / `backend/**`-globbed rule.**  C. Root CLAUDE.md with everything.  D. A hook.

**Q9.** Their CI must review PR diffs and fail the build on severe issues. Correct shape:
- A. Interactive `claude` in CI.  B. **`claude -p … --output-format json --permission-mode plan`, parse JSON, set exit code.**  C. `-p … --permission-mode acceptEdits`.  D. A hook.

---

### Scenario D — "FormFlow" document intake
*FormFlow extracts fields from thousands of invoices into JSON. Some fields are missing in some docs.*

**Q10.** Reliable structured output is best achieved by:
- A. Asking for JSON in prose.  B. **Defining a tool whose `input_schema` is the target shape (tool_use).**  C. Regex on prose.  D. Raising `max_tokens`.

**Q11.** An invoice has no due date. The output should:
- A. Guess +30 days.  B. Use an empty string.  C. **Be explicit `null` (field is nullable).**  D. Omit the record.

**Q12.** Processing 5,000 invoices nightly (not real-time). Cheapest correct approach:
- A. A hot loop of real-time calls on Opus.  B. **Batch API + route to Haiku; cache the schema/instructions.**  C. One giant prompt with all 5,000.  D. Manual review.

---
---

## Answer key
1-**B** · 2-**C** · 3-**B** · 4-**B** · 5-**B** · 6-**C** · 7-**C** · 8-**B** · 9-**B** · 10-**B** · 11-**C** · 12-**B**

**Map your misses to a domain:**
- Missed 1, 2, 4, 5 → **Domain 1** (agentic). Re-drive [the agent loop](https://thedocwho.github.io/claude-architect-certification/illustrated/1-agentic/agent-loop.html) & [guardrails](https://thedocwho.github.io/claude-architect-certification/illustrated/1-agentic/guardrails.html).
- Missed 3, 10 → **Domain 2** (tools). Re-drive [structured errors](https://thedocwho.github.io/claude-architect-certification/illustrated/2-tools-mcp/structured-errors.html) & [tool anatomy](https://thedocwho.github.io/claude-architect-certification/illustrated/2-tools-mcp/tool-anatomy.html).
- Missed 7, 8, 9 → **Domain 3** (Claude Code). Re-drive [skills/rules/hooks](https://thedocwho.github.io/claude-architect-certification/illustrated/3-claude-code/skills-rules.html) & [headless/CI](https://thedocwho.github.io/claude-architect-certification/illustrated/3-claude-code/cicd-headless.html).
- Missed 10, 11, 12 → **Domain 4** (structured output). Re-drive [structured output](https://thedocwho.github.io/claude-architect-certification/illustrated/4-prompting/structured-output.html).
- Missed 6 → **Domain 5** (context). Re-drive [compaction](https://thedocwho.github.io/claude-architect-certification/illustrated/5-context/compaction.html).

Every miss = one of the [14 traps](../BLUEPRINT.md#high-frequency-exam-traps-the-distractors-that-look-smart-but-are-wrong). Name the trap, then move on.
