export function Dnd5eHeader({
    title,
    subtitle,
    desc,
}: {
    title: string;
    subtitle?: string;
    desc?: string;
}) {
    return (
        <>
            <header className="mb-2">
                <h1 className="font-serif text-2xl font-bold text-brand-500 tracking-wide">
                    {title}
                </h1>
                {subtitle ? (
                    <p className="text-sm italic text-muted-foreground">{subtitle}</p>
                ) : null}
            </header>

            {desc ? (
                <p className="text-sm italic text-muted-foreground mb-3 whitespace-pre-wrap">
                    {desc}
                </p>
            ) : null}
        </>
    );
}
