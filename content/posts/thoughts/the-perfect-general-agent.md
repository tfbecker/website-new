---
title: "The (Perfect) General Agent"
date: "2025-10-25"
type: "thought"
---

George Hotz articulated this idea better than I ever could, <a href="https://geohot.github.io/blog/jekyll/update/2025/12/18/computer-use-models.html">see link</a>.

Case in point - I am editing this post via terminal and Claude, currently plugged into a 3mbps DSL line in the Namibian desert. Another advantage of using terminal only.

Back in 2023 we imagined the <a href="https://issuu.com/heartcore/docs/ai_report_final">increased productivity through AI</a> and since then not that much has happened. Where are all the productivity gains that McKinsey consultants promised us? 

It is clear that we must <a href="https://newsletter.angularventures.com/p/the-radiologist-the-dynamo-and-the-dangerous-allure-of-the-retrofit">rearchitect vs retrofit</a> and for the first time i think Anthropic has launched something that has a real shot for prosumers and companies alike to make a dent: Skills.

Quick recap on what waves i observed in terms of productivity gains:

**Wave I: Enterprise RAG** → Using new technology to solve a fundamental search problem. Companies like Gleam and Sana AI threw new technology at an existing problem without building new interfaces. <a href="https://www.nicolasbustamante.com/p/the-rag-obituary-killed-by-agents">RAG is dead</a> and they will get either bundled into Google Drive or <a href="https://www.eu-startups.com/2025/09/workday-acquires-swedish-startup-sana-in-a-e928-million-ai-deal/" data-tooltip="Sana AI was acquired by Workday">acquired</a> by enterprises.

**Wave II: Better Interfaces** → The hypothesis was that ChatGPT and Claude would never build something truly for B2B. Companies like <a href="https://www.langdock.com/" data-tooltip="I sadly passed on the opportunity to invest in their seed round after Y Combinator. Big mistake - they're executing so well and I wish them all the best. Really good team.">Langdock</a> built better interfaces with white glove onboarding for SMBs, going through agencies, doing what ChatGPT or Gemini don't want to do because they're too consumer-focused[^2].

**Wave III: Coding Interfaces** → Now we're in the third wave. Cursor and Claude Code didn't just target developers; they built for the laziest users on earth. The irony is that this developer-first approach might be what finally makes AI useful for everyone else. Every breakthrough in Claude Code is now making its way into the Claude desktop app - and that's where the real story starts.

## A Terminal is All You Need

Claude Code is perfect, because of its simplicity. The only thing you need is a file system where you can save all of your projects and chats as markdown files forever. You can execute code and little scripts and make them reusable. Websearch is also integrated.

The real killer are the tools. <a href="https://www.anthropic.com/news/skills">Agent skills</a> are a way to revolutionize MCP tooling, and this has also now found its way into the Claude consumer app. It's amazing because you can essentially use an API, save your credentials super conveniently and safely in your local file system in an environment file, and just build anything on top.

What are Skills? They're similar to tools or MCPs, but you can tell the agent what to do in a specific way. It's like giving the agent its own context window - essentially its own claude.md file where you can specialize it. It's a standard operating procedure, and this is perfect. This is exactly what we need in companies. This is the best iteration of the productivity and tooling problem we've had so far.

The obvious take for skills is:
- Ease of creation
- Versatility
- Context efficiency

The non-obvious:
- Iteration that is quick → even for non-technical people - how can a customer support agent change a rule of an agent?
- Build and teaching skills is democratized → Building an MCP server is actually hard
- How are we sharing/ collaborating with these skills/ gems/ gpts → actually an open research question → should we still use git or should people like Samuel from <a href="https://inlang.com/c/lix" data-tooltip="They actually started with a translation (i18n) app called Inlang, but the bigger problem that we will see is version control for all different file formats and then also for the agents that will work in large corporations because you will have more and more people editing the same files in real time and resolving conflicts is becoming a bigger and bigger problem because you trust an agent less than a human and this is definitely not solved.">Lix</a> or <a href="https://gitbutler.com/" data-tooltip="One of the ex-cofounders of GitHub actually built GitButler in Berlin because it's not really end-user friendly. So it's kind of like the same theme here that version control is not really solved for the normal Joe.">GitButler</a> find a better way for version control

In theory, I can connect my Gmail mailbox, my project management suite, my GitHub account, my journaling service, maybe even unofficial APIs like the iCloud API, and my calendar API. But I can also add stuff that doesn't have official support—like web scrapers—and build micro apps real quick because I can just code these and then make them reusable. The nice thing is that making them reusable was really hard in the past. You needed to host an MCP server, but now you can do it really quickly.

For example, I used to go to a gym where I could book classes. I reverse-engineered the API and got all the gym classes sent to my email. Now I can just use Claude Code on my iOS app and do it on the fly. I can say, "Hey, this is the website, please spin up a Selenium session, log in, and tell me all about the classes available next week, then auto-book them as soon as they're available" (because they were booked out fairly quickly within a couple of minutes). I could have a truly background agent that checks whenever a new class becomes available, all completely on mobile.

What's also super nice is that there's a plethora of GitHub apps and repositories that I can just remix. I used to live in Berlin, and booking an appointment with government officials (the Amt) was really hard. There was a GitHub repository that sent you an email notification fairly quickly when appointments opened up. You can just clone this, have it on your personal server all the time, and essentially vibe-code your life.

That's another good example: I really like this Obsidian continuous research type of thing, having it as a second brain. I think Obsidian or Roam Research back in the days was really flawed because you had to write everything down - you couldn't dictate it - and structuring the nodes was super tedious.
Now I  built a Claude skill, that goes through all my old notes that I've done over the years, extracts all the people's names I mentioned, builds an ontology, and links them together. So I can just ask, "What was the most fun trip I did with a friend of mine?" and there's a really easy way of looking it up. It's like a very intelligent contact system, and it all runs with the power of markdown files.

Even this website is another example. I just have markdown files in a folder on my computer. I have a bunch of thoughts and transcripts from old founder calls. I use Claude to explore my past knowledge or an idea, and then I put them in a project or research folder. When I feel good enough about it - even if it only reads like 70% polished - I can just push it to my own website, which also consists of markdown files, and then it's online. I just really like the interoperability of markdown files and LLMs on top of it, voice dictation, and truly being in charge of your data.

Another thing I use is the <a href="https://happy.engineering/">Happy Engineering</a> iOS app. When I'm driving for four hours, the Happy Engineering app uses an <a href="https://elevenlabs.io/conversational-ai">ElevenLabs voice agent</a> on top of Claude Code, so I can talk with it. I can say, "Hey, please go into my vault and tell me everything about notes on a certain topic," or "Let's start a new research project." This is all available in ChatGPT voice mode, but ChatGPT voice mode is real-time and stupid - it cannot think for a long time and doesn't have access to all of my files.

<a href="https://www.youtube.com/watch?v=aZZaqmcq-1Q&t=459s">More info/demo about this setup.</a>

For specific skill combinations I use daily, see <a href="/posts/claude-code-productivity-hacks-2026">my favorite Claude Code productivity hacks</a>.

[^2]: The real money lies in ads. Or they are swinging for the 10m+ enterprise and gov contracts like Palantir.


