type SectionLike = {
    desc?: string;
    entries?: Array<{ name: string; text?: string; ref?: string }>;
};

function sectionTextLen(sec?: SectionLike) {
    if (!sec) return 0;
    const descLen = sec.desc?.length ?? 0;
    const entriesLen =
        (sec.entries ?? []).reduce(
            (sum, e) =>
                sum +
                (e.name?.length ?? 0) +
                (e.text?.length ?? 0) +
                (e.ref?.length ?? 0),
            0
        );

    return descLen + entriesLen;
}

export function dnd5eStatBlockWeight(sb: {
    desc?: string;
    traits?: SectionLike;
    actions?: SectionLike;
    bonusActions?: SectionLike;
    reactions?: SectionLike;
    legendaryActions?: SectionLike;
    spells?: SectionLike;
    feats?: SectionLike;
    special?: SectionLike;
}) {
    return (
        (sb.desc?.length ?? 0) +
        sectionTextLen(sb.traits) +
        sectionTextLen(sb.actions) +
        sectionTextLen(sb.bonusActions) +
        sectionTextLen(sb.reactions) +
        sectionTextLen(sb.legendaryActions) +
        sectionTextLen(sb.spells) +
        sectionTextLen(sb.feats) +
        sectionTextLen(sb.special)
    );
}
