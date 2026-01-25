export function Dnd5eAdditionalStats({
    saves,
    skills,
    resistances,
    immunities,
    vulnerabilities,
    conditionImmunities,
    senses,
    languages,
    challengeRating,
    crRaw,
    proficiencyBonus,
}: {
    saves?: string;
    skills?: string;
    resistances?: string;
    immunities?: string;
    vulnerabilities?: string;
    conditionImmunities?: string;
    senses?: string;
    languages?: string;
    challengeRating?: string;
    crRaw?: string;
    proficiencyBonus?: string;
}) {
    return (
        <div className="space-y-1 text-sm">
            {saves && (
                <p>
                    <span className="font-semibold text-brand-500">Saving Throws</span> {saves}
                </p>
            )}
            {skills && (
                <p>
                    <span className="font-semibold text-brand-500">Skills</span> {skills}
                </p>
            )}
            {resistances && (
                <p>
                    <span className="font-semibold text-brand-500">Damage Resistances</span>{" "}
                    {resistances}
                </p>
            )}
            {immunities && (
                <p>
                    <span className="font-semibold text-brand-500">Damage Immunities</span>{" "}
                    {immunities}
                </p>
            )}
            {vulnerabilities && (
                <p>
                    <span className="font-semibold text-brand-500">Damage Vulnerabilities</span>{" "}
                    {vulnerabilities}
                </p>
            )}
            {conditionImmunities && (
                <p>
                    <span className="font-semibold text-brand-500">Condition Immunities</span>{" "}
                    {conditionImmunities}
                </p>
            )}
            {senses && (
                <p>
                    <span className="font-semibold text-brand-500">Senses</span> {senses}
                </p>
            )}
            {languages && (
                <p>
                    <span className="font-semibold text-brand-500">Languages</span> {languages}
                </p>
            )}
            {(challengeRating || crRaw) && (
                <p>
                    <span className="font-semibold text-brand-500">Challenge</span>{" "}
                    {challengeRating ?? crRaw}
                    {proficiencyBonus ? ` (${proficiencyBonus})` : null}
                </p>
            )}
        </div>
    );
}
