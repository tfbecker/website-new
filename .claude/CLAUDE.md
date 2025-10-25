# Blog Post Writing Guidelines

## Footnote Formatting

When writing blog posts, use markdown-style footnotes with interactive popovers. This allows readers to view footnote content without scrolling, while keeping the full reference at the bottom for printing.

### Format

**In the text:**
```markdown
This is a sentence with a footnote.[^1]
```

**At the bottom of the post:**
```markdown
[^1]: This is the footnote content. Can include links: <a href="https://example.com">Link text</a>
```

### Rules

1. **Numbering**: Use sequential numbering starting from [^1]
2. **Placement**: Put footnote references immediately after punctuation (before the period/comma)
3. **Content**: Footnote definitions go at the bottom of the post, after all content
4. **Links**: Use HTML `<a>` tags within footnotes for consistency with the rest of the post
5. **Spacing**: Add a blank line before the footnote definitions section

### Example

```markdown
---
title: "My Blog Post"
date: "2025-10-25"
type: "thought"
---

Here is my main content with a footnote reference.[^1] And another sentence with a second footnote.[^2]

More content here.

[^1]: This is the first footnote with a <a href="https://example.com">link</a>.
[^2]: This is the second footnote.
```

### Interactive Behavior

- **Animation**: Footnote references have a subtle pulse animation to hint interactivity
- **Desktop**: Footnotes show in a popover on hover
- **Mobile**: Footnotes show in a popover on click/tap
- **Desktop fallback**: Clicking the footnote reference jumps to the bottom (traditional behavior)
- **Printing**: Full footnotes appear at bottom of page

The footnote references are styled in blue with a gentle pulsing animation that stops on hover, signaling to readers that they can interact with them.

## Link Tooltips

You can add descriptive tooltips to any link using the `data-tooltip` attribute. These appear on hover (desktop) or click (mobile).

### Format

```markdown
<a href="https://example.com" data-tooltip="This is a helpful description of what the link is about">Link Text</a>
```

### Example

```markdown
Companies like <a href="https://www.langdock.com/" data-tooltip="I sadly passed on the opportunity to invest in their seed round after Y Combinator. Big mistake - they're executing so well.">Langdock</a> built better interfaces.
```

### Styling

- Links with tooltips have a **dotted underline** to hint interactivity
- On hover, the underline becomes solid
- Tooltip appears in a popover below the link
- On mobile: first tap shows tooltip, second tap follows the link
