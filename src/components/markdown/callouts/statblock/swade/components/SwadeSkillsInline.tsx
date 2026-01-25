export function SwadeSkillsInline({
    skillsList,
}: {
    skillsList: Array<[string, string]>;
}) {
    if (!skillsList.length) return null;

    return (
        <div className="mb-2">
            <h2 className="font-serif text-sm font-bold text-brand-500 uppercase tracking-wider mb-2">
                Skills
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {skillsList.map(([name, die], index) => (
                    <span key={name}>
                        <span className="font-medium">{name}</span>{" "}
                        <span className="text-brand-500 font-semibold">{die}</span>
                        {index < skillsList.length - 1 && ","}
                    </span>
                ))}
            </div>
        </div>
    );
}
