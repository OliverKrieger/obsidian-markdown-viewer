# Adding a New Statblock Ruleset (Developer Guide)

This document explains how to add a new ruleset to the statblock system.

---

## 1️⃣ Define the Types

In `types.ts`:

```ts
export type MyRuleStatBlock = {
  ruleset: "myrule";
  title: string;
  desc?: string;

  stats?: Record<string, string>;

  abilities?: {
    desc?: string;
    entries: AbilityEntry[];
  };
};
```

All sections must follow the pattern:

```ts
{
  desc?: string;
  entries: T[];
}
```
This enables:
- flexible rendering
- section descriptions
- consistent layouts

---

## 2️⃣ Write the Parser

Create:

```md
myrule/
  parseMyRule.ts
```

Responsibilities:
- Parse key: value
- Detect section headers
- Capture desc: inside sections
- Normalize data into the shared shape

Parser signature:

```ts
export function parseMyRule(
  lines: string[],
  title: string
): MyRuleStatBlock
```

---

## 3️⃣ Register the Ruleset

In the statblock dispatcher:
```ts
if (ruleset === "myrule") return parseMyRule(lines, title);
```

---

## 4️⃣ Build Renderer Components

Split rendering into focused helpers:

```md
myrule/components/
  MyRuleHeader.tsx
  MyRuleStats.tsx
  MyRuleAbilityLine.tsx
```

Use shared infrastructure:
- StatBlockSection
- statblock-columns
- shared link & hover components

---

## 5️⃣ Responsive Layout

Add a weight helper:

```md
myrule/helpers/statBlockSizeHelper.ts
```

Return a numeric “content weight” used to determine:
- max width
- column density
- visual scaling

---

## 6️⃣ Styling Rules

- Never hardcode colors
- Use Tailwind or CSS variables only
- Sections must include break-inside: avoid
- Never assume column count
- Headings must be readable standalone

---

## ✅ Ruleset Checklist

✔ `ruleset:` declared  
✔ Parser handles sections + desc  
✔ Renderer uses `StatBlockSection`
✔ Column waterfall enabled
✔ Hover/link infra supported

---

## Future Improvements:

- Schema validation + Markdown linting
- Authoring warnings
- Per-ruleset theming overrides