export type StatBlockRuleset = "swade" | "dnd5e" | string;

export type ManifestLike = {
    slugMap: Record<string, string>;
    pageMeta?: Record<string, any>;
};

export type SectionBlock<TEntry> = {
    desc?: string;
    entries: TEntry[];
};

// -------------------------
// D&D 5e
// -------------------------

export type Dnd5eAction = {
    name: string;
    text?: string;
    ref?: string;
};

export type Dnd5eStatBlock = {
    ruleset: "dnd5e";
    title: string;
    variant: "classic" | "compact";
    className?: string;

    // top-level meta
    desc?: string;

    // core fields
    size?: string;
    creatureType?: string;
    alignment?: string;

    ac?: string;
    hp?: string;
    speed?: string;

    abilities?: Record<string, { score: number; mod: string }> | undefined;

    saves?: string;
    skills?: string;

    resistances?: string;
    immunities?: string;
    vulnerabilities?: string;
    conditionImmunities?: string;

    senses?: string;
    languages?: string;
    cr?: string;

    // sectioned blocks (NEW SHAPE)
    traits?: SectionBlock<Dnd5eAction>;
    actions?: SectionBlock<Dnd5eAction>;
    reactions?: SectionBlock<Dnd5eAction>;
    legendaryActions?: SectionBlock<Dnd5eAction>;

    // Optional future sections (you can add later without refactors)
    bonusActions?: SectionBlock<Dnd5eAction>;
    spells?: SectionBlock<Dnd5eAction>;
    feats?: SectionBlock<Dnd5eAction>;
    special?: SectionBlock<Dnd5eAction>;
};

// -------------------------
// SWADE
// -------------------------

export type StatBlockAbilityRef = {
    name: string;
    text?: string;
    ref?: string;
};

export type SwadeStatBlock = {
    ruleset: "swade";
    title: string;
    variant: "default" | "compact";
    className?: string;

    // top-level meta
    desc?: string;
    type?: string;

    attributes?: Record<string, string>;
    skills?: Record<string, string>;

    pace?: string;
    parry?: string;
    toughness?: string;
    charisma?: string;

    // sectioned blocks (NEW SHAPE)
    edges?: SectionBlock<StatBlockAbilityRef>;
    hindrances?: SectionBlock<StatBlockAbilityRef>;
    special?: SectionBlock<StatBlockAbilityRef>;

    // gear is just strings today
    gear?: SectionBlock<string>;
};

export type UnknownStatBlock = {
    ruleset: string;
    title: string;
    raw: string;
    className?: string;
};

export type NormalizedStatBlock = SwadeStatBlock | Dnd5eStatBlock | UnknownStatBlock;
