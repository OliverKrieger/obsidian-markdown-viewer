// src/.../swade/helpers/statBlockSizeHelper.ts
import type { SwadeStatBlock } from "../../types";

type SectionLike = { desc?: string; entries?: any[] } | undefined;

function sectionWeight(sec: SectionLike) {
    if (!sec) return 0;
    let w = 0;
    if (sec.desc) w += sec.desc.length * 1.1;
    if (sec.entries?.length) w += sec.entries.length * 55;
    return w;
}

export function swadeStatBlockWeight(
    sb: Pick<SwadeStatBlock, "desc" | "skills" | "edges" | "hindrances" | "special" | "gear">
) {
    let w = 0;

    if (sb.desc) w += sb.desc.length * 1.2;
    if (sb.skills) w += Object.keys(sb.skills).length * 18;

    w += sectionWeight(sb.edges);
    w += sectionWeight(sb.hindrances);
    w += sectionWeight(sb.special);
    w += sectionWeight(sb.gear);

    return w;
}
