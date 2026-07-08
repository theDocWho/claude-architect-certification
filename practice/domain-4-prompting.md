# Drill — Domain 4: Prompt Engineering & Structured Output (20%)

---

**Q1.** A classification prompt gives inconsistent results on ambiguous messages. Best fix?

- A. Add "be more accurate and professional" to the prompt.
- B. Raise the temperature.
- C. Add **2–5 few-shot examples**, including the tricky edge cases, in a consistent format.
- D. Switch to Opus.

---

**Q2.** You need Claude's output consumed by another program as reliable JSON. Strongest approach?

- A. Ask in prose: "respond only with JSON."
- B. Define a **tool whose `input_schema` is the target shape** and let Claude call it.
- C. Post-process the prose with a regex.
- D. Raise `max_tokens`.

---

**Q3.** A new prompt version "reads better." Before shipping, you should:

- A. Ship it — readability is a good signal.
- B. **Run it against a golden-set eval** and compare scores, including edge cases.
- C. Ask a colleague if they like it.
- D. A/B test in production only.

---

**Q4.** Your summary prompt's quality is subjective (tone, completeness). What grader fits the eval?

- A. Exact string match.
- B. **LLM-as-judge** with a clear rubric.
- C. Regex.
- D. Character count.

---

**Q5.** You're passing a long contract plus a question to Claude. Best structure?

- A. Question first, then the contract.
- B. Contract wrapped in **XML tags, placed before** the question.
- C. Contract and question merged into one paragraph.
- D. Contract in the system prompt as plain text, no tags.

---

**Q6.** A prompt change raises average eval score from 0.86 to 0.88 but now fails a previously-passing edge case.
This is:

- A. An improvement — ship it.
- B. A **regression** — a broken edge case matters even if the average rose.
- C. Irrelevant — averages are what count.
- D. Expected noise.

---

## Answers

**Q1 — C.** Ambiguity → **examples**, consistent and edge-case-covering. **A** is vague; **B** adds randomness;
**D** is overkill. *(Trap: adjectives over examples.)*

**Q2 — B.** **tool_use as a schema contract** is the reliable path. **A** is best-effort; **C/D** don't enforce
structure. *(Structured output.)*

**Q3 — B.** **Measure first.** Readability isn't correctness. *(Trap: "looks better, ship it.")*

**Q4 — B.** Open-ended quality → **LLM-as-judge** with a rubric. Exact/regex/length can't judge tone. *(Grader
choice.)*

**Q5 — B.** **XML-tagged context, before the question** — separates data from instructions and aids long-context
recall. *(Prompt structure.)*

**Q6 — B.** A broken edge case is a **regression** — which is why hard cases stay in the golden set. *(Trap:
higher average hides a regression.)*
