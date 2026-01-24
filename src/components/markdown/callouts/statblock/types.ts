export type StatBlockRuleset = "swade" | "dnd5e" | string;

export type ManifestLike = {
    slugMap: Record<string, string>;
    pageMeta?: Record<string, any>;
};

export type StatBlockAbilityRef = {
    name: string;          // display label
    text?: string;         // inline description (optional)
    ref?: string;          // wikilink target (optional)
};

export type SwadeStatBlock = {
    ruleset: "swade";
    title: string;

    type?: string; // e.g. "Human (Wild Card)"
    desc?: string;

    attributes?: Record<string, string>; // Agi -> d10
    skills?: Record<string, string>;     // Fighting -> d8

    pace?: string;
    parry?: string;
    toughness?: string;
    charisma?: string;

    edges?: StatBlockAbilityRef[];
    hindrances?: StatBlockAbilityRef[];
    gear?: string[];

    special?: StatBlockAbilityRef[];

    className?: string;
    variant?: "compact" | "default";
};

export type Dnd5eAction = {
    name: string;
    text?: string;
    ref?: string;
};

export type Dnd5eStatBlock = {
    ruleset: "dnd5e";
    title: string;

    size?: string;
    creatureType?: string;
    alignment?: string;

    ac?: string;
    hp?: string;
    speed?: string;

    abilities?: {
        STR?: { score: number; mod: string };
        DEX?: { score: number; mod: string };
        CON?: { score: number; mod: string };
        INT?: { score: number; mod: string };
        WIS?: { score: number; mod: string };
        CHA?: { score: number; mod: string };
    };

    saves?: string;
    skills?: string;
    immunities?: string;
    resistances?: string;
    vulnerabilities?: string;
    conditionImmunities?: string;

    senses?: string;
    languages?: string;

    cr?: string;

    traits?: Dnd5eAction[];
    actions?: Dnd5eAction[];
    reactions?: Dnd5eAction[];
    legendaryActions?: Dnd5eAction[];

    className?: string;
    variant?: "classic" | "compact";
};

export type UnknownStatBlock = {
    ruleset: string;
    title: string;
    raw: string;
    className?: string;
};

export type NormalizedStatBlock = SwadeStatBlock | Dnd5eStatBlock | UnknownStatBlock;
