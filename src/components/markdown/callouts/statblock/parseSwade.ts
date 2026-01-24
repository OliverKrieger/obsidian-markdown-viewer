import type { StatBlockAbilityRef, SwadeStatBlock } from "./types";

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

function parseAbilityBullet(line: string): StatBlockAbilityRef | null {
    const cleaned = line.replace(/^\s*-\s*/, "").trim();
    if (!cleaned) return null;

    const justLink = cleaned.match(/^\[\[(.+?)\]\]$/);
    if (justLink) {
        const ref = justLink[1].trim();
        return { name: ref, ref };
    }

    const idx = cleaned.indexOf(":");
    if (idx === -1) {
        if (cleaned.length > 0) return { name: cleaned };
        return null;
    }

    const name = cleaned.slice(0, idx).trim();
    const rest = cleaned.slice(idx + 1).trim();

    const linkOnly = rest.match(/^\[\[(.+?)\]\]$/);
    if (linkOnly) {
        const ref = linkOnly[1].trim();
        return { name, ref };
    }

    const embedded = rest.match(/\[\[(.+?)\]\]/);
    if (embedded) {
        const ref = embedded[1].trim();
        const text = rest.replace(/\[\[(.+?)\]\]/, "").trim();
        return { name, ref, text: text || undefined };
    }

    return { name, text: rest || undefined };
}

type Section = "edges" | "hindrances" | "gear" | "special" | null;

export function parseSwade(lines: string[], title: string): SwadeStatBlock {
    const sb: SwadeStatBlock = {
        ruleset: "swade",
        title,
        variant: "default",
    };

    let section: Section = null;

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        // section headers
        if (/^edges\s*:?\s*$/i.test(line)) {
            section = "edges";
            sb.edges ??= [];
            continue;
        }
        if (/^hindrances\s*:?\s*$/i.test(line)) {
            section = "hindrances";
            sb.hindrances ??= [];
            continue;
        }
        if (/^gear\s*:?\s*$/i.test(line)) {
            section = "gear";
            sb.gear ??= [];
            continue;
        }
        if (/^special\s*:?\s*$/i.test(line) || /^special abilities\s*:?\s*$/i.test(line)) {
            section = "special";
            sb.special ??= [];
            continue;
        }

        // section mode: accept BOTH bullets and plain lines
        if (section) {
            // If we hit a top-level key:value line, exit section and fall through
            if (/^[\w-]+\s*:/.test(line)) {
                const k = normaliseKey(line.slice(0, line.indexOf(":")));
                const isTopLevelKey = new Set([
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
                ]).has(k);

                if (isTopLevelKey) {
                    section = null; // fallthrough to parse key/value
                } else {
                    // treat as section entry (rare)
                    if (section === "gear") {
                        sb.gear!.push(line.replace(/^\s*-\s*/, "").trim());
                    } else {
                        const dashNormalised = line.replace(/\s+[—–-]\s+/, ": ");
                        const ability = parseAbilityBullet(dashNormalised);
                        if (ability) {
                            if (section === "edges") sb.edges!.push(ability);
                            if (section === "hindrances") sb.hindrances!.push(ability);
                            if (section === "special") sb.special!.push(ability);
                        }
                    }
                    continue;
                }
            } else {
                // Plain section entry (most common)
                if (section === "gear") {
                    sb.gear!.push(line.replace(/^\s*-\s*/, "").trim());
                } else {
                    // Support "Name — text" by normalising to "Name: text"
                    const dashNormalised = line.replace(/\s+[—–-]\s+/, ": ");
                    const ability = parseAbilityBullet(dashNormalised);
                    if (ability) {
                        if (section === "edges") sb.edges!.push(ability);
                        if (section === "hindrances") sb.hindrances!.push(ability);
                        if (section === "special") sb.special!.push(ability);
                    }
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

    if (sb.edges?.length === 0) delete sb.edges;
    if (sb.hindrances?.length === 0) delete sb.hindrances;
    if (sb.special?.length === 0) delete sb.special;
    if (sb.gear?.length === 0) delete sb.gear;

    return sb;
}
