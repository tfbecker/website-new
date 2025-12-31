---
title: "Ralph Wiggum Kills Process Mining"
date: "2025-12-31"
type: "rougher-thought"
---

I'm tinkering with the <a href="https://github.com/anthropics/claude-code/tree/main/plugins" data-tooltip="Claude Code plugin that runs Claude in a loop">Ralph Wiggum</a> Claude Code plugin. This isn't a new idea—it goes back to ~2023 when GPT-4 Engineer was on GitHub and people ran GPT-4 in a loop until it produced something worthwhile.

This is the second iteration: better tool calling, subscription model to mitigate high LLM costs.

The impact on white-collar work will be profound:

**1. Well-documented jobs get automated first**

Data entry, customer support, anything with clear inputs/outputs and verifiable correctness. You just run the LLM in a loop until it passes unit tests—which you also dynamically generate.

**2. Process mining from unstructured data**

This is the more profound impact. Traditional process mining uses database logs, transaction histories, ERP systems. Structured data.

Instead: loop through a thousand customer support emails to backpropagate how the support policies actually work. Or ingest Slack messages to understand how decisions get made.

This is tremendously helpful for external consultants or process managers working with companies where processes exist only as tribal knowledge and are never documented.

![Ralph Wiggum](/fun/ralph-wiggum.webp)
