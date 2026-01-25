// src/.../swade/helpers/parseBasics.ts

export function parseWildCard(type?: string) {
    if (!type) return false;
    return /\bwild\s*card\b/i.test(type);
}

export function parseToughnessAndArmor(raw?: string): { tough?: number; armor?: number } {
    if (!raw) return {};
    const toughMatch = raw.match(/-?\d+/);
    const tough = toughMatch ? Number(toughMatch[0]) : undefined;
    const armorMatch = raw.match(/\((\d+)\)/);
    const armor = armorMatch ? Number(armorMatch[1]) : undefined;
    return { tough, armor };
}
