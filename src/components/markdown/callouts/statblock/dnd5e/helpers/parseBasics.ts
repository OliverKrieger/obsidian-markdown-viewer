export function calculateModifier(score: number): string {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function parseAC(ac?: string): { armorClass?: number; armorType?: string } {
    if (!ac) return {};
    const n = ac.match(/-?\d+/);
    const armorClass = n ? Number(n[0]) : undefined;
    const t = ac.match(/\((.+?)\)/);
    const armorType = t?.[1]?.trim();
    return { armorClass, armorType };
}

export function parseHP(hp?: string): { hitPoints?: number; hitDice?: string } {
    if (!hp) return {};
    const n = hp.match(/-?\d+/);
    const hitPoints = n ? Number(n[0]) : undefined;
    const d = hp.match(/\((.+?)\)/);
    const hitDice = d?.[1]?.trim();
    return { hitPoints, hitDice };
}

export function parseCR(cr?: string): { challengeRating?: string; proficiencyBonus?: string } {
    if (!cr) return {};
    const pbMatch = cr.match(/\(([-+]\d+)\)\s*$/);
    const proficiencyBonus = pbMatch ? pbMatch[1] : undefined;
    const challengeRating = pbMatch ? cr.replace(/\(([-+]\d+)\)\s*$/, "").trim() : cr.trim();
    return { challengeRating, proficiencyBonus };
}
