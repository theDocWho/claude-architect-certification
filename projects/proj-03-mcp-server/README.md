# proj-03 — Custom MCP Server

> **Exam scenario:** Developer Productivity Tools · **Domain:** 2 (Tool Design & MCP, 18%) · ⭐⭐⭐
> Build and publish a **Model Context Protocol server** that exposes real tools (and resources) any MCP host —
> Claude Desktop, Claude Code, your own app — can plug into. This is the build that makes "I understand MCP"
> concrete and demonstrable, with a public artifact people can actually install.

> 🎨 Drive it first: [MCP architecture](https://thedocwho.github.io/claude-architect-certification/illustrated/2-tools-mcp/mcp-architecture.html) ·
> [tool anatomy](https://thedocwho.github.io/claude-architect-certification/illustrated/2-tools-mcp/tool-anatomy.html) ·
> [structured errors](https://thedocwho.github.io/claude-architect-certification/illustrated/2-tools-mcp/structured-errors.html).

## What you'll build
A working MCP server (Python or TS SDK) that wraps a useful domain — pick one: a **codebase navigator**
(`search_symbols`, `read_file`, `list_tests`), a **personal-knowledge** server over your notes, or a **SaaS
connector** (e.g. a read-only Postgres/GitHub bridge). It exposes **tools**, at least one **resource**, and a
**prompt template**, with **structured errors** and **scoped permissions**. Then you connect it to Claude Code /
Desktop and show it in action.

## Why it matters for the exam
Domain 2 is "overlooked by almost everyone," and the exam rewards people who know that **tool descriptions are the
product** and that MCP standardises *connection*, not *quality*. Building a server forces you to internalise the
host/client/server split, the tools-vs-resources-vs-prompts distinction, and transport choice (stdio vs HTTP).

## Stages
1. **Pick a transport & scaffold.** Start with **stdio** (local subprocess) — simplest to test with Claude
   Desktop/Code. Scaffold with the official MCP SDK. *Checkpoint: the host lists your server's capabilities.*
2. **Expose great tools.** 3–4 tools with **sharp descriptions** (what/when/when-not/returns), typed schemas,
   required-vs-nullable fields. *Checkpoint: Claude picks the right tool unprompted and passes clean args.*
3. **Add a resource and a prompt.** One read-only **resource** the host can attach as context; one reusable
   **prompt** template a user can invoke. *Checkpoint: you can `@`-attach the resource and run the prompt.*
4. **Structured errors + scope.** Return `errorCategory`/`isRetryable`/message on failure; scope what the server
   can touch (read-only where possible). *Checkpoint: a bad call yields a recoverable structured error, not a
   stack trace.*
5. **Publish.** README with install instructions, a 60-second demo GIF, and a one-command setup. Optionally add a
   **streamable-HTTP** transport so it can run remotely with auth.

## Make it better
- (stretch) Ship **both** stdio and HTTP transports; document when to use each.
- (stretch) Add auth + rate-limiting to the HTTP server (real production concern).
- (stretch) Write a tiny **eval** that checks Claude selects each tool correctly from its description alone.

## Done when
- [ ] A clean MCP host (fresh Claude Desktop/Code) can install and use your server from your README alone.
- [ ] At least 3 tools + 1 resource + 1 prompt, all with quality descriptions and structured errors.
- [ ] Claude selects the right tool from the description without extra hints.
- [ ] You can explain tools-vs-resources-vs-prompts and stdio-vs-HTTP in one breath each.

## Architect's Decision Lens
1. **Problem:** make a data source / capability reusable across every AI app, not glued to one.
2. **Is MCP right?** Yes when the integration should be **portable** and **reused**; a one-off inline tool
   wouldn't need it.
3. **Design:** server exposes tools (callable) + resources (attachable) + prompts (templates).
4. **Guardrails:** least-privilege scope; read-only where you can; structured errors.
5. **Evals:** tool-selection accuracy from descriptions; error recoverability.
6. **Cost:** N/A at the server, but good descriptions cut wasted model turns downstream.
7. **Reliability:** structured, categorised errors so clients recover.
8. **Build vs buy:** the SDK gives you the protocol; *your* tool design + scoping is the value.

## Concepts you must be able to explain
host vs client vs server; tools (model-controlled) vs resources (app-controlled) vs prompts (user-controlled);
stdio vs streamable-HTTP and when to choose each; why a vague MCP tool fails exactly like a vague inline tool;
least-privilege scoping.

**Résumé line:** *Built and published an MCP server (official SDK) exposing scoped tools, resources, and prompt
templates with structured error handling over stdio and HTTP; installable in any MCP host (Claude Desktop/Code).*
