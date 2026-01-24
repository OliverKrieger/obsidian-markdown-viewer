import type { Dnd5eAction, Dnd5eStatBlock } from "./types";

function normaliseKey(k: string) {
    return k.trim().toLowerCase();
}

function parseAbilities(value: string): Dnd5eStatBlock["abilities"] {
    // "STR 30 (+10), DEX 10 (+0), ..."
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

    // "- [[Thing]]" OR "[[Thing]]"
    const justLink = cleaned.match(/^\[\[(.+?)\]\]$/);
    if (justLink) {
        const ref = justLink[1].trim();
        return { name: ref, ref };
    }

    // "Name: rest"
    const idxColon = cleaned.indexOf(":");
    if (idxColon !== -1) {
        const name = cleaned.slice(0, idxColon).trim();
        const rest = cleaned.slice(idxColon + 1).trim();

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

    // "Name. rest" (common in 5e traits like "Legendary Resistance (3/Day). If...")
    const idxDot = cleaned.indexOf(".");
    if (idxDot > 0) {
        const name = cleaned.slice(0, idxDot).trim();
        const rest = cleaned.slice(idxDot + 1).trim();
        if (name && rest) return { name, text: rest };
    }

    // fallback: treat entire line as name
    return { name: cleaned };
}


type Section = "traits" | "actions" | "reactions" | "legendaryActions" | null;

export function parseDnd5e(lines: string[], title: string): Dnd5eStatBlock {
    const sb: Dnd5eStatBlock = {
        ruleset: "dnd5e",
        title,
        variant: "classic",
    };

    let section: Section = null;

    for (const rawLine of lines) {
        const line = rawLine.trim();

        // section headers
        if (/^traits\s*:\s*$/i.test(line)) {
            section = "traits";
            sb.traits ??= [];
            continue;
        }
        if (/^actions\s*:\s*$/i.test(line)) {
            section = "actions";
            sb.actions ??= [];
            continue;
        }
        if (/^reactions\s*:\s*$/i.test(line)) {
            section = "reactions";
            sb.reactions ??= [];
            continue;
        }
        if (/^legendaryactions\s*:\s*$/i.test(line) || /^legendary actions\s*:\s*$/i.test(line)) {
            section = "legendaryActions";
            sb.legendaryActions ??= [];
            continue;
        }

        // Always ignore empty lines (don’t end sections)
        if (!line) continue;

        // If we're inside a section...
        if (section) {
            // If we hit another section header, switch (your header logic above already does continue)
            // If we hit a normal key: value line (like "ac: ..."), we leave the section and fall through.
            if (/^[\w-]+\s*:/.test(line) && !line.startsWith("-")) {
                // IMPORTANT: only treat as "key: value" if the key is a known top-level field
                // otherwise "Bite: ..." would incorrectly exit the actions section.
                const k = normaliseKey(line.slice(0, line.indexOf(":")));
                const isTopLevelKey = new Set([
                    "ruleset",
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
                ]).has(k);

                if (isTopLevelKey) {
                    section = null; // fall through to key:value parsing
                } else {
                    // It's a section entry like "Bite: ..." — parse it as an action/trait/etc.
                    const entry = parseSectionEntry(line);
                    if (entry) {
                        if (section === "traits") sb.traits!.push(entry);
                        if (section === "actions") sb.actions!.push(entry);
                        if (section === "reactions") sb.reactions!.push(entry);
                        if (section === "legendaryActions") sb.legendaryActions!.push(entry);
                    }
                    continue;
                }
            } else {
                // Bullet or plain line inside the section
                const entry = parseSectionEntry(line);
                if (entry) {
                    if (section === "traits") sb.traits!.push(entry);
                    if (section === "actions") sb.actions!.push(entry);
                    if (section === "reactions") sb.reactions!.push(entry);
                    if (section === "legendaryActions") sb.legendaryActions!.push(entry);
                }
                continue;
            }
        }


        const idx = line.indexOf(":");
        if (idx === -1) continue;

        const key = normaliseKey(line.slice(0, idx));
        const value = line.slice(idx + 1).trim();
        if (!value) continue;

        switch (key) {
            case "ruleset":
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

    if (sb.traits?.length === 0) delete sb.traits;
    if (sb.actions?.length === 0) delete sb.actions;
    if (sb.reactions?.length === 0) delete sb.reactions;
    if (sb.legendaryActions?.length === 0) delete sb.legendaryActions;

    return sb;
}
