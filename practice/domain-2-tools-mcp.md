# Drill — Domain 2: Tool Design & MCP Integration (18%)

---

**Q1.** Claude keeps calling your `get_order` tool for refund requests too, and sometimes passes `"#4471"`
instead of `4471`. What's the right fix?

- A. Add a separate `refund` tool and hope it picks correctly.
- B. Switch to a more capable model.
- C. **Improve the tool's description** (what it's for, when *not* to use it) and **type the schema**
  (`order_id` as integer, "strip the #").
- D. Lower the temperature to 0.

---

**Q2.** A tool can fail because the upstream service is briefly overloaded. What should the tool return so the
agent behaves well?

- A. A raw stack trace.
- B. `{ "error": "failed" }`.
- C. A structured error with **`errorCategory: "RATE_LIMIT"`, `isRetryable: true`**, and a short message.
- D. Nothing — let it throw.

---

**Q3.** An order-lookup tool is called with an ID that doesn't exist. The best structured error sets:

- A. `isRetryable: true` so the agent keeps trying.
- B. **`isRetryable: false`** with a message telling the agent to confirm the ID with the user.
- C. `errorCategory: "RATE_LIMIT"`.
- D. A 200 response with an empty object.

---

**Q4.** In MCP, which statement is correct?

- A. Tools, resources, and prompts are all model-controlled.
- B. **Tools are model-controlled, resources are app-controlled, prompts are user-controlled.**
- C. MCP replaces the need for good tool descriptions.
- D. An MCP server can only be used by the app that wrote it.

---

**Q5.** You're building a local MCP server that reads files on the developer's machine for Claude Code. Which
transport is the natural fit?

- A. **stdio** (local subprocess).
- B. Streamable HTTP with OAuth.
- C. WebSocket to a cloud server.
- D. It doesn't matter.

---

**Q6.** A document-extraction tool sometimes receives docs missing the `due_date`. How should the schema model it?

- A. Make `due_date` required so the model always provides one.
- B. Make it **nullable** (`["string","null"]`) with a description: "null if not present in the document."
- C. Omit it from the schema entirely.
- D. Default it to today's date.

---

## Answers

**Q1 — C.** Misuse → fix the **words and schema**, not the model or tool count. **A/B/D** all dodge the real
cause. *(Trap: "add tools / switch models.")*

**Q2 — C.** Retryable + categorized + human message lets the agent back off and recover. **A/B/D** leave it
unable to tell retry from give-up. *(Trap: raw errors.)*

**Q3 — B.** Not-found is **not** retryable — hammering wastes turns. Tell the agent to ask the user. **A** loops
pointlessly; **C** mislabels; **D** hides the failure. *(Trap: wrong retry signal.)*

**Q4 — B.** Know the control directions. **C** is false (MCP standardises connection, not quality); **D** is the
opposite of MCP's whole point. *(Trap: MCP solves quality.)*

**Q5 — A.** Local + private → **stdio** subprocess. HTTP/OAuth is for shared/remote servers. *(Transport choice
is a deployment decision.)*

**Q6 — B.** Nullable-not-invented. **A** forces fabrication; **C** loses the field; **D** invents a wrong value.
*(Trap: everything required.)*
