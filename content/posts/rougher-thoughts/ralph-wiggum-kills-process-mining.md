---
title: "Ralph Wiggum Kills Process Mining"
date: "2025-12-31"
type: "rougher-thought"
---

Tinkering with the <a href="https://github.com/anthropics/claude-code/tree/main/plugins" data-tooltip="Claude Code plugin that runs Claude in a loop">Ralph Wiggum</a> Claude Code plugin. Not a new idea, goes back to 2023 when people ran GPT-4 in a loop until it worked.

The obvious take: well-documented jobs (data entry, customer support) get automated. Run LLM in loop until it passes unit tests. Whatever, this takes 10 years.

The non-obvious take: process mining from unstructured data becomes possible. Traditional process mining needs database logs, ERP transaction histories. Structured stuff.

Instead you loop through a thousand customer support emails to figure out how the policies actually work. Or ingest Slack messages to understand how decisions get made. Super useful for consultants dealing with tribal knowledge that was never documented.

Also kills <a href="/posts/tool-to-build-llm-tools">YC startups doing private API reverse engineering</a>. Just let Claude loop until it figures out the API.

![Ralph Wiggum](/fun/ralph-wiggum.webp)
