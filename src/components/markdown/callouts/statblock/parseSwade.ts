import type { SectionBlock, StatBlockAbilityRef, SwadeStatBlock } from "./types";

function normaliseKey(k: string) {
    return k.trim().toLowerCase();
}

function splitInlinePairs(s: string): Record<string, string> {
    const out: Record<string, string> = {};
    s.split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .forEach((part) => {
            const m = part.match(/^(.+?)\s+(d\d+|\d+|—|\+\d+|\-\d+|\d+\(\d+\))$/i);
            if (!m) return;
            out[m[1].trim()] = m[2].trim();
        });
    return out;
}

function parseAbilityLine(line: string): StatBlockAbilityRef | null {
    const cleaned = line.replace(/^\s*-\s*/, "").trim();
    if (!cleaned) return null;

    const justLink = cleaned.match(/^\[\[(.+?)\]\]$/);
    if (justLink) {
        const ref = justLink[1].trim();
        return { name: ref, ref };
    }

    const idx = cleaned.indexOf(":");
    if (idx === -1) return { name: cleaned };

    const name = cleaned.slice(0, idx).trim();
    const rest = cleaned.slice(idx + 1).trim();

    const linkOnly = rest.match(/^\[\[(.+?)\]\]$/);
    if (linkOnly) return { name, ref: linkOnly[1].trim() };

    const embedded = rest.match(/\[\[(.+?)\]\]/);
    if (embedded) {
        const ref = embedded[1].trim();
        const text = rest.replace(/\[\[(.+?)\]\]/, "").trim();
        return { name, ref, text: text || undefined };
    }

    return { name, text: rest || undefined };
}

type SectionKey = "edges" | "hindrances" | "gear" | "special" | null;

function ensureAbilitySection(sb: SwadeStatBlock, key: Exclude<SectionKey, "gear" | null>): SectionBlock<StatBlockAbilityRef> {
    const existing = sb[key] as SectionBlock<StatBlockAbilityRef> | undefined;
    if (existing) return existing;
    const created: SectionBlock<StatBlockAbilityRef> = { entries: [] };
    (sb as any)[key] = created;
    return created;
}

function ensureGearSection(sb: SwadeStatBlock): SectionBlock<string> {
    const existing = sb.gear as SectionBlock<string> | undefined;
    if (existing) return existing;
    const created: SectionBlock<string> = { entries: [] };
    sb.gear = created;
    return created;
}

export function parseSwade(lines: string[], title: string): SwadeStatBlock {
    const sb: SwadeStatBlock = {
        ruleset: "swade",
        title,
        variant: "default",
    };

    let section: SectionKey = null;

    const topLevelKeys = new Set([
        "ruleset",
        "type",
        "desc",
        "description",
        "attributes",
        "skills",
        "pace",
        "parry",
        "toughness",
        "tough",
        "charisma",
        "cha",
        "class",
        "classname",
        "variant",
    ]);

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        // section headers
        const h = line.replace(/\s*:?\s*$/, "").toLowerCase();
        if (h === "edges") { section = "edges"; ensureAbilitySection(sb, "edges"); continue; }
        if (h === "hindrances") { section = "hindrances"; ensureAbilitySection(sb, "hindrances"); continue; }
        if (h === "gear") { section = "gear"; ensureGearSection(sb); continue; }
        if (h === "special" || h === "special abilities") { section = "special"; ensureAbilitySection(sb, "special"); continue; }

        // section mode
        if (section) {
            // section-local desc:
            if (/^desc\s*:/i.test(line) || /^description\s*:/i.test(line)) {
                const idx = line.indexOf(":");
                const value = line.slice(idx + 1).trim();
                if (value) {
                    if (section === "gear") ensureGearSection(sb).desc = value;
                    else ensureAbilitySection(sb, section as any).desc = value;
                }
                continue;
            }

            // key:value line -> only exit section if it's a top-level key
            if (/^[\w-]+\s*:/.test(line) && !line.startsWith("-")) {
                const k = normaliseKey(line.slice(0, line.indexOf(":")));
                if (topLevelKeys.has(k)) {
                    section = null; // fallthrough to key:value parsing
                } else {
                    // treat as section entry (e.g. "Marksman: text")
                    if (section === "gear") ensureGearSection(sb).entries.push(line.replace(/^\s*-\s*/, "").trim());
                    else {
                        const ability = parseAbilityLine(line.replace(/\s+[—–-]\s+/, ": "));
                        if (ability) ensureAbilitySection(sb, section as any).entries.push(ability);
                    }
                    continue;
                }
            } else {
                // normal section entry
                if (section === "gear") {
                    ensureGearSection(sb).entries.push(line.replace(/^\s*-\s*/, "").trim());
                } else {
                    const dashNormalised = line.replace(/\s+[—–-]\s+/, ": ");
                    const ability = parseAbilityLine(dashNormalised);
                    if (ability) ensureAbilitySection(sb, section as any).entries.push(ability);
                }
                continue;
            }
        }

        // key: value lines
        const idx = line.indexOf(":");
        if (idx === -1) continue;

        const key = normaliseKey(line.slice(0, idx));
        const value = line.slice(idx + 1).trim();
        if (!value) continue;

        switch (key) {
            case "ruleset":
                break;

            case "type":
                sb.type = value;
                break;

            case "desc":
            case "description":
                sb.desc = value;
                break;

            case "attributes":
                sb.attributes = splitInlinePairs(value);
                break;

            case "skills":
                sb.skills = splitInlinePairs(value);
                break;

            case "pace":
                sb.pace = value;
                break;
            case "parry":
                sb.parry = value;
                break;
            case "toughness":
            case "tough":
                sb.toughness = value;
                break;
            case "charisma":
            case "cha":
                sb.charisma = value;
                break;

            case "class":
            case "classname":
                sb.className = value;
                break;

            case "variant":
                if (value === "compact" || value === "default") sb.variant = value;
                break;

            default:
                break;
        }
    }

    // clean empty sections
    const cleanAbilitySection = (k: "edges" | "hindrances" | "special") => {
        const sec = sb[k];
        if (sec && sec.entries.length === 0 && !sec.desc) delete (sb as any)[k];
    };
    cleanAbilitySection("edges");
    cleanAbilitySection("hindrances");
    cleanAbilitySection("special");

    if (sb.gear && sb.gear.entries.length === 0 && !sb.gear.desc) delete sb.gear;

    return sb;
}
