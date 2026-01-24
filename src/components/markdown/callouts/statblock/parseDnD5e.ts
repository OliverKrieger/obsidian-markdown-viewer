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

function parseActionBullet(line: string): Dnd5eAction | null {
    const cleaned = line.replace(/^\s*-\s*/, "").trim();

    // "- [[Thing]]"
    const justLink = cleaned.match(/^\[\[(.+?)\]\]$/);
    if (justLink) {
        const ref = justLink[1].trim();
        return { name: ref, ref };
    }

    // "- Name: [[Ref]]" OR "- Name: text"
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

    return { name, text: rest };
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

        // bullets within sections
        if (section && line.startsWith("-")) {
            const a = parseActionBullet(line);
            if (a) {
                if (section === "traits") sb.traits!.push(a);
                if (section === "actions") sb.actions!.push(a);
                if (section === "reactions") sb.reactions!.push(a);
                if (section === "legendaryActions") sb.legendaryActions!.push(a);
            }
            continue;
        }

        // leaving section if we hit a key: value
        if (section && /^[\w-]+\s*:/.test(line)) {
            section = null;
            // fallthrough
        } else if (section) {
            continue;
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
