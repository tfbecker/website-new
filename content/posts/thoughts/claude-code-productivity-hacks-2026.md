---
title: "Favorite Claude Code Productivity Hacks 2026"
date: "2026-01-15"
type: "thought"
---

I've been using <a href="https://claude.com/claude-code" data-tooltip="Anthropic's CLI tool for Claude - runs in your terminal with full file system access">Claude Code</a> as my primary interface for almost everything. Here's what stuck.

**Overview:**
- Private API reverse engineering
- Playwright for legacy portals
- Dashboard scraping
- Virtual inbox as data source
- Background agents on cron
- SQL access with natural language
- Jira analytics
- Text to app
- Language learning with markdown flashcards
- Research that accumulates
- Reading list processing
- Voice-to-markdown
- Vibe-code apps with voice, deploy for free
- Terminal from anywhere
- Email reminders with context
- Receipts to finance advisor

---

## 1. Access Data That Was Tedious to Get

The killer feature isn't coding assistance. It's turning any website into a programmable data source.

**Private API reverse engineering.** Every website has an API - they just don't document it. Open DevTools, make the action you want to automate, and ask Claude to replicate it. It captures the auth flow, figures out the cookie rotation, and builds you a reusable skill. I did this for my old gym's booking system, for <a href="https://www.crunchbase.com/" data-tooltip="Database of companies, funding rounds, and investors">Crunchbase</a> funding data, for LinkedIn Sales Navigator searches.[^1]
<br>→ *Replaces: <a href="https://zapier.com/" data-tooltip="Automation platform that requires official API integrations">Zapier</a>, <a href="https://www.make.com/" data-tooltip="Visual automation platform, formerly Integromat">Make</a> (which only work with official integrations)*

**Playwright for legacy portals.** Government booking systems, internal company tools, old-school B2B platforms - these never have APIs. With <a href="https://playwright.dev/" data-tooltip="Browser automation library that Claude Code can use via MCP">Playwright</a> running through Claude Code, you describe what you want and it figures out the clicks, the waits, the form fills. I automated the entire German Bürgeramt appointment booking flow in one session.
<br>→ *Replaces: <a href="https://ui.vision/" data-tooltip="Browser automation with visual scripting">UI.Vision</a>, Selenium IDE, manual clicking*

**Dashboard scraping.** Analytics dashboards, admin panels, CRMs that charge extra for data export. Playwright captures the page, Claude extracts the structure, and suddenly you have your own data pipeline. No more manual CSV exports.
<br>→ *Replaces: <a href="https://supermetrics.com/" data-tooltip="Data connector for marketing platforms, $99+/mo">Supermetrics</a>, paying for enterprise export tiers*

**Virtual inbox as data source.** Set up a dedicated email that receives receipts, bank statements, invoices. Claude parses them on demand. "What did I spend on food this month?" works across all your purchase confirmations. I found three forgotten subscriptions this way - one was $15/month for a tool I'd stopped using two years ago.[^2]
<br>→ *Replaces: <a href="https://copilot.money/" data-tooltip="Finance tracking app, $70/year">Copilot</a>, <a href="https://mint.intuit.com/" data-tooltip="Personal finance app by Intuit">Mint</a>, manual spreadsheet tracking*

The mental model shift: stop asking "does this have an API?" Start asking "what would I click to get this data?"

## 2. Hard Tasks That Need Async, Reusable Context, or Private Data

Some tasks are too slow for a single session, need persistent memory, or touch sensitive data that can't leave your machine.

**Background agents on cron.** Availability hunters for gym classes, concert tickets, visa appointments. Price monitors that diff against yesterday and email you changes. Scheduled blog publishing that checks a folder for posts with future dates. These run on a server, every few minutes, without your attention.
<br>→ *Replaces: <a href="https://ifttt.com/" data-tooltip="If This Then That - consumer automation">IFTTT</a>, <a href="https://zapier.com/" data-tooltip="Automation platform">Zapier</a> scheduled triggers, <a href="https://www.bardeen.ai/" data-tooltip="Browser automation tool">Bardeen</a>*

