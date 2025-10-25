---
title: "The (Perfect) General Agent"
date: "2025-10-25"
type: "thought"
---

Back in 2023 I <a href="https://issuu.com/heartcore/docs/ai_report_final">wrote about productivity gains through AI</a> and since then not that much has happened. We dreamt big and I felt like there was this short time where we enjoyed an un-nerfed GPT-4 where people's imagination was sparked and we envisioned how the future of work could look like.

Since then we've had three waves of AI productivity startups:

**Wave I: RAG** → Using new technology to solve a fundamental enterprise problem: search. Companies like Gleam and Sana AI threw new technology at an existing problem without building new interfaces. <a href="https://www.nicolasbustamante.com/p/the-rag-obituary-killed-by-agents">RAG is dead</a> and they will get either bundled into Google Drive or acquired by enterprises (<a href="https://www.eu-startups.com/2025/09/workday-acquires-swedish-startup-sana-in-a-e928-million-ai-deal/">Sana AI was acquired by Workday</a>).

**Wave II: Better Interfaces** → The hypothesis was that ChatGPT and Claude would never build something truly for B2B. Companies like LangDoc built better interfaces with white glove onboarding for SMBs, going through agencies, doing what ChatGPT or Gemini don't want to do because they're too consumer-focused. The interesting thing is that Anthropic is going fully vertically integrated, pushing out products and innovations.

**Wave III: Coding Interfaces** → Cursor and Claude Code started by honing the interface for the laziest user ever (developers). Now, completely unintuitively, we can draw all the learnings from software engineering into normal productivity for normal folks in companies. Everything new in Claude Code is being rolled into the Claude desktop app. In terms of B2B productivity, Anthropic is actually the leader.
    - Case in point: I am using Claude Code on top of my knowledge management files in Obsidian - <a href="https://www.youtube.com/watch?v=aZZaqmcq-1Q&t=459s">- demo of this setup</a>

The most interesting alley for me has always been hooking up agents with APIs. We have come a long way from Function/Tool calling, MCP servers (which are also dead), and now the last iteration of little recipes for agents to write helper scripts on the fly.

They are not new. When I spoke to Joans from <a href="https://beam.ai/">Beam</a> 1.5 years ago, they called these SOPs (standard operating procedures).

Anthropic calls them Skills and this is the most exciting thing I have seen in almost 2 years.

The obvious take for skills is:
- Ease of creation
- Versatility
- Context efficiency

The non-obvious:
- Iteration that is quick → even for non-technical people - how can a customer support agent change a rule of an agent?
- Build and teaching skills is democratized → Building an MCP server is actually hard
- How are we sharing/ collaborating with these skills/ gems/ gpts → actually an open research question → should we still use git or should people like Samuel from <a href="https://inlang.com/c/lix">Lix</a> or <a href="https://gitbutler.com/">GitButler</a> find a better way for version control

I think the hardest part is finding an easy-to-use setup like what Replit did for coding. Putting it into the hands of operational people in our company and letting them teach the agent. Anthropic is the most serious about this. OpenAI's ChatGPT and shareable gems are essentially useless without MCPs or APIs.


