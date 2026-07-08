# Drill — Domain 5: Context Management & Reliability (15%)

---

**Q1.** A long-running agent is approaching its context limit mid-task. The conversation includes an order number
and a refund amount that matter later. How should you compact?

- A. "Summarize the conversation so far" and replace the history.
- B. Keep critical facts (order #, amount, decisions) in a **structured memory note preserved verbatim**, and
  summarize only the narrative.
- C. Truncate the oldest half of the messages.
- D. Switch to a model with a bigger context window.

---

**Q2.** Why is "just use the biggest context window" a weak answer to long-conversation management?

- A. It isn't — bigger is always better.
- B. Big windows cost more, add latency, and still suffer **recall degradation ("context rot")** when stuffed.
- C. Big windows aren't available.
- D. Because summarization is always better.

---

**Q3.** You answer 20 questions about the same 50-page policy document. How do you cut cost and latency?

- A. Re-send the document each time at full price.
- B. Use **prompt caching** with the document as a **stable prefix placed first**; later calls read it cheaply.
- C. Summarize the document so it's shorter.
- D. Cache the changing user question.

---

**Q4.** A tool an agent depends on has failed three times in a row. What's the reliable move?

- A. Keep retrying until it works.
- B. Guess the result and continue.
- C. **Stop retrying, degrade explicitly** ("can't reach records right now"), and escalate / fall back.
- D. Crash silently.

---

**Q5.** In a multi-step pipeline, step 2 returns a partial/failed result. How do you prevent a confident wrong
final answer?

- A. Ignore the status and let step 5 use whatever step 2 returned.
- B. Carry a **status flag** (`partial`/`failed`) with the data so downstream steps check it and degrade
  explicitly.
- C. Always retry step 2 forever.
- D. Drop step 2 from the pipeline.

---

**Q6.** Which belongs in a cached **stable prefix**, and which must stay outside the cache breakpoint?

- A. Cache the user's changing question; keep the system prompt variable.
- B. **Cache the system prompt + tools + big shared docs (first); keep the changing user turn last, outside the
  breakpoint.**
- C. Cache everything including the user turn.
- D. Don't cache; it's not worth it for 20 calls.

---

## Answers

**Q1 — B.** Progressive summarization is **lossy** — protect transactional facts in a verbatim structured note.
**A** drops the exact values; **C** loses early context; **D** dodges the issue and still rots. *(Trap:
"summarize everything.")*

**Q2 — B.** Bigger windows are costlier, slower, and still lose mid-context recall. *(Trap: "biggest window.")*

**Q3 — B.** **Caching a stable, first-positioned prefix** is the win; reuses pay ~10%. **A** wastes money; **C**
loses detail; **D** caches the wrong (volatile) part. *(Caching rules.)*

**Q4 — C.** Repeated failure → **stop, degrade explicitly, escalate**. **A/B/D** either waste turns or fail
silently. *(Trap: "keep retrying.")*

**Q5 — B.** Propagate **status** so synthesis accounts for the gap. **A** is silent failure; **C** loops; **D**
loses needed data. *(Stop error propagation.)*

**Q6 — B.** Stable content **first** and cached; volatile user turn **last**, outside the breakpoint. *(Trap:
volatile-before-stable.)*
