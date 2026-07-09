---
title: "European Company Registers"
date: "2026-07-10"
type: "project"
link: "https://github.com/tfbecker/european-company-registers"
---

The Bundesanzeiger Bot kept growing. It started as "look up a German company's revenue for me" and turned into a proper toolkit that pulls financials and register data across four European countries (Germany, France, Poland and the UK) without paying a single data provider.

The annoying part is that every register hides public data behind a different wall: CAPTCHAs, session-bound encrypted payloads, JSF state machines, anti-bot walls, PDFs. So I reverse-engineered the official portals (Bundesanzeiger, Unternehmensregister, Handelsregister, INPI in France, KRS in Poland, Companies House in the UK) and made them all return clean JSON.

Two things I'm happy with on the German side:

- It handles the **DiRUG** split. Annual accounts for fiscal years after 2021 moved from the Bundesanzeiger to the Unternehmensregister, so most scrapers out there are about three years stale. This one queries both sources in parallel and routes each year to whichever one actually has it.
- It reads the actual numbers **for free** by having Claude look at the CAPTCHA image and pull the figures out of the messy German report text. No paid financial API, no OCR service.

I built it as an agent skill, so I can just ask Claude *"what was this company's revenue over the last three years, and who are the managing directors?"* and it runs the right scripts and reads the JSON back. It's also a plain CLI, so it drops into any code or cron job.

Open source under MIT. Code is [here](https://github.com/tfbecker/european-company-registers).
