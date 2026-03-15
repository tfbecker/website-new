---
title: "Autonomous E-Commerce"
date: "2026-03-16"
type: "thought"
---

openai tried to build checkout inside chatgpt. <a href="https://hellopartner.com/2026/03/09/openai-pulls-plug-on-chatgpt-checkout-plans/" data-tooltip="OpenAI killed in-chat checkout after near-zero merchant adoption">they killed it in march</a>. users treated the chat as a research tool, not a store. merchants didn't integrate. tax compliance was a mess. the biggest AI company in the world couldn't bolt commerce onto a chat interface.

so the consumer-facing "buy in chat" thing is dead. but the merchant side? that's where it gets interesting.

## the data problem is solved

i can point an AI at all our PDF datasheets and the product data problem is essentially solved. we did this at work with claude code. unstructured manufacturer PDFs, structured product attributes come out the other end. complete and correct. no rules engine, no template mapping, just "read this and tell me the dimensions, material, and weight class."

i genuinely don't see why <a href="https://www.akeneo.com/" data-tooltip="Product Information Management system">PIM</a> automation startups still exist. the entire category of "help companies clean up product data" is collapsing into a prompt. this is not a futuristic take. we're running this in production today.

## marketplaces should win (but don't yet)

if structured data becomes free, platforms with the most products should dominate. in our industry that's <a href="https://www.manomano.de/" data-tooltip="European DIY/home improvement marketplace">ManoMano</a> and similar specialized marketplaces. they have the catalog breadth. but the user experience is still mediocre. discovery is bad. recommendations are generic. nobody has figured out how to make a marketplace feel like it understands what you actually need.

## e-commerce is the oldest AI problem

when i started my current job last summer, i told my colleagues: what is an e-commerce shop, really? you have an offer. you run ads. you observe user behavior. you optimize for AOV, total contribution margin, customer lifetime value, pick your metric. a bunch of inputs, squashed together, optimizing for a single output.

this is the oldest fucking problem in AI. and a surprising number of startups have broken their teeth trying to solve it with ML.

## the ralph wiggum evolution

in my <a href="/posts/ralph-wiggum-kills-process-mining">ralph wiggum post</a> i wrote about running LLMs in brute-force loops on verifiable outputs. that idea has now matured.

<a href="https://github.com/karpathy/autoresearch" data-tooltip="Single-file autonomous ML experimentation loop">karpathy's autoresearch</a> is the blueprint. define an objective, let an agent modify the code, run the experiment, evaluate, iterate. 12 experiments per hour, 80-100 overnight, completely unattended. the human shifts from experimenter to experimental designer.

now replace "train.py" with "product page" or "pricing algorithm" and you have autonomous e-commerce.

## who's building this

<a href="https://www.sequen.ai/" data-tooltip="RL-native e-commerce optimization, $162M incremental revenue for first 5 customers">sequen</a> is the most interesting company i've found here. they built "Large Event Models". like LLMs predict the next word, LEMs predict the next user event. click, purchase, bounce. the whole system runs on reinforcement learning, not retrofitted search. their first 5 customers saw $162M in incremental revenue in 7 months.

<a href="https://www.coframe.com/" data-tooltip="Autonomous A/B testing - websites optimize themselves">coframe</a> takes the experimentation angle. multi-agent system that runs the full A/B testing loop autonomously. ideate variants, design them, deploy, analyze. the website optimizes itself. they just <a href="https://www.prnewswire.com/news-releases/coframe-acquires-haystacksai-and-appoints-ceo-bo-mohazzabi-as-vp-of-gtm-to-accelerate-its-ai-growth-agent-302703687.html" data-tooltip="March 2026 acquisition">acquired HaystacksAI</a> and claim $150M+ incremental revenue across customers.

## why this is a big deal

the theoretical foundation is <a href="https://www.promptfoo.dev/blog/rlvr-explained/" data-tooltip="Reinforcement Learning with Verifiable Rewards">RLVR</a>. reinforcement learning with verifiable rewards. same idea that makes <a href="https://arxiv.org/pdf/2501.12948" data-tooltip="DeepSeek-R1 paper">DeepSeek-R1</a> reason well. you don't need human-labeled preferences. you need measurable business outcomes as the reward signal. did conversion go up? did AOV increase? binary, verifiable, automated.

for any online shop with decent traffic, the question is no longer "should we do this" but "who figures out the right reward function first." whoever makes these detail decisions early and optimizes consistently will compound their advantage every single day.

chatgpt tried to reinvent the storefront. the real disruption is making the existing storefront optimize itself.