```bash
*/5 * * * * cd ~/skills && node gym-checker.js >> /var/log/gym.log 2>&1
```

**SQL access with natural language.** I have a skill that tunnels through SSH to a PostgreSQL analytics database. "Show me revenue by region for Q4" becomes a query, runs, returns formatted results. The context is reusable - it knows the schema, the table relationships, the business logic. No BI dashboard needed.
<br>→ *Replaces: <a href="https://www.metabase.com/" data-tooltip="Open source BI tool">Metabase</a>, <a href="https://www.tableau.com/" data-tooltip="Enterprise BI platform">Tableau</a>, <a href="https://mode.com/" data-tooltip="Collaborative analytics platform">Mode</a>*

**Jira analytics.** Story points by assignee, completion rates, overdue tickets. The skill runs JQL directly and remembers what metrics matter. "Who completed the most complex tickets last sprint?" - answered in seconds, not a dashboard configuration session.
<br>→ *Replaces: <a href="https://linearb.io/" data-tooltip="Dev analytics platform">LinearB</a>, <a href="https://jellyfish.co/" data-tooltip="Engineering management platform">Jellyfish</a>, Jira dashboards*

**Text to app.** Describe what you want, Claude builds it. This sounds generic but the key is *reusable context*. I described a spaced repetition system once - now I can say "add these 20 words to my Portuguese deck" and it knows the file format, the algorithm, the frontend location.
<br>→ *Replaces: <a href="https://retool.com/" data-tooltip="Low-code internal tools">Retool</a>, <a href="https://www.glideapps.com/" data-tooltip="No-code app builder">Glide</a>, no-code builders*

The pattern: anything that needs memory across sessions, or access to private infrastructure, or runs while you sleep.

## 3. Personal Growth and Knowledge

This category surprised me. Claude Code replaced several learning apps.

**Language learning with markdown flashcards.** I built a spaced repetition system in one conversation. Flashcards are markdown files - front and back, tags, difficulty scores. A simple frontend shows cards due today, tracks correct/incorrect, updates intervals. Text-to-speech for pronunciation. No Anki plugins, no sync issues, no subscription.[^3]
<br>→ *Replaces: <a href="https://apps.ankiweb.net/" data-tooltip="Popular flashcard app with complex plugin ecosystem">Anki</a>, <a href="https://www.duolingo.com/" data-tooltip="Gamified language learning app">Duolingo</a>, <a href="https://www.memrise.com/" data-tooltip="Language learning with spaced repetition">Memrise</a>*

```markdown
---
front: "obrigado"
back: "thank you"
tags: [portuguese, basics]
due: 2026-01-16
interval: 4
---
```

**Research that accumulates.** I keep markdown files of notes on topics I'm learning. Claude Code can search across them, find connections, suggest what to revisit. "What did I write about market sizing last year?" actually works because it has access to my filesystem.
<br>→ *Replaces: <a href="https://www.notion.so/" data-tooltip="All-in-one workspace with AI features">Notion AI</a>, <a href="https://mem.ai/" data-tooltip="AI-powered note taking">Mem.ai</a>, <a href="https://roamresearch.com/" data-tooltip="Networked thought tool">Roam Research</a>*

**Reading list processing.** Save articles as markdown, ask Claude to summarize the key points, extract quotes, link to related notes. The integration is seamless because everything is files.
<br>→ *Replaces: <a href="https://readwise.io/" data-tooltip="Reading highlights aggregator">Readwise</a>, <a href="https://hq.getmatter.com/" data-tooltip="Read-it-later app with highlights">Matter</a>, <a href="https://getpocket.com/" data-tooltip="Save articles for later">Pocket</a>*

The insight: learning tools are just spaced repetition + content + interface. Claude Code can generate all three, customized to how you actually learn.

## 4. Mobile & Voice Workflows

The terminal isn't just for desktops. These workflows run from my phone via <a href="https://termius.com/" data-tooltip="SSH client for iOS with great keyboard support">Termius</a> + speech-to-text.

