import React from "react";
import type { Dnd5eStatBlock, ManifestLike } from "../types";
import { OrnamentBorder, StatDivider } from "./Shared";
import { StatBlockSection } from "./shared/StatBlockSection";

import { parseAC, parseCR, parseHP } from "../dnd5e/helpers/parseBasics";
import { Dnd5eHeader } from "../dnd5e/components/Dnd5eHeader";
import { Dnd5eBasicStats } from "../dnd5e/components/Dnd5eBasicStats";
import { Dnd5eAbilityGrid } from "../dnd5e/components/Dnd5eAbilityGrid";
import { Dnd5eAdditionalStats } from "../dnd5e/components/Dnd5eAdditionalStats";
import { Dnd5eActionLine } from "../dnd5e/components/Dnd5eActionLine";

export const Dnd5eStatBlockCard: React.FC<Dnd5eStatBlock & { manifest?: ManifestLike }> = ({
    title,
    size,
    creatureType,
    alignment,
    ac,
    hp,
    speed,
    abilities,
    saves,
    skills,
    resistances,
    immunities,
    vulnerabilities,
    conditionImmunities,
    senses,
    languages,
    cr,

    desc,

    traits,
    actions,
    bonusActions,
    reactions,
    legendaryActions,
    spells,
    feats,
    special,

    className,
    manifest,
}) => {
    const { armorClass, armorType } = parseAC(ac);
    const { hitPoints, hitDice } = parseHP(hp);
    const { challengeRating, proficiencyBonus } = parseCR(cr);

    const subtitle = [size, creatureType, alignment].filter(Boolean).join(" ");

    return (
        <div
            className={[
                "relative bg-brand-100/20 p-6 w-full shadow-lg border-2 border-brand-500/40",
                "max-w-md md:max-w-2xl xl:max-w-3xl 2xl:max-w-7xl",
                className ?? "",
            ].join(" ")}
        >
            <OrnamentBorder />

            <Dnd5eHeader title={title} subtitle={subtitle} desc={desc} />

            <StatDivider />

            <Dnd5eBasicStats
                armorClass={armorClass}
                acRaw={ac}
                armorType={armorType}
                hitPoints={hitPoints}
                hpRaw={hp}
                hitDice={hitDice}
                speed={speed}
            />

            <StatDivider />

            <Dnd5eAbilityGrid abilities={abilities} />

            <StatDivider />

            <Dnd5eAdditionalStats
                saves={saves}
                skills={skills}
                resistances={resistances}
                immunities={immunities}
                vulnerabilities={vulnerabilities}
                conditionImmunities={conditionImmunities}
                senses={senses}
                languages={languages}
                challengeRating={challengeRating}
                crRaw={cr}
                proficiencyBonus={proficiencyBonus}
            />

            <StatDivider />

            {/* WATERFALL SECTION AREA */}
            <div className="statblock-columns">
                {traits?.entries?.length ? (
                    <StatBlockSection title="Traits" desc={traits.desc}>
                        <div className="space-y-2 text-sm">
                            {traits.entries.map((t, i) => (
                                <Dnd5eActionLine key={i} item={t} manifest={manifest} />
                            ))}
                        </div>
                    </StatBlockSection>
                ) : null}

                {actions?.entries?.length ? (
                    <StatBlockSection title="Actions" desc={actions.desc}>
                        <div className="space-y-2 text-sm">
                            {actions.entries.map((a, i) => (
                                <Dnd5eActionLine key={i} item={a} manifest={manifest} />
                            ))}
                        </div>
                    </StatBlockSection>
                ) : null}

                {bonusActions?.entries?.length ? (
                    <StatBlockSection title="Bonus Actions" desc={bonusActions.desc}>
                        <div className="space-y-2 text-sm">
                            {bonusActions.entries.map((a, i) => (
                                <Dnd5eActionLine key={i} item={a} manifest={manifest} />
                            ))}
                        </div>
                    </StatBlockSection>
                ) : null}

                {reactions?.entries?.length ? (
                    <StatBlockSection title="Reactions" desc={reactions.desc}>
                        <div className="space-y-2 text-sm">
                            {reactions.entries.map((r, i) => (
                                <Dnd5eActionLine key={i} item={r} manifest={manifest} />
                            ))}
                        </div>
                    </StatBlockSection>
                ) : null}

                {legendaryActions?.entries?.length ? (
                    <StatBlockSection title="Legendary Actions" desc={legendaryActions.desc}>
                        <div className="space-y-2 text-sm">
                            {legendaryActions.entries.map((a, i) => (
                                <Dnd5eActionLine key={i} item={a} manifest={manifest} />
                            ))}
                        </div>
                    </StatBlockSection>
                ) : null}

                {spells?.entries?.length ? (
                    <StatBlockSection title="Spells" desc={spells.desc}>
                        <div className="space-y-2 text-sm">
                            {spells.entries.map((a, i) => (
                                <Dnd5eActionLine key={i} item={a} manifest={manifest} />
                            ))}
                        </div>
                    </StatBlockSection>
                ) : null}

                {feats?.entries?.length ? (
                    <StatBlockSection title="Feats" desc={feats.desc}>
                        <div className="space-y-2 text-sm">
                            {feats.entries.map((a, i) => (
                                <Dnd5eActionLine key={i} item={a} manifest={manifest} />
                            ))}
                        </div>
                    </StatBlockSection>
                ) : null}

                {special?.entries?.length ? (
                    <StatBlockSection title="Special" desc={special.desc}>
                        <div className="space-y-2 text-sm">
                            {special.entries.map((a, i) => (
                                <Dnd5eActionLine key={i} item={a} manifest={manifest} />
                            ))}
                        </div>
                    </StatBlockSection>
                ) : null}
            </div>
        </div>
    );
};
