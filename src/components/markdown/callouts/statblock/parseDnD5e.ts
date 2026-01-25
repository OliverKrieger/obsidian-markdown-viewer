import type { Dnd5eAction, Dnd5eStatBlock, SectionBlock } from "./types";

function normaliseKey(k: string) {
    return k.trim().toLowerCase();
}

function parseAbilities(value: string): Dnd5eStatBlock["abilities"] {
    const out: any = {};
    const parts = value.split(",").map((p) => p.trim()).filter(Boolean);

    for (const part of parts) {
        const m = part.match(/^(STR|DEX|CON|INT|WIS|CHA)\s+(\d+)\s*\(([-+]\d+)\)$/i);
        if (!m) continue;
        const key = m[1].toUpperCase();
        const score = Number(m[2]);
        const mod = m[3];
        out[key] = { score, mod };
    }

    return Object.keys(out).length ? out : undefined;
}

function parseSectionEntry(line: string): Dnd5eAction | null {
    const cleaned = line.replace(/^\s*-\s*/, "").trim();
    if (!cleaned) return null;

    // [[Thing]]
    const justLink = cleaned.match(/^\[\[(.+?)\]\]$/);
    if (justLink) {
        const ref = justLink[1].trim();
        return { name: ref, ref };
    }

    // Name: rest
    const idxColon = cleaned.indexOf(":");
    if (idxColon !== -1) {
        const name = cleaned.slice(0, idxColon).trim();
        const rest = cleaned.slice(idxColon + 1).trim();

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

    // Name. rest
    const idxDot = cleaned.indexOf(".");
    if (idxDot > 0) {
        const name = cleaned.slice(0, idxDot).trim();
        const rest = cleaned.slice(idxDot + 1).trim();
        if (name && rest) return { name, text: rest };
    }

    return { name: cleaned };
}

type SectionKey =
    | "traits"
    | "actions"
    | "reactions"
    | "legendaryActions"
    | "bonusActions"
    | "spells"
    | "feats"
    | "special"
    | null;

function ensureSection(sb: Dnd5eStatBlock, key: Exclude<SectionKey, null>): SectionBlock<Dnd5eAction> {
    const existing = sb[key] as SectionBlock<Dnd5eAction> | undefined;
    if (existing) return existing;
    const created: SectionBlock<Dnd5eAction> = { entries: [] };
    (sb as any)[key] = created;
    return created;
}

export function parseDnd5e(lines: string[], title: string): Dnd5eStatBlock {
    const sb: Dnd5eStatBlock = {
        ruleset: "dnd5e",
        title,
        variant: "classic",
    };

    let section: SectionKey = null;

    const topLevelKeys = new Set([
        "ruleset",
        "desc",
        "size",
        "creaturetype",
        "type",
        "alignment",
        "ac",
        "armorclass",
        "hp",
        "hitpoints",
        "speed",
        "abilities",
        "saves",
        "savingthrows",
        "skills",
        "immunities",
        "damageimmunities",
        "resistances",
        "damageresistances",
        "vulnerabilities",
        "damagevulnerabilities",
        "conditionimmunities",
        "senses",
        "languages",
        "cr",
        "challenge",
        "class",
        "classname",
        "variant",
    ]);

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        // section headers (colon optional)
        const sectionHeader = line.replace(/\s*:?\s*$/, "").toLowerCase();

        if (sectionHeader === "traits") { section = "traits"; ensureSection(sb, "traits"); continue; }
        if (sectionHeader === "actions") { section = "actions"; ensureSection(sb, "actions"); continue; }
        if (sectionHeader === "reactions") { section = "reactions"; ensureSection(sb, "reactions"); continue; }
        if (sectionHeader === "legendaryactions" || sectionHeader === "legendary actions") {
            section = "legendaryActions"; ensureSection(sb, "legendaryActions"); continue;
        }

        // optional future sections (won't break older blocks)
        if (sectionHeader === "bonusactions" || sectionHeader === "bonus actions") {
            section = "bonusActions"; ensureSection(sb, "bonusActions"); continue;
        }
        if (sectionHeader === "spells") { section = "spells"; ensureSection(sb, "spells"); continue; }
        if (sectionHeader === "feats") { section = "feats"; ensureSection(sb, "feats"); continue; }
        if (sectionHeader === "special") { section = "special"; ensureSection(sb, "special"); continue; }

        // section mode
        if (section) {
            // allow section-local desc:
            if (/^desc\s*:/i.test(line) || /^description\s*:/i.test(line)) {
                const idx = line.indexOf(":");
                const value = line.slice(idx + 1).trim();
                if (value) ensureSection(sb, section).desc = value;
                continue;
            }

            // if line is key:value, only exit section if it's a known TOP-LEVEL key
            if (/^[\w-]+\s*:/.test(line) && !line.startsWith("-")) {
                const k = normaliseKey(line.slice(0, line.indexOf(":")));
                if (topLevelKeys.has(k)) {
                    section = null; // fall through to parse key:value
                } else {
                    // treat as an entry like "Bite: ..."
                    const entry = parseSectionEntry(line);
                    if (entry) ensureSection(sb, section).entries.push(entry);
                    continue;
                }
            } else {
                // bullet or plain line entry
                const entry = parseSectionEntry(line);
                if (entry) ensureSection(sb, section).entries.push(entry);
                continue;
            }
        }

        // top-level key:value
        const idx = line.indexOf(":");
        if (idx === -1) continue;

        const key = normaliseKey(line.slice(0, idx));
        const value = line.slice(idx + 1).trim();
        if (!value) continue;

        switch (key) {
            case "ruleset":
                break;

            case "desc":
            case "description":
                sb.desc = value;
                break;

            case "size":
                sb.size = value;
                break;
            case "creaturetype":
            case "type":
                sb.creatureType = value;
                break;
            case "alignment":
                sb.alignment = value;
                break;

            case "ac":
            case "armorclass":
                sb.ac = value;
                break;
            case "hp":
            case "hitpoints":
                sb.hp = value;
                break;
            case "speed":
                sb.speed = value;
                break;

            case "abilities":
                sb.abilities = parseAbilities(value);
                break;

            case "saves":
            case "savingthrows":
                sb.saves = value;
                break;
            case "skills":
                sb.skills = value;
                break;

            case "immunities":
            case "damageimmunities":
                sb.immunities = value;
                break;
            case "resistances":
            case "damageresistances":
                sb.resistances = value;
                break;
            case "vulnerabilities":
            case "damagevulnerabilities":
                sb.vulnerabilities = value;
                break;
            case "conditionimmunities":
                sb.conditionImmunities = value;
                break;

            case "senses":
                sb.senses = value;
                break;
            case "languages":
                sb.languages = value;
                break;

            case "cr":
            case "challenge":
                sb.cr = value;
                break;

            case "class":
            case "classname":
                sb.className = value;
                break;

            case "variant":
                if (value === "classic" || value === "compact") sb.variant = value;
                break;

            default:
                break;
        }
    }

    // clean empty sections
    const maybeDelete = (k: Exclude<SectionKey, null>) => {
        const sec = sb[k] as SectionBlock<Dnd5eAction> | undefined;
        if (sec && sec.entries.length === 0 && !sec.desc) delete (sb as any)[k];
    };
    (["traits", "actions", "reactions", "legendaryActions", "bonusActions", "spells", "feats", "special"] as const).forEach(maybeDelete);

    return sb;
}