**Voice-to-markdown.** Dictate a thought while walking, it goes straight into my Obsidian vault as a timestamped markdown file. Claude cleans up speech-to-text artifacts, adds structure, tags it, extracts action items, links to previous entries. Works for journal entries, blog drafts, meeting notes - this post started as a voice note on a drive.[^4]
<br>→ *Replaces: <a href="https://dayoneapp.com/" data-tooltip="Premium journaling app, $35/year">Day One</a>, <a href="https://otter.ai/" data-tooltip="AI meeting notes and transcription">Otter.ai</a>, voice memos you never process*

**Vibe-code apps with voice, deploy for free.** This is my <a href="https://lovable.dev/" data-tooltip="AI app builder, subscription-based">Lovable.dev</a> replacement. Describe an app while talking into my phone, Claude Code writes it, then a <a href="https://coolify.io/" data-tooltip="Self-hosted PaaS, open source alternative to Heroku/Vercel">Coolify</a> skill deploys it to my server. "Build me a simple countdown timer for my talk next week" → running at timer.becker.im in under 10 minutes. No subscription, no vendor lock-in, I own the code.[^5]
<br>→ *Replaces: <a href="https://lovable.dev/" data-tooltip="AI app builder">Lovable</a>, <a href="https://www.bolt.new/" data-tooltip="AI web app builder">Bolt.new</a>, <a href="https://vercel.com/new" data-tooltip="Deploy templates from Vercel">Vercel templates</a>*

## 5. Misc

**Terminal from anywhere.** I've edited this blog from a 3mbps DSL line in the Namibian desert. SSH into the server, run Claude Code, done. No VS Code remote setup, no sync issues, no "waiting for extension host."
<br>→ *Replaces: <a href="https://code.visualstudio.com/docs/remote/ssh" data-tooltip="VS Code Remote SSH extension">VS Code Remote</a>, <a href="https://github.com/features/codespaces" data-tooltip="GitHub's cloud dev environments">GitHub Codespaces</a>, <a href="https://www.gitpod.io/" data-tooltip="Cloud development environments">Gitpod</a>*

**Email reminders with context.** A skill that sends emails can also attach files, include data from other skills, format HTML. "Email me a summary of this week's Jira tickets" produces a formatted report in my inbox.
<br>→ *Replaces: <a href="https://superhuman.com/" data-tooltip="Premium email client, $30/mo">Superhuman</a> snippets, email templates, manual report compilation*

**Receipts to finance advisor.** Forward receipts to a virtual inbox, ask questions at month-end. "Which subscriptions increased in price?" "What's my average weekly grocery spend?" Your email history becomes queryable.
<br>→ *Replaces: <a href="https://www.youneedabudget.com/" data-tooltip="Budgeting app, $99/year">YNAB</a>, <a href="https://copilot.money/" data-tooltip="Finance tracking app">Copilot</a>, accountant queries*

---

The pattern across all of these: Claude Code is most powerful when it has *context* - access to your files, your credentials, your history. The cloud AI tools can't do this safely. A terminal on your own machine can.

The best way to start: pick one annoying recurring task. Something you do weekly that involves clicking through a website or processing emails. Build a skill for it. Once you see how fast it is, you'll find ten more.

[^1]: This works because Sales Navigator and Crunchbase have private APIs that Claude Code can reverse-engineer. Not officially supported, but stable enough for personal use.

[^2]: The subscription auditor skill scans for "your plan renewed" and "payment received" emails, extracts amounts and dates, builds a complete picture of recurring charges.

[^3]: The full system is ~200 lines of code. Frontend in Next.js, flashcards in a markdown folder, spaced repetition algorithm in a single function. Took one afternoon to build, replaces Anki entirely.

[^4]: The key is Termius has excellent iOS keyboard support and stays connected. Combined with the native iOS speech-to-text, you get a surprisingly smooth voice-to-terminal workflow.

[^5]: Lovable.dev charges $20/month. My setup: free Coolify on my own server + Claude Code subscription I already pay for. The skill knows my GitHub, my domain pattern (*.becker.im), and my deployment preferences. One command deploys.
