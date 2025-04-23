---
title: "The Tool to Build LLM Tools"
date: "2024-01-01"
type: "thought"
---

Google was not the first search company, but it was the first to introduce PageRank. This made all the difference. Since the advent of GPT-4, I've been anticipating the emergence of a new Google. However, I'm skeptical that Perplexity or You.com represent the next evolution of search.

The new internet search engine will transform websites into services, akin to LLM tools. Consider the following scenarios:

- You want to book a restaurant in city X. The process might involve using Google Maps to generate a list, Yelp to check menus, parsing the menu PDFs, and then utilizing several booking SaaS platforms to confirm availability.
- You could use LinkedIn and Crunchbase to construct complex nested queries to identify potential contacts.

These use cases involve multi-step processes and require deep integrations into services. The big question is, who will build these integrations? Unlike the 'Zapierfication' of the internet, many of these services are resistant to programmatic data access.

There are three approaches to convert websites into LLM digestable services/tools:

1. Vision-based action models, such as Adept.
2. Scrapers combined with HTML minifiers, like TinyFish.
3. API tools, for example, Multi On and Anon.com.

I believe that information retrieval will involve a combination of the first two approaches, but to truly advance web interactivity, we must address the third challenge.

There are two types of tasks to consider:

1. Public APIs: These will likely be addressed with OpenAPI configurations and tools within the next two years (Edit 2025: this is now called Model Context Protocol/ MCP - same stuff).
2. Private APIs: These present several challenges, including lack of documentation, rapid changes leading to brittleness, rate limiting, and authentication issues like cookie handling and rotation.

I am curious about who is developing the tools to construct LLM tools from private APIs. Anon.com is a promising first step, but the question remains: can this process be automated? 

Edit: [Integuru](https://github.com/Integuru-AI/Integuru) launched with the last YC batch and looks exactly like what I'm describing.