---
title: "The (Perfect) General Agent"
date: "2025-10-25"
type: "thought"
---

Back in 2023 I <a href="https://issuu.com/heartcore/docs/ai_report_final">wrote about productivity gains through AI</a> and since then not that much has happened. Where are all the productivity gains that McKinsey consultants promised us? We dreamt big and I felt like there was this short time where we enjoyed an un-nerfed GPT-4 where people's imagination was sparked and we envisioned how the future of work could look like.

Since then we've had three waves of AI productivity startups:

**Wave I: RAG** → Using new technology to solve a fundamental enterprise problem: search. Companies like Gleam and Sana AI threw new technology at an existing problem without building new interfaces. <a href="https://www.nicolasbustamante.com/p/the-rag-obituary-killed-by-agents">RAG is dead</a> and they will get either bundled into Google Drive or <a href="https://www.eu-startups.com/2025/09/workday-acquires-swedish-startup-sana-in-a-e928-million-ai-deal/" data-tooltip="Sana AI was acquired by Workday">acquired</a> by enterprises (Sana AI was acquired by Workday).

**Wave II: Better Interfaces** → The hypothesis was that ChatGPT and Claude would never build something truly for B2B. Companies like <a href="https://www.langdock.com/" data-tooltip="I sadly passed on the opportunity to invest in their seed round after Y Combinator. Big mistake - they're executing so well and I wish them all the best. Really good team.">Langdock</a> built better interfaces with white glove onboarding for SMBs, going through agencies, doing what ChatGPT or Gemini don't want to do because they're too consumer-focused[^2]. The real reason? ChatGPT and Gemini are going for the big consumer pie—the real money lies in ads, like Meta and Google. Anthropic realized they can't play there, so they're going full stack and going for B2B. They're staying afloat by making money through the API and inferencing, which is profitable for them. Meanwhile, Anthropic is going fully vertically integrated, pushing out products and innovations.[^1]

**Wave III: Coding Interfaces** → Cursor and Claude Code started by honing the interface for the laziest user ever (developers). Now, completely unintuitively, we can draw all the learnings from software engineering into normal productivity for normal folks in companies. Everything new in Claude Code is being rolled into the Claude desktop app. In terms of B2B productivity, Anthropic is actually the leader.
    - Case in point: I am using Claude Code on top of my knowledge management files in <a href="https://www.youtube.com/watch?v=aZZaqmcq-1Q&t=459s" data-tooltip="This guy in this video explains the setup really well. I am essentially running the same setup but only on my local computer so far. I haven't had the time to put it onto a server.">Obsidian</a>

The last thing that has found its way from Claude Code to the Claude consumer app is something they call Skills. This is not new—when I spoke to Jonas from <a href="https://beam.ai/">Beam</a> 1.5 years ago, they called these SOPs (standard operating procedures). But this is the most exciting thing I have seen in almost 2 years.

What are Skills? They're similar to tools or MCPs, but you can tell the agent what to do in a specific way. It's like giving the agent its own context window—essentially its own claude.md file where you can specialize it. It's a standard operating procedure, and this is perfect. This is exactly what we need in companies. This is the best iteration of the productivity and tooling problem we've had so far.

The obvious take for skills is:
- Ease of creation
- Versatility
- Context efficiency

The non-obvious:
- Iteration that is quick → even for non-technical people - how can a customer support agent change a rule of an agent?
- Build and teaching skills is democratized → Building an MCP server is actually hard
- How are we sharing/ collaborating with these skills/ gems/ gpts → actually an open research question → should we still use git or should people like Samuel from <a href="https://inlang.com/c/lix" data-tooltip="Started as internationalization/translation library. Actually crazy usage. I just love Samuel as a founder and the vision is so much bigger. Version control is such a hassle that even one of the co-founders of GitHub is building a better interface now.">Lix</a> or <a href="https://gitbutler.com/">GitButler</a> find a better way for version control

I think the hardest part is finding an easy-to-use setup like what Replit did for coding. Putting it into the hands of operational people in our company and letting them teach the agent. Anthropic is the most serious about this. OpenAI's ChatGPT and shareable gems are essentially useless without MCPs or APIs.

[^1]: I might be wrong here—maybe OpenAI and Google have enough shipping cadence to actually ship pro tools too. OpenAI showed with Codex that they can ship something incredible. I also read <a href="https://calv.info/openai-reflections">an article about OpenAI's decentralized Slack-only organization design</a>, which is absolutely fascinating.

[^2]: Or they are swinging for the 10m+ enterprise and gov contracts like Palantir.


