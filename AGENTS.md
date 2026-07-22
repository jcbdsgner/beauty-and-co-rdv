<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Workspace conventions

- **Before validating a significant implementation plan** (a new feature, a non-trivial refactor, anything that touches the data model or booking flow), run `/grill-with-docs` to stress-test it against this project's language and documented decisions before writing code.
- **At the end of a significant session** (meaningful scope covered, or context getting long), run `/handoff` to produce a continuation document for whoever picks up next.

Both are invoked manually when the moment fits — not on a fixed schedule.
