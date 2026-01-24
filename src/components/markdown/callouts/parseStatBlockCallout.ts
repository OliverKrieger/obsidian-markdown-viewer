// src/components/markdown/callouts/parseStatBlockCallout.ts
type HastNode = any;

function getTextFromNode(node: HastNode): string {
    if (!node) return "";
    if (node.type === "text" && typeof node.value === "string") return node.value;
    if (Array.isArray(node.children)) return node.children.map(getTextFromNode).join("");
    return "";
}

function normaliseKey(k: string) {
    return k.trim().toLowerCase();
}

function parseInlinePairs(s: string): Record<string, string> {
    // "Agility d8, Smarts d4" -> { agility: "d8", smarts: "d4" }
    const out: Record<string, string> = {};
    s.split(",").map(x => x.trim()).filter(Boolean).forEach(part => {
        const m = part.match(/^(.+?)\s+(d\d+|\d+|—)$/i);
        if (!m) return;
        out[m[1].trim()] = m[2].trim();
    });
    return out;
}

export type StatBlockAbility = {
    name?: string;     // "Undead"
    text?: string;     // "+2 Toughness..."
    ref?: string;      // "Undead" (wikilink target)
};

export type ParsedStatBlock = {
    title: string;
    desc?: string;

    attributes?: Record<string, string>;
    skills?: Record<string, string>;

    pace?: string;
    parry?: string;
    toughness?: string;

    edges?: string;
    hindrances?: string;
    gear?: string;

    special?: StatBlockAbility[];

    className?: string;
    variant?: "compact" | "default";
};

function parseAbilityLine(line: string): StatBlockAbility | null {
    // supports:
    // "- Undead: [[Undead]]"
    // "- Undead: +2 Toughness..."
    // "- [[Undead]]"
    const cleaned = line.replace(/^\s*-\s*/, "").trim();

    // Just [[Thing]]
    const justLink = cleaned.match(/^\[\[(.+?)\]\]$/);
    if (justLink) return { ref: justLink[1].trim(), name: justLink[1].trim() };

    // "Name: rest"
    const idx = cleaned.indexOf(":");
    if (idx === -1) return null;

    const name = cleaned.slice(0, idx).trim();
    const rest = cleaned.slice(idx + 1).trim();

    const link = rest.match(/^\[\[(.+?)\]\]$/);
    if (link) return { name, ref: link[1].trim() };

    // Or allow ref embedded anywhere: "See [[Undead]]"
    const embedded = rest.match(/\[\[(.+?)\]\]/);
    if (embedded) return { name, ref: embedded[1].trim(), text: rest.replace(/\[\[(.+?)\]\]/, "").trim() || undefined };

    return { name, text: rest };
}

export function parseStatBlockCallout(
    blockquoteNode: HastNode,
    calloutHeaderText: string,
    headerTitle?: string
): ParsedStatBlock {
    const raw = getTextFromNode(blockquoteNode);

    const lines = raw
        .split(/\r?\n/)
        .map(l => l.trimEnd())
        .filter(l => l.trim().length > 0);

    // remove header line exactly
    const bodyLines = lines.filter(l => l.trim() !== calloutHeaderText.trim());

    const sb: ParsedStatBlock = {
        title: headerTitle?.trim() || "Stat Block",
        special: [],
        variant: "default",
    };

    let inSpecial = false;

    for (const line of bodyLines) {
        const trimmed = line.trim();

        // Start of special section
        if (/^special\s*:\s*$/i.test(trimmed) || /^special abilities\s*:\s*$/i.test(trimmed)) {
            inSpecial = true;
            continue;
        }

        if (inSpecial) {
            // Expect bullets. If we hit a new top-level key, stop special mode.
            if (/^[\w-]+\s*:\s*/.test(trimmed) && !trimmed.startsWith("-")) {
                inSpecial = false;
                // fall through to normal parsing
            } else {
                if (trimmed.startsWith("-")) {
                    const ability = parseAbilityLine(trimmed);
                    if (ability) sb.special!.push(ability);
                }
                continue;
            }
        }

        // Key: value lines
        const idx = trimmed.indexOf(":");
        if (idx === -1) continue;

        const key = normaliseKey(trimmed.slice(0, idx));
        const value = trimmed.slice(idx + 1).trim();
        if (!value) continue;

        switch (key) {
            case "desc":
            case "description":
                sb.desc = value;
                break;

            case "attributes":
                sb.attributes = parseInlinePairs(value);
                break;
            case "skills":
                sb.skills = parseInlinePairs(value);
                break;

            case "pace":
                sb.pace = value;
                break;
            case "parry":
                sb.parry = value;
                break;
            case "toughness":
                sb.toughness = value;
                break;

            case "edges":
                sb.edges = value;
                break;
            case "hindrances":
                sb.hindrances = value;
                break;
            case "gear":
                sb.gear = value;
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

    if (sb.special && sb.special.length === 0) delete sb.special;
    return sb;
}
